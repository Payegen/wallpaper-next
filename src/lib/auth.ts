import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * 检查当前用户是否为管理员
 * 使用 Clerk 的 publicMetadata 判断管理员身份
 * 
 * 设置管理员方法：
 * 1. 在 Clerk Dashboard 中，进入用户详情页
 * 2. 在 Metadata 部分添加 publicMetadata: { role: 'admin' }
 * 
 * @returns {Promise<boolean>}
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    
    if (!user) {
      return false;
    }
    
    // 从 publicMetadata 中读取角色信息
    const role = user.publicMetadata?.role;
    
    // 检查角色是否为 admin
    return role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * 要求用户已登录，否则抛出错误
 * @throws {Error} 如果用户未登录
 */
export async function requireAuth(): Promise<void> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: Please sign in');
  }
}

/**
 * 要求用户为管理员，否则抛出错误
 * @throws {Error} 如果用户未登录或不是管理员
 */
export async function requireAdmin(): Promise<void> {
  await requireAuth();
  
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Forbidden: Admin access required');
  }
}

/**
 * 获取当前用户 ID
 * @returns {Promise<string | null>}
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * 获取当前用户邮箱
 * @returns {Promise<string | null>}
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress || null;
}

/**
 * 获取当前用户信息
 * @returns {Promise<{id: string, email: string, name: string} | null>}
 */
export async function getCurrentUserInfo(): Promise<{
  id: string;
  email: string;
  name: string;
} | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    name: user.fullName || user.username || 'Anonymous',
  };
}
