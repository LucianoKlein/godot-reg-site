"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import s from "./page.module.scss";

interface Article {
  id: number;
  title: string;
  content: string;
  translation: string;
  sort_order: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    back: "返回",
    empty: "暂无文章",
  },
  en: {
    back: "Back",
    empty: "No articles yet",
  },
};

export default function MissionDetailPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const missionId = params.id as string;
  const t = dict[locale] || dict.zh;

  const [articles, setArticles] = useState<Article[]>([]);
  const [unitTitle, setUnitTitle] = useState("");

  useEffect(() => {
    fetch(`/api/english/article-units/${missionId}/articles`)
      .then(r => r.json())
      .then((data: Article[]) => setArticles(data))
      .catch(() => {});
    fetch("/api/english/article-units")
      .then(r => r.json())
      .then((units: any[]) => {
        const u = units.find((x: any) => String(x.id) === missionId);
        if (u) setUnitTitle(u.title);
      })
      .catch(() => {});
  }, [missionId]);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english/missions`} className={s.backBtn}>
          <ChevronLeft size={18} /> {t.back}
        </Link>
        <h1 className={s.title}>{unitTitle}</h1>
      </header>

      <main className={s.main}>
        {articles.length === 0 && <div className={s.empty}>{t.empty}</div>}
        {articles.map(a => (
          <Link
            key={a.id}
            href={`/${locale}/english/missions/${missionId}/${a.id}`}
            className={s.articleItem}
          >
            <div className={s.articleTitle}>{a.title}</div>
            <div className={s.articlePreview}>
              {a.content.slice(0, 80)}{a.content.length > 80 ? "..." : ""}
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
