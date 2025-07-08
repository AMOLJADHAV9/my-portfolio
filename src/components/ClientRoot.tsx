"use client";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import CustomCursor from "./CustomCursor";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading && <Loader />}
      <CustomCursor />
      {children}
    </>
  );
} 