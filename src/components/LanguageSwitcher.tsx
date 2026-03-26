"use client";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const label = locale === "zh" ? "EN" : "中文";

  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <a
      href={switchPath}
      style={{
        padding: "6px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.72)",
        fontSize: 13,
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      {label}
    </a>
  );
}
