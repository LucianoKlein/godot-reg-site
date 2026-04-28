"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

interface Category {
  id: string;
  name: string;
  icon: string;
  question_count: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    pageTitle: "刷题训练",
    headerLogo: "← Aiden 实战训练",
    logout: "退出登录",
    notLoggedInTitle: "请先登录",
    notLoggedInDesc: "登录后即可进入刷题训练",
    goLogin: "去登录",
    back: "← 返回首页",
    questions: "道题",
    loading: "加载中...",
    wrongBook: "错题本",
    wrongCount: "{n} 道错题",
  },
  en: {
    pageTitle: "Quiz Training",
    headerLogo: "← Aiden Training",
    logout: "Logout",
    notLoggedInTitle: "Please Login First",
    notLoggedInDesc: "Login to access quiz training",
    goLogin: "Go to Login",
    back: "← Back to Home",
    questions: "questions",
    loading: "Loading...",
    wrongBook: "Wrong Book",
    wrongCount: "{n} wrong",
  },
};

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) setLoggedIn(true);
    try {
      const wrong = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
      setWrongCount(Array.isArray(wrong) ? wrong.length : 0);
    } catch { setWrongCount(0); }
  }, []);

  useEffect(() => {
    if (!mounted || !loggedIn) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mounted, loggedIn]);

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

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href={`/${locale}`} className={s.headerLogo}>{t.headerLogo}</a>
          <button onClick={() => { localStorage.removeItem("user"); setLoggedIn(false); }} className={s.logoutBtn}>
            {t.logout}
          </button>
        </div>
      </header>

      <div className={s.container}>
        <h1 className={s.h1}>{t.pageTitle}</h1>

        {loading ? (
          <p style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.55)" }}>{t.loading}</p>
        ) : (
          <div className={s.grid}>
            {wrongCount > 0 && (
              <div
                className={`${s.card} ${s.wrongCard}`}
                onClick={() => router.push(`/${locale}/quiz/wrong`)}
              >
                <div className={s.cardIcon}>📕</div>
                <div className={s.cardName}>{t.wrongBook}</div>
                <div className={s.cardCount}>{t.wrongCount.replace("{n}", String(wrongCount))}</div>
              </div>
            )}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={s.card}
                onClick={() => router.push(`/${locale}/quiz/${cat.id}`)}
              >
                <div className={s.cardIcon}>{cat.icon}</div>
                <div className={s.cardName}>{cat.name}</div>
                <div className={s.cardCount}>{cat.question_count} {t.questions}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
