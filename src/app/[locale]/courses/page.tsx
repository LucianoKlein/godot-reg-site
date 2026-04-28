"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

const TABS = ["poker", "baccarat", "dice"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<string, Record<Tab, string>> = {
  zh: { "poker": "扑克教程", "baccarat": "百家乐", "dice": "骰子" },
  en: { "poker": "Poker", "baccarat": "Baccarat", "dice": "Dice" },
};

const dict: Record<string, Record<string, string>> = {
  zh: { pageTitle: "在线课程", notLoggedInTitle: "请先登录", notLoggedInDesc: "登录后即可查看全部在线课程", goLogin: "去登录", back: "← 返回首页", headerLogo: "← Aiden 实战训练", logout: "退出登录", instructor: "讲师", totalDuration: "总时长", students: "学习人数", subscribers: "订阅人数", updated: "更新" },
  en: { pageTitle: "Online Courses", notLoggedInTitle: "Please Login First", notLoggedInDesc: "Login to access all online courses", goLogin: "Go to Login", back: "← Back to Home", headerLogo: "← Aiden Training", logout: "Logout", instructor: "Instructor", totalDuration: "Duration", students: "Students", subscribers: "Subscribers", updated: "Updated" },
};

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  student_count: number;
  category: string;
  created_at: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const tabLabels = TAB_LABELS[locale] || TAB_LABELS.zh;
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("poker");
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) setLoggedIn(true);
  }, []);

  useEffect(() => {
    fetch(`/api/courses?category=${activeTab}`)
      .then(r => r.json())
      .then(setCourses)
      .catch(() => {});
  }, [activeTab]);

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

  const filteredCourses = courses;

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

        <div className={s.tabs}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`${s.tab} ${activeTab === tab ? s.active : ""}`}
            >{tabLabels[tab]}</button>
          ))}
        </div>

        <div className={s.grid}>
          {filteredCourses.map((c) => (
            <div key={c.id} onClick={() => router.push(`/${locale}/courses/${c.id}`)} className={s.card}>
              <div className={s.cardName}>{c.title}</div>
              <div className={s.cardInstructor}>{t.instructor}：{c.instructor}</div>
              <div className={s.cardMeta}>
                <span>{t.totalDuration}：{c.duration}</span>
                <span>{t.students}：{c.student_count}</span>
                <span>{t.updated}：{c.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
