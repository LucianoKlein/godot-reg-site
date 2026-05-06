"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Clock, CheckCircle, XCircle, LogOut } from "lucide-react";
import { authFetch } from "@/lib/api";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    totalDone: "刷题总数", accuracy: "正确率", streak: "连续天数",
    days: "天", titleProgress: "成就称号",
    challengeTitle: "今日挑战",
    submit: "提交答案", correct: "回答正确", wrong: "回答错误",
    noQuestion: "今日暂无挑战题目",
    logout: "退出登录", notLoggedIn: "未登录", pleaseLogin: "请先登录", goLogin: "去登录",
  },
  en: {
    totalDone: "Total Done", accuracy: "Accuracy", streak: "Streak",
    days: "d", titleProgress: "Titles",
    challengeTitle: "Daily Challenge",
    submit: "Submit", correct: "Correct!", wrong: "Wrong!",
    noQuestion: "No challenge today",
    logout: "Logout", notLoggedIn: "Not Logged In", pleaseLogin: "Please login first", goLogin: "Login",
  },
};

interface Stats { total_done: number; accuracy: number; streak: number; heatmap: { date: string; count: number }[] }
interface TitleItem { id: number; name_zh: string; name_en: string; icon: string; threshold: number }
interface TitleProgress { titles: TitleItem[]; current_count: number; current_title: TitleItem | null }
interface ChallengeQuestion { id: number; question: string; options?: string[]; correct_answer: number | number[] | string; explanation: string }
interface ChallengeData { question: ChallengeQuestion | null; already_answered: boolean; was_correct: boolean | null; streak: number }

function ChallengeCard({ challenge, selected, setSelected, result, submitting, onSubmit, t }: {
  challenge: ChallengeData; selected: number | null; setSelected: (v: number) => void;
  result: { correct: boolean; correctAnswer: number | number[] | string; explanation: string; streak: number } | null;
  submitting: boolean; onSubmit: () => void; t: Record<string, string>;
}) {
  const q = challenge.question;
  const answered = challenge.already_answered || result !== null;
  const wasCorrect = result?.correct ?? challenge.was_correct;
  const correctIdx = typeof (result?.correctAnswer ?? q?.correct_answer) === "number"
    ? (result?.correctAnswer ?? q?.correct_answer) as number : null;

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <div className={s.cardTitleRow}>
          <Zap size={18} className={s.cardIcon} />
          <div className={s.cardTitle}>{t.challengeTitle}</div>
        </div>
        {challenge.streak > 0 && (
          <div className={s.streakBadge}><Clock size={12} /><span>{challenge.streak} {t.days}</span></div>
        )}
      </div>
      {!q ? <div className={s.emptyState}>{t.noQuestion}</div> : (
        <div className={s.challengeBody}>
          <div className={s.questionText}>{q.question}</div>
          {q.options && (
            <div className={s.optionList}>
              {q.options.map((opt, idx) => {
                let cls = s.optionItem;
                if (answered && correctIdx === idx) cls += ` ${s.optionCorrect}`;
                else if (answered && selected === idx && correctIdx !== idx) cls += ` ${s.optionWrong}`;
                else if (!answered && selected === idx) cls += ` ${s.optionSelected}`;
                return (
                  <div key={idx} className={cls} onClick={() => { if (!answered) setSelected(idx); }}>
                    <span className={s.optionLabel}>{String.fromCharCode(65 + idx)}</span>
                    <span className={s.optionText}>{opt}</span>
                    {answered && correctIdx === idx && <CheckCircle size={16} className={s.optionIconCorrect} />}
                    {answered && selected === idx && correctIdx !== idx && <XCircle size={16} className={s.optionIconWrong} />}
                  </div>
                );
              })}
            </div>
          )}
          {!answered && <button className={s.submitBtn} disabled={selected === null || submitting} onClick={onSubmit}>{submitting ? "..." : t.submit}</button>}
          {answered && (
            <div className={`${s.resultBanner} ${wasCorrect ? s.resultCorrect : s.resultWrong}`}>
              {wasCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <span>{wasCorrect ? t.correct : t.wrong}</span>
            </div>
          )}
          {answered && (result?.explanation || q.explanation) && (
            <div className={s.explanation}>{result?.explanation || q.explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TitleSection({ prog, locale, t }: { prog: TitleProgress; locale: string; t: Record<string, string> }) {
  const sorted = [...prog.titles].sort((a, b) => a.threshold - b.threshold);
  const next = sorted.find(ti => ti.threshold > prog.current_count);
  const progress = next ? Math.min(100, Math.round(prog.current_count / next.threshold * 100)) : 100;

  return (
    <div className={s.card}>
      <div className={s.cardTitle}>{t.titleProgress}</div>
      {next && (
        <div className={s.titleNext}>
          <div className={s.titleNextInfo}>
            <span>{next.icon} {locale === "en" ? next.name_en : next.name_zh}</span>
            <span className={s.titleNextCount}>{prog.current_count}/{next.threshold}</span>
          </div>
          <div className={s.progressBar}><div className={s.progressFill} style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <div className={s.titleGrid}>
        {sorted.map(ti => {
          const done = prog.current_count >= ti.threshold;
          return (
            <div key={ti.id} className={`${s.titleItem} ${done ? s.titleDone : ""}`}>
              <span className={s.titleIcon}>{ti.icon}</span>
              <span className={s.titleName}>{locale === "en" ? ti.name_en : ti.name_zh}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyRing({ heatmap, stats, locale }: {
  heatmap: { date: string; count: number }[]; stats: Stats; locale: string;
}) {
  const map = new Map(heatmap.map(h => [h.date, h.count]));
  const today = new Date();
  const dow = today.getDay() || 7;
  const weekDays = locale === "en" ? ["M","T","W","T","F","S","S"] : ["一","二","三","四","五","六","日"];
  const weekData: number[] = [];
  for (let i = dow - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    weekData.push(map.get(d.toISOString().slice(0, 10)) || 0);
  }
  for (let i = weekData.length; i < 7; i++) weekData.push(0);
  const weekTotal = weekData.reduce((a, b) => a + b, 0);
  const weekActive = weekData.filter(c => c > 0).length;
  const maxCount = Math.max(...weekData, 1);

  const goal = 7;
  const progress = Math.min(1, weekActive / goal);
  const r = 40; const stroke = 7; const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <div className={s.card}>
      <div className={s.ringSection}>
        <div className={s.ringLeft}>
          <svg width="96" height="96" viewBox="0 0 96 96" className={s.ringSvg}>
            <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
            <circle cx="48" cy="48" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke}
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
              transform="rotate(-90 48 48)" className={s.ringProgress} />
            <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#A78BFA" />
            </linearGradient></defs>
          </svg>
          <div className={s.ringCenter}>
            <div className={s.ringNum}>{stats.streak}</div>
            <div className={s.ringLabel}>{locale === "en" ? "day streak" : "天连续"}</div>
          </div>
        </div>
        <div className={s.ringRight}>
          <div className={s.ringMetric}>
            <div className={s.ringMetricVal}>{weekTotal}</div>
            <div className={s.ringMetricLbl}>{locale === "en" ? "This week" : "本周刷题"}</div>
          </div>
          <div className={s.ringMetric}>
            <div className={s.ringMetricVal}>{stats.accuracy}<span className={s.statUnit}>%</span></div>
            <div className={s.ringMetricLbl}>{locale === "en" ? "Accuracy" : "正确率"}</div>
          </div>
          <div className={s.ringMetric}>
            <div className={s.ringMetricVal}>{weekActive}<span className={s.statUnit}>/7</span></div>
            <div className={s.ringMetricLbl}>{locale === "en" ? "Active days" : "活跃天数"}</div>
          </div>
        </div>
      </div>
      <div className={s.barChart}>
        {weekDays.map((label, i) => (
          <div key={i} className={s.barCol}>
            <div className={s.barTrack}>
              <div className={s.barFill} style={{
                height: weekData[i] > 0 ? `${Math.max(12, weekData[i] / maxCount * 100)}%` : "0%",
              }} />
            </div>
            <span className={`${s.barLabel} ${i === dow - 1 ? s.barToday : ""}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [titleProg, setTitleProg] = useState<TitleProgress | null>(null);
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: number | number[] | string; explanation: string; streak: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try { setUser(JSON.parse(raw)); } catch { return; }
    authFetch("/api/quiz/stats").then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); }).catch(() => {});
    authFetch("/api/quiz/title-progress").then(r => r.ok ? r.json() : null).then(d => { if (d) setTitleProg(d); }).catch(() => {});
    authFetch("/api/quiz/daily-challenge").then(r => r.ok ? r.json() : null).then(d => { if (d) setChallenge(d); }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (selected === null || !challenge?.question) return;
    setSubmitting(true);
    try {
      const res = await authFetch("/api/quiz/daily-challenge", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: selected }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setChallenge(prev => prev ? { ...prev, already_answered: true, was_correct: data.correct, streak: data.streak } : prev);
      }
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push(`/${locale}/login`);
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div className={s.page}>
        <div className={s.notLoggedIn}>
          <h2>{t.notLoggedIn}</h2>
          <p>{t.pleaseLogin}</p>
          <Link href={`/${locale}/login`} className={s.loginBtn}>{t.goLogin}</Link>
        </div>
      </div>
    );
  }

  const currentTitle = titleProg?.current_title;
  const titleName = currentTitle ? (locale === "en" ? currentTitle.name_en : currentTitle.name_zh) : null;

  return (
    <div className={s.page}>
      {/* 用户卡片 */}
      <div className={s.userCard}>
        <div className={s.avatar}>
          {user.avatar ? <img src={user.avatar} alt="" /> : <span>{user.username?.[0]?.toUpperCase() || "U"}</span>}
        </div>
        <div className={s.userName}>{user.username}</div>
        {titleName && (
          <div className={s.titleBadge}>
            <span>{currentTitle!.icon}</span>
            <span>{titleName}</span>
          </div>
        )}
      </div>

      {/* 数据行 */}
      {stats && (
        <div className={s.statsRow}>
          <div className={s.statItem}>
            <div className={s.statValue}>{stats.total_done}</div>
            <div className={s.statLabel}>{t.totalDone}</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statValue}>{stats.accuracy}<span className={s.statUnit}>%</span></div>
            <div className={s.statLabel}>{t.accuracy}</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statValue}>{stats.streak}<span className={s.statUnit}>{t.days}</span></div>
            <div className={s.statLabel}>{t.streak}</div>
          </div>
        </div>
      )}

      {/* 90天热力图 */}
      {stats && <WeeklyRing heatmap={stats.heatmap} stats={stats} locale={locale} />}

      {/* 称号进度 */}
      {titleProg && <TitleSection prog={titleProg} locale={locale} t={t} />}

      {/* 今日挑战 */}
      {challenge && <ChallengeCard challenge={challenge} selected={selected} setSelected={setSelected} result={result} submitting={submitting} onSubmit={handleSubmit} t={t} />}

      {/* 退出登录 */}
      <button className={s.logoutBtn} onClick={handleLogout}>
        <LogOut size={16} />
        <span>{t.logout}</span>
      </button>
    </div>
  );
}
