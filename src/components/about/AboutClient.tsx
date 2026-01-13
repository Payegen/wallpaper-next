/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Mail, Github, Code2, Calendar, Cpu, Laptop } from 'lucide-react';
// import { useTheme } from "next-themes";
import { ModeToggle } from '../ui/ModeToggle';

// 定义 props 类型，接收服务端传来的数据
interface ProfileData {
  basicInfo: any;
  skills: any;
  experience: any;
  toolbox: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function AboutClient({ data }: { data: ProfileData }) {
  const { basicInfo, skills, experience, toolbox } = data;
//   const { theme, setTheme } = useTheme(); // 使用 hook 切换主题
// const { theme, setTheme, resolvedTheme } = useTheme();
  
//   // 2. 解决水合不匹配：确保只在客户端渲染图标
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => {
//     setMounted(true);
//   }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 顶部导航 */}
      <nav className="p-6 fixed top-0 left-0 w-full z-5 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-md border border-border rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">返回首页</span>
        </Link>

        {/* 主题切换按钮 */}
        {/* 3. 主题切换按钮 */}
         <div className="pointer-events-auto">
          <ModeToggle />
        </div>
        
      </nav>

      <div className="max-w-5xl mx-auto pt-24 pb-20 px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* --- 左侧：个人卡片 --- */}
          <motion.aside variants={itemVariants} className="lg:col-span-1">
            <div className="bg-card border border-border rounded-3xl p-8 sticky top-24 backdrop-blur-sm shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-muted">
                <Image src={basicInfo.avatar} alt={basicInfo.name} fill className="object-cover" />
              </div>
              
              <div className="text-center mb-6">
                {/* 使用 bg-gradient-to-r (标准) */}
                <h1 className="text-2xl font-bold mb-2 bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {basicInfo.name}
                </h1>
                <p className="text-primary font-medium text-sm">{basicInfo.title}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-muted-foreground text-sm justify-center">
                  <MapPin size={16} /> <span>{basicInfo.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-sm justify-center">
                  <Mail size={16} /> <span>{basicInfo.email}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed text-center mb-8 border-t border-border pt-6">
                {basicInfo.bio}
              </p>

              <div className="flex justify-center gap-4">
                <a href={basicInfo.github} target="_blank" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </motion.aside>


          {/* --- 右侧：内容区域 --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 技术栈 */}
            <motion.section variants={itemVariants} className="bg-card/50 border border-border rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Code2 className="text-blue-500" /> 技术栈
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-3 uppercase tracking-wider font-semibold">Frontend</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.frontend.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 rounded-lg text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* ... Backend & Tools (同上逻辑) */}
              </div>
            </motion.section>

            {/* 工作经历 */}
            <motion.section variants={itemVariants} className="bg-card/50 border border-border rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-green-500" /> 经历
              </h2>
              
              <div className="space-y-8 relative pl-2">
                {/* 线条：替换 w-[2px] 为 w-0.5 */}
                <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-border" />

                {experience.map((exp: any, index: number) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-background border-2 border-green-500 rounded-full z-10" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{exp.role}</h3>
                      <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{exp.period}</span>
                    </div>
                    <div className="text-green-600 dark:text-green-400 text-sm mb-2">{exp.company}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 装备库 */}
            <motion.section variants={itemVariants} className="bg-card/50 border border-border rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="text-orange-500" /> 装备库
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {toolbox.map((tool: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border hover:bg-muted transition-colors">
                    <div className="p-3 bg-background rounded-lg border border-border shadow-sm">
                      <Laptop size={20}/>
                    </div>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}