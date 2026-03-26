"use client";
import React, { useState } from "react";
import s from "./QuizModal.module.scss";

const MOCK_QUESTIONS = [
  { q: "以下哪项是正确的操作流程？", opts: ["A. 先发牌再确认", "B. 先确认再发牌", "C. 随意发牌", "D. 不需要确认"], answer: 1 },
  { q: "标准操作中，手势规范的核心要求是？", opts: ["A. 速度快", "B. 动作清晰可见", "C. 随意即可", "D. 越复杂越好"], answer: 1 },
  { q: "遇到异常情况时，第一步应该？", opts: ["A. 继续操作", "B. 立即停止并报告", "C. 忽略", "D. 自行处理"], answer: 1 },
];

const dict = {
  zh: { title: "课后练习", wrong: "回答错误，请重新选择", later: "稍后再做", submit: "提交答案" },
  en: { title: "Quiz", wrong: "Wrong answer, please try again", later: "Later", submit: "Submit" },
};

export default function QuizModal({ onPass, onClose, locale = "zh" }: { onPass: () => void; onClose: () => void; locale?: string }) {
  const t = dict[locale as keyof typeof dict] || dict.zh;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const total = MOCK_QUESTIONS.length;
  const question = MOCK_QUESTIONS[current];

  const handleSelect = (idx: number) => { setSelected(idx); setWrong(false); };

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === question.answer) {
      const newScore = score + 1;
      setScore(newScore);
      if (current < total - 1) { setCurrent(current + 1); setSelected(null); }
      else onPass();
    } else setWrong(true);
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <div className={s.header}>
          <span className={s.title}>{t.title}</span>
          <span className={s.progress}>{current + 1} / {total}</span>
        </div>
        <p className={s.question}>{question.q}</p>
        {question.opts.map((opt, idx) => (
          <div key={idx} onClick={() => handleSelect(idx)}
            className={`${s.option} ${selected === idx ? s.selected : ""}`}
          >{opt}</div>
        ))}
        {wrong && <p className={s.error}>{t.wrong}</p>}
        <div className={s.footer}>
          <button onClick={onClose} className={s.btnClose}>{t.later}</button>
          <button onClick={handleSubmit} disabled={selected === null}
            className={`${s.btnSubmit} ${selected !== null ? s.active : ""}`}
          >{t.submit}</button>
        </div>
      </div>
    </div>
  );
}
