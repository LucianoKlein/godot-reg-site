"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    title: "题型刷题",
    subtitle: "按题型分类练习",
    single: "单选题",
    singleDesc: "从多个选项中选择一个正确答案",
    multiple: "多选题",
    multipleDesc: "选择所有正确的选项",
    trueFalse: "判断题",
    trueFalseDesc: "判断对错",
    fillBlank: "填空题",
    fillBlankDesc: "输入正确答案",
  },
  en: {
    title: "By Type",
    subtitle: "Practice by question type",
    single: "Single Choice",
    singleDesc: "Choose one correct answer",
    multiple: "Multiple Choice",
    multipleDesc: "Select all correct options",
    trueFalse: "True / False",
    trueFalseDesc: "Judge true or false",
    fillBlank: "Fill in the Blank",
    fillBlankDesc: "Type the correct answer",
  },
};

const TYPES = [
  { key: "single", icon: "🔘" },
  { key: "multiple", icon: "☑️" },
  { key: "trueFalse", icon: "⚖️" },
  { key: "fillBlank", icon: "✏️" },
];

export default function ByTypePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </div>
      <div className={s.main}>
        <div className={s.grid}>
          {TYPES.map((tp) => (
            <div
              key={tp.key}
              className={s.card}
              onClick={() => router.push(`/${locale}/quiz/type-${tp.key}`)}
            >
              <div className={s.cardIcon}>{tp.icon}</div>
              <div className={s.cardName}>{t[tp.key as keyof typeof t]}</div>
              <div className={s.cardDesc}>{t[`${tp.key}Desc` as keyof typeof t]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
