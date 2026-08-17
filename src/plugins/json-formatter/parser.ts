// JSON 解析器

export interface ParseResult {
  success: boolean
  data?: any
  error?: string
  line?: number
  column?: number
}

/**
 * 解析 JSON 字符串
 */
export function parseJson(input: string): ParseResult {
  if (!input.trim()) {
    return {
      success: false,
      error: '输入为空'
    }
  }

  try {
    const data = JSON.parse(input)
    return {
      success: true,
      data
    }
  } catch (error) {
    const parseError = error as Error
    const match = parseError.message.match(/position (\d+)/)
    
    if (match) {
      const position = parseInt(match[1])
      const lines = input.substring(0, position).split('\n')
      const line = lines.length
      const column = lines[lines.length - 1].length + 1
      
      return {
        success: false,
        error: `语法错误：${parseError.message}`,
        line,
        column
      }
    }
    
    return {
      success: false,
      error: `语法错误：${parseError.message}`
    }
  }
}

/**
 * 验证 JSON 是否有效
 */
export function isValidJson(input: string): boolean {
  const result = parseJson(input)
  return result.success
}

/**
 * 获取 JSON 统计信息
 */
export function getJsonStats(input: string): {
  lineCount: number
  fileSize: string
  isValid: boolean
} {
  const lineCount = input.split('\n').length
  const bytes = new Blob([input]).size
  
  let fileSize: string
  if (bytes < 1024) {
    fileSize = `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    fileSize = `${(bytes / 1024).toFixed(1)} KB`
  } else {
    fileSize = `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return {
    lineCount,
    fileSize,
    isValid: isValidJson(input)
  }
}