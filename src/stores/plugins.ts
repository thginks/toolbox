import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Plugin } from '@/types/plugin'

export const usePluginStore = defineStore('plugins', () => {
  // 状态
  const plugins = ref<Map<string, Plugin>>(new Map())
  const activePluginId = ref<string | null>(null)
  const loadedPlugins = ref<Set<string>>(new Set())

  // 计算属性
  const activePlugin = computed(() => {
    if (!activePluginId.value) return null
    return plugins.value.get(activePluginId.value) || null
  })

  const pluginList = computed(() => {
    return Array.from(plugins.value.values())
  })

  // 注册插件
  const registerPlugin = (plugin: Plugin) => {
    plugins.value.set(plugin.id, plugin)
  }

  // 加载插件
  const loadPlugin = async (pluginId: string) => {
    if (loadedPlugins.value.has(pluginId)) {
      return
    }

    const plugin = plugins.value.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未注册`)
      return
    }

    try {
      // TODO: 实现插件上下文
      const context = {} as any
      plugin.activate(context)
      loadedPlugins.value.add(pluginId)
    } catch (error) {
      console.error(`加载插件 ${pluginId} 失败:`, error)
    }
  }

  // 卸载插件
  const unloadPlugin = (pluginId: string) => {
    const plugin = plugins.value.get(pluginId)
    if (!plugin) {
      return
    }

    try {
      plugin.deactivate()
      loadedPlugins.value.delete(pluginId)
    } catch (error) {
      console.error(`卸载插件 ${pluginId} 失败:`, error)
    }
  }

  // 设置活动插件
  const setActivePlugin = (pluginId: string) => {
    activePluginId.value = pluginId
  }

  // 初始化插件列表
  const initPlugins = () => {
    // TODO: 从插件目录动态加载插件
    console.log('初始化插件列表')
  }

  return {
    plugins,
    activePluginId,
    loadedPlugins,
    activePlugin,
    pluginList,
    registerPlugin,
    loadPlugin,
    unloadPlugin,
    setActivePlugin,
    initPlugins
  }
})