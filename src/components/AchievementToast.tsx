"use client";
import React, { useState, useEffect, useCallback } from "react";
import s from "./AchievementToast.module.scss";

interface TitleItem {
  id: number;
  name_zh: string;
  name_en: string;
  icon: string;
  threshold: number;
}

interface ToastItem {
  id: number;
  title: TitleItem;
  exiting: boolean;
}

interface Props {
  titles: TitleItem[];
  locale?: string;
  onDone?: () => void;
}

export default function AchievementToast({ titles, locale = "zh", onDone }: Props) {
  const [queue, setQueue] = useState<TitleItem[]>([]);
  const [current, setCurrent] = useState<ToastItem | null>(null);

  useEffect(() => {
    if (titles.length > 0) {
      setQueue([...titles]);
    }
  }, [titles]);

  const showNext = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) {
        onDone?.();
        return prev;
      }
      const [next, ...rest] = prev;
      setCurrent({ id: next.id, title: next, exiting: false });
      return rest;
    });
  }, [onDone]);

  useEffect(() => {
    if (current === null && queue.length > 0) {
      showNext();
    }
  }, [current, queue, showNext]);

  useEffect(() => {
    if (!current || current.exiting) return;
    const timer = setTimeout(() => {
      setCurrent((c) => (c ? { ...c, exiting: true } : null));
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  useEffect(() => {
    if (!current?.exiting) return;
    const timer = setTimeout(() => {
      setCurrent(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [current?.exiting]);

  if (!current) return null;

  const label = locale === "en" ? "ACHIEVEMENT UNLOCKED" : "成就解锁";
  const name = locale === "en" ? current.title.name_en : current.title.name_zh;

  return (
    <div className={s.container}>
      <div className={`${s.card} ${current.exiting ? s.cardExit : ""}`}>
        <div className={s.shimmer} />
        <div className={s.iconWrap}>
          <span className={s.icon}>{current.title.icon}</span>
        </div>
        <div className={s.body}>
          <div className={s.label}>{label}</div>
          <div className={s.name}>{name}</div>
        </div>
      </div>
    </div>
  );
}
