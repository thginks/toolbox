<script setup lang="ts">
import { ref } from 'vue'

// 插件列表
const plugins = ref([
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    icon: '📋',
    description: 'JSON 美化、压缩、语法高亮'
  },
  {
    id: 'json-compare',
    name: 'JSON 对比',
    icon: '🔄',
    description: '对比两个 JSON 的差异'
  },
  {
    id: 'cron-tool',
    name: 'Cron 工具',
    icon: '⏰',
    description: 'Cron 表达式生成与解析'
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    icon: '🔐',
    description: '生成安全密码'
  }
])

// 当前选中的插件
const selectedPlugin = ref('json-formatter')

// 选择插件
const emit = defineEmits<{
  (e: 'select-plugin', pluginId: string): void
}>()

const selectPlugin = (pluginId: string) => {
  selectedPlugin.value = pluginId
  emit('select-plugin', pluginId)
}
</script>

<template>
  <div class="w-48 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col">
    <!-- 插件列表标题 -->
    <div class="p-3 border-b border-[var(--color-border)]">
      <h3 class="text-sm font-medium text-[var(--color-secondary)]">插件列表</h3>
    </div>

    <!-- 插件列表 -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="plugin in plugins"
        :key="plugin.id"
        class="p-3 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-border)] transition-colors"
        :class="{ 'bg-[var(--color-primary)] text-white': selectedPlugin === plugin.id }"
        @click="selectPlugin(plugin.id)"
      >
        <div class="flex items-center space-x-2">
          <span class="text-lg">{{ plugin.icon }}</span>
          <div>
            <div class="text-sm font-medium">{{ plugin.name }}</div>
            <div class="text-xs opacity-75">{{ plugin.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
