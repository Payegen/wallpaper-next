import type { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";
import profileData from "@/data/profile.json"; // 直接在服务端导入 JSON

// 配置 SEO 信息
export const metadata: Metadata = {
  title: `${profileData.basicInfo.name} - 关于我`,
  description: profileData.basicInfo.bio,
};

export default function AboutPage() {
  // 服务端组件：数据直接准备好
  return <AboutClient data={profileData} />;
}