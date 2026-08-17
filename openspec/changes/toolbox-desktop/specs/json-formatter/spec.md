# JSON Formatter

## ADDED Requirements

### Requirement: JSON Formatting
系统 MUST 提供 JSON 格式化功能，包括美化和压缩。

#### Scenario: Format Valid JSON
- **WHEN** 用户输入合法的 JSON 字符串
- **THEN** 系统 SHOULD 格式化该 JSON 并显示美化后的结果

#### Scenario: Compress JSON
- **WHEN** 用户点击压缩按钮
- **THEN** 系统 SHOULD 将 JSON 压缩为一行

### Requirement: Syntax Highlighting
系统 MUST 提供 JSON 语法高亮显示功能。

#### Scenario: Display Colored JSON
- **WHEN** JSON 被格式化后
- **THEN** 系统 SHOULD 使用不同颜色显示键名、字符串、数字、布尔值和 null

### Requirement: Error Handling
系统 MUST 提供友好的错误处理功能。

#### Scenario: Invalid JSON Input
- **WHEN** 用户输入非法的 JSON 字符串
- **THEN** 系统 SHOULD 显示错误位置和原因提示