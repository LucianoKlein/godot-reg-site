"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authFetch } from "@/lib/api";
import s from "./page.module.scss";

interface WrongItem {
  id: number;
  question_id: number;
  category_id: string;
  category_name: string | null;
  category_icon: string | null;
  added_at: string;
  question: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correct_answer: number | number[] | string;
    explanation: string;
    image_urls?: string[];
  } | null;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
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

  const [items, setItems] = useState<WrongItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadItems();
  }, []);

  function loadItems() {
    setLoading(true);
    authFetch("/api/quiz/wrong")
      .then(r => r.ok ? r.json() : [])
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }

  function handleDelete(questionId: number) {
    authFetch(`/api/quiz/wrong/${questionId}`, { method: "DELETE" })
      .then(() => setItems(prev => prev.filter(q => q.question_id !== questionId)))
      .catch(() => {});
  }

  function handleClear() {
    authFetch("/api/quiz/wrong", { method: "DELETE" })
      .then(() => setItems([]))
      .catch(() => {});
  }

  function handlePractice() {
    router.push(`/${locale}/quiz/wrong-all?mode=wrong`);
  }

  if (!mounted || loading) return null;

  const grouped = items.reduce<Record<string, WrongItem[]>>((acc, q) => {
    const key = q.category_id || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  const typeLabel = (type: string) => t[type] || type;

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.titleRow}>
          <h1 className={s.h1}>{t.title}</h1>
          {items.length > 0 && (
            <button className={s.clearBtn} onClick={handleClear}>{t.clear}</button>
          )}
        </div>

        {items.length === 0 ? (
          <p className={s.empty}>{t.empty}</p>
        ) : (
          <>
            {Object.entries(grouped).map(([catId, questions]) => {
              const first = questions[0];
              const icon = first?.category_icon || "📋";
              const name = first?.category_name || catId;
              return (
              <div key={catId} className={s.group}>
                <div className={s.groupTitle}><span>{icon}</span> {name} ({questions.length})</div>
                <div className={s.list}>
                  {questions.map((q) => (
                    <div key={q.id} className={s.item}>
                      <span className={s.itemType}>{typeLabel(q.question?.type || "")}</span>
                      <div className={s.itemBody}>
                        <div className={s.itemQuestion}>{q.question?.question || ""}</div>
                        <div className={s.itemMeta}>{q.added_at ? new Date(q.added_at).toLocaleString() : ""}</div>
                      </div>
                      <button className={s.deleteBtn} onClick={() => handleDelete(q.question_id)}>{t.delete}</button>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
            <button className={s.practiceBtn} onClick={handlePractice}>{t.practice}</button>
          </>
        )}
      </div>
    </div>
  );
}
