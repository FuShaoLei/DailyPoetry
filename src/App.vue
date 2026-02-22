<script setup>
import PoetryCard from './components/PoetryCard.vue'
</script>

<template>
  <PoetryCard />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 亮色主题（默认） */
  --bg-primary: #f5f5f5;
  --bg-secondary: #e8e8e8;
  --text-primary: #333333;
  --text-secondary: #666666;
  --card-bg: #ffffff;
  --border-color: rgba(139, 69, 19, 0.2);
  --accent-color: #8b4513;
  --accent-color-secondary: #a0522d;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  /* 深色主题 */
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --card-bg: #16213e;
  --border-color: rgba(212, 175, 55, 0.2);
  --accent-color: #d4af37;
  --accent-color-secondary: #c9a962;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  min-height: 100vh;
}
</style>
