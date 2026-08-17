import type { Plugin, PluginContext } from '@/types/plugin'
import JsonFormatter from './JsonFormatter.vue'

export const jsonFormatterPlugin: Plugin = {
  id: 'json-formatter',
  name: 'JSON 格式化',
  description: 'JSON 美化、压缩、语法高亮',
  version: '1.0.0',
  icon: '📋',

  activate(context: PluginContext) {
    console.log('JSON 格式化插件已激活')
    // 初始化插件
  },

  deactivate() {
    console.log('JSON 格式化插件已停用')
    // 清理插件
  },

  render() {
    return JsonFormatter
  }
}

export default jsonFormatterPlugin