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
    title: "文章练习",
    subtitle: "通过文章阅读提升英语能力",
    articleCount: "篇文章",
  },
  en: {
    title: "Article Practice",
    subtitle: "Improve English through article reading",
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
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </header>

      <main className={s.main}>
        <div className={s.grid}>
          {units.map(unit => (
            <Link key={unit.id} href={`/${locale}/english/missions/${unit.id}`} className={s.card}>
              <div className={s.cardIcon}>📖</div>
              <h2 className={s.cardTitle}>{unit.title}</h2>
              <p className={s.cardDesc}>{unit.description}</p>
              <div className={s.cardFooter}>
                <span className={s.badge}>{unit.article_count} {t.articleCount}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
