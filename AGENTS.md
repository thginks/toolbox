# AGENTS.md — workspec：Spec-Driven Development 工作流

workspec 是一个**统一**的 spec-driven 开发工作流：一次需求从登记到归档，只走一遍 workspec 流程。流程由两个**组件**支撑，它们不是两个并行流程：

- **brainstorm 组件**（技能 `brainstorming`）——负责"想清楚"：需求澄清与设计确认（workspec 的设计阶段）
- **openspec 组件**（技能 `openspec` + openspec CLI）——负责"管得住"：变更托管底座（登记/回填/校验/归档）

> 层级关系：**workspec（流程）= brainstorm（设计组件）+ openspec（托管组件）**

## workspec 流程（一次需求 = 走完一遍）

| 阶段 | 组件 | 内容 |
|------|------|------|
| **0. 分级** | — | 判断级别（L0 跳过全程 / L1 快速 / L2 深度） |
| **1. 登记** | openspec | 创建 `openspec/changes/<name>/` 骨架（proposal.md / design.md / tasks.md / specs/） |
| **2. 澄清与设计** | brainstorm | 一次一问澄清 → 2-3 方案对比 → 分段设计 → **用户批准（HARD-GATE）** |
| **3. 回填** | openspec | 设计写入 design.md + tasks.md + specs/，`openspec validate` 校验 |
| **4. 实现** | openspec | 按 tasks.md 逐任务实现（git 一次需求一提交，见下） |
| **5. 归档** | openspec | `openspec archive`，更新主 spec |

**HARD-GATE 属于阶段 2**：未经用户批准设计，不得进入阶段 4（不得写实现代码、不得脚手架项目）。

### 分级执行（阶段 0 的判断）

- **级别 0**（改几行/单文件/需求明确）：直接写代码 + git commit，不进入流程。
- **级别 1**（单模块多文件/需求基本清楚）：阶段 1 → 阶段 2 快速澄清（2-5 个关键问题，一次一问）→ 阶段 3 → 阶段 4 → 阶段 5。
- **级别 2**（跨模块多角色/有状态机/需求模糊）：阶段 2 深度澄清（双留痕）→ 阶段 4 完成后**最终全量审查不可省**（能发现设计文档自身的盲点）→ 阶段 5。

## 组件一：brainstorm（阶段 2，加载 `brainstorming` 技能执行）

实现任何功能、组件、或修改行为之前，必须先完成需求澄清与设计确认：

> **HARD-GATE：未经设计呈现并获得用户批准，不得写实现代码、不得脚手架项目、不得采取任何实现动作。无论任务看起来多简单都适用。**

流程（详见 `brainstorming` 技能）：探索上下文 → 范围预判拆分 → **一次一问**澄清（purpose/constraints/success criteria）→ 2-3 方案对比（推荐项放最前）→ 分段设计（架构/组件/数据流/错误处理/测试）→ 用户批准 → 设计落盘（写入 `openspec/changes/<name>/design.md`，阶段 3 回填）→ 设计自审（占位符/一致性/范围/歧义）→ 用户审阅门。

设计原则：单元小而内聚、接口清晰、可独立理解与测试；既有代码库先探索再按既有模式修改，只做服务于当前目标的重构；YAGNI 果断砍非必要功能。

## 组件二：openspec（阶段 1/3/4/5，加载 `openspec` 技能获取命令细节）

- 变更生命周期：`openspec init`（首次）→ 阶段 1 登记（创建 `openspec/changes/<name>/` 下 proposal.md / design.md / tasks.md / specs/）→ 阶段 3 回填与 `openspec validate <name>` → 阶段 4 实现 → 阶段 5 `openspec archive <name>` 归档并更新主 spec。
- 变更文件格式与 spec delta 规范（`## ADDED Requirements` / `### Requirement` / `#### Scenario` / SHALL·MUST / WHEN·THEN）见 `openspec` 技能。
- 若仓库有 `openspec/config.yaml`，其 context 与 rules 对生成 artifacts 起约束作用，遵循之。

## 关键约定

- brainstorm（阶段 2）只在需求分析确认阶段用，澄清后直接回填 openspec artifacts。
- 阶段 1/2 不重复跑：登记生成骨架后，brainstorm 只澄清，不重复登记。
- 动手前先澄清需求；级别 2 最终全量审查不可省。
- 进程内没有状态机：流程进度靠对话与已落盘的 openspec 变更文件延续；新会话用 `openspec show <name>` 恢复上下文。

## git 提交规范（一次需求 = 一次提交）

**目的：** 一次需求的历史只对应一个清晰的 commit，方便回溯该需求的完整代码变更。

- **一个需求 → 一个 commit**：commit message 用 `feat: <需求名>`，包含该需求的全部代码、文档、测试、SQL、OpenSpec artifacts。实现过程中**不中途提交**，需求实现 + 文档 + 测试完成、自测通过后一次性提交。
- **禁止混入无关改动**：一次 commit 只含本次需求文件；其他需求/遗留工作单独提交，绝不混入本次需求 commit。
- **提交前自查**：`git status` 确认无本次需求之外的改动；有无关文件先单独处理（提交或还原）。
- **推送纪律**：推送前确认 commit 已按需求组织好；**推送后不改写历史**（不 force push、不 squash 已推送提交）。需要 squash 只能在**推送前**做。
- **需求留痕并入**：设计文档、OpenSpec artifacts 随实现并入需求 commit，不单独成 commit。