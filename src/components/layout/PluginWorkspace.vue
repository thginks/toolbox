<script setup lang="ts">
import { ref } from 'vue'

// 当前插件 ID
const currentPluginId = ref('json-formatter')

// 插件组件映射
const pluginComponents: Record<string, any> = {
  'json-formatter': null, // TODO: 导入 JSON 格式化插件组件
  'json-compare': null,   // TODO: 导入 JSON 对比插件组件
  'cron-tool': null,      // TODO: 导入 Cron 工具插件组件
  'password-generator': null // TODO: 导入密码生成器插件组件
}

// 更新当前插件
const updatePlugin = (pluginId: string) => {
  currentPluginId.value = pluginId
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-[var(--color-background)]">
    <!-- 插件内容区域 -->
    <div class="flex-1 flex items-center justify-center">
      <!-- 占位内容 -->
      <div class="text-center">
        <div class="text-6xl mb-4">🔧</div>
        <h2 class="text-xl font-semibold mb-2">跨平台桌面工具箱</h2>
        <p class="text-[var(--color-secondary)]">从左侧选择一个插件开始使用</p>
      </div>
      
      <!-- TODO: 根据 currentPluginId 动态加载插件组件 -->
      <!-- <component :is="pluginComponents[currentPluginId]" /> -->
    </div>
  </div>
</template>