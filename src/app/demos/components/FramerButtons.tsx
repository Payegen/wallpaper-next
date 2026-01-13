"use client";
import { motion } from "framer-motion";

export default function FramerButtons() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-background">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
      >
        弹性按钮
      </motion.button>
      
      <motion.button
        className="px-6 py-3 border border-primary text-primary rounded-lg overflow-hidden relative"
        whileHover="hover"
      >
        <span className="relative z-10">光效扫描</span>
        <motion.div 
          variants={{ hover: { x: ["-100%", "100%"] } }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-primary/20 -skew-x-12"
        />
      </motion.button>
    </div>
  );
}