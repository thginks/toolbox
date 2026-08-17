import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme, ThemeColors } from '@/types/theme'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const currentTheme = ref<Theme>({
    id: 'light',
    name: '浅色主题',
    isDark: false,
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      border: '#e2e8f0'
    }
  })

  // 计算属性
  const isDark = computed(() => currentTheme.value.isDark)

  // 初始化：检测系统主题
  const initTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (mediaQuery.matches) {
      setDarkTheme()
    } else {
      setLightTheme()
    }
    
    // 监听系统主题变化
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        setDarkTheme()
      } else {
        setLightTheme()
      }
    })
  }

  // 设置浅色主题
  const setLightTheme = () => {
    currentTheme.value = {
      id: 'light',
      name: '浅色主题',
      isDark: false,
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        border: '#e2e8f0'
      }
    }
    updateDOMTheme()
  }

  // 设置深色主题
  const setDarkTheme = () => {
    currentTheme.value = {
      id: 'dark',
      name: '深色主题',
      isDark: true,
      colors: {
        primary: '#38bdf8',
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        border: '#334155'
      }
    }
    updateDOMTheme()
  }

  // 切换主题
  const toggleTheme = () => {
    if (currentTheme.value.isDark) {
      setLightTheme()
    } else {
      setDarkTheme()
    }
  }

  // 更新 DOM 主题
  const updateDOMTheme = () => {
    if (currentTheme.value.isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    currentTheme,
    isDark,
    initTheme,
    setLightTheme,
    setDarkTheme,
    toggleTheme
  }
})