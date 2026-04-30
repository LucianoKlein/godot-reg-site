"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import s from "./page.module.scss";

interface Phrase {
  text: string;
  translation: string;
  kk: string;
  dj: string;
  ipa: string;
}

interface Sentence {
  id: number;
  text: string;
  translation: string;
  kk: string;
  dj: string;
  ipa: string;
  phrases: Phrase[];
}

interface ArticleData {
  id: number;
  title: string;
  content: string;
  translation: string;
  sentences: Sentence[];
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    back: "返回",
    showPhonetic: "音标",
    showTranslation: "翻译",
    showPhrases: "短语",
    kk: "KK",
    dj: "DJ",
    ipa: "IPA",
    noSentences: "暂无句子数据",
  },
  en: {
    back: "Back",
    showPhonetic: "Phonetic",
    showTranslation: "Translation",
    showPhrases: "Phrases",
    kk: "KK",
    dj: "DJ",
    ipa: "IPA",
    noSentences: "No sentence data",
  },
};

export default function ArticleReadPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const missionId = params.id as string;
  const articleId = params.articleId as string;
  const t = dict[locale] || dict.zh;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [phoneticType, setPhoneticType] = useState<"kk" | "dj" | "ipa">("kk");
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);

  useEffect(() => {
    fetch(`/api/english/article-units/${missionId}/articles`)
      .then(r => r.json())
      .then((articles: any[]) => {
        const a = articles.find((x: any) => String(x.id) === articleId);
        if (a) setArticle(a);
      })
      .catch(() => {});
  }, [missionId, articleId]);

  if (!article) return <div className={s.page}><div className={s.loading}>Loading...</div></div>;

  const sentences = article.sentences || [];

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english/missions/${missionId}`} className={s.backBtn}>
          <ChevronLeft size={18} /> {t.back}
        </Link>
        <h1 className={s.title}>{article.title}</h1>
      </header>

      <div className={s.controls}>
        <label className={s.control}>
          <input
            type="checkbox"
            checked={showPhonetic}
            onChange={e => setShowPhonetic(e.target.checked)}
          />
          <span>{t.showPhonetic}</span>
          {showPhonetic && (
            <select
              className={s.select}
              value={phoneticType}
              onChange={e => setPhoneticType(e.target.value as "kk" | "dj" | "ipa")}
            >
              <option value="kk">{t.kk}</option>
              <option value="dj">{t.dj}</option>
              <option value="ipa">{t.ipa}</option>
            </select>
          )}
        </label>

        <label className={s.control}>
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={e => setShowTranslation(e.target.checked)}
          />
          <span>{t.showTranslation}</span>
        </label>

        <button
          className={`${s.controlBtn} ${showPhrases ? s.active : ""}`}
          onClick={() => setShowPhrases(!showPhrases)}
        >
          {showPhrases ? <ChevronsDownUp size={16} /> : <ChevronsUpDown size={16} />}
          <span>{t.showPhrases}</span>
        </button>
      </div>

      <main className={s.main}>
        {sentences.length === 0 && <div className={s.empty}>{t.noSentences}</div>}
        {sentences.map((sent, i) => (
          <div key={sent.id || i} className={s.sentenceBlock}>
            <div className={s.sentenceText}>{sent.text}</div>
            {showPhonetic && sent[phoneticType] && (
              <div className={s.phonetic}>{sent[phoneticType]}</div>
            )}
            {showTranslation && sent.translation && (
              <div className={s.translation}>{sent.translation}</div>
            )}
            {showPhrases && sent.phrases && sent.phrases.length > 0 && (
              <div className={s.phrases}>
                {sent.phrases.map((p, j) => (
                  <div key={j} className={s.phraseItem}>
                    <span className={s.phraseText}>{p.text}</span>
                    <span className={s.phraseTranslation}>{p.translation}</span>
                    {showPhonetic && p[phoneticType] && (
                      <span className={s.phrasePhonetic}>{p[phoneticType]}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
