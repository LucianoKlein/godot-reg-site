"use client";
import React, { useState } from "react";
import s from "./ExercisePanel.module.scss";

const MOCK_EXERCISES = [
  { id: 1, title: "识别正确的发牌手势", image: "https://placehold.co/600x300/1a1a2e/7C3AED?text=发牌手势示意图", hint: "观察图中手势，描述正确的发牌流程和注意事项" },
  { id: 2, title: "分析牌桌布局", image: "https://placehold.co/600x300/1a1a2e/22C55E?text=牌桌布局图", hint: "根据图片标注各区域名称及其用途" },
  { id: 3, title: "异常情况处理", image: "https://placehold.co/600x300/1a1a2e/FACC15?text=异常场景截图", hint: "图中出现了什么异常？请写出你的处理步骤" },
  { id: 4, title: "切牌操作要点", image: "https://placehold.co/600x300/1a1a2e/F87171?text=切牌操作图", hint: "描述图中切牌操作的标准步骤，指出可能的错误" },
];

const dict = {
  zh: { prefix: "第", suffix: "题", placeholder: "在此输入你的答案...", submit: "提交答案", submitted: "✓ 已提交" },
  en: { prefix: "Q", suffix: "", placeholder: "Enter your answer here...", submit: "Submit", submitted: "✓ Submitted" },
};

export default function ExercisePanel({ locale = "zh" }: { locale?: string }) {
  const t = dict[locale as keyof typeof dict] || dict.zh;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSubmit = (id: number) => {
    if (!answers[id]?.trim()) return;
    setSubmitted(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div>
      {MOCK_EXERCISES.map((ex, idx) => (
        <div key={ex.id} className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.badge}>{t.prefix}{idx + 1}{t.suffix}</span>
            <span className={s.cardTitle}>{ex.title}</span>
          </div>
          <div className={s.imageWrap}>
            <img src={ex.image} alt={ex.title} className={s.image} />
          </div>
          <p className={s.hint}>{ex.hint}</p>
          <textarea
            value={answers[ex.id] || ""}
            onChange={e => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
            disabled={submitted[ex.id]}
            placeholder={t.placeholder}
            className={`${s.textarea} ${submitted[ex.id] ? s.submitted : ""}`}
          />
          <div className={s.footer}>
            {!submitted[ex.id] ? (
              <button onClick={() => handleSubmit(ex.id)}
                className={`${s.submitBtn} ${answers[ex.id]?.trim() ? s.ready : ""}`}
              >{t.submit}</button>
            ) : (
              <span className={s.submittedTag}>{t.submitted}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
