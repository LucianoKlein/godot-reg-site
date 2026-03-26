"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

const TABS = ["扑克教程", "百家乐", "骰子"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<string, Record<Tab, string>> = {
  zh: { "扑克教程": "扑克教程", "百家乐": "百家乐", "骰子": "骰子" },
  en: { "扑克教程": "Poker", "百家乐": "Baccarat", "骰子": "Dice" },
};

const dict: Record<string, Record<string, string>> = {
  zh: { pageTitle: "在线课程", notLoggedInTitle: "请先登录", notLoggedInDesc: "登录后即可查看全部在线课程", goLogin: "去登录", back: "← 返回首页", headerLogo: "← Aiden 实战训练", logout: "退出登录", instructor: "讲师", totalDuration: "总时长", students: "学习人数", subscribers: "订阅人数", updated: "更新" },
  en: { pageTitle: "Online Courses", notLoggedInTitle: "Please Login First", notLoggedInDesc: "Login to access all online courses", goLogin: "Go to Login", back: "← Back to Home", headerLogo: "← Aiden Training", logout: "Logout", instructor: "Instructor", totalDuration: "Duration", students: "Students", subscribers: "Subscribers", updated: "Updated" },
};

interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  students: number;
  subscribers: number;
  updatedAt: string;
}

const COURSES: Record<Tab, Course[]> = {
  扑克教程: [
    { id: "poker-1", name: "德州扑克基础入门", instructor: "Aiden", duration: "8小时20分", students: 1243, subscribers: 876, updatedAt: "2025-03-10" },
    { id: "poker-2", name: "锦标赛策略精讲", instructor: "Aiden", duration: "12小时30分", students: 892, subscribers: 654, updatedAt: "2025-03-08" },
    { id: "poker-3", name: "位置与筹码管理", instructor: "Leo", duration: "6小时45分", students: 1087, subscribers: 723, updatedAt: "2025-02-28" },
    { id: "poker-4", name: "读牌与心理博弈", instructor: "Aiden", duration: "10小时15分", students: 756, subscribers: 512, updatedAt: "2025-03-05" },
    { id: "poker-5", name: "短牌扑克实战技巧", instructor: "Leo", duration: "5小时50分", students: 634, subscribers: 398, updatedAt: "2025-02-20" },
  ],
  百家乐: [
    { id: "baccarat-1", name: "百家乐规则与流程", instructor: "Aiden", duration: "4小时10分", students: 2105, subscribers: 1432, updatedAt: "2025-03-12" },
    { id: "baccarat-2", name: "路单分析与记录", instructor: "Aiden", duration: "7小时30分", students: 1567, subscribers: 1098, updatedAt: "2025-03-06" },
    { id: "baccarat-3", name: "发牌操作标准训练", instructor: "Leo", duration: "9小时00分", students: 1890, subscribers: 1245, updatedAt: "2025-03-01" },
    { id: "baccarat-4", name: "百家乐岗位模拟考核", instructor: "Aiden", duration: "6小时20分", students: 1345, subscribers: 987, updatedAt: "2025-02-25" },
  ],
  骰子: [
    { id: "dice-1", name: "骰子游戏规则详解", instructor: "Aiden", duration: "5小时00分", students: 987, subscribers: 654, updatedAt: "2025-03-11" },
    { id: "dice-2", name: "赔率计算与赔付", instructor: "Leo", duration: "8小时15分", students: 765, subscribers: 523, updatedAt: "2025-03-04" },
    { id: "dice-3", name: "骰子桌操作实训", instructor: "Aiden", duration: "10小时40分", students: 1123, subscribers: 789, updatedAt: "2025-02-27" },
    { id: "dice-4", name: "高级骰子策略与管理", instructor: "Leo", duration: "7小时30分", students: 543, subscribers: 367, updatedAt: "2025-02-18" },
  ],
};

export default function CoursesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const tabLabels = TAB_LABELS[locale] || TAB_LABELS.zh;
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("扑克教程");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) setLoggedIn(true);
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

  const courses = COURSES[activeTab];

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
          {courses.map((c) => (
            <div key={c.id} onClick={() => router.push(`/${locale}/courses/${c.id}`)} className={s.card}>
              <div className={s.cardName}>{c.name}</div>
              <div className={s.cardInstructor}>{t.instructor}：{c.instructor}</div>
              <div className={s.cardMeta}>
                <span>{t.totalDuration}：{c.duration}</span>
                <span>{t.students}：{c.students}</span>
                <span>{t.subscribers}：{c.subscribers}</span>
                <span>{t.updated}：{c.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
