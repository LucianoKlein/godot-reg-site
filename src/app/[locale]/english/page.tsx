"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EnglishPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "zh";

  useEffect(() => {
    router.replace(`/${locale}/english/units`);
  }, [locale, router]);

  return null;
}
