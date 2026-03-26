import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const meta: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  zh: {
    title: "Aiden 实战训练 — 荷官培训·在线课程·就业保障",
    description: "Aiden 实战训练提供扑克、百家乐、骰子等荷官岗位的系统化培训课程，含视频录播、笔记讲义与模拟练习，报名即签合同，结果导向。",
    keywords: ["荷官培训", "发牌员培训", "百家乐培训", "扑克培训", "骰子培训", "在线课程", "Aiden实战训练"],
  },
  en: {
    title: "Aiden Training — Dealer Training · Online Courses · Job Placement",
    description: "Systematic dealer training for poker, baccarat, dice and more. Video courses, notes, and simulation exercises. Contract on enrollment, results-oriented.",
    keywords: ["dealer training", "poker training", "baccarat training", "dice training", "online courses", "Aiden Training"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "zh") as Locale;
  const m = meta[loc];
  return {
    title: { default: m.title, template: `%s | ${loc === "zh" ? "Aiden 实战训练" : "Aiden Training"}` },
    description: m.description,
    keywords: m.keywords,
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      locale: loc === "zh" ? "zh_CN" : "en_US",
      siteName: loc === "zh" ? "Aiden 实战训练" : "Aiden Training",
    },
    alternates: {
      languages: { "zh": "/zh", "en": "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div lang={locale === "zh" ? "zh-CN" : "en"} data-locale={locale}>
      <link rel="alternate" hrefLang="zh" href="/zh" />
      <link rel="alternate" hrefLang="en" href="/en" />
      {children}
    </div>
  );
}
