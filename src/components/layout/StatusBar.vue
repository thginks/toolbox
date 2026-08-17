<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 状态信息
const statusInfo = ref({
  pluginName: 'JSON 格式化',
  jsonStatus: '就绪',
  fileSize: '0 B',
  lineCount: 0,
  theme: '浅色'
})

// 监听主题变化
onMounted(() => {
  const updateThemeStatus = () => {
    const isDark = document.documentElement.classList.contains('dark')
    statusInfo.value.theme = isDark ? '深色' : '浅色'
  }
  
  // 初始更新
  updateThemeStatus()
  
  // 监听主题变化
  const observer = new MutationObserver(updateThemeStatus)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})
</script>

<template>
  <div class="h-6 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center px-3 text-xs text-[var(--color-secondary)]">
    <div class="flex items-center space-x-4">
      <span>插件：{{ statusInfo.pluginName }}</span>
      <span>状态：{{ statusInfo.jsonStatus }}</span>
      <span>大小：{{ statusInfo.fileSize }}</span>
      <span>行数：{{ statusInfo.lineCount }}</span>
      <span>主题：{{ statusInfo.theme }}</span>
    </div>
  </div>
</template>