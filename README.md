# Wallpaper Next

一个基于 `Next.js 16` + `React 19` + `Prisma` 的壁纸展示与管理项目，支持壁纸画廊、合集管理、文章文档、Cloudflare R2 上传，以及基于 Clerk 的后台权限控制。

项目当前围绕以下能力展开：

- 壁纸浏览、详情展示、标签筛选
- 壁纸上传与 Cloudflare R2 对象存储
- Steam Workshop 壁纸导入
- 合集管理
- 文档/教程文章管理
- Clerk 登录与管理员权限校验

## 技术栈

### 前端

- `Next.js 16.1.1`，使用 App Router
- `React 19.2.3`
- `TypeScript 5`
- `Tailwind CSS 4`
- `Framer Motion`
- `Zustand`
- `next-themes`

### 后端与数据层

- `Prisma 7`
- `@prisma/client`
- `@prisma/adapter-pg`
- `PostgreSQL`
- 推荐数据库服务：`Neon`

### 认证与存储

- `Clerk`：用户登录与管理员鉴权
- `Cloudflare R2`
- `AWS SDK v3` + `S3 Presigned URL`

## 项目结构

以下列出主要目录与文件，路由目录中的 `page.tsx` 对应页面入口。

```text
.
├─ prisma/
│  ├─ schema.prisma            # Prisma 数据模型定义
│  └─ seed.ts                  # 初始化文章种子数据
├─ public/                     # 可直接通过 URL 访问的静态资源
├─ src/
│  ├─ app/                     # Next.js App Router 页面与服务端入口
│  │  ├─ page.tsx              # 首页
│  │  ├─ layout.tsx            # 根布局、Clerk、主题 Provider 与导航
│  │  ├─ globals.css           # 全局样式入口，按顺序引入主题模块
│  │  ├─ loading.tsx           # 路由加载界面
│  │  ├─ about/                # 关于我页面
│  │  ├─ actions/              # 文章、壁纸、合集、Steam 导入的 Server Actions
│  │  ├─ api/upload-image/     # 图片上传凭证接口（route.ts）
│  │  ├─ collections/          # 合集列表
│  │  │  └─ [id]/              # 合集详情
│  │  │     └─ edit/           # 合集编辑
│  │  ├─ demos/                # 交互与组件演示列表、配置（config.ts）
│  │  │  ├─ carousel/          # 轮播组件演示
│  │  │  ├─ components/        # 演示页面使用的组件
│  │  │  ├─ framer-buttons/    # 按钮微交互演示
│  │  │  ├─ loading/           # 加载效果演示
│  │  │  └─ scrollParallax/    # 滚动视差演示
│  │  ├─ docs/                 # 文档/文章列表与加载界面
│  │  │  ├─ [slug]/            # 文章详情
│  │  │  │  └─ edit/           # 文章编辑
│  │  │  ├─ admin/             # 文章后台管理
│  │  │  └─ new/               # 新建文章
│  │  ├─ gallery/              # 壁纸画廊、搜索与筛选
│  │  ├─ uploadpage/           # 壁纸上传与 Steam 导入页面
│  │  └─ wallpaper/[id]/       # 壁纸详情与桌面预览
│  ├─ components/
│  │  ├─ ThemeProvider.tsx     # next-themes 主题 Provider
│  │  ├─ about/                # 关于我页面组件
│  │  ├─ article/              # 文章编辑器、管理入口
│  │  ├─ home/                 # 首页导航、场景主视觉与分层矢量图
│  │  ├─ layout/               # 导航栏、路由切换进度条
│  │  ├─ ui/                   # 按钮、视差卡片、轮播、Markdown 等通用组件
│  │  ├─ wallpaper/            # 壁纸详情客户端组件
│  │  └─ widgets/              # 小工具组件与可拖拽的 WidgetLayer
│  ├─ data/profile.json        # 关于我页面的个人资料
│  ├─ hooks/
│  │  ├─ useAuth.ts            # 客户端管理员权限检查（useAdmin）
│  │  └─ useLoading.ts         # 加载状态与异步操作封装
│  ├─ lib/                     # Prisma、R2、Steam、鉴权、工具与模拟数据
│  ├─ store/widgetStore.ts     # Zustand 小工具列表与位置状态
│  ├─ styles/
│  │  ├─ base.css              # 基础样式与全局初始化
│  │  ├─ home.css              # 首页布局与 Atropos 主题样式
│  │  ├─ tailwind-theme.css    # Tailwind v4 语义化主题映射
│  │  ├─ theme-transition.css  # 明暗主题全屏扇形过渡
│  │  ├─ variants.css          # dark 自定义变体
│  │  └─ themes/
│  │     ├─ dark.css           # 暗色主题变量
│  │     └─ light.css          # 亮色主题变量
│  ├─ types/
│  │  ├─ article.ts            # 文章类型
│  │  └─ index.ts              # 基于 Prisma 模型的壁纸类型
│  ├─ globals.d.ts             # Clerk 会话角色类型声明
│  └─ proxy.ts                 # Clerk 中间件与受保护路由检查
├─ .env.example                # 环境变量示例
├─ .env template               # 本地环境变量模板
├─ eslint.config.mjs           # ESLint 配置
├─ next.config.ts              # Next.js 配置
├─ package.json                # 项目依赖与脚本
├─ package-lock.json           # npm 依赖锁文件
├─ postcss.config.mjs          # PostCSS / Tailwind 配置
├─ prisma.config.ts            # Prisma CLI 配置
└─ tsconfig.json               # TypeScript 配置与 @/* 路径别名
```

`src/generated/prisma/` 在执行 `prisma generate` 后生成，已被 Git 忽略；`node_modules/`、`.next/` 等依赖与构建产物也不纳入上述源码结构。

## 核心目录说明

### `src/app`

使用 App Router 组织页面与服务端逻辑。`[id]`、`[slug]` 是动态路由参数；例如 `wallpaper/[id]/page.tsx` 对应 `/wallpaper/:id`，`docs/[slug]/edit/page.tsx` 对应 `/docs/:slug/edit`。

`layout.tsx` 统一接入 Clerk、主题 Provider、导航栏和路由加载进度条；`page.tsx` 是首页，`demos/` 用于展示轮播、滚动视差、按钮交互和加载效果。

业务数据操作集中在 `actions/`：

- `src/app/actions/article.ts`
  负责文章的新增、查询、更新、删除，以及 slug 生成。
- `src/app/actions/wallpaper.ts`
  负责壁纸查询与保存、合集管理、标签统计、上传凭证获取等操作。
- `src/app/actions/steam.ts`
  负责从 Steam Workshop 导入壁纸预览信息。

`api/upload-image/route.ts` 提供 `POST /api/upload-image`，校验管理员权限和图片类型，返回 R2 上传签名地址与公开访问地址，文件由客户端直传 R2。

### `src/components`

按页面业务和复用范围组织组件：

- `about/`：关于我页面的客户端展示组件。
- `article/`：文章编辑器与管理员入口按钮。
- `home/`：首页导航、可切换场景的主视觉、共享透视的预览卡片和原创分层 SVG 场景。
- `layout/`：全站导航栏和路由切换进度条。
- `ui/`：按钮、Atropos 视差卡片、轮播、Markdown 渲染、主题切换、加载遮罩与骨架屏等通用组件。
- `wallpaper/`：壁纸详情与桌面预览的客户端交互。
- `widgets/`：时钟、搜索、天气、待办等小工具相关组件；`WidgetLayer.tsx` 负责小工具的渲染与拖拽。

`ThemeProvider.tsx` 封装 `next-themes`，由根布局统一挂载。

`ModeToggle.tsx` 通过 `src/lib/theme-transition.ts` 实现明暗切换：新主题从按钮最近的屏幕角落以扇形扫过全屏，约 760ms 完成，页面颜色继续使用主题变量。动画使用浏览器 View Transition API；不支持时或系统开启“减少动态效果”时直接切换，主题选择仍由 `next-themes` 保存。

### 通用按钮与首页视差

`src/components/ui/Button.tsx` 导出 `Button` 和 `ButtonLink`：前者渲染原生按钮，默认 `type="button"`，支持 `loading`、`disabled`、ref 和原生按钮属性；后者通过 Next.js Link 渲染链接，避免链接内嵌套按钮。

- `variant`：`primary`、`secondary`、`outline`、`ghost`、`danger`、`glass`。
- `size`：`sm`、`md`、`lg`、`icon`。
- `leadingIcon`、`trailingIcon`：设置两侧图标；纯图标按钮需提供 `aria-label`。

```tsx
import { Button, ButtonLink } from '@/components/ui/Button';

<Button type="submit" loading={isSaving}>保存</Button>
<ButtonLink href="/gallery" variant="outline">探索画廊</ButtonLink>
```

首页使用 [Atropos 2.0.2](https://atroposjs.com/docs) 实现景深交互。`src/components/ui/ParallaxCard.tsx` 封装实例初始化、卸载清理、触屏纵向滚动和 `prefers-reduced-motion`；子元素通过 `data-atropos-offset` 设置远近层次。系统开启减少动态效果时保留静态预览。

`HomeHero.tsx` 提供三种场景切换，`HomeShowcase.tsx` 让多张卡片共享指针区域。场景是原创 SVG 预览，不依赖外部图片服务，颜色均来自现有系统主题；实际壁纸仍在画廊中浏览。

### 权限、hooks 与状态管理

- `src/proxy.ts`：Clerk 中间件入口，对上传页面和文章新建、管理、编辑页面执行登录与管理员检查。
- `src/globals.d.ts`：声明 Clerk 会话元数据中的角色字段。
- `src/hooks/useAuth.ts`：导出 `useAdmin`，供客户端控制管理员入口和操作按钮的显示。
- `src/hooks/useLoading.ts`：管理加载状态，并提供 `withLoading` 包装异步操作。
- `src/store/widgetStore.ts`：使用 Zustand 维护小工具列表，处理添加、删除和位置更新。

### `src/lib`

项目的基础能力封装集中在这里。

- `src/lib/prisma.ts`
  Prisma 运行时客户端封装，使用 `PrismaPg` 连接 PostgreSQL。
- `src/lib/r2.ts`
  生成 R2 上传签名地址，供前端直传文件。
- `src/lib/auth.ts`
  统一封装 Clerk 登录校验与管理员权限校验。
- `src/lib/steam.ts`
  Steam Workshop 链接解析与详情查询。
- `src/lib/utils.ts`
  提供 `cn`，合并条件类名与 Tailwind CSS 类名。
- `src/lib/mock.ts`、`src/lib/mock-articles.ts`
  壁纸与文章的模拟数据。
- `src/lib/sricpit.ts`
  Prisma 用户创建与查询示例脚本。

### 样式、静态数据与类型

`src/app/globals.css` 是样式入口，依次引入 Tailwind、Atropos 布局样式、自定义变体、亮暗主题变量、语义化主题映射、基础样式和首页样式。修改主题颜色等变量时查看 `src/styles/themes/`，调整 `sys-*` 类名映射时查看 `src/styles/tailwind-theme.css`。

页面和组件统一使用 `sys-*` 语义类，颜色值集中定义在 `light.css`、`dark.css` 中；新增变量时同时维护两种主题。`tailwind-theme.css` 使用 `@theme inline` 映射这些变量，旧的 `bg-background` 等类名也指向同一套变量。

| 场景 | 常用类名 |
| --- | --- |
| 页面、卡片、浮层 | `bg-sys-bg-page`、`bg-sys-bg-surface`、`bg-sys-bg-elevated` |
| 正文、次要文字、辅助文字 | `text-sys-text-base`、`text-sys-text-secondary`、`text-sys-text-muted` |
| 主按钮 | `bg-sys-primary text-sys-primary-text hover:bg-sys-primary-hover` |
| 边框与阴影 | `border-sys-border`、`shadow-sys-md` |
| 图片、视频上的文字与遮罩 | `text-sys-media-text`、`text-sys-media-muted`、`bg-sys-media-bg/70` |

普通页面随主题自动切换颜色；`sys-media-*` 用于图片、视频上的固定对比色。Clerk 登录组件也通过 `appearance.variables` 引用相同的主题变量。

`src/data/profile.json` 提供关于我页面的个人资料；`src/types/article.ts` 定义文章及列表类型，`src/types/index.ts` 基于生成的 Prisma Client 定义壁纸模型类型。`public/` 存放通过根路径直接访问的静态资源。

### `prisma`

- `prisma/schema.prisma`
  定义数据库模型，当前包含 `User`、`Wallpaper`、`Collection`、`Article`。
- `prisma/seed.ts`
  写入示例文章数据，便于本地快速验证文档系统。

## 数据模型概览

当前 Prisma Schema 中包含以下核心模型：

- `User`
  基础用户信息，当前包含邮箱和名称。
- `Wallpaper`
  壁纸实体，记录标题、描述、资源地址、类型、来源、标签、下载量、点赞数等。
- `Collection`
  合集实体，与 `Wallpaper` 是多对多关系。
- `Article`
  文档/教程内容，包含 slug、标题、Markdown 内容、分类、标签、作者、阅读时长等。

`Prisma Client` 的生成目录被配置为：

```text
src/generated/prisma
```

注意：这个目录不是手写代码，而是通过 Prisma CLI 生成的产物。

## 环境变量

建议先复制模板文件：

```bash
cp ".env template" .env
```

或参考：

```bash
cp .env.example .env
```

至少需要配置以下变量：

### 数据库

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Clerk

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"
```

### Cloudflare R2

```env
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_PUBLIC_URL_DEV="https://your-bucket-name.r2.dev"
R2_PUBLIC_URL_PROD="https://your-bucket-name.r2.dev"
```

### Steam

```env
STEAM_WEB_API_KEY="your-steam-api-key"
```

## 安装与启动

先安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

当前 `package.json` 中已有脚本：

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Prisma 相关操作

本项目使用：

- `prisma/schema.prisma` 维护数据模型
- `prisma.config.ts` 提供 Prisma CLI 配置
- `src/lib/prisma.ts` 作为运行时数据库客户端入口

### 1. 生成 Prisma Client

当你修改了 `schema.prisma` 后，需要重新生成客户端：

```bash
npx prisma generate
```

如果本地没有全局 `npx`，也可以直接使用仓库内可执行文件：

```bash
./node_modules/.bin/prisma generate
```

生成结果会输出到：

```text
src/generated/prisma
```

### 2. 将 Schema 同步到数据库

适合开发阶段快速同步结构：

```bash
npx prisma db push
```

等价写法：

```bash
./node_modules/.bin/prisma db push
```

### 3. 创建并执行迁移

如果你希望保留正式的迁移历史，使用：

```bash
npx prisma migrate dev --name init
```

例如新增字段后：

```bash
npx prisma migrate dev --name add-article-cover
```

迁移文件默认位于：

```text
prisma/migrations
```

### 4. 从数据库反向拉取 Schema

如果数据库结构已经存在，想同步回本地 Schema：

```bash
npx prisma db pull
```

### 5. 打开 Prisma Studio

可视化查看和编辑数据库内容：

```bash
npx prisma studio
```

如果你不想自动打开浏览器：

```bash
npx prisma studio --browser none
```

### 6. 校验与格式化 Schema

校验：

```bash
npx prisma validate
```

格式化：

```bash
npx prisma format
```

### 7. 执行 Seed 数据

本项目提供了 `prisma/seed.ts`，用于初始化文章示例数据。

由于种子文件是 TypeScript，执行前请先确保：

- 已正确配置 `.env`
- 已执行过 `prisma generate`
- 数据库表结构已创建完成

一种直接执行方式如下：

```bash
node --experimental-strip-types prisma/seed.ts
```

如果你本地使用 `tsx`、`ts-node` 或在后续补充了 `package.json` 脚本，也可以按你自己的 Node/TS 运行方式执行。

### 8. Prisma 运行时使用方式

项目运行时统一从下面这个文件导入数据库实例：

[`src/lib/prisma.ts`](/Users/ys/wallpaper-next/src/lib/prisma.ts)

示例：

```ts
import { prisma } from '@/lib/prisma';

const articles = await prisma.article.findMany({
  orderBy: { createdAt: 'desc' },
});
```

## 当前 Prisma 在项目中的落点

Prisma 目前主要服务于以下业务：

- `Article`
  文档系统的增删改查，见 [`src/app/actions/article.ts`](/Users/ys/wallpaper-next/src/app/actions/article.ts)
- `Wallpaper`
  壁纸上传、筛选、详情查询，见 [`src/app/actions/wallpaper.ts`](/Users/ys/wallpaper-next/src/app/actions/wallpaper.ts)
- `Collection`
  合集创建、壁纸关联、列表查询
- `Steam 导入`
  Steam 数据映射到 `Wallpaper`，见 [`src/app/actions/steam.ts`](/Users/ys/wallpaper-next/src/app/actions/steam.ts)

## 开发建议

- 修改 `prisma/schema.prisma` 后，优先执行 `prisma generate`
- 开发阶段可用 `prisma db push` 快速同步结构
- 团队协作或准备上线时，建议使用 `prisma migrate dev` 管理迁移历史
- 如果你新增了依赖 `src/generated/prisma` 的代码，但还没生成客户端，TypeScript 会直接报错，这是正常现象

## 后续可补充项

如果你准备继续完善这个项目，README 下一步比较适合再补这几块：

- 部署流程（Vercel + Neon + Clerk + R2）
- 管理员账号初始化流程
- Steam 导入功能的限制说明
- 上传文件大小、格式和审核策略
