"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { demos } from "./config"; // 导入配置文件
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DemosPage() {
  return (
    <div className="min-h-screen w-full pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          交互实验室
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          探索 Next.js 与 Framer Motion 的无限可能。
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {demos.map((demo) => {
          const Icon = demo.icon;
          return (
            <motion.div key={demo.slug} variants={item}>
              <Link 
                // ✅ 这里链接变为动态路由
                href={`/demos/${demo.slug}`}
                className="group relative block h-full p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1"
              >
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br",
                  demo.color
                )} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-background/80 border border-border/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>
                    <ArrowUpRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{demo.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {demo.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}