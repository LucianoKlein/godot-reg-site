# Aiden 后台管理系统 — 前端开发文档

## 一、项目概述

### 1.1 项目定位

为 Aiden 实战训练平台提供后台管理界面，管理员可通过该系统管理首页内容、课程体系、用户权限、弹幕审核、评论管理等。

### 1.2 技术栈

| 技术 | 说明 |
|------|------|
| React 18+ | UI 框架 |
| Vite | 构建工具 |
| TypeScript | 类型安全 |
| Ant Design 5.x | UI 组件库 |
| SCSS Modules | 样式方案（`*.module.scss`） |
| React Router v6 | 路由 |
| Axios | HTTP 请求（暂用 mock） |

### 1.3 项目结构（建议）

```
admin/
├── public/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 通用组件
│   ├── layouts/
│   │   └── AdminLayout.tsx  # 后台整体布局（侧边栏+顶栏+内容区）
│   ├── pages/
│   │   ├── login/           # 管理员登录
│   │   ├── dashboard/       # 仪表盘首页
│   │   ├── homepage/        # 首页内容管理
│   │   ├── courses/         # 课程管理
│   │   ├── users/           # 用户管理
│   │   ├── danmaku/         # 弹幕管理
│   │   ├── comments/        # 评论管理
│   │   └── settings/        # 系统设置
│   ├── mock/                # Mock 数据
│   ├── services/            # API 请求封装
│   ├── stores/              # 状态管理（可选，轻量场景用 Context）
│   ├── styles/
│   │   └── variables.scss   # SCSS 全局变量
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── router.tsx           # 路由配置
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 二、全局布局与管理员认证

### 2.1 管理员登录页 `/login`

| 字段 | 说明 |
|------|------|
| 用户名 | 管理员账号 |
| 密码 | 管理员密码 |

- 登录成功后将 token 存入 `localStorage`，跳转至 `/dashboard`
- 暂用 mock：用户名 `admin`，密码 `admin123` 即可登录
- 未登录访问任何后台页面自动跳转 `/login`

### 2.2 后台整体布局 `AdminLayout`

```
┌──────────────────────────────────────────────┐
│  顶栏：Logo · 管理员名称 · 退出登录          │
├────────┬─────────────────────────────────────┤
│        │                                     │
│ 侧边栏 │          内容区域                    │
│        │                                     │
│ · 仪表盘│                                     │
│ · 首页管理│                                   │
│ · 课程管理│                                   │
│ · 用户管理│                                   │
│ · 弹幕管理│                                   │
│ · 评论管理│                                   │
│ · 系统设置│                                   │
│        │                                     │
└────────┴─────────────────────────────────────┘
```

- 使用 Ant Design 的 `Layout` + `Sider` + `Menu` 组件
- 侧边栏可折叠
- 顶栏右侧显示当前管理员名称和退出按钮

---

## 三、仪表盘 `/dashboard`

展示平台核心数据概览（全部 mock）：

| 卡片 | 数据 |
|------|------|
| 总用户数 | 数字 + 较昨日变化 |
| 总课程数 | 数字 |
| 今日活跃用户 | 数字 |
| 待审核弹幕 | 数字（可点击跳转弹幕管理） |
| 待审核评论 | 数字（可点击跳转评论管理） |
| 待开通用户 | 数字（可点击跳转用户管理） |

底部可放一个简单的折线图（近7天活跃用户趋势），用 Ant Design Charts 或暂时用占位图。

---

## 四、首页内容管理 `/homepage`

管理前台首页（`src/app/page.tsx`）中各区块的内容。

### 4.1 页面结构

使用 Tab 或折叠面板分区管理，对应前台首页的各 section：

### 4.2 Hero 区域管理

| 字段 | 类型 | 说明 |
|------|------|------|
| 标签列表 | `string[]` | 如 "没有套路"、"实战导向" 等，可增删改排序 |
| 主标题 | `string` | 如 "只有真正的实力和学员的收获" |
| 副标题描述 | `string`（富文本） | 支持 `<strong>` 等简单标签 |
| 行动按钮 | `{text, href}[]` | 如 "获取课程与就业服务细节" |
| 左侧小卡片 | `{title, bigText, desc}[]` | 如 "学员反馈关键词 → 务实" |
| 右侧信息卡片 | `{title, bigText, desc}[]` | 如 "Sandy 收到 Venetian Offer" |
| 提醒卡片 | `{title, desc}` | 黄色警告卡片内容 |

### 4.3 真实案例区域

| 字段 | 类型 | 说明 |
|------|------|------|
| 区域标题 | `string` | "真实案例分享" |
| 区域描述 | `string` | |
| 案例引用列表 | `{quote, source, keywords}[]` | 学员反馈引用 |

### 4.4 课程与保障区域

| 字段 | 类型 | 说明 |
|------|------|------|
| 区域标题 | `string` | |
| 区域描述 | `string` | |
| 特性卡片列表 | `{title, description}[]` | 6 张特性卡片，可增删改排序 |

### 4.5 教学体系区域

| 字段 | 类型 | 说明 |
|------|------|------|
| 区域标题 | `string` | |
| 区域描述 | `string` | |
| 步骤列表 | `{title, text}[]` | 4 个步骤，可增删改排序 |
| 引用卡片 | `{quote, source, keywords}` | |
| 澄清说明 | `{title, text}` | |

### 4.6 常见问题区域

| 字段 | 类型 | 说明 |
|------|------|------|
| FAQ 列表 | `{question, answer}[]` | 可增删改排序 |

### 4.7 咨询区域 & 页脚

| 字段 | 类型 | 说明 |
|------|------|------|
| CTA 标签 | `string` | |
| CTA 标题 | `string` | |
| CTA 描述 | `string` | |
| 表单字段配置 | `{placeholder}[]` | 咨询表单的输入框 |
| 页脚品牌名 | `string` | |
| 页脚联系方式 | `string` | |
| 页脚链接 | `{text, href}[]` | |

### 4.8 交互要求

- 每个区块使用 Ant Design `Form` 组件编辑
- 列表类字段使用可拖拽排序的动态表单项（`Form.List` + 拖拽）
- 提供「预览」按钮，可在新窗口预览修改后的首页效果（可选，后期实现）
- 提供「保存」按钮，暂存到 mock/localStorage

---

## 五、课程管理 `/courses`

管理前台课程列表和课程播放器中的所有内容。

### 5.1 课程列表页 `/courses`

使用 Ant Design `Table` 展示所有课程，支持按分类筛选和搜索。

#### 表格列

| 列名 | 字段 | 说明 |
|------|------|------|
| 课程ID | `id` | 如 `poker-1` |
| 课程名称 | `name` | 如 "德州扑克基础入门" |
| 分类 | `category` | 扑克教程 / 百家乐 / 骰子 |
| 讲师 | `instructor` | 如 "Aiden" |
| 总时长 | `duration` | 如 "8小时20分" |
| 学习人数 | `students` | 数字 |
| 订阅人数 | `subscribers` | 数字 |
| 课节数 | `episodeCount` | 该课程下的课节总数 |
| 状态 | `status` | 已上架 / 已下架 / 草稿 |
| 更新时间 | `updatedAt` | 日期 |
| 操作 | — | 编辑 · 上/下架 · 删除 |

#### 顶部操作栏

- 「新建课程」按钮
- 分类筛选下拉（全部 / 扑克教程 / 百家乐 / 骰子）
- 状态筛选（全部 / 已上架 / 已下架 / 草稿）
- 搜索框（按课程名称模糊搜索）

#### 课程数据模型

```typescript
interface Course {
  id: string;
  name: string;
  category: "扑克教程" | "百家乐" | "骰子";
  instructor: string;
  duration: string;
  students: number;
  subscribers: number;
  status: "published" | "unpublished" | "draft";
  cover?: string;          // 封面图 URL
  description?: string;    // 课程简介
  price?: number;          // 课程价格（元）
  updatedAt: string;
  createdAt: string;
}
```

### 5.2 课程编辑页 `/courses/:id/edit`

使用 Ant Design `Form` + `Tabs` 组织，分为以下 Tab：

#### Tab 1：基本信息

| 字段 | 组件 | 说明 |
|------|------|------|
| 课程名称 | `Input` | 必填 |
| 分类 | `Select` | 扑克教程 / 百家乐 / 骰子 |
| 讲师 | `Input` | 必填 |
| 课程简介 | `TextArea` | 选填 |
| 封面图 | `Upload` | 图片上传（暂 mock，显示预览即可） |
| 课程价格 | `InputNumber` | 单位：元 |
| 状态 | `Select` | 草稿 / 已上架 / 已下架 |

#### Tab 2：课节管理

管理该课程下的所有课节（Episode），使用可拖拽排序的列表。

##### 课节数据模型

```typescript
interface Episode {
  id: number;
  title: string;           // 如 "第1节 课程介绍与学习目标"
  duration: string;        // 如 "12:30"
  videoUrl: string;        // 视频文件路径（暂 mock）
  sortOrder: number;       // 排序序号
  status: "published" | "draft";
}
```

##### 课节列表 UI

- 可拖拽排序的卡片列表
- 每个卡片显示：序号、标题、时长、状态
- 操作：编辑 · 删除 · 上移/下移
- 「添加课节」按钮

##### 课节编辑弹窗（Modal）

| 字段 | 组件 | 说明 |
|------|------|------|
| 课节标题 | `Input` | 必填 |
| 时长 | `Input` | 如 "12:30" |
| 视频文件 | `Upload` / `Input` | 暂用 URL 输入，后续改为上传 |
| 状态 | `Switch` | 发布/草稿 |

#### Tab 3：题目管理（Quiz）

管理每个课节对应的课后测验题目。

##### 题目数据模型

```typescript
interface QuizQuestion {
  id: number;
  episodeId: number;       // 关联课节
  question: string;        // 题目文本
  options: string[];       // 选项列表，如 ["A. xxx", "B. xxx", ...]
  answerIndex: number;     // 正确答案索引（0-based）
  sortOrder: number;
}
```

##### 题目管理 UI

- 先选择课节（下拉），再管理该课节下的题目
- 题目列表使用 `Table` 或卡片列表
- 每题显示：题目文本、选项数量、正确答案
- 操作：编辑 · 删除
- 「添加题目」按钮

##### 题目编辑弹窗

| 字段 | 组件 | 说明 |
|------|------|------|
| 关联课节 | `Select` | 下拉选择课节 |
| 题目文本 | `TextArea` | 必填 |
| 选项列表 | `Form.List` | 动态增删选项，至少 2 个 |
| 正确答案 | `Radio` | 从选项中选择正确答案 |

#### Tab 4：练习管理（Exercise）

管理图片练习题。

##### 练习数据模型

```typescript
interface Exercise {
  id: number;
  courseId: string;         // 关联课程
  title: string;           // 如 "识别正确的发牌手势"
  image: string;           // 图片 URL
  hint: string;            // 提示文本
  sortOrder: number;
}
```

##### 练习管理 UI

- 练习列表使用卡片布局，显示图片缩略图 + 标题
- 操作：编辑 · 删除 · 排序
- 「添加练习」按钮

##### 练习编辑弹窗

| 字段 | 组件 | 说明 |
|------|------|------|
| 练习标题 | `Input` | 必填 |
| 图片 | `Upload` | 图片上传（暂 mock） |
| 提示文本 | `TextArea` | 引导学员作答的提示 |

#### Tab 5：笔记模板（可选）

管理预设笔记模板，学员打开笔记面板时可看到预设内容。

```typescript
interface NoteTemplate {
  id: number;
  episodeId: number;
  time: number;            // 视频时间点（秒）
  content: string;         // Markdown 内容
}
```

暂时优先级较低，可后期实现。

---

## 六、用户管理 `/users`

### 6.1 用户列表页

使用 Ant Design `Table` 展示所有注册用户。

#### 表格列

| 列名 | 字段 | 说明 |
|------|------|------|
| 用户ID | `id` | 自增 |
| 用户名 | `username` | |
| 注册时间 | `createdAt` | |
| 最后登录 | `lastLoginAt` | |
| 已开通课程 | `courseCount` | 数字，可点击查看详情 |
| 状态 | `status` | 正常 / 已禁用 |
| 操作 | — | 开通课程 · 禁用/启用 · 查看详情 |

#### 顶部操作栏

- 搜索框（按用户名搜索）
- 状态筛选（全部 / 正常 / 已禁用）
- 「添加用户」按钮（手动创建用户）

#### 用户数据模型

```typescript
interface User {
  id: number;
  username: string;
  avatar?: string;
  status: "active" | "disabled";
  createdAt: string;
  lastLoginAt: string;
  courses: UserCourse[];   // 已开通的课程列表
}

interface UserCourse {
  courseId: string;
  courseName: string;
  grantedAt: string;       // 开通时间
  grantedBy: string;       // 操作管理员
  expiresAt?: string;      // 过期时间（可选，null 表示永久）
  paymentNote?: string;    // 付款备注
}
```

### 6.2 课程开通弹窗

管理员点击「开通课程」后弹出 Modal：

| 字段 | 组件 | 说明 |
|------|------|------|
| 选择课程 | `Select`（多选） | 从课程列表中选择要开通的课程 |
| 有效期 | `DatePicker` / 永久 | 可选择到期日期或勾选"永久有效" |
| 付款备注 | `TextArea` | 记录私下付款信息，如 "微信转账 ¥299，2026-03-18" |

### 6.3 用户详情页 `/users/:id`

| 区域 | 内容 |
|------|------|
| 基本信息 | 用户名、注册时间、最后登录、状态 |
| 已开通课程 | 表格：课程名、开通时间、操作管理员、到期时间、付款备注 |
| 学习记录 | 表格：课程名、已学课节数/总课节数、最后学习时间 |
| 操作日志 | 该用户相关的操作记录（开通、禁用等） |

---

## 七、弹幕管理 `/danmaku`

### 7.1 弹幕数据模型

```typescript
interface Danmaku {
  id: number;
  courseId: string;
  episodeId: number;
  userId: number;
  username: string;
  text: string;
  color: string;        // 如 "#fff", "#FACC15"
  time: number;         // 视频时间点（秒）
  status: "visible" | "hidden";
  createdAt: string;
}
```

### 7.2 弹幕列表页

使用 `Table` 展示，支持筛选和批量操作。

#### 表格列

| 列名 | 说明 |
|------|------|
| ID | 弹幕ID |
| 课程 | 所属课程名称 |
| 课节 | 所属课节标题 |
| 用户 | 发送者用户名 |
| 内容 | 弹幕文本 |
| 颜色 | 色块预览 |
| 时间点 | 视频中的时间 |
| 状态 | 显示中 / 已隐藏 |
| 发送时间 | 创建时间 |
| 操作 | 隐藏 / 恢复显示 · 删除 |

#### 筛选栏

- 课程筛选（下拉）
- 课节筛选（联动下拉）
- 状态筛选（全部 / 显示中 / 已隐藏）
- 关键词搜索（按弹幕内容）
- 批量操作：批量隐藏 / 批量删除

---

## 八、评论管理 `/comments`

### 8.1 评论数据模型

```typescript
interface AdminComment {
  id: number;
  courseId: string;
  episodeId: number;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  status: "visible" | "hidden";
  createdAt: string;
  replies: AdminReply[];
}

interface AdminReply {
  id: number;
  commentId: number;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  status: "visible" | "hidden";
  createdAt: string;
}
```

### 8.2 评论列表页

#### 表格列

| 列名 | 说明 |
|------|------|
| ID | 评论ID |
| 课程 | 所属课程 |
| 课节 | 所属课节 |
| 用户 | 评论者用户名 |
| 内容 | 评论文本（截断显示，hover 全文） |
| 点赞数 | |
| 回复数 | 子回复数量 |
| 状态 | 显示中 / 已隐藏 |
| 发布时间 | |
| 操作 | 隐藏/恢复 · 删除 · 查看回复 |

#### 筛选栏

- 课程筛选、状态筛选、关键词搜索
- 批量操作：批量隐藏 / 批量删除

### 8.3 回复管理

点击「查看回复」展开 Drawer，显示子回复列表，支持隐藏/删除单条回复。

---

## 九、系统设置 `/settings`

### 9.1 管理员账号管理

| 字段 | 说明 |
|------|------|
| 管理员列表 | 用户名、角色、创建时间 |
| 添加管理员 | 用户名 + 密码 + 角色 |
| 修改密码 | 当前管理员修改自己的密码 |

角色暂定两种：`超级管理员`（全部权限）、`普通管理员`（不可管理其他管理员）。

### 9.2 课程分类管理

管理前台课程列表的 Tab 分类，支持增删改排序。

```typescript
interface CourseCategory {
  id: string;
  name: string;       // 如 "扑克教程"、"百家乐"、"骰子"
  sortOrder: number;
}
```

### 9.3 弹幕敏感词设置

| 字段 | 说明 |
|------|------|
| 敏感词列表 | 可增删，命中时自动隐藏弹幕 |
| 开关 | 是否启用自动过滤 |

---

## 十、补充功能建议（你可能遗漏的）

以下是分析前台代码后发现的、原始需求中未明确提到但建议纳入的功能：

### 10.1 咨询表单管理

前台首页底部有「快速留资」表单（姓名、联系方式、方向），后台应有对应的留资记录查看页面：

| 列名 | 说明 |
|------|------|
| 称呼 | 用户填写的称呼 |
| 联系方式 | 微信/电话 |
| 咨询方向 | 课程/面试/就业服务 |
| 提交时间 | |
| 状态 | 未处理 / 已联系 / 已关闭 |
| 备注 | 管理员可添加跟进备注 |

### 10.2 学习进度统计

前台课节有 `watched` 和 `quizPassed` 状态，后台应能查看每个用户的学习进度：

- 按课程维度：某课程的完课率、平均进度
- 按用户维度：某用户各课程的学习进度、做题通过情况

### 10.3 操作日志

记录管理员的关键操作，便于审计追溯：

| 列名 | 说明 |
|------|------|
| 操作时间 | |
| 管理员 | 操作人用户名 |
| 操作类型 | 开通课程 / 隐藏弹幕 / 删除评论 / 修改课程 等 |
| 操作对象 | 用户名 / 课程名 / 弹幕ID 等 |
| 详情 | 操作描述 |

### 10.4 讲师管理

前台课程有 `instructor` 字段，建议后台维护讲师列表：

```typescript
interface Instructor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;           // 简介
  status: "active" | "disabled";
}
```

课程编辑时从讲师列表中选择，而非手动输入。

---

## 十一、路由汇总

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | 管理员登录 | 无需 Layout |
| `/dashboard` | 仪表盘 | 数据概览 |
| `/homepage` | 首页内容管理 | Tab/折叠面板分区 |
| `/courses` | 课程列表 | Table + 筛选 |
| `/courses/create` | 新建课程 | 表单 |
| `/courses/:id/edit` | 编辑课程 | Tabs 多面板 |
| `/users` | 用户列表 | Table + 筛选 |
| `/users/:id` | 用户详情 | 信息+课程+进度 |
| `/danmaku` | 弹幕管理 | Table + 批量操作 |
| `/comments` | 评论管理 | Table + Drawer |
| `/consultations` | 咨询留资 | Table + 状态管理 |
| `/instructors` | 讲师管理 | Table + CRUD |
| `/logs` | 操作日志 | Table 只读 |
| `/settings` | 系统设置 | 管理员/分类/敏感词 |

---

## 十二、Mock 数据规范

所有 mock 数据统一放在 `src/mock/` 目录下，按模块拆分文件：

```
src/mock/
├── auth.ts          # 管理员登录 mock
├── courses.ts       # 课程 + 课节 + 题目 + 练习
├── users.ts         # 用户 + 开通记录
├── danmaku.ts       # 弹幕数据
├── comments.ts      # 评论 + 回复
├── homepage.ts      # 首页各区块内容
├── consultations.ts # 咨询留资
├── instructors.ts   # 讲师
├── logs.ts          # 操作日志
└── index.ts         # 统一导出
```

Mock 数据量建议：
- 课程：3 个分类各 3-5 门，共约 12 门
- 每门课程 5-10 个课节
- 每课节 3 道题目
- 用户：20 条
- 弹幕：50 条
- 评论：30 条（含回复）
- 咨询留资：10 条

---

## 十三、开发优先级

分三期推进，每期可独立交付使用：

### P0（第一期 — 核心功能）

1. 项目脚手架搭建（Vite + React + TS + Ant Design + SCSS Modules + Router）
2. 管理员登录 + 路由守卫
3. AdminLayout 整体布局
4. 课程管理（列表 + 新建/编辑 + 课节管理）
5. 用户管理（列表 + 课程开通）

### P1（第二期 — 内容与审核）

6. 题目管理（Quiz）
7. 练习管理（Exercise）
8. 弹幕管理（列表 + 隐藏/删除）
9. 评论管理（列表 + 回复管理）
10. 仪表盘数据概览

### P2（第三期 — 运营与扩展）

11. 首页内容管理（CMS）
12. 咨询留资管理
13. 讲师管理
14. 操作日志
15. 系统设置（管理员账号、分类管理、敏感词）

---

## 十四、UI 风格约定

| 项目 | 约定 |
|------|------|
| 主题 | Ant Design 默认亮色主题 |
| 主色 | `#7C3AED`（与前台品牌色一致） |
| 布局宽度 | 侧边栏 220px，内容区自适应 |
| 表格 | 统一使用 Ant Design `Table`，带分页（每页 20 条） |
| 弹窗 | 统一使用 `Modal`，宽度 520px-720px |
| 表单 | 统一使用 `Form`，标签右对齐，宽度 120px |
| 消息提示 | 操作成功用 `message.success`，失败用 `message.error` |
| 确认操作 | 删除等危险操作使用 `Modal.confirm` 二次确认 |
| SCSS Modules | 每个页面/组件一个 `*.module.scss` 文件 |

---

## 十五、类型定义汇总

所有类型统一放在 `src/types/` 下，按模块拆分：

```
src/types/
├── course.ts        # Course, Episode, QuizQuestion, Exercise
├── user.ts          # User, UserCourse
├── danmaku.ts       # Danmaku
├── comment.ts       # AdminComment, AdminReply
├── homepage.ts      # 首页各区块类型
├── consultation.ts  # 咨询留资
├── instructor.ts    # Instructor
├── log.ts           # OperationLog
├── auth.ts          # AdminUser, LoginForm
└── index.ts         # 统一 re-export
```

---

## 十六、备注

- 本文档基于前台项目 `reg-site` 的现有代码结构和数据模型编写
- 所有数据暂用 mock，后续接入后端 API 时只需替换 `src/services/` 中的请求实现
- 视频文件存储方案暂不考虑，课节中的 `videoUrl` 字段暂用本地路径或占位 URL
- 付费流程为线下私下付款，管理员在后台手动为用户开通课程权限

