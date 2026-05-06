"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import s from "../login/page.module.scss";

const dict: Record<string, Record<string, string>> = {
  zh: {
    title: "注册",
    subtitle: "创建账号，开始刷题之旅",
    usernamePlaceholder: "用户名",
    passwordPlaceholder: "密码",
    emailPlaceholder: "邮箱（选填）",
    submitBtn: "注册",
    back: "← 返回首页",
    hasAccount: "已有账号？去登录",
    usernameTaken: "用户名已被注册",
    networkError: "网络错误",
  },
  en: {
    title: "Register",
    subtitle: "Create an account to start practicing",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    emailPlaceholder: "Email (optional)",
    submitBtn: "Register",
    back: "← Back to Home",
    hasAccount: "Already have an account? Login",
    usernameTaken: "Username already taken",
    networkError: "Network error",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email: email || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail === "Username already exists" ? t.usernameTaken : (data?.detail || t.networkError));
        return;
      }
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.access_token);
      router.push(`/${locale}/quiz`);
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
        <form onSubmit={handleRegister} className={s.form}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernamePlaceholder} className={s.input} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passwordPlaceholder} className={s.input} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailPlaceholder} className={s.input} />
          {error && <div className={s.error}>{error}</div>}
          <button type="submit" className={s.submitBtn} disabled={loading}>{loading ? "..." : t.submitBtn}</button>
        </form>
        <div className={s.backLink}>
          <a href={`/${locale}/login`}>{t.hasAccount}</a>
        </div>
        <div className={s.backLink}>
          <a href={`/${locale}`}>{t.back}</a>
        </div>
      </div>
    </div>
  );
}
