// 插件接口定义
export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  icon?: string
  
  activate(context: PluginContext): void
  deactivate(): void
  render(): any
}

// 插件上下文
export interface PluginContext {
  theme: Theme
  storage: StorageManager
  api: PluginAPI
}

// 主题接口
export interface Theme {
  id: string
  name: string
  isDark: boolean
  colors: ThemeColors
}

// 主题颜色
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  border: string
}

// 存储管理器接口
export interface StorageManager {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

// 插件 API 接口
export interface PluginAPI {
  // 主题相关
  getTheme(): Theme
  setTheme(theme: Theme): void
  
  // 存储相关
  getStorage(): StorageManager
  
  // 窗口相关
  minimizeWindow(): void
  maximizeWindow(): void
  closeWindow(): void
}