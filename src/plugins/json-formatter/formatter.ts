// JSON 格式化器

/**
 * 格式化 JSON（美化）
 */
export function formatJson(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, indent)
  } catch (error) {
    throw new Error(`格式化失败：${(error as Error).message}`)
  }
}

/**
 * 压缩 JSON
 */
export function compressJson(input: string): string {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  } catch (error) {
    throw new Error(`压缩失败：${(error as Error).message}`)
  }
}

/**
 * 语法高亮 JSON
 */
export function syntaxHighlight(json: string): string {
  // 转义 HTML 特殊字符
  let highlighted = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // 高亮键名
  highlighted = highlighted.replace(
    /"([^"\\]*(\\.[^"\\]*)*)"/g,
    '<span class="json-key">"$1"</span>'
  )
  
  // 高亮字符串值
  highlighted = highlighted.replace(
    /:\s*"([^"\\]*(\\.[^"\\]*)*)"/g,
    ': <span class="json-string">"$1"</span>'
  )
  
  // 高亮数字
  highlighted = highlighted.replace(
    /:\s*(-?\d+\.?\d*([eE][+-]?\d+)?)/g,
    ': <span class="json-number">$1</span>'
  )
  
  // 高亮布尔值
  highlighted = highlighted.replace(
    /:\s*(true|false)/g,
    ': <span class="json-boolean">$1</span>'
  )
  
  // 高亮 null
  highlighted = highlighted.replace(
    /:\s*(null)/g,
    ': <span class="json-null">$1</span>'
  )
  
  return highlighted
}

/**
 * 获取 JSON 节点信息
 */
export interface JsonNode {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  key?: string
  value?: any
  startLine: number
  endLine: number
  collapsed?: boolean
}

/**
 * 解析 JSON 为节点树
 */
export function parseJsonToNodes(json: string): JsonNode[] {
  const lines = json.split('\n')
  const nodes: JsonNode[] = []
  
  // 简单实现：按行解析
  let currentLine = 1
  let indentLevel = 0
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
      nodes.push({
        type: trimmed.endsWith('{') ? 'object' : 'array',
        startLine: currentLine,
        endLine: currentLine,
        collapsed: false
      })
      indentLevel++
    } else if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
      indentLevel--
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1]
        if (lastNode.endLine === lastNode.startLine) {
          lastNode.endLine = currentLine
        }
      }
    } else if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':')
      const key = trimmed.substring(0, colonIndex).trim().replace(/"/g, '')
      const valuePart = trimmed.substring(colonIndex + 1).trim()
      
      let type: JsonNode['type'] = 'string'
      if (valuePart.startsWith('{') || valuePart.endsWith('{')) {
        type = 'object'
      } else if (valuePart.startsWith('[') || valuePart.endsWith('[')) {
        type = 'array'
      } else if (valuePart === 'true' || valuePart === 'false') {
        type = 'boolean'
      } else if (valuePart === 'null') {
        type = 'null'
      } else if (!isNaN(Number(valuePart))) {
        type = 'number'
      }
      
      nodes.push({
        type,
        key,
        value: valuePart,
        startLine: currentLine,
        endLine: currentLine
      })
    }
    
    currentLine++
  }
  
  return nodes
}

/**
 * 折叠/展开节点
 */
export function toggleNodeCollapse(nodes: JsonNode[], lineNumber: number): JsonNode[] {
  return nodes.map(node => {
    if (node.startLine <= lineNumber && node.endLine >= lineNumber) {
      return {
        ...node,
        collapsed: !node.collapsed
      }
    }
    return node
  })
}