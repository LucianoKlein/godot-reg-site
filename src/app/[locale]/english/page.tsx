import React from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import s from "./page.module.scss";

export default async function EnglishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "zh") as Locale;
  const dict = await getDictionary(loc);

  const tabs = [
    { key: "units", label: dict.english.tabs.units, href: `/${loc}/english/units`, icon: "📚" },
    { key: "missions", label: dict.english.tabs.missions, href: `/${loc}/english/missions`, icon: "🎯" },
    { key: "stats", label: dict.english.tabs.stats, href: `/${loc}/english/stats`, icon: "📊" },
    { key: "teachers", label: dict.english.tabs.teachers, href: `/${loc}/english/teachers`, icon: "👨‍🏫" },
    { key: "history", label: dict.english.tabs.history, href: `/${loc}/english/history`, icon: "📝" },
  ];

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${loc}`} className={s.backBtn}>
          {dict.english.backToHome}
        </Link>
        <h1 className={s.title}>{dict.english.pageTitle}</h1>
      </header>

      <main className={s.main}>
        <div className={s.grid}>
          {tabs.map((tab) => (
            <Link key={tab.key} href={tab.href} className={s.card}>
              <div className={s.icon}>{tab.icon}</div>
              <div className={s.label}>{tab.label}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
