"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinning ring */}
        <motion.div
          className="w-24 h-24 rounded-full border-4 border-accent border-t-transparent animate-spin mb-6 shadow-glass bg-glass"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        {/* Initials */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-accent drop-shadow-lg select-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          AJ
        </motion.div>
      </motion.div>
    </div>
  );
} 