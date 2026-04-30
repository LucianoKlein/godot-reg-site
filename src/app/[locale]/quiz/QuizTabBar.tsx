"use client";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Home, BookX, Trophy, User } from "lucide-react";
import s from "./layout.module.scss";

const tabs = [
  { key: "", icon: Home, zh: "首页", en: "Home" },
  { key: "wrong", icon: BookX, zh: "错题", en: "Wrong" },
  { key: "rank", icon: Trophy, zh: "排名", en: "Rank" },
  { key: "me", icon: User, zh: "我的", en: "Me" },
];

export default function QuizTabBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as string) || "zh";

  const getActive = (key: string) => {
    const base = `/${locale}/quiz`;
    if (key === "") {
      return pathname === base || pathname === `${base}/` ||
        pathname.startsWith(`${base}/category`) ||
        pathname.startsWith(`${base}/by-type`) ||
        pathname.startsWith(`${base}/random`) ||
        pathname.startsWith(`${base}/unseen`);
    }
    return pathname.startsWith(`${base}/${key}`);
  };

  const links = tabs.map((tab) => {
    const active = getActive(tab.key);
    const href = tab.key === "" ? `/${locale}/quiz` : `/${locale}/quiz/${tab.key}`;
    return { tab, active, href };
  });

  return (
    <>
      <nav className={s.sidebar}>
        <div className={s.sidebarTitle}>Quiz</div>
        {links.map(({ tab, active, href }) => (
          <Link key={tab.key || "home"} href={href} className={`${s.sideTab} ${active ? s.active : ""}`}>
            <tab.icon size={20} />
            <span>{locale === "en" ? tab.en : tab.zh}</span>
          </Link>
        ))}
      </nav>

      <nav className={s.tabBar}>
        {links.map(({ tab, active, href }) => (
          <Link key={tab.key || "home"} href={href} className={`${s.tab} ${active ? s.active : ""}`}>
            <tab.icon size={22} />
            <span className={s.tabLabel}>{locale === "en" ? tab.en : tab.zh}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
