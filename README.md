# 跨平台桌面工具箱

基于 Tauri + Vue 的轻量级桌面工具箱，面向开发者，主打快速启动和插件化架构。

## 功能特性

### MVP（第一阶段）
- **JSON 格式化工具**
  - JSON 美化（格式化）
  - JSON 压缩（压缩为一行）
  - 语法高亮显示
  - 行号显示
  - 支持大文件处理（>10MB，Web Worker 异步处理）

### 后续阶段
- **JSON 对比工具**
- **Cron 生成解析器**
- **密码生成器**

## 技术栈

| 层 | 技术 | 版本 |
|---|---|---|
| 前端框架 | Vue 3 + TypeScript | 3.4+ |
| 桌面框架 | Tauri | 2.x |
| 构建工具 | Vite | 5.x |
| 样式框架 | Tailwind CSS | 3.4+ |
| 状态管理 | Pinia | 2.1+ |
| 工具函数 | VueUse | 10.7+ |

## 项目结构

```
toolbox/
├── src-tauri/              # Tauri 后端（Rust）
│   ├── Cargo.toml          # Rust 依赖配置
│   ├── tauri.conf.json     # Tauri 应用配置（v2 格式）
│   ├── capabilities/       # Tauri 2 权限声明（替代 v1 allowlist）
│   │   └── default.json    # 默认权限
│   ├── main.rs             # Rust 入口
│   └── build.rs            # Tauri 构建脚本
├── src/                    # 前端源码
│   ├── components/
│   │   └── layout/         # 布局组件
│   │       ├── TitleBar.vue        # 标题栏
│   │       ├── PluginSidebar.vue   # 左侧插件栏
│   │       ├── PluginWorkspace.vue # 右侧工作区
│   │       └── StatusBar.vue       # 底部状态栏
│   ├── plugins/            # 插件目录
│   │   └── json-formatter/ # JSON 格式化插件
│   │       ├── index.ts            # 插件入口
│   │       ├── JsonFormatter.vue   # 插件组件
│   │       ├── parser.ts           # JSON 解析器
│   │       ├── formatter.ts        # 格式化/压缩工具
│   │       ├── worker-manager.ts   # Web Worker 管理
│   │       └── json-worker.ts      # Worker 线程脚本
│   ├── stores/             # Pinia 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── App.vue             # 根组件
│   ├── main.ts             # 前端入口
│   └── style.css           # 全局样式 + 主题变量
├── openspec/               # OpenSpec 变更管理
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 开发环境要求

| 依赖 | 版本要求 | 说明 |
|---|---|---|
| Node.js | 18+ | 前端构建运行 |
| npm / yarn | 最新 | 包管理器 |
| Rust | 1.70+ | Tauri 后端编译 |
| Cargo | 随 Rust 安装 | Rust 包管理器 |
| Tauri CLI | 2.x | `npm install -D @tauri-apps/cli`（已在 package.json 中） |
| Windows | 需安装 WebView2 | Windows 10+ 通常自带 |

### 一键安装 Rust（如未安装）

```bash
# Windows / macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

安装后验证：

```bash
rustc --version   # >= 1.70.0
cargo --version
```

## 快速开始

### 1. 克隆并安装依赖

```bash
git clone <仓库地址>
cd toolbox
npm install
```

### 2. 启动开发模式

#### 方式 A：Tauri 桌面窗口（推荐）

```bash
npx tauri dev
```

这会自动完成以下步骤：
1. 启动 Vite 前端开发服务器（`http://localhost:1420`）
2. 编译 Rust 后端（首次启动较慢，后续增量编译）
3. 弹出原生桌面窗口加载应用

> 首次运行 `npx tauri dev` 会下载并编译 Tauri Rust 依赖，可能需要 2~5 分钟。

#### 方式 B：纯浏览器（快速预览 UI）

```bash
npm run dev
```

打开浏览器访问 `http://localhost:1420`，可测试所有前端功能。

> 注意：浏览器模式下标题栏的最小化/最大化/关闭按钮仅为占位，无实际效果。

### 3. 构建生产版本

```bash
npx tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`，包含：
- **Windows**：`.msi` 安装包 / `.exe` 可执行文件
- **macOS**：`.dmg` / `.app`
- **Linux**：`.deb` / `.AppImage`

### 4. 仅构建前端

```bash
npm run build
```

输出到 `dist/` 目录，可用于静态部署。

## 测试

### 前端功能测试（浏览器）

```bash
npm run dev
# 访问 http://localhost:1420
```

可测试内容：
- 插件切换（左侧栏点击不同插件）
- JSON 格式化 / 压缩 / 对比模式
- 主题切换（深色 / 浅色）
- 响应式布局

### 桌面应用测试

```bash
npx tauri dev
```

在弹出的原生窗口中测试：
- 完整的窗口行为（最小化/最大化/关闭）
- 应用在桌面环境中的实际表现
- 性能和资源占用

### 单元测试（待配置）

后续可集成 [Vitest](https://vitest.dev/) 进行前端单元测试：

```bash
# 安装（尚未配置）
npm install -D vitest @vue/test-utils

# 运行
npx vitest
```

## 插件开发

### 插件结构

每个插件位于 `src/plugins/<plugin-name>/`，包含：

```
json-formatter/
├── index.ts              # 插件元数据 + 生命周期（必须）
├── JsonFormatter.vue     # 插件主 UI 组件（必须）
├── parser.ts             # 业务逻辑（可选）
├── formatter.ts          # 工具函数（可选）
├── worker-manager.ts     # Web Worker 管理（可选）
└── json-worker.ts        # Worker 线程脚本（可选）
```

### 插件接口

```typescript
interface Plugin {
  id: string            // 唯一标识
  name: string          // 显示名称
  description: string   // 描述
  version: string       // 版本号
  icon?: string         // 图标（emoji 或自定义）
  activate(context: PluginContext): void  // 激活时调用
  deactivate(): void                       // 停用时调用
  render(): any                            // 返回 Vue 组件
}
```

### 添加新插件

1. 在 `src/plugins/` 下创建新目录
2. 创建 `index.ts` 实现 `Plugin` 接口
3. 创建插件 Vue 组件
4. 在 `PluginWorkspace.vue` 的 `pluginComponents` 中注册：

```typescript
import { defineAsyncComponent } from 'vue'

const pluginComponents: Record<string, any> = {
  'json-formatter': defineAsyncComponent(() => import('@/plugins/json-formatter/JsonFormatter.vue')),
  'my-new-plugin': defineAsyncComponent(() => import('@/plugins/my-new-plugin/MyComponent.vue')),
}
```

5. 在 `PluginSidebar.vue` 的 `plugins` 数组中添加入口信息

## 主题支持

- **浅色模式**（默认）
- **深色模式**（跟随系统主题，可手动切换）

主题通过 CSS 变量实现，定义在 `src/style.css`：

```css
:root {
  --color-primary: #0ea5e9;
  --color-background: #ffffff;
  /* ... */
}

.dark {
  --color-primary: #38bdf8;
  --color-background: #0f172a;
  /* ... */
}
```

## 性能目标

| 指标 | 目标 | 可接受 |
|---|---|---|
| 启动速度 | < 500ms | < 1s |
| 内存占用（空闲） | < 100MB | < 150MB |
| 安装包大小 | < 20MB（Windows） | < 30MB |
| JSON 处理 | < 100ms（1MB 文件） | < 500ms |

## 常见问题

### Q: `npx tauri dev` 首次编译很慢？

Tauri 首次运行需要下载并编译所有 Rust 依赖，这是正常的。后续增量编译通常在 10 秒内完成。

### Q: Windows 上提示缺少 WebView2？

Windows 10 (1803+) 通常自带 WebView2。如果缺失，从 [Microsoft WebView2 下载页](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 安装即可。

### Q: 浏览器里 `npm run dev` 报错？

确认 Node.js 版本 >= 18，然后重新 `npm install`。

### Q: 如何调试 Rust 后端？

在 `src-tauri/main.rs` 中添加 `println!` 或 `eprintln!`，日志会输出到终端。也可以使用 `dbg!()` 宏进行调试输出。

## 许可证

MIT License
