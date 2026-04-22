import { NextRequest, NextResponse } from 'next/server';
import { getUploadUrl } from '@/lib/r2';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 权限检查：只有管理员可以上传图片
    await requireAdmin();
    
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 只允许图片类型
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      );
    }

    // 获取上传 URL
    const { uploadUrl, publicUrl } = await getUploadUrl(filename, contentType);

    return NextResponse.json({
      uploadUrl,
      publicUrl,
    });
  } catch (error) {
    console.error('获取上传 URL 失败:', error);
    
    // 如果是权限错误，返回 401 或 403
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in' },
        { status: 401 }
      );
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: '获取上传 URL 失败' },
      { status: 500 }
    );
  }
}
