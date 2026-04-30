import React from "react";
import QuizTabBar from "./QuizTabBar";
import s from "./layout.module.scss";

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.container}>
      <QuizTabBar />
      <div className={s.content}>{children}</div>
    </div>
  );
}
