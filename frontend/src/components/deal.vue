<template>
  <div class="container">
    <!-- 页面标题 -->
    <div class="title-container">
      <div class="title">
        <h1 class="page-title">交易记录</h1>
        <p class="subtitle">管理您的所有交易策略</p>
      </div>
      <button class="new-trade" @click="createNewTrade">+ 新建交易</button>
    </div>

    <!-- 汇总卡片 -->
    <div class="summary-cards">
      <div class="card">
        <div class="label">总交易数</div>
        <div class="value">{{ trades.length }}</div>
      </div>
      <div class="card">
        <div class="label">总盈亏</div>
        <div :class="['value', totalPnL >= 0 ? 'profit' : 'loss']">
          {{ totalPnL }}¥
        </div>
      </div>
      <div class="card">
        <div class="label">未平仓</div>
        <div class="value">{{ openTrades }}</div>
      </div>
    </div>

    <!-- 策略项目 -->
    <div class="item-container">
      <!-- 工具栏 筛选 -->
      <div class="toolbar">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索交易..."
        />
        <select v-model="filterType">
          <option value="全部">全部</option>
          <option value="盈">盈利</option>
          <option value="亏">亏损</option>
        </select>
      </div>  
      <!-- 交易项目表格 -->
      <table class="trade-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>累计盈亏</th>
            <th>创建时间</th>
            <th>平仓时间</th>
            <th>到期日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(trade, index) in filteredTrades" :key="index">
            <td class="name">{{ trade.name }}</td>
            <td :class="trade.pnl >= 0 ? 'profit' : 'loss'">
              {{ trade.pnl }}¥ ({{ trade.pnlRate }})
            </td>
            <td>{{ trade.createTime }}</td>
            <td>{{ trade.closeTime || '-' }}</td>
            <td>剩余{{ trade.daysLeft }}天 {{ trade.expiry }}</td>
            <td>
              <button class="btn copy" @click="copyTradeName(trade)">❏</button>              
              <button class="btn chart" @click="openChart(trade)">⡴</button>
              <button class="btn close" @click="closeTrade(index)">平仓</button>
              <button class="btn delete" @click="deleteTrade(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="red">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 组合盈亏历史走势  弹窗 -->
    <teleport to="body">
      <div v-if="showChart" class="modal-backdrop" @click.self="showChart = false">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ selectedTrade.name }}</h3>
            <button class="close-btn" @click="showChart = false">×</button>
          </div>

          <!-- ECharts 容器 -->
          <div ref="chartRef" class="chart-container" style="width: 100%; height: 240px;"></div>

          <!-- 组合成分详情 -->
          <div class="trade-info">
            <div class="intro">
              <p class="created">创建时间：{{ selectedTrade.createTime }}</p>
              <p class="isClose">未平仓</p>
            </div>
            <p>组合成分详情:</p>
            <table class="detail-table">
              <thead>
                <tr>
                  <th class="title">合约</th>
                  <th>数量</th>
                  <th>成本价</th>
                  <th>最新价</th>
                  <th>总盈亏</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c, i) in selectedTrade.instruments" :key="i">
                  <td class="title">{{ c.symbol }}</td>
                  <td :class="c.qty < 0 ? 'profit' : 'loss'">
                    {{ c.qty > 0 ? '+' : '' }}{{ c.qty }}
                  </td>
                  <td>{{ c.cost }}</td>
                  <td>{{ c.last }}</td>
                  <td :class="c.pnl >= 0 ? 'profit' : 'loss'">
                    {{ c.pnl >= 0 ? '+' : '' }}{{ c.pnl }}
                  </td>
                </tr>
                <tr class="total-row">
                  <td colspan="4" class="title">总计</td>
                  <td :class="totalContractPnL >= 0 ? 'profit' : 'loss'">
                    {{ totalContractPnL >= 0 ? '+' : '' }}{{ totalContractPnL }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </teleport>
  </div> 
</template>

<script>
'use strict'
// import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue' 
// import dayjs from 'dayjs'
import * as echarts from "echarts";
import axios from 'axios'
import { mapGetters } from 'vuex';


export default {
  name: 'DealComponent',
  data() {
    return {
      searchKeyword: '',
      filterType: '全部', // 默认显示全部
      trades: [], // deals from backend
      showChart: false,
      selectedTrade: {},
      trade: { // 模拟的数据
        name: "沪银:250924 自定义策略 9200/9500",
        createTime: "2025-08-09 11:03:58",
        pnlHistory: [
          [-200, "2025-08-11 09:00"],
          [-300, "2025-08-11 10:00"],
          [-250, "2025-08-12 12:00"],
          [-100, "2025-08-13 22:00"],
          [50, "2025-08-14 09:00"],
          [100, "2025-08-14 10:00"],
          [150, "2025-08-14 11:00"],
          [200, "2025-08-14 12:00"],
          [250, "2025-08-14 13:00"],
          [-200, "2025-08-11 09:00"],
          [-300, "2025-08-11 10:00"],
          [-250, "2025-08-12 12:00"],
          [-100, "2025-08-13 22:00"],
          [50, "2025-08-14 09:00"],
          [100, "2025-08-14 10:00"],
          [150, "2025-08-14 11:00"],
          [200, "2025-08-14 12:00"],
          [250, "2025-08-14 13:00"],
        ],
        instruments: [
          { symbol: "AG:250924:P:9200", qty: 1, cost: 240.0, last: 207.5, pnl: -487.5 },
          { symbol: "/AG2510", qty: 1, cost: 9273.0, last: 9299.0, pnl: 390.0 },
          { symbol: "AG:250924:C:9500", qty: -1, cost: 197.0, last: 185.5, pnl: 172.5 }
        ]
      }
    };
  },
  computed: {
    // select 筛选交易项目
    filteredTrades() {
      return this.trades.filter((t) => {
        const matchKeyword = t.name.includes(this.searchKeyword);
        const matchFilter = 
          this.filterType === "全部" 
            ? true 
            : this.filterType === "盈" 
            ? t.pnl > 0 
            : t.pnl < 0;
        return matchKeyword && matchFilter;
      });
    },
    // 计算 盈利profit 和 亏损 loss 总和
    totalPnL() {
      return this.trades.reduce((sum, t) => sum + t.pnl, 0);
    },
    // 计算未平仓交易数量
    openTrades() {
      return this.trades.filter((t) => !t.closeTime).length;
    },
    // 计算当前组合的合计总盈亏
    totalContractPnL() {
      return this.trade.instruments.reduce((sum, c) => sum + c.pnl, 0);
    },
    // 使用命名空间映射
    ...mapGetters('apiConfig', ['getApiPath']) 
  },
  methods: {
    // btn new deal
    createNewTrade() {
      const newTrade = {
        name: "新交易" + (this.trades.length + 1),
        pnl: 0,
        pnlRate: "0%",
        createTime: new Date().toISOString().slice(0, 19).replace("T", " "),
        closeTime: null,
        daysLeft: 30,
        expiry: "2025-12-31"
      };
      this.trades.push(newTrade);
    },
    // btn copy
    copyTradeName(trade) {
      navigator.clipboard.writeText(trade.name)
        .then(() => alert('分享链接已复制'))
        .catch(err => console.error('复制失败:', err));
    },
    // btn del
    deleteTrade(index) {
      if (confirm("确认删除该交易吗？")) {
        this.trades.splice(index, 1);
      }
    },
    // btn close position
    closeTrade(index) {
      if (!this.trades[index].closeTime) {
        this.trades[index].closeTime = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        alert("已平仓");
      }
    },

    // popup chart
    openChart(trade) {
      this.selectedTrade = trade;
      this.selectedTrade.instruments = this.trade.instruments;

      this.showChart = true;
      
      this.$nextTick(() => {
        if (!this.$refs.chartRef) {
          console.error('Chart container not found');
          return;
        }
        // check w h
        const { width, height } = this.$refs.chartRef.getBoundingClientRect();
        if (width === 0 || height === 0) {
          console.warn('Chart container has zero size');
        }
        
        const existingChart = echarts.getInstanceByDom(this.$refs.chartRef);
        if (existingChart) {
          existingChart.dispose();
        }
        
        // chart trend canvs
        const chart = echarts.init(this.$refs.chartRef);
        chart.setOption({
          tooltip: { trigger: "axis" },
          grid: { top: 0, bottom: 30, left: 50, right: 0 },
          xAxis: {
            type: "category",
            boundaryGap: false, // 边界留白
            data: this.trade.pnlHistory.map(p => p[1]),
            axisLine: { lineStyle: { color: "#999" } }
          },
          yAxis: {
            type: "value",
            axisLabel: { inside: false },            
            axisLine: { show: true, lineStyle: { color: '#ccc' } },
            splitLine: { lineStyle: { type: 'dashed', width: 1, color: "#eee" } },
            axisTick: { show: true },
          },
          series: [{
            name: "trends",
            data: this.trade.pnlHistory.map(p => p[0]),
            type: "line",
            smooth: true,
            areaStyle: { color: "rgba(0, 136, 212, 0.15)" },
            lineStyle: { color: "#0088d4", width: 1.5 },
            symbol: "none",
            symbolSize: 6,
            itemStyle: { color: "#0088d4" }
          }]
        });
      });
    }
  },
  watch: {
    showChart(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.chartRef) {
            const chart = echarts.init(this.$refs.chartRef);
            chart.setOption({/*...*/});
          }
        });
      }
    }
  },
  mounted() {
    document.title = '交易中心 | OpenVlab'
  },
  async created() { 
    // 从后端获取交易数据
    let url = this.getApiPath('/deals/')
    try {
        const res = await axios.get(url)
        // console.log(234, res.data)
        this.trades = res.data
    } catch(error){
        console.error('Error fetching data:', error)
    }
  }
};


</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
}
/* 页面标题 */
.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 0;
}
.subtitle {
  color: gray;
  margin-top: 0;
}
.new-trade {
  background: black;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  margin-left: auto; /* 确保按钮靠右 */
}

/* 汇总卡片 */
.summary-cards {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}
.card {
  padding: 30px 20px;
  background: #f6f6f6;
  border: 1px solid #ddd;
  border-radius: 8px;
  flex: 1;
  /* text-align: center; */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}
.card .label {
  color: gray;
  font-size: 14px;
}
.card .value {
  font-size: 26px;
  font-weight: bold;
  margin-top: 20px;
}
.value.loss {
  color: green;
}
.value.profit {
  color: red;
}

/* 策略项目 */

.item-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 20px;
}
/* 工具栏 筛选 */
.toolbar { 
  display: flex;
  gap: 10px;
  margin: 20px 0 5px 0;
  border-bottom: 1px solid #ddd;
  padding: 0 20px 20px 20px;
}
.toolbar input,
.toolbar select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.toolbar input{
  width: 160px;
}
.toolbar select {
  width: 125px;
  padding: 8px 24px 8px 8px; 
  -webkit-appearance: none; /* 移除默认样式 */
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}
/* 交易项目表格 */
.trade-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
.trade-table th,
.trade-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}
.trade-table th{
  font-weight: bold;
  color: #666;
}
.trade-table td.name{
  font-weight: bold;
  color:#444;
}
.trade-table td.loss {
  font-weight: bold;
  color: green;
}
.trade-table td.profit {
  font-weight: bold;
  color: red;
}

.btn {
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  padding: 5px 8px;
  margin: 0 2px;
  vertical-align: middle;
  cursor: pointer;
}
.btn.close {
  color: red;
  font-size: 12px;
  border-color: red;
}
.btn.delete {
  padding: 4px 8px;
  color: red;
  font-size: 10px;
  border-color: red;
}
.btn.delete svg {
  vertical-align: middle;
  transform: none; 
}


/* 弹窗 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-size:22px;
}
.intro {
  display: flex;
  justify-content: space-between;
  color:#999;
}
.created {
  text-align: left;
}
.isClose {
  text-align: right;
}
.trade-info p.created {
  font-size: 14px;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.detail-table th, .detail-table td {
  text-align: right;
  padding: 8px;
  border-bottom: 1px solid #eee;
  /* color:#444; */
}
.detail-table th.title, .detail-table td.title {
  text-align: left;
}
.total-row {
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.profit {
  color: #e74c3c;
}
.loss {
  color: #2ecc71;
}




</style>
