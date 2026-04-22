// Next.js 16 中间件文件：proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * 需要登录才能访问的路由
 */
const isProtectedRoute = createRouteMatcher([
  '/uploadpage(.*)',
  '/docs/new(.*)',
  '/docs/admin(.*)',
  '/docs/(.*)/edit(.*)',
]);

/**
 * 需要管理员权限的路由
 */
const isAdminRoute = createRouteMatcher([
  '/docs/new(.*)',
  '/docs/admin(.*)',
  '/docs/(.*)/edit(.*)',
  '/uploadpage(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. 检查是否是受保护的路由
  if (isProtectedRoute(req)) {
    // 要求用户已登录
    await auth.protect();
    
    // 2. 如果是管理员路由，检查权限
    if (isAdminRoute(req)) {
      const { sessionClaims } = await auth();
      
      // 从 sessionClaims 中读取 publicMetadata
      const role = (sessionClaims as CustomJwtSessionClaims)?.metadata?.role;
      
      // 如果不是管理员，重定向到首页或显示错误
      if (role !== 'admin') {
        // 可以重定向到错误页面或首页
        // 这里选择返回首页
        const url = new URL('/', req.url);
        return Response.redirect(url);
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
