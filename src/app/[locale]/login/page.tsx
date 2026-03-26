"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "./page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: { title: "登录", subtitle: "输入任意用户名和密码即可登录", usernamePlaceholder: "用户名", passwordPlaceholder: "密码", submitBtn: "登录", back: "← 返回首页" },
  en: { title: "Login", subtitle: "Enter any username and password to log in", usernamePlaceholder: "Username", passwordPlaceholder: "Password", submitBtn: "Login", back: "← Back to Home" },
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem("user", JSON.stringify({ username }));
    router.push(`/${locale}/courses`);
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
        <form onSubmit={handleLogin} className={s.form}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernamePlaceholder} className={s.input} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passwordPlaceholder} className={s.input} />
          <button type="submit" className={s.submitBtn}>{t.submitBtn}</button>
        </form>
        <div className={s.backLink}>
          <a href={`/${locale}`}>{t.back}</a>
        </div>
      </div>
    </div>
  );
}
