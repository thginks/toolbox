import type { Plugin, PluginContext } from '@/types/plugin'

export class PluginLoader {
  private plugins: Map<string, Plugin> = new Map()
  private loadedPlugins: Set<string> = new Set()

  // 注册插件
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`插件 ${plugin.id} 已注册`)
      return
    }
    this.plugins.set(plugin.id, plugin)
  }

  // 加载插件
  async load(pluginId: string, context: PluginContext): Promise<boolean> {
    if (this.loadedPlugins.has(pluginId)) {
      return true
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      console.error(`插件 ${pluginId} 未注册`)
      return false
    }

    try {
      plugin.activate(context)
      this.loadedPlugins.add(pluginId)
      return true
    } catch (error) {
      console.error(`加载插件 ${pluginId} 失败:`, error)
      return false
    }
  }

  // 卸载插件
  unload(pluginId: string): void {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      return
    }

    try {
      plugin.deactivate()
      this.loadedPlugins.delete(pluginId)
    } catch (error) {
      console.error(`卸载插件 ${pluginId} 失败:`, error)
    }
  }

  // 获取插件
  get(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  // 获取所有插件
  getAll(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  // 获取已加载插件
  getLoaded(): Plugin[] {
    return Array.from(this.loadedPlugins)
      .map(id => this.plugins.get(id))
      .filter((plugin): plugin is Plugin => plugin !== undefined)
  }

  // 检查插件是否已加载
  isLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId)
  }
}

// 导出单例实例
export const pluginLoader = new PluginLoader()