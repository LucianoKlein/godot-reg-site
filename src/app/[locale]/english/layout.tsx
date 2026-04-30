import React from "react";
import TabBar from "./TabBar";
import s from "./layout.module.scss";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.container}>
      <TabBar />
      <div className={s.content}>{children}</div>
    </div>
  );
}
