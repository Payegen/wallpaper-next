"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

/**
 * 客户端权限检查 Hook
 * 使用 Clerk 的 publicMetadata 判断管理员身份
 * 
 * @example
 * ```tsx
 * const { isSignedIn, isAdmin, canManage } = useAdmin();
 * 
 * if (canManage) {
 *   // 显示管理按钮
 * }
 * ```
 */
export function useAdmin() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const isAdmin = useMemo(() => {
    if (!isSignedIn || !user) {
      return false;
    }

    // 从 publicMetadata 中读取角色信息
    const role = user.publicMetadata?.role;
    
    return role === 'admin';
  }, [isSignedIn, user]);

  return {
    isLoaded,          // Clerk 是否加载完成
    isSignedIn,        // 是否已登录
    isAdmin,           // 是否为管理员
    canManage: isSignedIn && isAdmin, // 是否有管理权限（已登录且是管理员）
    userInfo: {
      user
    }
  };
}
