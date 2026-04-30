"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

interface Category {
  id: string;
  name: string;
  icon: string;
  question_count: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    title: "专项刷题",
    subtitle: "选择分类，专项突破",
    questions: "道题",
    loading: "加载中...",
  },
  en: {
    title: "By Category",
    subtitle: "Choose a category to practice",
    questions: "questions",
    loading: "Loading...",
  },
};

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </div>
      <div className={s.main}>
        {loading ? (
          <p className={s.loading}>{t.loading}</p>
        ) : (
          <div className={s.grid}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={s.card}
                onClick={() => router.push(`/${locale}/quiz/${cat.id}`)}
              >
                <div className={s.cardIcon}>{cat.icon}</div>
                <div className={s.cardName}>{cat.name}</div>
                <div className={s.cardCount}>{cat.question_count} {t.questions}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
