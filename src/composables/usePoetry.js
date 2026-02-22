import { ref } from 'vue'

const STORAGE_KEY = 'dailypoetry_cache'

// 获取今日日期字符串
const getTodayDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

// 从 localStorage 加载缓存的诗词
const loadCachedPoetry = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const data = JSON.parse(cached)
      const today = getTodayDate()

      // 如果缓存是今天的，直接使用
      if (data.date === today) {
        return { poetry: data.poetry, fromCache: true }
      }
    }
  } catch (error) {
    console.error('Failed to load cached poetry:', error)
  }
  return null
}

// 保存诗词到缓存
const saveCachedPoetry = (poetry) => {
  try {
    const data = {
      date: getTodayDate(),
      poetry: poetry
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save cached poetry:', error)
  }
}

// 从 API 获取诗词
const fetchPoetry = async () => {
  try {
    const response = await fetch('https://v2.jinrishici.com/one.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()

    if (result.status === 'success' && result.data) {
      return result.data
    } else {
      throw new Error('Invalid API response')
    }
  } catch (error) {
    console.error('Failed to fetch poetry:', error)
    throw error
  }
}

export function usePoetry() {
  const poetry = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 加载诗词（优先使用缓存）
  const loadPoetry = async () => {
    loading.value = true
    error.value = null

    try {
      // 先尝试从缓存加载
      const cached = loadCachedPoetry()
      if (cached) {
        poetry.value = cached.poetry
        loading.value = false
        return
      }

      // 缓存不存在或已过期，从 API 获取
      const data = await fetchPoetry()
      poetry.value = data
      saveCachedPoetry(data)
    } catch (err) {
      error.value = err.message || '获取诗词失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  // 强制刷新诗词
  const refreshPoetry = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await fetchPoetry()
      poetry.value = data
      saveCachedPoetry(data)
    } catch (err) {
      error.value = err.message || '获取诗词失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  return {
    poetry,
    loading,
    error,
    loadPoetry,
    refreshPoetry
  }
}
