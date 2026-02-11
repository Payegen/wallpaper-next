import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// 获取上传签名 URL (核心功能)
// 前端拿到这个 URL 后，直接用 PUT 请求把文件传给 Cloudflare
export async function getUploadUrl(filename: string, contentType: string) {
  const uniqueFilename = `uploads/${Date.now()}-${filename}`;
  
  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    }),
    { expiresIn: 3600 }
  );

  // 返回签名地址 和 最终文件的公开访问地址
  return {
    uploadUrl: signedUrl,
    publicUrl: `${process.env.R2_PUBLIC_URL_DEV}/${uniqueFilename}`
  };
}