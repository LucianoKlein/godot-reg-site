"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  university: string;
  degree: string;
  title: string;
  bio: string;
  specialties: string[];
  rating: number;
  student_count: number;
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToEnglish: "← 返回英语学习",
    title: "教师团队",
    subtitle: "专业的英语教师为您提供指导",
    university: "毕业院校",
    degree: "学位",
    jobTitle: "职称",
    specialties: "专长",
    rating: "评分",
    students: "学生数",
    noTeachers: "暂无教师信息",
  },
  en: {
    backToEnglish: "← Back to English",
    title: "Teachers",
    subtitle: "Professional English teachers to guide you",
    university: "University",
    degree: "Degree",
    jobTitle: "Title",
    specialties: "Specialties",
    rating: "Rating",
    students: "Students",
    noTeachers: "No teachers available",
  },
};

export default function TeachersPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const t = dict[locale] || dict.zh;

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    fetch("/api/english/teachers")
      .then(r => r.json())
      .then(setTeachers)
      .catch(() => {});
  }, []);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english`} className={s.backBtn}>{t.backToEnglish}</Link>
        <h1 className={s.title}>{t.title}</h1>
        <p className={s.subtitle}>{t.subtitle}</p>
      </header>

      <main className={s.main}>
        {teachers.length > 0 ? (
          <div className={s.grid}>
            {teachers.map(teacher => (
              <div key={teacher.id} className={s.card}>
                <div className={s.avatar}>{teacher.avatar}</div>
                <h2 className={s.name}>{teacher.name}</h2>
                <div className={s.jobTitle}>{teacher.title}</div>
                <p className={s.bio}>{teacher.bio}</p>
                <div className={s.info}>
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>{t.university}</span>
                    <span className={s.infoValue}>{teacher.university}</span>
                  </div>
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>{t.degree}</span>
                    <span className={s.infoValue}>{teacher.degree}</span>
                  </div>
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>{t.rating}</span>
                    <span className={s.infoValue}>{"⭐".repeat(Math.round(teacher.rating))} {teacher.rating}</span>
                  </div>
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>{t.students}</span>
                    <span className={s.infoValue}>{teacher.student_count}</span>
                  </div>
                </div>
                {teacher.specialties.length > 0 && (
                  <div className={s.tags}>
                    {teacher.specialties.map((sp, i) => (
                      <span key={i} className={s.tag}>{sp}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={s.empty}>{t.noTeachers}</div>
        )}
      </main>
    </div>
  );
}
