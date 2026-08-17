// Worker 管理器

export class WorkerManager {
  private worker: Worker | null = null
  private pendingRequests: Map<string, {
    resolve: (value: any) => void
    reject: (reason: any) => void
  }> = new Map()
  private requestId = 0

  // 初始化 Worker
  init(): void {
    if (typeof Worker === 'undefined') {
      console.warn('当前环境不支持 Web Worker')
      return
    }

    try {
      this.worker = new Worker(new URL('./json-worker.ts', import.meta.url), {
        type: 'module'
      })

      this.worker.onmessage = (e) => {
        const { success, data, error } = e.data
        const requestId = e.data.requestId

        if (requestId && this.pendingRequests.has(requestId)) {
          const { resolve, reject } = this.pendingRequests.get(requestId)!
          this.pendingRequests.delete(requestId)

          if (success) {
            resolve(data)
          } else {
            reject(new Error(error))
          }
        }
      }

      this.worker.onerror = (error) => {
        console.error('Worker 错误:', error)
      }
    } catch (error) {
      console.error('创建 Worker 失败:', error)
    }
  }

  // 发送请求
  async sendRequest(action: string, data: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        // 如果 Worker 不可用，回退到主线程处理
        try {
          let result: any
          switch (action) {
            case 'parse':
              result = JSON.parse(data)
              break
            case 'format':
              result = JSON.stringify(JSON.parse(data), null, 2)
              break
            case 'compress':
              result = JSON.stringify(JSON.parse(data))
              break
            default:
              throw new Error(`未知操作: ${action}`)
          }
          resolve(result)
        } catch (error) {
          reject(error)
        }
        return
      }

      const requestId = `req_${++this.requestId}`
      this.pendingRequests.set(requestId, { resolve, reject })

      this.worker.postMessage({ action, data, requestId })
    })
  }

  // 终止 Worker
  terminate(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.pendingRequests.clear()
  }
}

// 导出单例实例
export const workerManager = new WorkerManager()