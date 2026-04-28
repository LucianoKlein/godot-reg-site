"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    profile: "个人中心",
    username: "用户名",
    email: "邮箱",
    joinedAt: "加入时间",
    learningStats: "学习统计",
    todayPractice: "今日练习",
    totalPractice: "总练习次数",
    streak: "连续天数",
    completedUnits: "完成单元",
    quickLinks: "快捷入口",
    myNotes: "我的笔记",
    myExercises: "我的练习",
    wrongBook: "错题本",
    recordings: "录音历史",
    settings: "设置",
    logout: "退出登录",
    notLoggedIn: "未登录",
    pleaseLogin: "请先登录",
    goToLogin: "前往登录",
  },
  en: {
    profile: "Profile",
    username: "Username",
    email: "Email",
    joinedAt: "Joined",
    learningStats: "Learning Stats",
    todayPractice: "Today",
    totalPractice: "Total Practice",
    streak: "Streak",
    completedUnits: "Completed Units",
    quickLinks: "Quick Links",
    myNotes: "My Notes",
    myExercises: "My Exercises",
    wrongBook: "Wrong Book",
    recordings: "Recordings",
    settings: "Settings",
    logout: "Logout",
    notLoggedIn: "Not Logged In",
    pleaseLogin: "Please login first",
    goToLogin: "Go to Login",
  },
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const parsed = JSON.parse(userData);
    setUser(parsed);

    // Fetch stats from backend
    fetch("/api/english/user/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push(`/${locale}/login`);
  };

  if (!user) {
    return (
      <div className={s.page}>
        <div className={s.notLoggedIn}>
          <h2>{t.notLoggedIn}</h2>
          <p>{t.pleaseLogin}</p>
          <Link href={`/${locale}/login`} className={s.loginBtn}>{t.goToLogin}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1>{t.profile}</h1>
      </header>

      <main className={s.main}>
        <section className={s.section}>
          <div className={s.userInfo}>
            <div className={s.infoRow}>
              <span className={s.label}>{t.username}:</span>
              <span className={s.value}>{user.username}</span>
            </div>
            {user.email && (
              <div className={s.infoRow}>
                <span className={s.label}>{t.email}:</span>
                <span className={s.value}>{user.email}</span>
              </div>
            )}
          </div>
        </section>

        {stats && (
          <section className={s.section}>
            <h2 className={s.sectionTitle}>{t.learningStats}</h2>
            <div className={s.statsGrid}>
              <div className={s.statCard}>
                <div className={s.statValue}>{stats.today_count || 0}</div>
                <div className={s.statLabel}>{t.todayPractice}</div>
              </div>
              <div className={s.statCard}>
                <div className={s.statValue}>{stats.total_count || 0}</div>
                <div className={s.statLabel}>{t.totalPractice}</div>
              </div>
              <div className={s.statCard}>
                <div className={s.statValue}>{stats.streak || 0}</div>
                <div className={s.statLabel}>{t.streak}</div>
              </div>
              <div className={s.statCard}>
                <div className={s.statValue}>{stats.completed_units || 0}</div>
                <div className={s.statLabel}>{t.completedUnits}</div>
              </div>
            </div>
          </section>
        )}

        <section className={s.section}>
          <h2 className={s.sectionTitle}>{t.quickLinks}</h2>
          <div className={s.linkGrid}>
            <Link href={`/${locale}/english/units`} className={s.linkCard}>{t.wrongBook}</Link>
            <Link href={`/${locale}/english/history`} className={s.linkCard}>{t.recordings}</Link>
            <Link href={`/${locale}/english/stats`} className={s.linkCard}>{t.learningStats}</Link>
          </div>
        </section>

        <button className={s.logoutBtn} onClick={handleLogout}>{t.logout}</button>
      </main>
    </div>
  );
}
