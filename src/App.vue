<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TitleBar from './components/layout/TitleBar.vue'
import PluginSidebar from './components/layout/PluginSidebar.vue'
import PluginWorkspace from './components/layout/PluginWorkspace.vue'
import StatusBar from './components/layout/StatusBar.vue'

const isDark = ref(false)
const currentPluginId = ref('json-formatter')

// 检测系统主题
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  isDark.value = mediaQuery.matches

  // 监听系统主题变化
  mediaQuery.addEventListener('change', (e) => {
    isDark.value = e.matches
    updateTheme()
  })

  // 应用初始主题
  updateTheme()
})

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

// 更新主题
const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 插件切换
const onSelectPlugin = (pluginId: string) => {
  currentPluginId.value = pluginId
}
</script>

<template>
  <div class="h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
    <!-- 标题栏 -->
    <TitleBar
      :is-dark="isDark"
      @toggle-theme="toggleTheme"
    />

    <!-- 主内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧插件栏 -->
      <PluginSidebar @select-plugin="onSelectPlugin" />

      <!-- 右侧工作区 -->
      <PluginWorkspace :current-plugin-id="currentPluginId" />
    </div>

    <!-- 状态栏 -->
    <StatusBar />
  </div>
</template>
