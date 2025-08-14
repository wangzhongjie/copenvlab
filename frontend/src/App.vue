<template>
  <div id="app">
    <!-- 顶部导航 -->
    <header class="navbar">
      <div class="logo">OpenVlab</div>
      <!-- nav fn -->
      <nav>
        <ul class="nav" v-show="($route.meta.headShow || $route.path=='/')">
          <li><router-link to="/market">市场</router-link></li>
          <li><router-link to="/chart">行情</router-link> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down align-middle ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></li>
          <li><router-link to="/wave">波动率</router-link> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down align-middle ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></li>
          <li><router-link to="/change">异动</router-link></li>
          <li><router-link to="/celüe">策略</router-link> <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down align-middle ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></li>
          <li class="active"><router-link to="/deal">交易</router-link></li>
          <li><router-link to="/lesson">教学</router-link></li>
        </ul>      
      </nav>

      <!-- right fn -->
      <div class="header-right">
          <!-- 主题切换按钮 -->
          <button class="theme-toggle" id="themeToggle">🌙</button>
          
          <!-- 反馈按钮 -->
          <div class="feedback" id="feedbackBtn">
            <span class="feedback-icon">💬</span>
            <span>反馈</span>
          </div>
          
          <!-- 等级模块 -->
          <div class="level-box">
            <span class="badge">🏅</span>
            <span class="level-number">0</span>
            <span class="level-label">Lv1</span>
          </div>
          
          <!-- 用户模块 -->
          <div class="user" id="userMenu">柚</div>

      </div>
    </header>

    <!-- 内容区域 -->
    <router-view></router-view>
  </div>
</template>

<script>
'use strict'
export default {
  name: "App",
};
</script>

<style>
body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 0;
    margin: 0;
}
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000;
    margin: 0;
}
.navbar {
  background: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.navbar .logo {
  font-size: 16px;
  font-weight: bold;
  color: #ffb400;
  margin-right: 30px;
}
.navbar nav ul {
  display: flex;
  list-style: none;
  padding: 0;
}
.navbar nav ul li {
  margin: 0 10px;
  cursor: pointer;
  padding: 8px 0;
}.navbar nav ul li a {
  font-size: 14px;
  color: #333;
  text-decoration: none;
}
.navbar nav ul li.active {

  border-bottom: 2px solid black;
}


.header-right {
  display: flex;
  margin-left: auto;
  gap: 16px; /* 元素间距 */
  font-size: 14px;
  color: #333;
}

/* 主题切换按钮 */
.theme-toggle {
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.3s;
}
.theme-toggle:hover {
  transform: scale(1.1);
  background: #f0f0f0;
  border-radius: 6px;
}

/* 反馈按钮 */
.feedback {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 2px 4px;
}
.feedback:hover {
  /* transform: scale(1.1); */
  background: #f0f0f0;
  border-radius: 6px;
}
.feedback-icon {
  width: 20px;
  height: 20px;
  /* border: 1px solid #ccc; */
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* 等级模块 */
.level-box {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff3cc; /* 浅橙色背景 */
  padding: 4px 8px;
  border-radius: 16px;
  border: 1px solid #ffd666; /* 橙色边框 */
}
/* .level-box:hover {
  background: #f60; 橙色背景
} */
.badge {
  color: #f90; /* 勋章颜色 */
}
.level-number {
  font-weight: bold;
  color: #f60;
}
.level-label {
  color: #f60;
  font-size: 12px;
  font-weight: bold;
  padding-left: 5px;
}

/* 用户模块 */
.user {
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s;
  background: #eee;
  border-radius: 16px;
  padding: 5px 8px;
}
.user:hover {
  color: #ff6600;
}



</style>