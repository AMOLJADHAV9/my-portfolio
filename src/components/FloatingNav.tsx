"use client";
import { useEffect, useState } from "react";
import { FaUser, FaTools, FaFolderOpen, FaCogs, FaQuoteRight, FaEnvelope } from "react-icons/fa";

const navItems = [
  { id: "about", label: "About", icon: <FaUser /> },
  { id: "skills", label: "Skills", icon: <FaTools /> },
  { id: "projects", label: "Projects", icon: <FaFolderOpen /> },
  { id: "services", label: "Services", icon: <FaCogs /> },
  { id: "testimonials", label: "Testimonials", icon: <FaQuoteRight /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope /> },
];

export default function FloatingNav() {
  const [active, setActive] = useState<string>(navItems[0].id);

  useEffect(() => {
    const handleScroll = () => {
      let current = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) {
            current = item.id;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="hidden md:flex fixed top-1/2 right-8 -translate-y-1/2 z-40 flex-col gap-2 bg-glass-dark/80 backdrop-blur-xs rounded-2xl shadow-glass p-4 border border-accent/20" style={{minWidth: 64}}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-accent/60
            ${active === item.id
              ? "bg-accent/90 text-background shadow-glass"
              : "bg-glass text-accent hover:bg-accent/30 hover:text-background"}
          `}
          aria-current={active === item.id ? "page" : undefined}
          aria-label={item.label}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="hidden lg:inline" style={{textShadow: '0 0 8px #38bdf8, 0 0 16px #38bdf8'}}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
} 