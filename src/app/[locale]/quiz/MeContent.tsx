"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Zap, Trophy, CheckCircle, XCircle, Clock } from "lucide-react";
import { authFetch } from "@/lib/api";
import s from "./me/page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    challengeTitle: "今日挑战",
    challengeDesc: "每天一题，保持手感",
    streakLabel: "连续挑战",
    days: "天",
    answered: "今日已答",
    correct: "回答正确",
    wrong: "回答错误",
    correctAnswer: "正确答案",
    submit: "提交答案",
    noQuestion: "今日暂无挑战题目",
    leaderTitle: "本周排行",
    leaderDesc: "本周刷题 Top 10",
    questions: "题",
    accuracy: "正确率",
    empty: "暂无数据",
    you: "你",
  },
  en: {
    challengeTitle: "Daily Challenge",
    challengeDesc: "One question a day, stay sharp",
    streakLabel: "Streak",
    days: "days",
    answered: "Answered today",
    correct: "Correct!",
    wrong: "Wrong!",
    correctAnswer: "Answer",
    submit: "Submit",
    noQuestion: "No challenge today",
    leaderTitle: "Weekly Rank",
    leaderDesc: "Top 10 this week",
    questions: "Q",
    accuracy: "Acc",
    empty: "No data yet",
    you: "You",
  },
};

interface ChallengeQuestion {
  id: number;
  type: string;
  question: string;
  options?: string[];
  correct_answer: number | number[] | string;
  explanation: string;
}

interface ChallengeData {
  question: ChallengeQuestion | null;
  already_answered: boolean;
  was_correct: boolean | null;
  streak: number;
}

interface LeaderEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar: string | null;
  count: number;
  accuracy: number;
}

export default function MeContent() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; correctAnswer: number | number[] | string; explanation: string; streak: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    authFetch("/api/quiz/daily-challenge")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setChallenge(d); })
      .catch(() => {});
    authFetch("/api/quiz/weekly-leaderboard")
      .then(r => r.ok ? r.json() : [])
      .then(d => setLeaders(d))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (selected === null || !challenge?.question) return;
    setSubmitting(true);
    try {
      const res = await authFetch("/api/quiz/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  if (!mounted) return null;

  const q = challenge?.question;
  const answered = challenge?.already_answered || result !== null;
  const wasCorrect = result?.correct ?? challenge?.was_correct;
  const streak = result?.streak ?? challenge?.streak ?? 0;

  const getOptionLabel = (idx: number) => String.fromCharCode(65 + idx);

  const correctIdx = typeof (result?.correctAnswer ?? q?.correct_answer) === "number"
    ? (result?.correctAnswer ?? q?.correct_answer) as number
    : null;

  return (
    <div className={s.meGrid}>
      {/* 今日挑战 */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitleRow}>
            <Zap size={18} className={s.cardIcon} />
            <h3 className={s.cardTitle}>{t.challengeTitle}</h3>
          </div>
          {streak > 0 && (
            <div className={s.streakBadge}>
              <Clock size={12} />
              <span>{streak} {t.days}</span>
            </div>
          )}
        </div>

        {!q ? (
          <div className={s.emptyState}>{t.noQuestion}</div>
        ) : (
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
                    <div
                      key={idx}
                      className={cls}
                      onClick={() => { if (!answered) setSelected(idx); }}
                    >
                      <span className={s.optionLabel}>{getOptionLabel(idx)}</span>
                      <span className={s.optionText}>{opt}</span>
                      {answered && correctIdx === idx && <CheckCircle size={16} className={s.optionIconCorrect} />}
                      {answered && selected === idx && correctIdx !== idx && <XCircle size={16} className={s.optionIconWrong} />}
                    </div>
                  );
                })}
              </div>
            )}

            {!answered && (
              <button
                className={s.submitBtn}
                disabled={selected === null || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "..." : t.submit}
              </button>
            )}

            {answered && (
              <div className={`${s.resultBanner} ${wasCorrect ? s.resultCorrect : s.resultWrong}`}>
                {wasCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                <span>{wasCorrect ? t.correct : t.wrong}</span>
              </div>
            )}

            {answered && (result?.explanation || q.explanation) && (
              <div className={s.explanation}>
                {result?.explanation || q.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 本周排行 */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <div className={s.cardTitleRow}>
            <Trophy size={18} className={s.cardIconGold} />
            <h3 className={s.cardTitle}>{t.leaderTitle}</h3>
          </div>
          <span className={s.cardSubtitle}>{t.leaderDesc}</span>
        </div>

        {leaders.length === 0 ? (
          <div className={s.emptyState}>{t.empty}</div>
        ) : (
          <div className={s.leaderList}>
            {leaders.map((entry) => (
              <div key={entry.user_id} className={s.leaderRow}>
                <div className={`${s.rankBadge} ${entry.rank <= 3 ? s[`rank${entry.rank}`] : ""}`}>
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                </div>
                <div className={s.leaderAvatar}>
                  {entry.avatar ? <img src={entry.avatar} alt="" /> : <span>{entry.username[0]?.toUpperCase()}</span>}
                </div>
                <div className={s.leaderInfo}>
                  <div className={s.leaderName}>{entry.username}</div>
                  <div className={s.leaderMeta}>{entry.count} {t.questions} · {t.accuracy} {entry.accuracy}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
