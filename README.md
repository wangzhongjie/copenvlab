# COpenVLab 复刻项目

## 技术架构
![Vue3](https://img.shields.io/badge/Vue-3.5-42b883)
![Express](https://img.shields.io/badge/Express-5.1-68a063)
![Django](https://img.shields.io/badge/Django-4.2-092e20)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3-4db33d)

**三端协同架构**
```
前端：Vue3 + Vue Router + Vuex + ECharts
后端：
  - Node层：Express + MongoDB + Mongoose（业务逻辑层）
  - Python层：Django REST Framework（业务逻辑层、算法服务层、订单服务层）
工具链：
  - 前端：Vue CLI + Webpack + Babel
  - 后端：Nodemon + Winston日志
```

## 项目结构

```
copenvlab/
├── backend-node/       # Node业务层
│   ├── config/        # 配置文件
│   ├── fn/            # 核心业务模块
│   │   ├── api.js     # 接口路由
│   │   ├── db.js      # MongoDB连接
├── backend-python/    # Python业务层、算法层、订单层
│   ├── blogs/         
│   │   ├── models.py  # 数据模型
│   │   ├── views.py   # DRF视图
├── frontend/          # Vue3前端
│   ├── src/
│   │   ├── store/     # Vuex状态管理
│   │   ├── components/# 可视化组件
│   ├── vue.config.js  # 前端配置
└── package.json       # 工作区管理
```

## 快速开始
### 克隆项目
- git clone https://github.com/wzjcool/copenvlab.git
- cd copenvlab

### 安装依赖
```bash
# 前端
1. 根目录 pnpm install
2. cd frontend && pnpm install

# Node后端 
cd backend-node && pnpm install

# Python后端
cd backend-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 注：Node后端和Python后端可以二选一
```
### 启动项目
#### 以Nodejs作为服务端
```
- 根目录下启动后端服务 npm run start:node
- 根目录下启动前端服务 npm run start:frontend:node
```
#### 以Python作为服务端
```
- 根目录下启动后端服务 npm run start:python
- 根目录下启动前端服务 npm run start:frontend:python
```

## 核心特性
- **双后端架构**：Node和Python都能作为后端服务处理业务逻辑和数据库操作(个人测试Nodejs速度更快些，但如有订单处理须调用Python来处理下单逻辑),
- **模块化前端**：基于Vue3的组合式API开发可复用数据可视化组件
- **统一认证**：Passport.js实现JWT鉴权，双后端共享认证体系
- **实时日志**：Winston实现多运输器日志记录（文件+控制台）

## 开发指南
1. 数据结构：MongoDB文档模型见`backend-node/fn/db.js`
2. 前端代理：`vue.config.js`已配置双向API代理
   - `/api/node` → Node服务（3001）
   - `/api/python` → Python服务（8000）


## deal页面已实现主要功能
- 从后端获取数据
- 点击deal，进入deal列表页
- 点击其它页面，会跳转到404（因其它页面未创建）
- 进入deal列表页后，点击新建交易，交易项目表格会追加一条新交易数据，同时总交易数和未平仓数也会跟着变化
- 点击某条交易组合右边的复制按钮，会复制当前交易组合到内存
- 点击某条交易组合右边的趋势按钮，会弹出当前交易组合的趋势图
- 点击某条交易组合右边的删除按钮，会删除当前交易组合
- 点击某条交易组合右边的平仓按钮，会弹出平仓弹窗，点击确定后当前交易组合会显示平仓时间






