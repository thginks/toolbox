// JSON 处理 Worker

self.onmessage = function(e) {
  const { action, data } = e.data
  
  try {
    switch (action) {
      case 'parse':
        const parsed = JSON.parse(data)
        self.postMessage({ success: true, data: parsed })
        break
        
      case 'format':
        const formatted = JSON.stringify(JSON.parse(data), null, 2)
        self.postMessage({ success: true, data: formatted })
        break
        
      case 'compress':
        const compressed = JSON.stringify(JSON.parse(data))
        self.postMessage({ success: true, data: compressed })
        break
        
      default:
        self.postMessage({ success: false, error: `未知操作: ${action}` })
    }
  } catch (error) {
    self.postMessage({ success: false, error: (error as Error).message })
  }
}