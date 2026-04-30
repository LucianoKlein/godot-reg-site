"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface WordDetail {
  word: string;
  score: number;
  error_type: string | null;
}

interface Report {
  total_score: number;
  accuracy_score: number;
  fluency_score: number;
  completeness_score: number;
  words: WordDetail[];
}

interface Recording {
  id: number;
  sentence_id: string;
  sentence_text: string;
  unit_title: string;
  submit_time: string;
  unlock_time: string;
  teacher_id: string;
  teacher_name: string;
  status: string;
  report: Report | null;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToEnglish: "← 返回英语学习",
    title: "学习记录",
    subtitle: "查看您的录音评测历史",
    sentence: "句子",
    submitTime: "提交时间",
    status: "状态",
    pending: "评测中",
    completed: "已完成",
    teacher: "评测教师",
    viewReport: "查看报告",
    hideReport: "收起报告",
    totalScore: "总分",
    accuracy: "准确度",
    fluency: "流利度",
    completeness: "完整度",
    wordDetails: "逐词分析",
    word: "单词",
    score: "得分",
    errorType: "错误类型",
    mispronounced: "发音错误",
    missed: "遗漏",
    unexpected: "多余",
    correct: "正确",
    noHistory: "暂无学习记录",
  },
  en: {
    backToEnglish: "← Back to English",
    title: "History",
    subtitle: "View your recording evaluation history",
    sentence: "Sentence",
    submitTime: "Submitted",
    status: "Status",
    pending: "Evaluating",
    completed: "Completed",
    teacher: "Teacher",
    viewReport: "View Report",
    hideReport: "Hide Report",
    totalScore: "Total Score",
    accuracy: "Accuracy",
    fluency: "Fluency",
    completeness: "Completeness",
    wordDetails: "Word Analysis",
    word: "Word",
    score: "Score",
    errorType: "Error Type",
    mispronounced: "Mispronounced",
    missed: "Missed",
    unexpected: "Unexpected",
    correct: "Correct",
    noHistory: "No history yet",
  },
};

export default function HistoryPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/english/recordings")
      .then(r => r.json())
      .then(setRecordings)
      .catch(() => {});
  }, []);

  const getErrorLabel = (type: string | null) => {
    if (!type) return t.correct;
    const map: Record<string, string> = {
      mispronounced: t.mispronounced,
      missed: t.missed,
      unexpected: t.unexpected,
    };
    return map[type] || type;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#22C55E";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </header>

      <main className={s.main}>
        {recordings.length > 0 ? (
          <div className={s.list}>
            {recordings.map(rec => (
              <div key={rec.id} className={s.card}>
                <div className={s.cardHeader}>
                  <div className={s.cardLeft}>
                    <div className={s.sentenceText}>{rec.sentence_text}</div>
                    <div className={s.cardMeta}>
                      <span>{rec.unit_title}</span>
                      <span>·</span>
                      <span>{t.teacher}: {rec.teacher_name}</span>
                      <span>·</span>
                      <span>{rec.submit_time.replace("T", " ").slice(0, 16)}</span>
                    </div>
                  </div>
                  <div className={s.cardRight}>
                    <span className={`${s.statusBadge} ${rec.status === "completed" ? s.statusCompleted : s.statusPending}`}>
                      {rec.status === "completed" ? t.completed : t.pending}
                    </span>
                    {rec.report && (
                      <button
                        className={s.reportBtn}
                        onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                      >
                        {expandedId === rec.id ? t.hideReport : t.viewReport}
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === rec.id && rec.report && (
                  <div className={s.report}>
                    <div className={s.scoreGrid}>
                      <div className={s.scoreItem}>
                        <div className={s.scoreValue} style={{ color: getScoreColor(rec.report.total_score) }}>
                          {rec.report.total_score}
                        </div>
                        <div className={s.scoreLabel}>{t.totalScore}</div>
                      </div>
                      <div className={s.scoreItem}>
                        <div className={s.scoreValue} style={{ color: getScoreColor(rec.report.accuracy_score) }}>
                          {rec.report.accuracy_score}
                        </div>
                        <div className={s.scoreLabel}>{t.accuracy}</div>
                      </div>
                      <div className={s.scoreItem}>
                        <div className={s.scoreValue} style={{ color: getScoreColor(rec.report.fluency_score) }}>
                          {rec.report.fluency_score}
                        </div>
                        <div className={s.scoreLabel}>{t.fluency}</div>
                      </div>
                      <div className={s.scoreItem}>
                        <div className={s.scoreValue} style={{ color: getScoreColor(rec.report.completeness_score) }}>
                          {rec.report.completeness_score}
                        </div>
                        <div className={s.scoreLabel}>{t.completeness}</div>
                      </div>
                    </div>

                    <div className={s.wordSection}>
                      <h3 className={s.wordSectionTitle}>{t.wordDetails}</h3>
                      <div className={s.wordTable}>
                        <div className={s.wordTableHeader}>
                          <span>{t.word}</span>
                          <span>{t.score}</span>
                          <span>{t.errorType}</span>
                        </div>
                        {rec.report.words.map((w, i) => (
                          <div key={i} className={s.wordTableRow}>
                            <span className={s.wordText}>{w.word}</span>
                            <span style={{ color: getScoreColor(w.score) }}>{w.score}</span>
                            <span className={w.error_type ? s.errorTag : s.correctTag}>
                              {getErrorLabel(w.error_type)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={s.empty}>{t.noHistory}</div>
        )}
      </main>
    </div>
  );
}
