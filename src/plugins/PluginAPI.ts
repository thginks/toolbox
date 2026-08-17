import type { Theme, StorageManager, PluginAPI } from '@/types/plugin'
import { useThemeStore } from '@/stores/theme'
import { storageManager } from '@/utils/storage'

export class PluginAPIImpl implements PluginAPI {
  private themeStore = useThemeStore()

  // 主题相关
  getTheme(): Theme {
    return this.themeStore.currentTheme
  }

  setTheme(theme: Theme): void {
    if (theme.isDark) {
      this.themeStore.setDarkTheme()
    } else {
      this.themeStore.setLightTheme()
    }
  }

  // 存储相关
  getStorage(): StorageManager {
    return storageManager
  }

  // 窗口相关
  minimizeWindow(): void {
    // TODO: 实现 Tauri 窗口最小化
    console.log('最小化窗口')
  }

  maximizeWindow(): void {
    // TODO: 实现 Tauri 窗口最大化
    console.log('最大化窗口')
  }

  closeWindow(): void {
    // TODO: 实现 Tauri 窗口关闭
    console.log('关闭窗口')
  }
}

// 导出单例实例
export const pluginAPI = new PluginAPIImpl()