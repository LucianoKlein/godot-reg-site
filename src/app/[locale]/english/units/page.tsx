"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface Book {
  id: number;
  title: string;
  description: string;
  unit_count: number;
}

interface Unit {
  id: number;
  book_id: number;
  title: string;
  description: string;
  word_count: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToEnglish: "← 返回英语学习",
    title: "单元学习",
    subtitle: "系统化学习英语单词和句子",
    unitCount: "个单元",
    wordCount: "个单词",
    startLearning: "开始学习",
  },
  en: {
    backToEnglish: "← Back to English",
    title: "Unit Learning",
    subtitle: "Systematically learn English words and sentences",
    unitCount: "units",
    wordCount: "words",
    startLearning: "Start Learning",
  },
};

export default function UnitsPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [books, setBooks] = useState<Book[]>([]);
  const [units, setUnits] = useState<Record<number, Unit[]>>({});
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/english/books").then(r => r.json()).then(setBooks).catch(() => {});
  }, []);

  const loadUnits = (bookId: number) => {
    if (units[bookId]) {
      setExpandedBook(expandedBook === bookId ? null : bookId);
      return;
    }
    fetch(`/api/english/units?book_id=${bookId}`)
      .then(r => r.json())
      .then(data => {
        setUnits(prev => ({ ...prev, [bookId]: data }));
        setExpandedBook(bookId);
      })
      .catch(() => {});
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english`} className={s.backBtn}>{t.backToEnglish}</Link>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </header>

      <main className={s.main}>
        {books.map(book => (
          <div key={book.id} className={s.bookCard}>
            <div className={s.bookHeader} onClick={() => loadUnits(book.id)}>
              <div>
                <h2 className={s.bookTitle}>📖 {book.title}</h2>
                <p className={s.bookDesc}>{book.description}</p>
              </div>
              <span className={s.bookMeta}>{book.unit_count} {t.unitCount}</span>
            </div>
            {expandedBook === book.id && units[book.id] && (
              <div className={s.unitList}>
                {units[book.id].map(unit => (
                  <Link key={unit.id} href={`/${locale}/english/units/${unit.id}`} className={s.unitItem}>
                    <div>
                      <div className={s.unitTitle}>{unit.title}</div>
                      <div className={s.unitDesc}>{unit.description}</div>
                    </div>
                    <div className={s.unitRight}>
                      <span className={s.wordBadge}>{unit.word_count} {t.wordCount}</span>
                      <span className={s.arrow}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
