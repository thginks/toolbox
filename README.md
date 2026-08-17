# 跨平台桌面工具箱

基于 Tauri + Vue 的轻量级桌面工具箱，面向开发者，主打快速启动和插件化架构。

## 功能特性

### MVP（第一阶段）
- **JSON 格式化工具**
  - JSON 美化（格式化）
  - JSON 压缩（压缩为一行）
  - 语法高亮显示
  - 行号显示
  - 支持大文件处理（>10MB）

### 后续阶段
- **JSON 对比工具**
- **Cron 生成解析器**
- **密码生成器**

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **桌面框架**：Tauri 2.x
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **状态管理**：Pinia
- **工具函数**：VueUse

## 项目结构

```
toolbox-desktop/
├── openspec/              # OpenSpec 变更管理
├── src/
│   ├── components/        # 组件
│   │   └── layout/        # 布局组件
│   ├── plugins/           # 插件目录
│   │   └── json-formatter/# JSON 格式化插件
│   ├── stores/            # Pinia stores
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── App.vue            # 主组件
│   ├── main.ts            # 入口文件
│   └── style.css          # 全局样式
├── package.json           # 项目配置
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind 配置
└── README.md              # 项目说明
```

## 开发环境要求

- Node.js 18+
- npm 或 yarn
- Rust 工具链
- Tauri CLI

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 启动开发服务器

```bash
npm run tauri dev
# 或
yarn tauri dev
```

### 3. 构建生产版本

```bash
npm run tauri build
# 或
yarn tauri build
```

## 插件开发

插件位于 `src/plugins/` 目录下，每个插件包含：
- `index.ts`：插件入口文件
- `Component.vue`：插件主组件

### 创建新插件

1. 在 `src/plugins/` 下创建新目录
2. 实现插件接口
3. 注册到插件系统

## 主题支持

- 浅色模式（默认）
- 深色模式（跟随系统主题）

## 性能目标

- 启动速度：< 500ms（目标），< 1s（可接受）
- 内存占用：< 100MB（空闲状态）
- 包大小：< 20MB（Windows），< 15MB（Linux）

## 许可证

MIT License