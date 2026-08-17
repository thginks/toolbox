import type { StorageManager } from '@/types/plugin'

export class LocalStorageManager implements StorageManager {
  private prefix: string

  constructor(prefix: string = 'toolbox_') {
    this.prefix = prefix
  }

  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(this.prefix + key)
      if (value === null) {
        return null
      }
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`读取存储失败: ${key}`, error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error(`写入存储失败: ${key}`, error)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.error(`删除存储失败: ${key}`, error)
    }
  }

  clear(): void {
    try {
      // 只清除带有前缀的存储项
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('清除存储失败:', error)
    }
  }
}

// 导出单例实例
export const storageManager = new LocalStorageManager()