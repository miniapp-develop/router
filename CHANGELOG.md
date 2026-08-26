# 更新日志

本文件记录 `@mini-dev/router` 的发布历史。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)（0.x 阶段：破坏性改动 bump minor）。

## [0.3.0] — 未发布

相对 0.2.x 的**破坏性改动**：用 [koa-compose](https://github.com/koajs/compose) 洋葱模型重写中间件。

### 新增

- `router.interceptor(mw)`：koa-compose 风格洋葱中间件，签名 `(ctx, next) => Promise<void>`。
- 中间件 `ctx` 新增 `router`、`state`、`result` 字段；`await next()` 之后为 up 阶段（after 钩子，可读 `ctx.result`，父级 up 阶段包住子 Router 导航）。
- 引入唯一运行时依赖 `koa-compose`。

### 变更（破坏性）

- 移除 `router.before(h)` 及 `utils.forEach` 线性中间件实现。
- 中间件顺序由 LIFO（后注册先执行）改为注册序 down、逆序 up。
- 中间件签名由 `(data) => data | Promise<data>` 改为 `(ctx, next) => Promise<void>`；阻断由"返回 rejected Promise"改为 `throw` / reject，或不调 `next()` 静默短路。
- 传递方式由"返回值传给下一个"改为共享 `ctx` + `await next()`。

### 文档

- README 新增「§11 从 0.2.x 迁移到 0.3.0」迁移指南。
- 修正 §3「不引入运行时依赖」、§9.4「npm 构建」与新依赖矛盾之处。
- `package.json`：修正 `repository.url`（原 `git+git@...` 非法），补充中文 `description`、`keywords`、`publishConfig.access`。

### 不变

- `use(...)` 路由注册、`navigateTo`/`redirectTo`/`reLaunch`/`switchTab` 调用方式、url>path>name 解析优先级、嵌套路由委托、`navigateBack` 绕过中间件、平台自动探测等行为均未变化。

### 迁移

见 README §11。核心是把 `before(cb)` 改写为 `interceptor(async (ctx, next) => { …; await next(); })`。

## [0.2.0] — 2026-07-16

- 完成示例项目重构与基础功能完善。
- 新增多端平台探测工具库（`wx` / `my` / `tt` / `swan` / `qq`），优化路由引入方式。
- 完善示例项目的页面、路由配置与样式文件。
- 补充完整的单元测试用例覆盖路由核心功能。
- 更新项目依赖与配置文件。

## [0.1.0] — 2025-08-19

首次以 `@mini-dev/router` 名称发布。

## [0.0.x] — 2021 ~ 2022

早期迭代版本（0.0.1 ~ 0.0.5），未纳入本更新日志的详细记录。

[0.3.0]: https://github.com/xesam/minidev-router/releases/tag/v0.3.0
[0.2.0]: https://github.com/xesam/minidev-router/releases/tag/v0.2.0
[0.1.0]: https://github.com/xesam/minidev-router/releases/tag/v0.1.0
