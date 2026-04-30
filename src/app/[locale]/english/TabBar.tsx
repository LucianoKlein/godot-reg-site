"use client";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Book, Target, BarChart3, GraduationCap, History } from "lucide-react";
import s from "./layout.module.scss";

const tabs = [
  { key: "units", icon: Book, zh: "单元学习", en: "Units" },
  { key: "missions", icon: Target, zh: "文章练习", en: "Articles" },
  { key: "stats", icon: BarChart3, zh: "学习统计", en: "Stats" },
  { key: "teachers", icon: GraduationCap, zh: "教师团队", en: "Teachers" },
  { key: "history", icon: History, zh: "学习记录", en: "History" },
];

export default function TabBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as string) || "zh";

  const getActive = (key: string) => {
    const base = `/${locale}/english`;
    if (key === "units") return pathname === base || pathname.startsWith(`${base}/units`);
    return pathname.startsWith(`${base}/${key}`);
  };

  const renderLinks = () =>
    tabs.map((tab) => {
      const active = getActive(tab.key);
      const href = tab.key === "units"
        ? `/${locale}/english/units`
        : `/${locale}/english/${tab.key}`;
      return { tab, active, href };
    });

  const links = renderLinks();

  return (
    <>
      {/* PC 侧边栏 */}
      <nav className={s.sidebar}>
        <div className={s.sidebarTitle}>English</div>
        {links.map(({ tab, active, href }) => (
          <Link key={tab.key} href={href} className={`${s.sideTab} ${active ? s.active : ""}`}>
            <tab.icon size={20} />
            <span>{locale === "en" ? tab.en : tab.zh}</span>
          </Link>
        ))}
      </nav>

      {/* 移动端底部 TabBar */}
      <nav className={s.tabBar}>
        {links.map(({ tab, active, href }) => (
          <Link key={tab.key} href={href} className={`${s.tab} ${active ? s.active : ""}`}>
            <tab.icon size={22} />
            <span className={s.tabLabel}>{locale === "en" ? tab.en : tab.zh}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
