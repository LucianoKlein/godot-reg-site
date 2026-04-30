"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Star, History, Info, ChevronRight } from "lucide-react";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    totalDone: "已做题数",
    accuracy: "正确率",
    streak: "坚持天数",
    heatTitle: "刷题热力图",
    less: "少",
    more: "多",
    badgeTitle: "勋章墙",
    currentTitle: "当前称号",
    menuFav: "收藏题目",
    menuHistory: "做题记录",
    menuAbout: "关于我们",
    day: "天",
    noData: "暂无数据，开始刷题吧",
  },
  en: {
    totalDone: "Total Done",
    accuracy: "Accuracy",
    streak: "Streak",
    heatTitle: "Activity Heatmap",
    less: "Less",
    more: "More",
    badgeTitle: "Badges",
    currentTitle: "Current Title",
    menuFav: "Favorites",
    menuHistory: "History",
    menuAbout: "About Us",
    day: "days",
    noData: "No data yet, start practicing!",
  },
};

const BADGES = [
  { key: "first", icon: "🎯", zh: "首次刷题", en: "First Quiz", threshold: 1 },
  { key: "streak7", icon: "🔥", zh: "连续7天", en: "7-Day Streak", threshold: 7 },
  { key: "acc90", icon: "💎", zh: "正确率90%", en: "90% Accuracy", threshold: 90 },
  { key: "done100", icon: "🏅", zh: "做满100题", en: "100 Done", threshold: 100 },
  { key: "done500", icon: "🏆", zh: "做满500题", en: "500 Done", threshold: 500 },
];

function getTitleByCount(count: number, locale: string) {
  if (count >= 500) return locale === "en" ? "Quiz Terminator" : "题库终结者";
  if (count >= 100) return locale === "en" ? "Quiz Master" : "刷题达人";
  if (count >= 1) return locale === "en" ? "Beginner" : "新手学员";
  return locale === "en" ? "Not Started" : "尚未开始";
}

interface HistoryEntry {
  date: string;
  correctCount: number;
  totalCount: number;
}

export default function MePage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = JSON.parse(localStorage.getItem("quizHistory") || "[]");
      setHistory(Array.isArray(raw) ? raw : []);
    } catch { setHistory([]); }
  }, []);

  const stats = useMemo(() => {
    const totalDone = history.reduce((sum, h) => sum + h.totalCount, 0);
    const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
    const accuracy = totalDone > 0 ? Math.round((totalCorrect / totalDone) * 100) : 0;

    const uniqueDays = new Set(history.map((h) => h.date.slice(0, 10)));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (uniqueDays.has(key)) streak++;
      else break;
    }

    return { totalDone, accuracy, streak, uniqueDays };
  }, [history]);

  const heatmapData = useMemo(() => {
    const countByDate: Record<string, number> = {};
    history.forEach((h) => {
      const key = h.date.slice(0, 10);
      countByDate[key] = (countByDate[key] || 0) + h.totalCount;
    });

    const weeks: { date: string; count: number }[][] = [];
    const today = new Date();
    const startDay = new Date(today);
    startDay.setDate(startDay.getDate() - 12 * 7 + 1);
    const dayOfWeek = startDay.getDay();
    startDay.setDate(startDay.getDate() - dayOfWeek);

    let currentWeek: { date: string; count: number }[] = [];
    const totalDays = 13 * 7;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      currentWeek.push({ date: key, count: countByDate[key] || 0 });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }, [history]);

  const getHeatLevel = (count: number) => {
    if (count === 0) return "";
    if (count <= 5) return s.heat1;
    if (count <= 15) return s.heat2;
    if (count <= 30) return s.heat3;
    return s.heat4;
  };

  const unlockedBadges = useMemo(() => {
    const set = new Set<string>();
    if (stats.totalDone >= 1) set.add("first");
    if (stats.streak >= 7) set.add("streak7");
    if (stats.accuracy >= 90 && stats.totalDone >= 10) set.add("acc90");
    if (stats.totalDone >= 100) set.add("done100");
    if (stats.totalDone >= 500) set.add("done500");
    return set;
  }, [stats]);

  if (!mounted) return null;

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* 数据卡片 */}
        <div className={s.statGrid}>
          <div className={s.statCard}>
            <div className={s.statValue}>{stats.totalDone}</div>
            <div className={s.statLabel}>{t.totalDone}</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statValue}>{stats.accuracy}<span className={s.statUnit}>%</span></div>
            <div className={s.statLabel}>{t.accuracy}</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statValue}>{stats.streak}<span className={s.statUnit}>{t.day}</span></div>
            <div className={s.statLabel}>{t.streak}</div>
          </div>
        </div>

        {/* 热力图 */}
        <div className={s.section}>
          <h2 className={s.sectionTitle}>{t.heatTitle}</h2>
          <div className={s.heatmap}>
            {heatmapData.map((week, wi) => (
              <div key={wi} className={s.heatCol}>
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`${s.heatCell} ${getHeatLevel(day.count)}`}
                    title={`${day.date}: ${day.count}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className={s.heatLegend}>
            <span>{t.less}</span>
            <span className={`${s.legendCell}`} style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className={`${s.legendCell} ${s.heat1}`} />
            <span className={`${s.legendCell} ${s.heat2}`} />
            <span className={`${s.legendCell} ${s.heat3}`} />
            <span className={`${s.legendCell} ${s.heat4}`} />
            <span>{t.more}</span>
          </div>
        </div>

        {/* 称号 */}
        <div className={s.section}>
          <h2 className={s.sectionTitle}>{t.currentTitle}</h2>
          <div className={s.titleBadge}>{getTitleByCount(stats.totalDone, locale)}</div>
        </div>

        {/* 勋章 */}
        <div className={s.section}>
          <h2 className={s.sectionTitle}>{t.badgeTitle}</h2>
          <div className={s.badgeGrid}>
            {BADGES.map((b) => {
              const unlocked = unlockedBadges.has(b.key);
              return (
                <div key={b.key} className={`${s.badge} ${unlocked ? s.badgeUnlocked : ""}`}>
                  <div className={`${s.badgeIcon} ${!unlocked ? s.badgeLocked : ""}`}>{b.icon}</div>
                  <div className={s.badgeName}>{locale === "en" ? b.en : b.zh}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 功能入口 */}
        <div className={s.section}>
          <div className={s.menuList}>
            <a href="#" className={s.menuItem}>
              <Star size={18} className={s.menuIcon} />
              <span>{t.menuFav}</span>
              <span className={s.menuArrow}><ChevronRight size={16} /></span>
            </a>
            <a href="#" className={s.menuItem}>
              <History size={18} className={s.menuIcon} />
              <span>{t.menuHistory}</span>
              <span className={s.menuArrow}><ChevronRight size={16} /></span>
            </a>
            <a href="#" className={s.menuItem}>
              <Info size={18} className={s.menuIcon} />
              <span>{t.menuAbout}</span>
              <span className={s.menuArrow}><ChevronRight size={16} /></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
