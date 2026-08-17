# 跨平台桌面工具箱 - 详细设计

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri 窗口管理                           │
├─────────────────────────────────────────────────────────────┤
│                      Vue 3 应用                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────────────┐│
│  │   左侧插件栏  │  │              右侧工作区              ││
│  │   (插件列表)  │  │  ┌──────────────────────────────┐  ││
│  │              │  │  │        插件工具栏              │  ││
│  │  - JSON格式化 │  │  ├──────────────────────────────┤  ││
│  │  - JSON对比   │  │  │                              │  ││
│  │  - Cron工具   │  │  │          编辑区域             │  ││
│  │  - 密码生成器 │  │  │                              │  ││
│  │              │  │  └──────────────────────────────┘  ││
│  └──────────────┘  └──────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                      插件系统                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ JSON 格式化  │  │  JSON 对比   │  │  Cron 工具   │      │
│  │   (插件)     │  │   (插件)     │  │   (插件)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 技术架构

### 1. Tauri 后端（Rust）

**职责**
- 窗口管理（创建、调整、最小化、关闭）
- 系统托盘（可选，后续添加）
- 文件系统访问（保存/加载配置）
- 剪贴板操作
- 自动更新（后续添加）
- 系统主题检测（深色/浅色模式）

**最小化配置**
```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**依赖最小化**
- 只依赖 `tauri` 核心功能
- 不依赖 `tauri-plugin-*`（除非必要）
- 不包含系统托盘、通知等（后续按需添加）

### 2. Vue 3 前端

**技术栈**
- Vue 3 + Composition API + TypeScript
- Vite 构建
- Tailwind CSS 样式
- Pinia 状态管理

**目录结构**
```
src/
├── assets/              # 静态资源
│   ├── icons/           # 工具图标
│   └── styles/          # 全局样式
├── components/          # 通用组件
│   ├── ToolSidebar.vue  # 左侧工具栏
│   ├── ToolWorkspace.vue # 右侧工作区
│   ├── ThemeToggle.vue  # 主题切换按钮
│   └── StatusBar.vue    # 状态栏
├── core/                # 核心框架
│   ├── plugin-system/   # 插件系统
│   │   ├── PluginLoader.ts    # 插件加载器
│   │   ├── PluginRegistry.ts  # 插件注册表
│   │   ├── PluginAPI.ts       # 插件 API
│   │   └── types.ts           # 类型定义
│   ├── theme/           # 主题系统
│   │   ├── ThemeManager.ts    # 主题管理器
│   │   ├── themes/            # 主题定义
│   │   └── types.ts           # 类型定义
│   └── storage/         # 存储系统
│       ├── StorageManager.ts  # 存储管理器
│       └── types.ts           # 类型定义
├── plugins/             # 工具插件
│   ├── json-formatter/  # JSON 格式化插件
│   │   ├── index.ts     # 插件入口
│   │   ├── Component.vue # 工具组件
│   │   ├── parser.ts    # JSON 解析器
│   │   └── formatter.ts # 格式化逻辑
│   ├── json-diff/       # JSON 对比插件（后续）
│   ├── cron-helper/     # Cron 工具（后续）
│   └── password-gen/    # 密码生成器（后续）
├── stores/              # Pinia 状态
│   ├── plugin-store.ts  # 插件状态
│   ├── theme-store.ts   # 主题状态
│   └── app-store.ts     # 应用状态
├── utils/               # 工具函数
│   ├── clipboard.ts     # 剪贴板操作
│   ├── file.ts          # 文件操作
│   └── format.ts        # 格式化工具
├── App.vue              # 主界面
└── main.ts              # 入口文件
```

### 3. 插件系统设计

**插件接口**
```typescript
// core/plugin-system/types.ts
export interface Plugin {
  id: string;                    // 唯一标识
  name: string;                  // 显示名称
  description: string;           // 描述
  icon: string;                  // 图标（SVG 或 emoji）
  version: string;               // 版本号
  author: string;                // 作者
  
  // 生命周期
  onInit?: () => void;          // 初始化
  onDestroy?: () => void;       // 销毁
  
  // 组件
  component: Component;         // Vue 组件
  
  // 配置（可选）
  config?: PluginConfig;
}

export interface PluginConfig {
  // 插件可定义的配置项
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'select';
    default: any;
    label: string;
    options?: { label: string; value: any }[];
  };
}

export interface PluginAPI {
  // 插件可调用的 API
  clipboard: {
    read: () => Promise<string>;
    write: (text: string) => Promise<void>;
  };
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
  theme: {
    getCurrent: () => Theme;
    toggle: () => void;
  };
}
```

**插件加载流程**
1. 应用启动时扫描 `plugins/` 目录
2. 动态导入插件的 `index.ts`
3. 验证插件接口合规性
4. 注册到插件注册表
5. 按需加载插件组件（懒加载）

**插件通信**
- 插件通过 `PluginAPI` 与核心系统交互
- 插件之间不直接通信（避免耦合）
- 全局状态通过 Pinia 共享

### 4. 主题系统

**主题定义**
```typescript
// core/theme/themes/dark.ts
export const darkTheme: Theme = {
  id: 'dark',
  name: '深色模式',
  colors: {
    // 基础色
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // 背景色
    background: '#111827',
    surface: '#1f2937',
    surfaceHover: '#374151',
    
    // 文本色
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    
    // 边框色
    border: '#374151',
    borderHover: '#4b5563',
    
    // 编辑器专用色
    editor: {
      background: '#1e1e1e',
      text: '#d4d4d4',
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      comment: '#6a9955',
      lineHighlight: '#2a2d2e',
    },
  },
};
```

**主题切换**
- 支持浅色/深色模式
- 跟随系统主题（可选）
- 主题配置持久化到本地存储

### 5. 存储系统

**存储策略**
```typescript
// core/storage/StorageManager.ts
export class StorageManager {
  private prefix = 'toolbox-';
  
  // 获取配置
  async get<T>(key: string): Promise<T | null> {
    // 优先从 Tauri storage 读取
    // 回退到 localStorage
  }
  
  // 设置配置
  async set<T>(key: string, value: T): Promise<void> {
    // 同时写入 Tauri storage 和 localStorage
  }
  
  // 删除配置
  async remove(key: string): Promise<void> {
    // 同时删除
  }
}
```

**存储内容**
- `theme`: 主题配置
- `sidebar-width`: 侧边栏宽度
- `window-size`: 窗口大小和位置
- `plugin-settings-*`: 各插件设置
- `recent-json`: 最近使用的 JSON（可选）

### 6. JSON 格式化插件设计

**核心功能**
1. **输入区域**：文本编辑器，支持拖拽文件
2. **操作按钮**：格式化、压缩、复制、清空
3. **输出区域**：格式化后的 JSON，语法高亮
4. **状态栏**：显示 JSON 状态（有效/无效）、大小、行数

**组件结构**
```vue
<!-- plugins/json-formatter/Component.vue -->
<template>
  <div class="json-formatter">
    <!-- 工具栏 -->
    <div class="toolbar">
      <button @click="format">格式化</button>
      <button @click="compress">压缩</button>
      <button @click="copy">复制</button>
      <button @click="clear">清空</button>
      <button @click="loadFile">加载文件</button>
    </div>
    
    <!-- 编辑器区域 -->
    <div class="editor-container">
      <textarea v-model="input" placeholder="粘贴 JSON..." />
      <div class="preview">
        <pre><code v-html="highlightedOutput"></code></pre>
      </div>
    </div>
    
    <!-- 状态栏 -->
    <div class="status-bar">
      <span>状态: {{ isValid ? '有效' : '无效' }}</span>
      <span>大小: {{ fileSize }}</span>
      <span>行数: {{ lineCount }}</span>
    </div>
  </div>
</template>
```

**性能优化**
1. **防抖处理**：输入时 300ms 防抖
2. **Web Worker**：大文件（>1MB）使用 Web Worker 解析
3. **虚拟滚动**：输出区域使用虚拟滚动（如果需要）
4. **懒加载**：插件组件懒加载

## 界面设计

### 主界面布局

```
┌─────────────────────────────────────────────────────────────┐
│ [图标] 工具箱          [浅色/深色切换]  [_] [□] [×]          │
├──────────────┬──────────────────────────────────────────────┤
│ 🔍 搜索工具   │                                              │
├──────────────┤                                              │
│              │                                              │
│ 📝 JSON 格式化│              工作区                          │
│              │           （加载选中的工具组件）                │
│ 🔄 JSON 对比  │                                              │
│              │                                              │
│ ⏰ Cron 工具  │                                              │
│              │                                              │
│ 🔑 密码生成器 │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│ 状态栏: JSON 格式化 | 有效 | 1.2KB | 15行                    │
└─────────────────────────────────────────────────────────────┘
```

### 响应式设计

- **最小窗口**：800x600
- **默认窗口**：1200x800
- **最大窗口**：全屏
- **侧边栏**：可拖拽调整宽度（200-400px）
- **小窗口模式**：隐藏侧边栏，只显示工具内容

## 数据流

### 插件加载流程
```
应用启动
  ↓
扫描插件目录
  ↓
动态导入插件
  ↓
验证插件接口
  ↓
注册到插件注册表
  ↓
渲染左侧工具栏
  ↓
用户点击工具
  ↓
懒加载工具组件
  ↓
渲染到工作区
```

### 主题切换流程
```
用户点击主题切换
  ↓
更新 Pinia 主题状态
  ↓
更新 CSS 变量
  ↓
持久化到本地存储
  ↓
组件响应式更新
```

## 错误处理

### JSON 解析错误
- 显示错误位置（行号、列号）
- 高亮错误位置
- 提供修复建议（可选）

### 插件加载错误
- 显示错误提示
- 允许重新加载
- 记录错误日志

### 存储错误
- 回退到内存存储
- 显示警告提示
- 不影响核心功能

## 测试策略

### 单元测试
- 插件系统：插件加载、验证、卸载
- 主题系统：主题切换、持久化
- JSON 解析：各种边界情况

### 组件测试
- 工具栏组件：点击事件、状态显示
- 工作区组件：组件切换、状态保持

### 集成测试
- 插件与核心系统交互
- 主题切换全流程
- 配置持久化流程

### 性能测试
- 启动时间 < 500ms
- 内存占用 < 100MB
- 处理大文件（>10MB）不卡顿

## 安全考虑

### 输入安全
- JSON 解析使用安全的解析器
- 不执行任何用户输入的代码
- 限制输入大小（防止 DoS）

### 存储安全
- 配置数据本地存储，不上传
- 不存储敏感信息（如密码）
- 配置文件权限控制

### 插件安全
- 插件沙箱化（不直接访问系统）
- 插件代码验证（可选，后续添加）

## 部署与分发

### Windows
- 使用 Tauri 打包为 `.msi` 安装包
- 支持自动更新（后续添加）
- 代码签名（可选）

### Linux (Debian)
- 打包为 `.deb` 包
- 支持 `apt` 安装（可选）
- 提供 `AppImage` 版本（可选）

### 开发环境
- `pnpm run dev`：启动开发服务器
- `pnpm run build`：构建生产版本
- `pnpm run tauri build`：打包桌面应用

## 未来扩展

### 功能扩展
- JSON 对比工具
- Cron 生成解析器
- 密码生成器
- Base64 编解码
- 时间戳转换
- 正则表达式测试

### 架构扩展
- 插件市场（在线插件库）
- 插件热更新
- 插件依赖管理
- 插件权限控制

### 用户体验扩展
- 全局快捷键
- 系统托盘
- 开机自启
- 多窗口支持
- 云端同步（可选）

## 实现优先级

### P0（必须实现）
1. Tauri 项目初始化
2. Vue 3 项目搭建
3. 插件系统核心
4. 主题系统
5. 左侧工具栏
6. 右侧工作区
7. JSON 格式化插件

### P1（重要）
8. 配置持久化
9. 错误处理
10. 性能优化
11. 跨平台测试

### P2（可选）
12. 系统托盘
13. 全局快捷键
14. 自动更新

### P3（未来）
15. JSON 对比插件
16. Cron 工具插件
17. 密码生成器插件
