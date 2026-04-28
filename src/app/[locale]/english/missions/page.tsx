"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface ArticleUnit {
  id: number;
  title: string;
  description: string;
  article_count: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToEnglish: "← 返回英语学习",
    title: "任务挑战",
    subtitle: "通过文章朗读提升口语能力",
    articleCount: "篇文章",
  },
  en: {
    backToEnglish: "← Back to English",
    title: "Missions",
    subtitle: "Improve speaking skills through article reading",
    articleCount: "articles",
  },
};

export default function MissionsPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [units, setUnits] = useState<ArticleUnit[]>([]);

  useEffect(() => {
    fetch("/api/english/article-units").then(r => r.json()).then(setUnits).catch(() => {});
  }, []);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english`} className={s.backBtn}>{t.backToEnglish}</Link>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </header>

      <main className={s.main}>
        {units.map(unit => (
          <Link key={unit.id} href={`/${locale}/english/missions/${unit.id}`} className={s.card}>
            <div className={s.cardIcon}>🎯</div>
            <div className={s.cardBody}>
              <h2 className={s.cardTitle}>{unit.title}</h2>
              <p className={s.cardDesc}>{unit.description}</p>
            </div>
            <div className={s.cardMeta}>
              <span className={s.badge}>{unit.article_count} {t.articleCount}</span>
              <span className={s.arrow}>→</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
