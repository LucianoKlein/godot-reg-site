"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface Stats {
  today_count: number;
  total_count: number;
  streak: number;
  completed_units: number;
}

interface TrendItem {
  date: string;
  spell_minutes: number;
  read_minutes: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToEnglish: "← 返回英语学习",
    title: "学习统计",
    todayPractice: "今日练习",
    totalPractice: "累计练习",
    streak: "连续打卡",
    days: "天",
    completedUnits: "完成单元",
    units: "个",
    practiceTrend: "练习趋势（近7天）",
    date: "日期",
    spellMinutes: "拼写（分钟）",
    readMinutes: "朗读（分钟）",
    noData: "暂无数据，开始练习吧！",
  },
  en: {
    backToEnglish: "← Back to English",
    title: "Learning Stats",
    todayPractice: "Today",
    totalPractice: "Total",
    streak: "Streak",
    days: "days",
    completedUnits: "Completed",
    units: "",
    practiceTrend: "Practice Trend (Last 7 Days)",
    date: "Date",
    spellMinutes: "Spelling (min)",
    readMinutes: "Reading (min)",
    noData: "No data yet. Start practicing!",
  },
};

export default function StatsPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);

  useEffect(() => {
    fetch("/api/english/user/stats").then(r => r.json()).then(setStats).catch(() => {});
    fetch("/api/english/user/practice-trend?days=7").then(r => r.json()).then(setTrend).catch(() => {});
  }, []);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english`} className={s.backBtn}>{t.backToEnglish}</Link>
        <h1 className={s.title}>{t.title}</h1>
      </header>

      <main className={s.main}>
        {stats && (
          <div className={s.statGrid}>
            <div className={s.statCard}>
              <div className={s.statValue}>{stats.today_count}</div>
              <div className={s.statLabel}>{t.todayPractice}</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statValue}>{stats.total_count}</div>
              <div className={s.statLabel}>{t.totalPractice}</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statValue}>{stats.streak} <span className={s.statUnit}>{t.days}</span></div>
              <div className={s.statLabel}>{t.streak}</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statValue}>{stats.completed_units} <span className={s.statUnit}>{t.units}</span></div>
              <div className={s.statLabel}>{t.completedUnits}</div>
            </div>
          </div>
        )}

        <section className={s.section}>
          <h2 className={s.sectionTitle}>{t.practiceTrend}</h2>
          {trend.length > 0 ? (
            <div className={s.trendTable}>
              <div className={s.trendHeader}>
                <span>{t.date}</span>
                <span>{t.spellMinutes}</span>
                <span>{t.readMinutes}</span>
              </div>
              {trend.map(item => (
                <div key={item.date} className={s.trendRow}>
                  <span className={s.trendDate}>{item.date}</span>
                  <span className={s.trendVal}>
                    <span className={s.barSpell} style={{ width: `${Math.min(item.spell_minutes * 2, 100)}%` }} />
                    {item.spell_minutes}
                  </span>
                  <span className={s.trendVal}>
                    <span className={s.barRead} style={{ width: `${Math.min(item.read_minutes * 2, 100)}%` }} />
                    {item.read_minutes}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={s.noData}>{t.noData}</div>
          )}
        </section>
      </main>
    </div>
  );
}
