"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring for cursor
  const springConfig = { damping: 30, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-12 h-12 rounded-full border-2 border-accent/70 bg-accent/10 mix-blend-difference"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          marginLeft: "-24px",
          marginTop: "-24px",
        }}
        aria-hidden
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-accent mix-blend-difference"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          marginLeft: "-6px",
          marginTop: "-6px",
        }}
        aria-hidden
      />
    </>
  );
} 