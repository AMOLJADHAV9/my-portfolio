"use client";
import { useEffect } from "react";

export default function BackgroundHoverEffect() {
  useEffect(() => {
    const overlay = document.querySelector('.bg-blur-overlay');
    function addHover() { overlay?.classList.add('hovered-bg'); }
    function removeHover() { overlay?.classList.remove('hovered-bg'); }
    document.body.addEventListener('mouseenter', addHover);
    document.body.addEventListener('mouseleave', removeHover);
    document.body.addEventListener('mousemove', addHover);
    document.body.addEventListener('mouseout', removeHover);
    return () => {
      document.body.removeEventListener('mouseenter', addHover);
      document.body.removeEventListener('mouseleave', removeHover);
      document.body.removeEventListener('mousemove', addHover);
      document.body.removeEventListener('mouseout', removeHover);
    };
  }, []);
  return null;
} 