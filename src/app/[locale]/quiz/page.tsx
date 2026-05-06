"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Layers, Type, Shuffle, FileQuestion, Flame, CheckCircle2 } from "lucide-react";
import { authFetch, apiUrl } from "@/lib/api";
import MeContent from "./MeContent";
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

interface BannerData {
  id: number;
  image_url: string;
  link_url: string;
}

interface CheckinData {
  days: boolean[];
  streak: number;
}

interface RoundItem {
  category_id: string;
  category_name: string;
  category_icon: string;
  current_round: number;
  total_questions: number;
  done_this_round: number;
}

const ROUND_COLORS = ["#7C3AED", "#22C55E", "#F59E0B", "#3B82F6", "#EC4899", "#14B8A6", "#F97316", "#8B5CF6"];

const FALLBACK_BANNERS = [
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
  const [user, setUser] = useState<{ username: string; avatar?: string | null }>({ username: "" });
  const [stats, setStats] = useState<{ total_done: number; accuracy: number; streak: number } | null>(null);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [checkin, setCheckin] = useState<CheckinData>({ days: [false,false,false,false,false,false,false], streak: 0 });
  const [rounds, setRounds] = useState<RoundItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("user");
    if (raw) {
      setLoggedIn(true);
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
      authFetch("/api/quiz/stats").then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); }).catch(() => {});
      authFetch("/api/quiz/weekly-checkin").then(r => r.ok ? r.json() : null).then(d => { if (d) setCheckin(d); }).catch(() => {});
      authFetch("/api/quiz/round-progress").then(r => r.ok ? r.json() : null).then(d => { if (d?.items) setRounds(d.items); }).catch(() => {});
    }
    fetch(apiUrl("/api/banners/active?page=quiz"))
      .then(r => r.ok ? r.json() : [])
      .then(d => setBanners(d))
      .catch(() => {});
  }, []);

  const bannerCount = banners.length || FALLBACK_BANNERS.length;

  useEffect(() => {
    if (bannerCount === 0) return;
    const timer = setInterval(() => {
      setBannerIdx((i) => (i + 1) % bannerCount);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerCount]);

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
    { key: "category", icon: Layers, href: `/${locale}/quiz/category`, color: "#7C3AED" },
    { key: "byType", icon: Type, href: `/${locale}/quiz/by-type`, color: "#22C55E" },
    { key: "random", icon: Shuffle, href: `/${locale}/quiz/random`, color: "#F59E0B" },
    { key: "unseen", icon: FileQuestion, href: `/${locale}/quiz/unseen`, color: "#3B82F6" },
  ];

  const handleBannerClick = (linkUrl: string) => {
    if (!linkUrl) return;
    if (linkUrl.startsWith("http")) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push(linkUrl);
    }
  };

  // 打卡数据
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const weekDays = locale === "en"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["一", "二", "三", "四", "五", "六", "日"];
  const checkedDays = checkin.days;
  const streakDays = checkin.streak;

  // 刷题轮次数据
  const displayRounds = rounds.map((r, i) => ({
    ...r,
    color: ROUND_COLORS[i % ROUND_COLORS.length],
  }));

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.mainGrid}>
          {/* 左栏：Banner + 入口卡片 */}
          <div className={s.leftCol}>
            {/* 移动端用户卡片 */}
            <div className={s.mobileUserCard}>
              <div className={s.mobileAvatar}>
                {user.avatar ? <img src={user.avatar} alt="" /> : <span>👤</span>}
              </div>
              <div className={s.mobileUserInfo}>
                <div className={s.mobileUserName}>{user.username}</div>
                {stats && (
                  <div className={s.mobileUserStats}>
                    <span>{locale === "en" ? "Done" : "已做"} {stats.total_done}</span>
                    <span>{locale === "en" ? "Acc" : "正确率"} {stats.accuracy}%</span>
                    <span>{locale === "en" ? "Streak" : "连续"} {stats.streak}{locale === "en" ? "d" : "天"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 轮播 Banner */}
            <div className={s.banner}>
              {banners.length > 0 ? (
                banners.map((b, i) => (
                  <div
                    key={b.id}
                    className={`${s.bannerSlide} ${i === bannerIdx ? s.bannerActive : ""}`}
                    style={{ cursor: b.link_url ? "pointer" : "default" }}
                    onClick={() => handleBannerClick(b.link_url)}
                  >
                    <img src={b.image_url} alt="" className={s.bannerImg} />
                  </div>
                ))
              ) : (
                FALLBACK_BANNERS.map((b, i) => (
                  <div
                    key={b.key}
                    className={`${s.bannerSlide} ${i === bannerIdx ? s.bannerActive : ""}`}
                    style={{ background: b.gradient }}
                  >
                    <span className={s.bannerText}>{t[b.key as keyof typeof t]}</span>
                  </div>
                ))
              )}
              <div className={s.bannerDots}>
                {Array.from({ length: bannerCount }).map((_, i) => (
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
                  <div className={s.entryIconWrap} style={{ "--entry-color": e.color } as React.CSSProperties}>
                    <e.icon size={28} className={s.entryIcon} />
                  </div>
                  <div className={s.entryName}>{t[e.key as keyof typeof t]}</div>
                  <div className={s.entryDesc}>{t[`${e.key}Desc` as keyof typeof t]}</div>
                </div>
              ))}
            </div>

            {/* 移动端打卡 */}
            <div className={s.mobileCheckin}>
              <div className={s.checkinHeader}>
                <div className={s.checkinTitle}>
                  <Flame size={16} className={s.checkinFlame} />
                  <span>{locale === "en" ? "Weekly Check-in" : "本周打卡"}</span>
                </div>
                <div className={s.checkinStreak}>
                  {streakDays} {locale === "en" ? "days" : "天"}
                </div>
              </div>
              <div className={s.checkinGrid}>
                {weekDays.map((day, i) => {
                  const isToday = i === dayOfWeek - 1;
                  const checked = checkedDays[i];
                  return (
                    <div key={day} className={`${s.checkinDay} ${isToday ? s.checkinToday : ""}`}>
                      <div className={`${s.checkinDot} ${checked ? s.checkinDone : ""}`}>
                        {checked && <CheckCircle2 size={14} />}
                      </div>
                      <span className={s.checkinLabel}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右栏 */}
          <div className={s.rightCol}>
            {/* 个人资料卡 */}
            <div className={s.profileCard}>
              <div className={s.profileBg} />
              <div className={s.profileContent}>
                <div className={s.userAvatar}>
                  {user.avatar ? <img src={user.avatar} alt="" /> : <span>👤</span>}
                </div>
                <div className={s.userName}>{user.username}</div>
                {stats && (
                  <div className={s.statsRow}>
                    <div className={s.statItem}>
                      <div className={s.statValue}>{stats.total_done}</div>
                      <div className={s.statLabel}>{locale === "en" ? "Done" : "已做"}</div>
                    </div>
                    <div className={s.statDivider} />
                    <div className={s.statItem}>
                      <div className={s.statValue}>{stats.accuracy}<span className={s.statUnit}>%</span></div>
                      <div className={s.statLabel}>{locale === "en" ? "Accuracy" : "正确率"}</div>
                    </div>
                    <div className={s.statDivider} />
                    <div className={s.statItem}>
                      <div className={s.statValue}>{stats.streak}<span className={s.statUnit}>{locale === "en" ? "d" : "天"}</span></div>
                      <div className={s.statLabel}>{locale === "en" ? "Streak" : "连续"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 本周打卡 */}
            <div className={s.checkinCard}>
              <div className={s.checkinHeader}>
                <div className={s.checkinTitle}>
                  <Flame size={16} className={s.checkinFlame} />
                  <span>{locale === "en" ? "Weekly Check-in" : "本周打卡"}</span>
                </div>
                <div className={s.checkinStreak}>
                  {streakDays} {locale === "en" ? "days" : "天"}
                </div>
              </div>
              <div className={s.checkinGrid}>
                {weekDays.map((day, i) => {
                  const isToday = i === dayOfWeek - 1;
                  const checked = checkedDays[i];
                  return (
                    <div key={day} className={`${s.checkinDay} ${isToday ? s.checkinToday : ""}`}>
                      <div className={`${s.checkinDot} ${checked ? s.checkinDone : ""}`}>
                        {checked && <CheckCircle2 size={14} />}
                      </div>
                      <span className={s.checkinLabel}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 今日挑战 + 排行榜 */}
        <div className={s.meSection}>
          <MeContent />
        </div>

        {/* 刷题轮次 */}
        {displayRounds.length > 0 && (
        <div className={s.roundSection}>
          <div className={s.roundSectionHeader}>
            <h3 className={s.roundSectionTitle}>{locale === "en" ? "Quiz Progress" : "刷题进度"}</h3>
          </div>
          <div className={s.roundGrid}>
            {displayRounds.map((r) => {
              const remaining = r.total_questions - r.done_this_round;
              const progress = r.total_questions > 0 ? Math.round(r.done_this_round / r.total_questions * 100) : 0;
              const isComplete = r.done_this_round >= r.total_questions;
              const notStarted = r.done_this_round === 0;
              return (
                <div key={r.category_id} className={s.roundCard}>
                  <div className={s.roundCardTop}>
                    <span className={s.roundIcon}>{r.category_icon}</span>
                    <span className={s.roundBadge} style={{ borderColor: `${r.color}40`, background: `${r.color}15`, color: r.color }}>
                      {locale === "en" ? `R${r.current_round}` : `第${r.current_round}轮`}
                    </span>
                  </div>
                  <div className={s.roundName}>{r.category_name}</div>
                  <div className={s.roundNumbers}>
                    <span className={s.roundDone}>{r.done_this_round}</span>
                    <span className={s.roundSep}>/</span>
                    <span className={s.roundTotal}>{r.total_questions}</span>
                  </div>
                  <div className={s.roundProgressBar}>
                    <div className={s.roundProgressFill} style={{ width: `${progress}%`, background: r.color }} />
                  </div>
                  <div className={s.roundFooter}>
                    <span className={s.roundRemaining}>
                      {isComplete
                        ? (locale === "en" ? "Completed!" : "已完成!")
                        : notStarted
                          ? (locale === "en" ? "Not started" : "未开始")
                          : (locale === "en" ? `${remaining} left` : `还剩 ${remaining} 题`)}
                    </span>
                    <span
                      className={s.roundContinueBtn}
                      onClick={() => router.push(`/${locale}/quiz/category`)}
                    >
                      {isComplete
                        ? (locale === "en" ? "Next round →" : "下一轮 →")
                        : notStarted
                          ? (locale === "en" ? "Start →" : "开始 →")
                          : (locale === "en" ? "Continue →" : "继续 →")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
