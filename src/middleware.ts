import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

function getPreferredLocale(request: NextRequest) {
  const acceptLang = request.headers.get("accept-language") || "";
  if (/^en/i.test(acceptLang) || acceptLang.includes("en")) return "en";
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源、api、_next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return;
  }

  // 已有 locale 前缀则放行
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // 302 重定向到对应语言路径
  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url, 302);
}

export const config = {
  matcher: ["/((?!_next|api|assets|.*\\..*).*)"],
};
