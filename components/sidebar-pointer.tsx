"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export function SidebarPointer() {
  const [visible, setVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Only show on mobile and if not dismissed
    const isMobile = window.innerWidth < 768;
    const dismissed =
      localStorage.getItem("sidebar_pointer_dismissed") === "true";
    setVisible(isMobile && !dismissed);

    // Listen for resize to hide on desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) setVisible(false);
    };
    window.addEventListener("resize", handleResize);

    // Intersection Observer for sidebar trigger (use data attribute for robustness)
    const trigger = document.querySelector('[data-sidebar="trigger"]');
    if (trigger) {
      observerRef.current = new window.IntersectionObserver(
        ([entry]) => setButtonVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );
      observerRef.current.observe(trigger);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      if (observerRef.current && trigger)
        observerRef.current.unobserve(trigger);
    };
  }, []);

  useEffect(() => {
    // Listen for custom event to dismiss
    const handler = () => {
      setVisible(false);
      localStorage.setItem("sidebar_pointer_dismissed", "true");
    };
    window.addEventListener("sidebar-opened", handler);
    return () => window.removeEventListener("sidebar-opened", handler);
  }, []);

  if (!visible || !buttonVisible) return null;

  // Position pointer near the sidebar trigger, animate horizontally
  return (
    <div
      className="absolute top-1.5 left-14 z-[60] flex flex-col items-center pointer-events-none"
      role="presentation"
    >
      <div className="w-10 h-10 relative">
        <Image
          src="/left-arrow.png"
          alt="Pointer to sidebar menu"
          width={650}
          height={650}
          className="w-10 h-10 animate-pointer-horizontal drop-shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
