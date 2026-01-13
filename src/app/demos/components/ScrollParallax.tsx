"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function ScrollParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div ref={ref} className="h-[200vh] w-full relative bg-background overflow-hidden rounded-xl border border-border">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
           <Image 
             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
             alt="bg" fill className="object-cover opacity-50" 
           />
        </motion.div>
        <h1 className="relative z-10 text-6xl font-bold text-white mix-blend-overlay">
          Parallax Demo
        </h1>
      </div>
      <div className="relative z-20 bg-card p-12 mt-[50vh] mx-auto max-w-2xl rounded-xl border border-border">
        <p>向下滚动查看视差效果...</p>
      </div>
    </div>
  );
}