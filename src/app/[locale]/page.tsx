import HomeZh from "./HomeZh";
import HomeEn from "./HomeEn";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = (locale === "en" ? "en" : "zh") as Locale;
  return (
    <>
      <div style={{ position: "fixed", top: 14, right: 20, zIndex: 50 }}>
        <LanguageSwitcher locale={loc} />
      </div>
      {loc === "en" ? <HomeEn /> : <HomeZh />}
    </>
  );
}
