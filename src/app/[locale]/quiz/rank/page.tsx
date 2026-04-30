"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    title: "排名",
    tabAccuracy: "正确率排名",
    tabCount: "刷题数量排名",
    me: "我",
    accuracy: "正确率",
    count: "题",
  },
  en: {
    title: "Ranking",
    tabAccuracy: "Accuracy Ranking",
    tabCount: "Count Ranking",
    me: "Me",
    accuracy: "Accuracy",
    count: "Q",
  },
};

const MOCK_USERS = [
  { name: "Sandy", avatar: "🧑‍💼", accuracy: 96.2, count: 842 },
  { name: "Leo", avatar: "👨‍🎓", accuracy: 94.8, count: 756 },
  { name: "Mia", avatar: "👩‍💻", accuracy: 93.5, count: 921 },
  { name: "Jack", avatar: "🧑‍🔧", accuracy: 92.1, count: 688 },
  { name: "Lily", avatar: "👩‍🎨", accuracy: 91.7, count: 534 },
  { name: "Tom", avatar: "🧑‍🏫", accuracy: 90.3, count: 612 },
  { name: "Emma", avatar: "👩‍⚕️", accuracy: 89.8, count: 478 },
  { name: "David", avatar: "👨‍💼", accuracy: 88.4, count: 823 },
  { name: "Sophie", avatar: "👩‍🔬", accuracy: 87.9, count: 395 },
  { name: "Ryan", avatar: "🧑‍🚀", accuracy: 87.2, count: 567 },
  { name: "Olivia", avatar: "👩‍🎤", accuracy: 86.5, count: 445 },
  { name: "Chris", avatar: "👨‍🍳", accuracy: 85.8, count: 712 },
  { name: "Amy", avatar: "👩‍✈️", accuracy: 85.1, count: 389 },
  { name: "Kevin", avatar: "🧑‍🎨", accuracy: 84.3, count: 501 },
  { name: "Nina", avatar: "👩‍🏫", accuracy: 83.6, count: 423 },
  { name: "我", avatar: "⭐", accuracy: 82.9, count: 356 },
  { name: "Alex", avatar: "🧑‍💻", accuracy: 82.1, count: 298 },
  { name: "Zoe", avatar: "👩‍🚒", accuracy: 81.4, count: 267 },
  { name: "Ben", avatar: "👨‍🔬", accuracy: 80.7, count: 234 },
  { name: "Chloe", avatar: "👩‍⚖️", accuracy: 79.9, count: 189 },
  { name: "Daniel", avatar: "🧑‍🌾", accuracy: 79.2, count: 156 },
  { name: "Grace", avatar: "👩‍🍳", accuracy: 78.5, count: 312 },
  { name: "Henry", avatar: "👨‍🎓", accuracy: 77.8, count: 278 },
  { name: "Iris", avatar: "👩‍💼", accuracy: 76.4, count: 145 },
  { name: "Jason", avatar: "🧑‍⚕️", accuracy: 75.1, count: 123 },
];

export default function RankPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [tab, setTab] = useState<"accuracy" | "count">("accuracy");

  const sorted = [...MOCK_USERS].sort((a, b) =>
    tab === "accuracy" ? b.accuracy - a.accuracy : b.count - a.count
  );

  return (
    <div className={s.page}>
      <div className={s.container}>
        <h1 className={s.title}>{t.title}</h1>

        <div className={s.tabs}>
          <button
            className={`${s.tabBtn} ${tab === "accuracy" ? s.tabActive : ""}`}
            onClick={() => setTab("accuracy")}
          >{t.tabAccuracy}</button>
          <button
            className={`${s.tabBtn} ${tab === "count" ? s.tabActive : ""}`}
            onClick={() => setTab("count")}
          >{t.tabCount}</button>
        </div>

        <div className={s.list}>
          {sorted.map((user, idx) => {
            const isMe = user.name === "我";
            return (
              <div key={user.name} className={`${s.item} ${isMe ? s.itemMe : ""}`}>
                <div className={`${s.rank} ${idx < 3 ? s.rankTop : ""}`}>
                  {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}
                </div>
                <div className={s.avatar}>{user.avatar}</div>
                <div className={s.name}>
                  {user.name}
                  {isMe && <span className={s.meTag}>{t.me}</span>}
                </div>
                <div className={s.value}>
                  {tab === "accuracy"
                    ? `${user.accuracy}%`
                    : `${user.count} ${t.count}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
