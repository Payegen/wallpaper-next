本项目基于 [Next.js](https://nextjs.org) 脚手架创建 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

[Prisma](https://prisma.io) 用于数据库操作

数据库使用`postgre` 服务商选择neon 配置参考 [neon](https://github.com/neondatabase/neon/tree/main/examples/prisma)

对象存储托管与 CF
## Getting Started

数据库使用的 ·Neon· 
修改.env 配置文件: `参考.env template 创建.env`
运行以下命令生成 Prisma 客户端：
```bash
npx prisma generate
```
同步数据库：
```bash
npx prisma db push
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

