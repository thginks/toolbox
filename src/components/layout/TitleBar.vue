<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
}>()

// 窗口控制函数（Tauri API）
const minimizeWindow = () => {
  // TODO: 实现 Tauri 窗口最小化
  console.log('最小化窗口')
}

const maximizeWindow = () => {
  // TODO: 实现 Tauri 窗口最大化
  console.log('最大化窗口')
}

const closeWindow = () => {
  // TODO: 实现 Tauri 窗口关闭
  console.log('关闭窗口')
}
</script>

<template>
  <div class="h-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-2 select-none">
    <!-- 左侧：应用名称 -->
    <div class="flex items-center space-x-2">
      <span class="text-sm font-medium">跨平台桌面工具箱</span>
    </div>
    
    <!-- 右侧：控制按钮 -->
    <div class="flex items-center space-x-1">
      <!-- 设置图标 -->
      <button 
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-border)] transition-colors"
        title="设置"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      <!-- 主题图标 -->
      <button 
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-border)] transition-colors"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        @click="emit('toggle-theme')"
      >
        <!-- 深色模式图标（太阳） -->
        <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- 浅色模式图标（月亮） -->
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
      
      <!-- 最小化 -->
      <button 
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-border)] transition-colors"
        title="最小化"
        @click="minimizeWindow"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      
      <!-- 最大化 -->
      <button 
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-border)] transition-colors"
        title="最大化"
        @click="maximizeWindow"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
      
      <!-- 关闭 -->
      <button 
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white transition-colors"
        title="关闭"
        @click="closeWindow"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>