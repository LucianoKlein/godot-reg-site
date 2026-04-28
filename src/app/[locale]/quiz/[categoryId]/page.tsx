"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import s from "./page.module.scss";

interface Question {
  id: number;
  type: "single" | "multiple" | "trueFalse" | "fillBlank";
  question: string;
  options?: string[];
  correctAnswer: number | number[] | string;
  explanation: string;
  imageUrls?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    back: "← 返回刷题",
    headerLogo: "← Aiden 实战训练",
    logout: "退出登录",
    notLoggedInTitle: "请先登录",
    notLoggedInDesc: "登录后即可进入刷题训练",
    goLogin: "去登录",
    backHome: "← 返回首页",
    question: "题",
    of: "/",
    submit: "提交",
    next: "下一题",
    prev: "上一题",
    finish: "完成",
    correct: "正确！",
    wrong: "错误",
    explanation: "解析",
    score: "得分",
    restart: "重新开始",
    backToList: "返回板块",
    fillPlaceholder: "请输入答案",
    notAnswered: "未作答",
    answered: "已作答",
    loading: "加载中...",
    noQuestions: "暂无题目",
    resubmit: "重新提交",
    wrongHint: "答案错误，请改正后重新提交",
    wrongModalTitle: "本轮有 {n} 道错题",
    wrongModalDesc: "是否立即练习错题？",
    practiceWrong: "练习错题",
    viewScore: "查看成绩",
  },
  en: {
    back: "← Back to Quiz",
    headerLogo: "← Aiden Training",
    logout: "Logout",
    notLoggedInTitle: "Please Login First",
    notLoggedInDesc: "Login to access quiz training",
    goLogin: "Go to Login",
    backHome: "← Back to Home",
    question: "Q",
    of: "/",
    submit: "Submit",
    next: "Next",
    prev: "Previous",
    finish: "Finish",
    correct: "Correct!",
    wrong: "Wrong",
    explanation: "Explanation",
    score: "Score",
    restart: "Restart",
    backToList: "Back",
    fillPlaceholder: "Enter your answer",
    notAnswered: "Not answered",
    answered: "Answered",
    loading: "Loading...",
    noQuestions: "No questions yet",
    resubmit: "Resubmit",
    wrongHint: "Wrong answer, please correct and resubmit",
    wrongModalTitle: "You got {n} wrong",
    wrongModalDesc: "Would you like to practice them now?",
    practiceWrong: "Practice Wrong",
    viewScore: "View Score",
  },
};

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || "zh";
  const categoryId = params.categoryId as string;
  const isWrongMode = searchParams.get("mode") === "wrong";
  const t = dict[locale] || dict.zh;

  const [cat, setCat] = useState<Category | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | number[] | string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [corrected, setCorrected] = useState<Record<number, boolean>>({});
  const [showWrongModal, setShowWrongModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("user");
    if (user) setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!mounted || !loggedIn) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const found = (Array.isArray(data) ? data : []).find((c: Category) => c.id === categoryId);
        if (found) setCat(found);
      })
      .catch(() => {});
  }, [mounted, loggedIn, categoryId]);

  useEffect(() => {
    if (!mounted || !loggedIn) return;
    if (isWrongMode) {
      try {
        const all = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
        const filtered = categoryId === "wrong-all"
          ? all
          : all.filter((q: { categoryId: string }) => q.categoryId === categoryId);
        setQuestions(filtered);
      } catch { setQuestions([]); }
      setLoading(false);
      return;
    }
    fetch(`/api/questions?category_id=${categoryId}&page_size=100&status=active`)
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items || []).map((q: Record<string, unknown>) => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          imageUrls: q.image_urls,
        }));
        setQuestions(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mounted, loggedIn, categoryId, isWrongMode]);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (submitted[current] && corrected[current]) return;
    if (q.type === "multiple") {
      const prev = (answers[current] as number[]) || [];
      const next = prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx];
      setAnswers({ ...answers, [current]: next });
    } else {
      setAnswers({ ...answers, [current]: idx });
    }
  };

  const handleFill = (val: string) => {
    if (submitted[current] && corrected[current]) return;
    setAnswers({ ...answers, [current]: val });
  };

  const handleSubmit = () => {
    if (!submitted[current]) {
      setSubmitted({ ...submitted, [current]: true });
      const correct = checkAnswer(q, answers[current]);
      if (correct) {
        setCorrected({ ...corrected, [current]: true });
      } else {
        saveWrongQuestion(q);
      }
    } else {
      const correct = checkAnswer(q, answers[current]);
      if (correct) {
        setCorrected({ ...corrected, [current]: true });
      }
    }
  };

  function checkAnswer(question: Question, ans: number | number[] | string | undefined): boolean {
    if (question.type === "multiple") {
      const ca = (question.correctAnswer as number[]).slice().sort();
      const ua = ((ans as number[]) || []).slice().sort();
      return JSON.stringify(ca) === JSON.stringify(ua);
    }
    if (question.type === "fillBlank") {
      return String(ans || "").trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    }
    return ans === question.correctAnswer;
  }

  function saveWrongQuestion(question: Question) {
    try {
      const key = "wrongQuestions";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (existing.some((w: { id: number }) => w.id === question.id)) return;
      existing.push({
        id: question.id,
        categoryId,
        type: question.type,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        imageUrls: question.imageUrls,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  }

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (!submitted[i]) return;
      if (checkAnswer(q, answers[i])) correct++;
    });
    return correct;
  }, [questions, answers, submitted]);

  const wrongCount = questions.length - score;

  const handleFinish = () => {
    if (isWrongMode) {
      removeCorrectFromWrongBook();
      setFinished(true);
      return;
    }
    if (wrongCount > 0) {
      setShowWrongModal(true);
    } else {
      setFinished(true);
    }
  };

  function removeCorrectFromWrongBook() {
    try {
      const all = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
      const correctIds = questions
        .filter((q, i) => checkAnswer(q, answers[i]))
        .map((q) => q.id);
      const remaining = all.filter((w: { id: number }) => !correctIds.includes(w.id));
      localStorage.setItem("wrongQuestions", JSON.stringify(remaining));
    } catch {}
  }

  const handlePracticeWrong = () => {
    const wrongItems = questions.filter((q, i) => !checkAnswer(q, answers[i]));
    setQuestions(wrongItems);
    setCurrent(0);
    setAnswers({});
    setSubmitted({});
    setCorrected({});
    setShowWrongModal(false);
  };

  if (!mounted) return null;

  if (!loggedIn) {
    return (
      <div className={s.pageCenter}>
        <div className={s.notLoggedIn}>
          <h1>{t.notLoggedInTitle}</h1>
          <p>{t.notLoggedInDesc}</p>
          <button onClick={() => router.push(`/${locale}/login`)} className={s.loginBtn}>{t.goLogin}</button>
          <div className={s.backRow}><a href={`/${locale}`}>{t.backHome}</a></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={s.page}>
        <header className={s.header}><div className={s.headerInner}>
          <a href={`/${locale}/quiz`} className={s.headerLogo}>{t.back}</a>
        </div></header>
        <div className={s.container}><p style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.55)" }}>{t.loading}</p></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={s.page}>
        <header className={s.header}><div className={s.headerInner}>
          <a href={`/${locale}/quiz`} className={s.headerLogo}>{t.back}</a>
        </div></header>
        <div className={s.container}><p style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.55)" }}>{t.noQuestions}</p></div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className={s.page}>
        <header className={s.header}><div className={s.headerInner}>
          <a href={`/${locale}/quiz`} className={s.headerLogo}>{t.back}</a>
        </div></header>
        <div className={s.container}>
          <div className={s.resultCard}>
            <div className={s.resultIcon}>{cat?.icon}</div>
            <h2 className={s.resultTitle}>{cat?.name}</h2>
            <div className={s.resultScore}>{t.score}: {score} / {questions.length}</div>
            <div className={s.resultActions}>
              <button className={s.btnPrimary} onClick={() => { setCurrent(0); setAnswers({}); setSubmitted({}); setFinished(false); }}>{t.restart}</button>
              <button className={s.btnOutline} onClick={() => router.push(`/${locale}/quiz`)}>{t.backToList}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasAnswer = answers[current] !== undefined && answers[current] !== "";
  const isSubmitted = !!submitted[current];

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href={`/${locale}/quiz`} className={s.headerLogo}>{t.back}</a>
          <span className={s.progress}>{current + 1} {t.of} {questions.length}</span>
        </div>
      </header>

      <div className={s.container}>
        <div className={s.questionCard}>
          <div className={s.questionHeader}>
            <span className={s.questionNum}>{t.question} {current + 1}</span>
            <span className={s.questionType}>
              {q.type === "single" ? (locale === "en" ? "Single" : "单选") :
               q.type === "multiple" ? (locale === "en" ? "Multiple" : "多选") :
               q.type === "trueFalse" ? (locale === "en" ? "True/False" : "判断") :
               (locale === "en" ? "Fill" : "填空")}
            </span>
          </div>
          <div className={s.questionText}>{q.question}</div>

          {q.imageUrls && q.imageUrls.length > 0 && (
            <div className={s.questionImages}>
              {q.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`question image ${idx + 1}`} className={s.questionImage} />
              ))}
            </div>
          )}

          {(q.type === "single" || q.type === "multiple" || q.type === "trueFalse") && q.options && (
            <div className={s.options}>
              {q.options.map((opt, idx) => {
                const selected = q.type === "multiple"
                  ? ((answers[current] as number[]) || []).includes(idx)
                  : answers[current] === idx;
                let cls = s.option;
                if (selected) cls += ` ${s.selected}`;
                if (isSubmitted && corrected[current]) {
                  const isCorrectOption = q.type === "multiple"
                    ? (q.correctAnswer as number[]).includes(idx)
                    : q.correctAnswer === idx;
                  if (isCorrectOption) cls += ` ${s.correctOption}`;
                  else if (selected) cls += ` ${s.wrongOption}`;
                } else if (isSubmitted && !corrected[current] && selected) {
                  cls += ` ${s.wrongOption}`;
                }
                return (
                  <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                    <span className={s.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "fillBlank" && (
            <input
              className={s.fillInput}
              placeholder={t.fillPlaceholder}
              value={(answers[current] as string) || ""}
              onChange={(e) => handleFill(e.target.value)}
              disabled={isSubmitted && corrected[current]}
            />
          )}

          {isSubmitted && corrected[current] && (
            <div className={`${s.feedback} ${s.feedbackCorrect}`}>
              <div className={s.feedbackTitle}>{t.correct}</div>
              {q.explanation && <div className={s.feedbackExplanation}>{t.explanation}: {q.explanation}</div>}
            </div>
          )}
          {isSubmitted && !corrected[current] && (
            <div className={`${s.feedback} ${s.feedbackWrong}`}>
              <div className={s.feedbackTitle}>{t.wrongHint}</div>
            </div>
          )}

          <div className={s.actions}>
            {current > 0 && (
              <button className={s.btnOutline} onClick={() => setCurrent(current - 1)}>{t.prev}</button>
            )}
            <div style={{ flex: 1 }} />
            {!isSubmitted && (
              <button className={s.btnPrimary} onClick={handleSubmit} disabled={!hasAnswer}>{t.submit}</button>
            )}
            {isSubmitted && !corrected[current] && (
              <button className={s.btnPrimary} onClick={handleSubmit} disabled={!hasAnswer}>{t.resubmit}</button>
            )}
            {isSubmitted && corrected[current] && current < questions.length - 1 && (
              <button className={s.btnPrimary} onClick={() => setCurrent(current + 1)}>{t.next}</button>
            )}
            {isSubmitted && corrected[current] && current === questions.length - 1 && (
              <button className={s.btnPrimary} onClick={handleFinish}>{t.finish}</button>
            )}
          </div>
        </div>

        <div className={s.dots}>
          {questions.map((_, i) => (
            <button
              key={i}
              className={`${s.dot} ${i === current ? s.dotActive : ""} ${submitted[i] ? s.dotDone : ""}`}
              onClick={() => setCurrent(i)}
            >{i + 1}</button>
          ))}
        </div>
      </div>

      {showWrongModal && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <h3 className={s.modalTitle}>{t.wrongModalTitle.replace("{n}", String(wrongCount))}</h3>
            <p className={s.modalDesc}>{t.wrongModalDesc}</p>
            <div className={s.modalActions}>
              <button className={s.btnPrimary} onClick={handlePracticeWrong}>{t.practiceWrong}</button>
              <button className={s.btnOutline} onClick={() => { setShowWrongModal(false); setFinished(true); }}>{t.viewScore}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
