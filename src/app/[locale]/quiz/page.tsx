"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Layers, Type, Shuffle, FileQuestion } from "lucide-react";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    notLoggedInTitle: "请先登录",
    notLoggedInDesc: "登录后即可进入刷题训练",
    goLogin: "去登录",
    back: "← 返回首页",
    banner1: "每日一练，保持手感",
    banner2: "错题反复练，薄弱变强项",
    banner3: "模拟实战，面试不慌",
    category: "专项刷题",
    categoryDesc: "按分类专项突破",
    byType: "题型刷题",
    byTypeDesc: "单选/多选/判断/填空",
    random: "乱序刷题",
    randomDesc: "随机打乱全部题目",
    unseen: "未做习题",
    unseenDesc: "只做还没做过的题",
  },
  en: {
    notLoggedInTitle: "Please Login First",
    notLoggedInDesc: "Login to access quiz training",
    goLogin: "Go to Login",
    back: "← Back to Home",
    banner1: "Daily practice, stay sharp",
    banner2: "Review mistakes, turn weakness into strength",
    banner3: "Simulate real exams, ace the interview",
    category: "By Category",
    categoryDesc: "Focus on specific topics",
    byType: "By Type",
    byTypeDesc: "Single/Multi/T-F/Fill",
    random: "Random",
    randomDesc: "All questions shuffled",
    unseen: "Unseen",
    unseenDesc: "Only unanswered questions",
  },
};

const BANNERS = [
  { gradient: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", key: "banner1" },
  { gradient: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", key: "banner2" },
  { gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", key: "banner3" },
];

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) setLoggedIn(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx((i) => (i + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  if (!loggedIn) {
    return (
      <div className={s.pageCenter}>
        <div className={s.notLoggedIn}>
          <h1>{t.notLoggedInTitle}</h1>
          <p>{t.notLoggedInDesc}</p>
          <button onClick={() => router.push(`/${locale}/login`)} className={s.loginBtn}>{t.goLogin}</button>
          <div className={s.backRow}>
            <a href={`/${locale}`}>{t.back}</a>
          </div>
        </div>
      </div>
    );
  }

  const entries = [
    { key: "category", icon: Layers, href: `/${locale}/quiz/category` },
    { key: "byType", icon: Type, href: `/${locale}/quiz/by-type` },
    { key: "random", icon: Shuffle, href: `/${locale}/quiz/random` },
    { key: "unseen", icon: FileQuestion, href: `/${locale}/quiz/unseen` },
  ];

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* 轮播 Banner */}
        <div className={s.banner}>
          {BANNERS.map((b, i) => (
            <div
              key={b.key}
              className={`${s.bannerSlide} ${i === bannerIdx ? s.bannerActive : ""}`}
              style={{ background: b.gradient }}
            >
              <span className={s.bannerText}>{t[b.key as keyof typeof t]}</span>
            </div>
          ))}
          <div className={s.bannerDots}>
            {BANNERS.map((_, i) => (
              <span
                key={i}
                className={`${s.dot} ${i === bannerIdx ? s.dotActive : ""}`}
                onClick={() => setBannerIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* 4 入口卡片 */}
        <div className={s.entryGrid}>
          {entries.map((e) => (
            <div key={e.key} className={s.entryCard} onClick={() => router.push(e.href)}>
              <e.icon size={32} className={s.entryIcon} />
              <div className={s.entryName}>{t[e.key as keyof typeof t]}</div>
              <div className={s.entryDesc}>{t[`${e.key}Desc` as keyof typeof t]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
