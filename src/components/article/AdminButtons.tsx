"use client";

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAuth';

/**
 * 文档管理按钮组件
 * 只有管理员可以看到创建和管理按钮
 */
export function AdminButtons() {
  const { canManage, isLoaded, userInfo } = useAdmin();

  // 如果 Clerk 还在加载中，不显示任何内容
  if (!isLoaded) {
    return 'loading 加载用户信息中';
  }

  // 如果不是管理员，不显示按钮
  if (!canManage) {
    return null;
  }
console.log(userInfo);

  return (
    <div className="flex items-center justify-center gap-3">
      <Link
        href="/docs/new"
        className="px-4 py-2 rounded-lg bg-sys-primary text-sys-primary-text hover:bg-sys-primary-hover transition-colors text-sm font-medium"
      >
        创建文章
      </Link>
      <Link
        href="/docs/admin"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sys-bg-elevated/70 hover:bg-sys-bg-elevated transition-colors text-sm font-medium"
      >
        <Settings size={16} />
        管理文章
      </Link>
    </div>
  );
}
