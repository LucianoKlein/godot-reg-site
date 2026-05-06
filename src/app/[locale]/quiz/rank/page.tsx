"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authFetch } from "@/lib/api";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    title: "排名",
    tabAccuracy: "正确率排名",
    tabCount: "刷题数量排名",
    me: "我",
    accuracy: "正确率",
    count: "题",
    empty: "暂无排名数据",
  },
  en: {
    title: "Ranking",
    tabAccuracy: "Accuracy Ranking",
    tabCount: "Count Ranking",
    me: "Me",
    accuracy: "Accuracy",
    count: "Q",
    empty: "No ranking data yet",
  },
};

interface RankEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar: string | null;
  accuracy: number;
  count: number;
}

export default function RankPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [tab, setTab] = useState<"accuracy" | "count">("count");
  const [list, setList] = useState<RankEntry[]>([]);
  const [myId, setMyId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.id) setMyId(u.id);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    authFetch(`/api/quiz/rank?sort=${tab}`)
      .then(r => r.ok ? r.json() : [])
      .then(setList)
      .catch(() => setList([]));
  }, [tab]);

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

        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.5)" }}>{t.empty}</div>
        ) : (
          <div className={s.list}>
            {list.map((entry, idx) => {
              const isMe = entry.user_id === myId;
              return (
                <div key={entry.user_id} className={`${s.item} ${isMe ? s.itemMe : ""}`}>
                  <div className={`${s.rank} ${idx < 3 ? s.rankTop : ""}`}>
                    {idx < 3 ? ["🥇", "🥈", "🥉"][idx] : idx + 1}
                  </div>
                  <div className={s.avatarWrap}>
                    {entry.avatar
                      ? <img src={entry.avatar} alt="" className={s.avatarImg} />
                      : <span className={s.avatarEmoji}>👤</span>}
                  </div>
                  <div className={s.name}>
                    {entry.username}
                    {isMe && <span className={s.meTag}>{t.me}</span>}
                  </div>
                  <div className={s.value}>
                    {tab === "accuracy"
                      ? `${entry.accuracy}%`
                      : `${entry.count} ${t.count}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
