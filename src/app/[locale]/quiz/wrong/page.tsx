"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

interface WrongQuestion {
  id: number;
  categoryId: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: number | number[] | string;
  explanation: string;
  imageUrls?: string[];
  addedAt: string;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    back: "← 返回刷题",
    title: "错题本",
    empty: "暂无错题，继续加油！",
    clear: "清空全部",
    delete: "删除",
    practice: "开始练习全部错题",
    single: "单选",
    multiple: "多选",
    trueFalse: "判断",
    fillBlank: "填空",
  },
  en: {
    back: "← Back to Quiz",
    title: "Wrong Book",
    empty: "No wrong questions yet, keep going!",
    clear: "Clear All",
    delete: "Delete",
    practice: "Practice All Wrong Questions",
    single: "Single",
    multiple: "Multiple",
    trueFalse: "True/False",
    fillBlank: "Fill",
  },
};

export default function WrongBookPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [items, setItems] = useState<WrongQuestion[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadItems();
  }, []);

  function loadItems() {
    try {
      const raw = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
      setItems(Array.isArray(raw) ? raw : []);
    } catch { setItems([]); }
  }

  function handleDelete(id: number) {
    const next = items.filter((q) => q.id !== id);
    setItems(next);
    localStorage.setItem("wrongQuestions", JSON.stringify(next));
  }

  function handleClear() {
    setItems([]);
    localStorage.setItem("wrongQuestions", "[]");
  }

  function handlePractice() {
    router.push(`/${locale}/quiz/wrong-all?mode=wrong`);
  }

  if (!mounted) return null;

  const grouped = items.reduce<Record<string, WrongQuestion[]>>((acc, q) => {
    const key = q.categoryId || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  const typeLabel = (type: string) => t[type] || type;

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href={`/${locale}/quiz`} className={s.headerLogo}>{t.back}</a>
          {items.length > 0 && (
            <button className={s.clearBtn} onClick={handleClear}>{t.clear}</button>
          )}
        </div>
      </header>

      <div className={s.container}>
        <h1 className={s.h1}>{t.title}</h1>

        {items.length === 0 ? (
          <p className={s.empty}>{t.empty}</p>
        ) : (
          <>
            {Object.entries(grouped).map(([catId, questions]) => (
              <div key={catId} className={s.group}>
                <div className={s.groupTitle}>{catId} ({questions.length})</div>
                <div className={s.list}>
                  {questions.map((q) => (
                    <div key={q.id} className={s.item}>
                      <span className={s.itemType}>{typeLabel(q.type)}</span>
                      <div className={s.itemBody}>
                        <div className={s.itemQuestion}>{q.question}</div>
                        <div className={s.itemMeta}>{new Date(q.addedAt).toLocaleDateString()}</div>
                      </div>
                      <button className={s.deleteBtn} onClick={() => handleDelete(q.id)}>{t.delete}</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className={s.practiceBtn} onClick={handlePractice}>{t.practice}</button>
          </>
        )}
      </div>
    </div>
  );
}
