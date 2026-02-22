<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePoetry } from '../composables/usePoetry.js'

const { poetry, loading, error, loadPoetry, refreshPoetry } = usePoetry()

// 主题状态
const isDark = ref(true)

// 译文显示状态
const showTranslate = ref(true)

// 切换译文显示
const toggleTranslate = () => {
  showTranslate.value = !showTranslate.value
}

// 从 localStorage 加载主题偏好
const loadTheme = () => {
  try {
    const savedTheme = localStorage.getItem('dailypoetry_theme')
    if (savedTheme !== null) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = true
    }
  } catch (error) {
    console.error('Failed to load theme:', error)
  }
}

// 保存主题偏好
const saveTheme = (theme) => {
  try {
    localStorage.setItem('dailypoetry_theme', theme)
  } catch (error) {
    console.error('Failed to save theme:', error)
  }
}

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  saveTheme(isDark.value ? 'dark' : 'light')
  applyTheme()
}

// 应用主题到 DOM
const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

// 获取今日日期
const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 监听主题变化
watch(isDark, () => {
  applyTheme()
})

// 组件挂载时加载诗词和主题
onMounted(() => {
  loadTheme()
  applyTheme()
  loadPoetry()
})
</script>

<template>
  <div class="poetry-container">
    <!-- 标题区域 -->
<!--    <header class="poetry-header">-->
<!--      <h1 class="app-title">每日诗词</h1>-->
<!--      <p class="app-date">{{ getTodayDate() }}</p>-->
<!--    </header>-->

    <!-- 诗词卡片 -->
    <main class="poetry-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在获取诗词...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button @click="loadPoetry" class="retry-button">重试</button>
      </div>

      <!-- 诗词展示 -->
      <article v-else-if="poetry" class="poetry-card">
        <!-- 诗词内容容器 -->
        <div class="poetry-content-wrapper">
          <!-- 左侧：诗词正文 -->
          <section class="poetry-main">
            <div class="full-poetry">
              <h2 class="poetry-title">{{ poetry.origin.title }}</h2>
              <p class="poetry-author">
                —— {{ poetry.origin.dynasty }} · {{ poetry.origin.author }}
              </p>

              <div class="poetry-lines">
                <p v-for="(line, index) in poetry.origin.content" :key="index" class="poetry-line">
                  {{ line }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- 右侧：译文区域（绝对定位） -->
        <section v-if="poetry.origin.translate && poetry.origin.translate.length > 0" class="poetry-side">
          <!-- 译文显示时 -->
          <div v-if="showTranslate" class="poetry-translate">
            <div class="translate-header">
              <h3 class="translate-title">译文</h3>
              <button @click="toggleTranslate" class="translate-close-btn" title="隐藏译文">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="translate-content">
              <p v-for="(line, index) in poetry.origin.translate" :key="index" class="translate-line">
                {{ line }}
              </p>
            </div>
          </div>

          <!-- 译文隐藏时的按钮 -->
          <button v-else @click="toggleTranslate" class="translate-toggle-btn">
            译文
          </button>
        </section>
      </article>
    </main>

    <!-- 悬浮按钮组 -->
    <div class="fab-buttons">
<!--      <button @click="refreshPoetry" class="fab-button refresh-button" :disabled="loading" title="刷新诗词">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>-->
<!--          <path d="M3 3v5h5"/>-->
<!--          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>-->
<!--          <path d="M16 16h5v5"/>-->
<!--        </svg>-->
<!--      </button>-->

      <button @click="toggleTheme" class="fab-button theme-button" title="切换主题">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.poetry-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  //padding: 2rem 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 标题区域 */
.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-title {
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--accent-color, #d4af37), var(--accent-color-secondary, #c9a962));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-date {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* 主内容区域 */
.poetry-content {
  width: 100%;
  //max-width: 1000px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--accent-color, #d4af37);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message {
  color: #ef4444;
}

.retry-button {
  padding: 0.75rem 2rem;
  background: var(--accent-color, #d4af37);
  color: var(--card-bg, #16213e);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* 诗词卡片 */
.poetry-card {
  //background: var(--card-bg, #16213e);
  //border-radius: 16px;
  padding: 3rem 2.5rem;
  //box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  //border: 1px solid var(--border-color, rgba(212, 175, 55, 0.2));
  position: relative;
  overflow: visible;
}

.poetry-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  //background: linear-gradient(90deg, var(--accent-color, #d4af37), var(--accent-color-secondary, #c9a962));
}

/* 诗词内容容器 */
.poetry-content-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* 左侧：诗词正文 */
.poetry-main {
  text-align: center;
  flex: 0 1 auto;
}

/* 右侧：译文区域（绝对定位） */
.poetry-side {
  position: absolute;
  right: 2.5rem;
  top: 3rem;
  width: 400px;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
}

/* 译文切换按钮（隐藏状态） */
.translate-toggle-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.1));
  border: 1px solid var(--border-color, rgba(212, 175, 55, 0.3));
  border-radius: 8px;
  color: var(--text-primary, #e0e0e0);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.translate-toggle-btn:hover {
  background: var(--accent-color, #d4af37);
  border-color: var(--accent-color, #d4af37);
  color: var(--card-bg, #16213e);
}

/* 完整诗词 */
.full-poetry {
  text-align: center;
}

.poetry-title {
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #e0e0e0);
  font-weight: 600;
}

.poetry-author {
  font-size: 1.3rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  font-style: italic;
}

.poetry-lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.poetry-line {
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  font-size: 1.9rem;
  line-height: 1.7;
  color: var(--text-primary, #e0e0e0);
  letter-spacing: 0.08em;
  font-weight: 500;
}

/* 翻译 */
.poetry-translate {
  background: var(--bg-secondary, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  border-left: 3px solid var(--accent-color, #d4af37);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 译文头部 */
.translate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color, rgba(212, 175, 55, 0.2));
}

/* 译文内容区 */
.translate-content {
  padding: 1rem 1.5rem;
  max-height: calc(100vh - 12rem);
  overflow-y: auto;
}

/* 关闭译文按钮 */
.translate-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--border-color, rgba(212, 175, 55, 0.3));
  color: var(--text-primary, #e0e0e0);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.translate-close-btn:hover {
  background: var(--accent-color, #d4af37);
  border-color: var(--accent-color, #d4af37);
  color: var(--card-bg, #16213e);
}

.translate-title {
  font-size: 1.2rem;
  opacity: 0.7;
  margin-bottom: 1rem;
  font-weight: normal;
}

.translate-line {
  font-size: 1.1rem;
  line-height: 1.8;
  opacity: 0.85;
  margin-bottom: 0.75rem;
  text-align: left;
}

/* 悬浮按钮 */
.fab-buttons {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
}

.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--accent-color, #d4af37);
  color: var(--card-bg, #16213e);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.fab-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.fab-button:active {
  transform: translateY(0);
}

.fab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fab-button:disabled:hover {
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }

  .poetry-card {
    padding: 1.5rem;
    position: relative;
  }

  .poetry-side {
    position: static;
    width: 100%;
    max-height: none;
    margin-top: 2rem;
  }

  .poetry-title {
    font-size: 2.2rem;
  }

  .poetry-author {
    font-size: 1.3rem;
  }

  .poetry-line {
    font-size: 1.6rem;
  }

  .translate-title {
    font-size: 1rem;
  }

  .translate-line {
    font-size: 0.95rem;
  }

  .fab-buttons {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .fab-button {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .poetry-container {
    padding: 1rem 0.5rem;
  }

  .poetry-title {
    font-size: 2rem;
  }

  .poetry-author {
    font-size: 1.2rem;
  }

  .poetry-line {
    font-size: 1.5rem;
  }

  .translate-title {
    font-size: 0.95rem;
  }

  .translate-line {
    font-size: 0.9rem;
  }
}
</style>
