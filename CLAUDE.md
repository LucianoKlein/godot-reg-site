# CLAUDE.md

## 技术栈
- Next.js 16 (App Router) + React 19 + TypeScript
- SCSS Modules 样式，共享变量在 `src/styles/_variables.scss`
- 包管理：yarn
- 构建：`npx next build`，开发：`yarn dev`
- i18n：基于 `[locale]` 动态路由段，支持中文（zh）和英文（en）

## 路由结构

```
/              → middleware 302 重定向到 /zh 或 /en（根据 Accept-Language）
/zh            → 中文首页（HomeZh）
/en            → 英文首页（HomeEn，占位骨架）
/zh/login      → 中文登录页
/en/login      → 英文登录页
/zh/courses    → 中文课程列表
/en/courses    → 英文课程列表
/zh/courses/[id] → 中文课程播放器
/en/courses/[id] → 英文课程播放器
```

## 文件清单

| 文件 | 职责 |
|------|------|
| `src/lib/constants.ts` | 全站共享色板 colors、背景渐变、字体栈 |
| `src/lib/i18n.ts` | Locale 类型定义、locales 列表、getDictionary 函数 |
| `src/lib/dictionaries/zh.json` | 中文翻译字典 |
| `src/lib/dictionaries/en.json` | 英文翻译字典 |
| `src/middleware.ts` | 语言检测 + 302 重定向 |
| `src/components/LanguageSwitcher.tsx` | 导航栏语言切换按钮 |
| `src/styles/_variables.scss` | SCSS 共享变量、断点 mixin、按钮 mixin |
| `src/app/layout.tsx` | 根布局壳，Geist 字体加载 |
| `src/app/globals.scss` | Tailwind 入口 + CSS 变量 |
| `src/app/[locale]/layout.tsx` | locale 感知布局：metadata、hreflang、generateStaticParams |
| `src/app/[locale]/page.tsx` | 首页入口，按 locale 渲染 HomeZh 或 HomeEn |
| `src/app/[locale]/HomeZh.tsx` | 中文首页（完整营销落地页） |
| `src/app/[locale]/HomeEn.tsx` | 英文首页（占位骨架） |
| `src/app/[locale]/page.module.scss` | 首页样式 |
| `src/app/[locale]/login/page.tsx` | 登录页，接入翻译字典 |
| `src/app/[locale]/courses/page.tsx` | 课程列表页，Tab 切换，接入翻译字典 |
| `src/app/[locale]/courses/[id]/page.tsx` | 课程播放器主页面 |
| `src/app/[locale]/courses/[id]/QuizModal.tsx` | 课后做题弹窗，接收 locale prop |
| `src/app/[locale]/courses/[id]/NotesPanel.tsx` | 笔记面板，接收 locale prop |
| `src/app/[locale]/courses/[id]/ExercisePanel.tsx` | 练习面板，接收 locale prop |
| `src/app/[locale]/courses/[id]/CommentItem.tsx` | 评论组件，接收 locale prop |

## 依赖关系

```
src/lib/constants.ts              ← 被播放器页面 import
src/lib/i18n.ts                   ← 被 middleware、locale layout import
src/lib/dictionaries/{zh,en}.json ← 被 i18n.ts 动态 import
src/components/LanguageSwitcher   ← 被 [locale]/page.tsx import
src/styles/_variables.scss        ← 被所有 .module.scss @use

src/app/layout.tsx                 (根布局壳)
src/app/[locale]/layout.tsx        → i18n.ts
src/app/[locale]/page.tsx          → HomeZh, HomeEn, LanguageSwitcher
src/app/[locale]/HomeZh.tsx        → page.module.scss
src/app/[locale]/HomeEn.tsx        → page.module.scss
src/app/[locale]/login/page.tsx    (内置 dict 对象)
src/app/[locale]/courses/page.tsx  (内置 dict 对象)
src/app/[locale]/courses/[id]/page.tsx → QuizModal, NotesPanel, ExercisePanel, CommentItem
```

## i18n 约定

- 首页中英文各自独立组件（HomeZh / HomeEn），文案写在组件内
- 子页面（login、courses、player）通过组件内 `dict` 对象按 locale 切换文案
- 子组件（QuizModal、NotesPanel、ExercisePanel、CommentItem）通过 `locale` prop 接收语言
- URL 路径以 `/zh` 或 `/en` 开头，middleware 自动重定向无前缀路径
- `LanguageSwitcher` 组件替换 URL 中的 locale 前缀实现切换

## 关键约定

- 样式：SCSS Modules（`.module.scss`），共享变量在 `_variables.scss`
- 色板：统一从 `@/lib/constants` 导入 `colors`（TS 中）或 `_variables.scss`（SCSS 中）
- 认证：localStorage 存 `user` JSON，无后端，登录页任意用户名即可
- 视频：`/public/assets/` 下的 mp4，`<video>` 标签直接引用
- Mock 数据：各组件内 `MOCK_*` 常量，后续接 API 时替换
- 播放器控件：position absolute 浮层，PC hover 显示 / 移动端 tap 显示，3秒无操作自动隐藏
- 移动端选集下拉：position absolute 浮层，不推动页面内容

## 编辑指南

- 改播放器控件 → `[locale]/courses/[id]/page.tsx` 的控件浮层区域
- 改评论功能 → `CommentItem.tsx` + `page.tsx` 中评论 state/列表
- 改笔记功能 → `NotesPanel.tsx`
- 改练习功能 → `ExercisePanel.tsx`
- 改做题弹窗 → `QuizModal.tsx`
- 改全局颜色 → `src/lib/constants.ts`（TS）+ `src/styles/_variables.scss`（SCSS）
- 改中文首页 → `src/app/[locale]/HomeZh.tsx`
- 改英文首页 → `src/app/[locale]/HomeEn.tsx`
- 改翻译文案 → `src/lib/dictionaries/{zh,en}.json` 或各组件内 `dict` 对象
- 添加新语言 → `src/lib/i18n.ts` 加 locale + 新建字典 JSON + middleware 匹配逻辑
