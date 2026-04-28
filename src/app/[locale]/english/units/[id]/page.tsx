"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface Example {
  id: number;
  text: string;
  translation: string;
}

interface Word {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  examples: Example[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
  words: Word[];
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToUnits: "← 返回单元列表",
    wordList: "单词列表",
    phonetic: "音标",
    translation: "翻译",
    examples: "例句",
    noExamples: "暂无例句",
    addToWrongBook: "加入错题本",
    removeFromWrongBook: "移出错题本",
  },
  en: {
    backToUnits: "← Back to Units",
    wordList: "Word List",
    phonetic: "Phonetic",
    translation: "Translation",
    examples: "Examples",
    noExamples: "No examples yet",
    addToWrongBook: "Add to Wrong Book",
    removeFromWrongBook: "Remove from Wrong Book",
  },
};

export default function UnitDetailPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const unitId = params.id as string;
  const t = dict[locale] || dict.zh;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [wrongBookIds, setWrongBookIds] = useState<Set<number>>(new Set());
  const [expandedWord, setExpandedWord] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/english/units/${unitId}`)
      .then(r => r.json())
      .then(setUnit)
      .catch(() => {});

    fetch("/api/english/wrong-book")
      .then(r => r.json())
      .then((data: any[]) => {
        setWrongBookIds(new Set(data.map(item => item.word_id)));
      })
      .catch(() => {});
  }, [unitId]);

  const toggleWrongBook = async (wordId: number) => {
    const isInWrongBook = wrongBookIds.has(wordId);
    if (isInWrongBook) {
      await fetch(`/api/english/wrong-book/${wordId}`, { method: "DELETE" });
      setWrongBookIds(prev => {
        const next = new Set(prev);
        next.delete(wordId);
        return next;
      });
    } else {
      await fetch("/api/english/wrong-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word_id: wordId }),
      });
      setWrongBookIds(prev => new Set(prev).add(wordId));
    }
  };

  if (!unit) return <div className={s.page}><div className={s.loading}>Loading...</div></div>;

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english/units`} className={s.backBtn}>{t.backToUnits}</Link>
        <h1 className={s.title}>{unit.title}</h1>
        <p className={s.subtitle}>{unit.description}</p>
      </header>

      <main className={s.main}>
        <h2 className={s.sectionTitle}>{t.wordList}</h2>
        <div className={s.wordList}>
          {unit.words.map(word => (
            <div key={word.id} className={s.wordCard}>
              <div className={s.wordHeader} onClick={() => setExpandedWord(expandedWord === word.id ? null : word.id)}>
                <div className={s.wordMain}>
                  <div className={s.wordText}>{word.text}</div>
                  <div className={s.wordPhonetic}>{word.phonetic}</div>
                </div>
                <div className={s.wordTranslation}>{word.translation}</div>
              </div>

              {expandedWord === word.id && (
                <div className={s.wordDetails}>
                  <div className={s.examplesSection}>
                    <div className={s.examplesTitle}>{t.examples}</div>
                    {word.examples.length > 0 ? (
                      word.examples.map(ex => (
                        <div key={ex.id} className={s.example}>
                          <div className={s.exampleText}>{ex.text}</div>
                          <div className={s.exampleTranslation}>{ex.translation}</div>
                        </div>
                      ))
                    ) : (
                      <div className={s.noExamples}>{t.noExamples}</div>
                    )}
                  </div>
                  <button
                    className={s.wrongBookBtn}
                    onClick={() => toggleWrongBook(word.id)}
                  >
                    {wrongBookIds.has(word.id) ? t.removeFromWrongBook : t.addToWrongBook}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
