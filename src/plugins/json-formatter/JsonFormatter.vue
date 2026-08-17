<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { parseJson, getJsonStats } from './parser'
import { formatJson as formatJsonUtil, compressJson as compressJsonUtil, syntaxHighlight } from './formatter'
import { workerManager } from './worker-manager'

// 输入内容
const inputText = ref('')
const outputText = ref('')
const highlightedOutput = ref('')

// 对比模式
const isCompareMode = ref(false)
const leftInputText = ref('')
const leftOutputText = ref('')
const leftHighlightedOutput = ref('')
const rightInputText = ref('')
const rightOutputText = ref('')
const rightHighlightedOutput = ref('')

// 状态
const jsonStatus = ref('就绪')
const isError = ref(false)
const errorMessage = ref('')
const errorLine = ref<number | null>(null)
const errorColumn = ref<number | null>(null)

// 左侧状态
const leftJsonStatus = ref('就绪')
const leftIsError = ref(false)
const leftErrorMessage = ref('')

// 右侧状态
const rightJsonStatus = ref('就绪')
const rightIsError = ref(false)
const rightErrorMessage = ref('')

// 计算属性
const lineCount = computed(() => {
  return inputText.value.split('\n').length
})

const fileSize = computed(() => {
  const stats = getJsonStats(inputText.value)
  return stats.fileSize
})

// 监听输入变化
watch(inputText, (newValue) => {
  if (!newValue.trim()) {
    outputText.value = ''
    highlightedOutput.value = ''
    jsonStatus.value = '就绪'
    isError.value = false
    errorMessage.value = ''
    errorLine.value = null
    errorColumn.value = null
    return
  }
  
  const result = parseJson(newValue)
  if (result.success) {
    jsonStatus.value = '有效 JSON'
    isError.value = false
    errorMessage.value = ''
    errorLine.value = null
    errorColumn.value = null
  } else {
    jsonStatus.value = '无效 JSON'
    isError.value = true
    errorMessage.value = result.error || '未知错误'
    errorLine.value = result.line || null
    errorColumn.value = result.column || null
  }
})

// 监听输出变化，生成高亮
watch(outputText, (newValue) => {
  if (newValue) {
    highlightedOutput.value = syntaxHighlight(newValue)
  } else {
    highlightedOutput.value = ''
  }
})

// 格式化 JSON
const formatJson = async () => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }
  
  try {
    outputText.value = await processWithWorker('format', inputText.value)
    jsonStatus.value = '已格式化'
  } catch (error) {
    isError.value = true
    errorMessage.value = (error as Error).message
  }
}

// 压缩 JSON
const compressJson = async () => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }
  
  try {
    outputText.value = await processWithWorker('compress', inputText.value)
    jsonStatus.value = '已压缩'
  } catch (error) {
    isError.value = true
    errorMessage.value = (error as Error).message
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    // TODO: 显示复制成功提示
    console.log('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 清空内容
const clearContent = () => {
  inputText.value = ''
  outputText.value = ''
  highlightedOutput.value = ''
  jsonStatus.value = '就绪'
  isError.value = false
  errorMessage.value = ''
  errorLine.value = null
  errorColumn.value = null
}

// 切换对比模式
const toggleCompareMode = () => {
  isCompareMode.value = !isCompareMode.value
  
  if (isCompareMode.value) {
    // 进入对比模式，将当前内容复制到左侧
    leftInputText.value = inputText.value
    leftOutputText.value = outputText.value
    leftHighlightedOutput.value = highlightedOutput.value
    leftJsonStatus.value = jsonStatus.value
    leftIsError.value = isError.value
    leftErrorMessage.value = errorMessage.value
    
    // 清空右侧
    rightInputText.value = ''
    rightOutputText.value = ''
    rightHighlightedOutput.value = ''
    rightJsonStatus.value = '就绪'
    rightIsError.value = false
    rightErrorMessage.value = ''
  } else {
    // 退出对比模式，将左侧内容复制回主区域
    inputText.value = leftInputText.value
    outputText.value = leftOutputText.value
    highlightedOutput.value = leftHighlightedOutput.value
    jsonStatus.value = leftJsonStatus.value
    isError.value = leftIsError.value
    errorMessage.value = leftErrorMessage.value
  }
}

// 左侧格式化
const formatLeftJson = async () => {
  if (!leftInputText.value.trim()) {
    leftOutputText.value = ''
    return
  }
  
  try {
    leftOutputText.value = await processWithWorker('format', leftInputText.value)
    leftJsonStatus.value = '已格式化'
  } catch (error) {
    leftIsError.value = true
    leftErrorMessage.value = (error as Error).message
  }
}

// 左侧压缩
const compressLeftJson = async () => {
  if (!leftInputText.value.trim()) {
    leftOutputText.value = ''
    return
  }
  
  try {
    leftOutputText.value = await processWithWorker('compress', leftInputText.value)
    leftJsonStatus.value = '已压缩'
  } catch (error) {
    leftIsError.value = true
    leftErrorMessage.value = (error as Error).message
  }
}

// 左侧复制
const copyLeftToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(leftOutputText.value)
    console.log('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 左侧清空
const clearLeftContent = () => {
  leftInputText.value = ''
  leftOutputText.value = ''
  leftHighlightedOutput.value = ''
  leftJsonStatus.value = '就绪'
  leftIsError.value = false
  leftErrorMessage.value = ''
}

// 右侧格式化
const formatRightJson = async () => {
  if (!rightInputText.value.trim()) {
    rightOutputText.value = ''
    return
  }
  
  try {
    rightOutputText.value = await processWithWorker('format', rightInputText.value)
    rightJsonStatus.value = '已格式化'
  } catch (error) {
    rightIsError.value = true
    rightErrorMessage.value = (error as Error).message
  }
}

// 右侧压缩
const compressRightJson = async () => {
  if (!rightInputText.value.trim()) {
    rightOutputText.value = ''
    return
  }
  
  try {
    rightOutputText.value = await processWithWorker('compress', rightInputText.value)
    rightJsonStatus.value = '已压缩'
  } catch (error) {
    rightIsError.value = true
    rightErrorMessage.value = (error as Error).message
  }
}

// 右侧复制
const copyRightToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(rightOutputText.value)
    console.log('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 右侧清空
const clearRightContent = () => {
  rightInputText.value = ''
  rightOutputText.value = ''
  rightHighlightedOutput.value = ''
  rightJsonStatus.value = '就绪'
  rightIsError.value = false
  rightErrorMessage.value = ''
}

// 初始化 Worker
onMounted(() => {
  workerManager.init()
})

// 清理 Worker
onUnmounted(() => {
  workerManager.terminate()
})

// 使用 Worker 处理大文件
const processWithWorker = async (action: string, data: string): Promise<any> => {
  // 如果数据小于 1MB，直接在主线程处理
  if (new Blob([data]).size < 1024 * 1024) {
    switch (action) {
      case 'parse':
        return JSON.parse(data)
      case 'format':
        return JSON.stringify(JSON.parse(data), null, 2)
      case 'compress':
        return JSON.stringify(JSON.parse(data))
      default:
        throw new Error(`未知操作: ${action}`)
    }
  }
  
  // 大文件使用 Worker 处理
  return workerManager.sendRequest(action, data)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 工具栏 -->
    <div class="h-10 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3 space-x-2">
      <button 
        v-if="!isCompareMode"
        class="px-3 py-1 text-sm bg-[var(--color-primary)] text-white rounded hover:opacity-90 transition-opacity"
        @click="formatJson"
      >
        格式化
      </button>
      <button 
        v-if="!isCompareMode"
        class="px-3 py-1 text-sm bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
        @click="compressJson"
      >
        压缩
      </button>
      <button 
        v-if="!isCompareMode"
        class="px-3 py-1 text-sm bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
        @click="copyToClipboard"
        :disabled="!outputText"
      >
        复制
      </button>
      <button 
        class="px-3 py-1 text-sm bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
        @click="clearContent"
      >
        清空
      </button>
      <button 
        class="px-3 py-1 text-sm bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
        :class="{ 'bg-[var(--color-primary)]': isCompareMode }"
        @click="toggleCompareMode"
      >
        {{ isCompareMode ? '退出对比' : '对比' }}
      </button>
    </div>
    
    <!-- 编辑区域 -->
    <div class="flex-1 flex">
      <!-- 普通模式 -->
      <template v-if="!isCompareMode">
        <!-- 输入区域 -->
        <div class="flex-1 flex flex-col border-r border-[var(--color-border)]">
          <div class="h-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
            <span class="text-sm font-medium">输入</span>
          </div>
          <textarea 
            v-model="inputText"
            class="flex-1 p-3 bg-[var(--color-background)] text-[var(--color-text)] font-mono text-sm resize-none focus:outline-none"
            placeholder="在此粘贴 JSON..."
          ></textarea>
        </div>
        
        <!-- 输出区域 -->
        <div class="flex-1 flex flex-col">
          <div class="h-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
            <span class="text-sm font-medium">输出</span>
          </div>
          <div class="flex-1 overflow-auto bg-[var(--color-background)]">
            <pre 
              v-if="outputText"
              class="p-3 font-mono text-sm text-[var(--color-text)]"
              v-html="highlightedOutput"
            ></pre>
            <div 
              v-else 
              class="p-3 text-[var(--color-secondary)]"
            >
              格式化结果将显示在这里...
            </div>
          </div>
        </div>
      </template>
      
      <!-- 对比模式 -->
      <template v-else>
        <!-- 左侧区域 -->
        <div class="flex-1 flex flex-col border-r border-[var(--color-border)]">
          <!-- 左侧工具栏 -->
          <div class="h-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3 space-x-2">
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-primary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="formatLeftJson"
            >
              格式化
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="compressLeftJson"
            >
              压缩
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="copyLeftToClipboard"
              :disabled="!leftOutputText"
            >
              复制
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="clearLeftContent"
            >
              清空
            </button>
          </div>
          
          <!-- 左侧编辑区域 -->
          <div class="flex-1 flex flex-col">
            <div class="h-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
              <span class="text-xs font-medium">左侧输入</span>
            </div>
            <textarea 
              v-model="leftInputText"
              class="flex-1 p-3 bg-[var(--color-background)] text-[var(--color-text)] font-mono text-sm resize-none focus:outline-none"
              placeholder="在此粘贴 JSON..."
            ></textarea>
          </div>
          
          <!-- 左侧输出区域 -->
          <div class="flex-1 flex flex-col border-t border-[var(--color-border)]">
            <div class="h-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
              <span class="text-xs font-medium">左侧输出</span>
            </div>
            <div class="flex-1 overflow-auto bg-[var(--color-background)]">
              <pre 
                v-if="leftOutputText"
                class="p-3 font-mono text-sm text-[var(--color-text)]"
                v-html="leftHighlightedOutput"
              ></pre>
              <div 
                v-else 
                class="p-3 text-[var(--color-secondary)] text-sm"
              >
                格式化结果将显示在这里...
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧区域 -->
        <div class="flex-1 flex flex-col">
          <!-- 右侧工具栏 -->
          <div class="h-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3 space-x-2">
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-primary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="formatRightJson"
            >
              格式化
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="compressRightJson"
            >
              压缩
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="copyRightToClipboard"
              :disabled="!rightOutputText"
            >
              复制
            </button>
            <button 
              class="px-2 py-1 text-xs bg-[var(--color-secondary)] text-white rounded hover:opacity-90 transition-opacity"
              @click="clearRightContent"
            >
              清空
            </button>
          </div>
          
          <!-- 右侧编辑区域 -->
          <div class="flex-1 flex flex-col">
            <div class="h-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
              <span class="text-xs font-medium">右侧输入</span>
            </div>
            <textarea 
              v-model="rightInputText"
              class="flex-1 p-3 bg-[var(--color-background)] text-[var(--color-text)] font-mono text-sm resize-none focus:outline-none"
              placeholder="在此粘贴 JSON..."
            ></textarea>
          </div>
          
          <!-- 右侧输出区域 -->
          <div class="flex-1 flex flex-col border-t border-[var(--color-border)]">
            <div class="h-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-3">
              <span class="text-xs font-medium">右侧输出</span>
            </div>
            <div class="flex-1 overflow-auto bg-[var(--color-background)]">
              <pre 
                v-if="rightOutputText"
                class="p-3 font-mono text-sm text-[var(--color-text)]"
                v-html="rightHighlightedOutput"
              ></pre>
              <div 
                v-else 
                class="p-3 text-[var(--color-secondary)] text-sm"
              >
                格式化结果将显示在这里...
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- 状态栏 -->
    <div class="h-6 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center px-3 text-xs text-[var(--color-secondary)]">
      <div class="flex items-center space-x-4">
        <template v-if="!isCompareMode">
          <span>状态：{{ jsonStatus }}</span>
          <span>大小：{{ fileSize }}</span>
          <span>行数：{{ lineCount }}</span>
          <span v-if="isError" class="text-red-500">
            {{ errorMessage }}
            <span v-if="errorLine">（行 {{ errorLine }}，列 {{ errorColumn }}）</span>
          </span>
        </template>
        <template v-else>
          <span>对比模式</span>
          <span>左侧：{{ leftJsonStatus }}</span>
          <span>右侧：{{ rightJsonStatus }}</span>
          <span v-if="leftIsError" class="text-red-500">左侧错误：{{ leftErrorMessage }}</span>
          <span v-if="rightIsError" class="text-red-500">右侧错误：{{ rightErrorMessage }}</span>
        </template>
      </div>
    </div>
  </div>
</template>