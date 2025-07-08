"use client";
import { useEffect, useState } from "react";

const THEMES = [
  { name: "Blue", className: "theme-blue" },
  { name: "Purple", className: "theme-purple" },
  { name: "Green", className: "theme-green" },
  { name: "Sunset", className: "theme-sunset" },
  { name: "Dark", className: "theme-dark" },
];

export default function ThemeSwitcher() {
  const [themeIdx, setThemeIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("themeIdx");
    if (saved) setThemeIdx(Number(saved));
  }, []);

  useEffect(() => {
    const overlay = document.querySelector(".bg-blur-overlay");
    if (!overlay) return;
    THEMES.forEach(t => overlay.classList.remove(t.className));
    overlay.classList.add(THEMES[themeIdx].className);
    localStorage.setItem("themeIdx", String(themeIdx));
  }, [themeIdx]);

  function nextTheme() {
    setThemeIdx((i) => (i + 1) % THEMES.length);
  }

  return (
    <button
      onClick={nextTheme}
      className="fixed bottom-6 right-6 z-50 bg-white/80 text-accent px-4 py-2 rounded-full shadow-lg border border-accent hover:bg-accent hover:text-white transition-colors"
      title={`Switch theme (Current: ${THEMES[themeIdx].name})`}
    >
      Theme: {THEMES[themeIdx].name}
    </button>
  );
} 