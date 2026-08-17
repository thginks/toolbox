<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps<{
  currentPluginId: string
}>()

// 插件组件映射（懒加载）
const pluginComponents: Record<string, any> = {
  'json-formatter': defineAsyncComponent(() => import('@/plugins/json-formatter/JsonFormatter.vue')),
  // TODO: 后续插件在这里注册
  // 'json-compare': defineAsyncComponent(() => import('@/plugins/json-compare/...')),
  // 'cron-tool': defineAsyncComponent(() => import('@/plugins/cron-tool/...')),
  // 'password-generator': defineAsyncComponent(() => import('@/plugins/password-generator/...')),
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-[var(--color-background)]">
    <!-- 有插件选中时渲染对应组件 -->
    <component
      v-if="currentPluginId && pluginComponents[currentPluginId]"
      :is="pluginComponents[currentPluginId]"
      class="flex-1"
    />

    <!-- 无插件选中或插件未注册时显示占位 -->
    <div
      v-else
      class="flex-1 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="text-6xl mb-4">🔧</div>
        <h2 class="text-xl font-semibold mb-2">跨平台桌面工具箱</h2>
        <p class="text-[var(--color-secondary)]">从左侧选择一个插件开始使用</p>
      </div>
    </div>
  </div>
</template>
