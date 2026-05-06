"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import styles from "./NavigationProgress.module.scss";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRunning = useRef(false);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    isRunning.current = true;
    setVisible(true);
    setProgress(15);

    let current = 15;
    timerRef.current = setInterval(() => {
      current += Math.random() * 10 + 2;
      if (current >= 90) {
        current = 90;
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setProgress(current);
    }, 200);
  }, []);

  const done = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    isRunning.current = false;
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  }, []);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (isRunning.current) {
      done();
    } else {
      start();
      requestAnimationFrame(() => {
        done();
      });
    }
  }, [pathname, start, done]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;
      if (href === pathname) return;
      start();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname, start]);

  if (!visible && progress === 0) return null;

  return (
    <div className={styles.bar} style={{ opacity: visible ? 1 : 0 }}>
      <div className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  );
}
