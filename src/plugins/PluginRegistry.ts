import type { Plugin } from '@/types/plugin'

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map()
  private categories: Map<string, string[]> = new Map()

  // 注册插件
  register(plugin: Plugin, category: string = 'default'): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`插件 ${plugin.id} 已注册`)
      return
    }

    this.plugins.set(plugin.id, plugin)

    // 添加到分类
    if (!this.categories.has(category)) {
      this.categories.set(category, [])
    }
    this.categories.get(category)!.push(plugin.id)
  }

  // 注销插件
  unregister(pluginId: string): void {
    this.plugins.delete(pluginId)

    // 从分类中移除
    for (const [category, pluginIds] of this.categories.entries()) {
      const index = pluginIds.indexOf(pluginId)
      if (index > -1) {
        pluginIds.splice(index, 1)
      }
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

  // 获取分类
  getCategories(): string[] {
    return Array.from(this.categories.keys())
  }

  // 获取分类下的插件
  getByCategory(category: string): Plugin[] {
    const pluginIds = this.categories.get(category) || []
    return pluginIds
      .map(id => this.plugins.get(id))
      .filter((plugin): plugin is Plugin => plugin !== undefined)
  }

  // 搜索插件
  search(query: string): Plugin[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.plugins.values()).filter(plugin =>
      plugin.name.toLowerCase().includes(lowerQuery) ||
      plugin.description.toLowerCase().includes(lowerQuery)
    )
  }
}

// 导出单例实例
export const pluginRegistry = new PluginRegistry()