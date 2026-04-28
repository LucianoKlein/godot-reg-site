"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./page.module.scss";

interface Article {
  id: number;
  title: string;
  content: string;
  translation: string;
  sort_order: number;
  word_ids: number[];
}

interface Word {
  id: number;
  text: string;
  phonetic: string;
  translation: string;
  examples: { id: number; text: string; translation: string }[];
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    backToMissions: "← 返回任务列表",
    articleContent: "文章内容",
    translation: "译文",
    relatedWords: "相关单词",
    selectArticle: "选择文章",
    record: "录音",
    recording: "录音中...",
    stopRecord: "停止",
    playback: "播放",
    submit: "提交录音",
    submitting: "提交中...",
    submitted: "已提交",
    recordHint: "点击录音按钮朗读文章内容",
  },
  en: {
    backToMissions: "← Back to Missions",
    articleContent: "Article Content",
    translation: "Translation",
    relatedWords: "Related Words",
    selectArticle: "Select an article",
    record: "Record",
    recording: "Recording...",
    stopRecord: "Stop",
    playback: "Play",
    submit: "Submit Recording",
    submitting: "Submitting...",
    submitted: "Submitted",
    recordHint: "Click record to read the article aloud",
  },
};

export default function MissionDetailPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const missionId = params.id as string;
  const t = dict[locale] || dict.zh;

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [words, setWords] = useState<Word[]>([]);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    fetch(`/api/english/article-units/${missionId}/articles`)
      .then(r => r.json())
      .then((data: Article[]) => {
        setArticles(data);
        if (data.length > 0) loadArticle(data[0].id);
      })
      .catch(() => {});
  }, [missionId]);

  const loadArticle = (articleId: number) => {
    fetch(`/api/english/articles/${articleId}`)
      .then(r => r.json())
      .then((data: any) => {
        setSelectedArticle(data);
        setWords(data.words || []);
        // Reset recording state when switching articles
        setAudioBlob(null);
        setAudioUrl(null);
        setSubmitStatus("idle");
      })
      .catch(() => {});
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const submitRecording = async () => {
    if (!audioBlob || !selectedArticle) return;
    setSubmitStatus("submitting");
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("article_id", String(selectedArticle.id));
      formData.append("article_title", selectedArticle.title);
      await fetch("/api/english/recordings", { method: "POST", body: formData });
      setSubmitStatus("submitted");
    } catch {
      setSubmitStatus("idle");
    }
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english/missions`} className={s.backBtn}>{t.backToMissions}</Link>
      </header>

      <main className={s.main}>
        <aside className={s.sidebar}>
          <h3 className={s.sidebarTitle}>{t.selectArticle}</h3>
          {articles.map(a => (
            <button
              key={a.id}
              className={`${s.articleTab} ${selectedArticle?.id === a.id ? s.active : ""}`}
              onClick={() => loadArticle(a.id)}
            >
              {a.title}
            </button>
          ))}
        </aside>

        <div className={s.content}>
          {selectedArticle ? (
            <>
              <h1 className={s.articleTitle}>{selectedArticle.title}</h1>

              <section className={s.section}>
                <h2 className={s.sectionTitle}>{t.articleContent}</h2>
                <div className={s.articleText}>{selectedArticle.content}</div>
              </section>

              <section className={s.section}>
                <h2 className={s.sectionTitle}>{t.translation}</h2>
                <div className={s.translationText}>{selectedArticle.translation}</div>
              </section>

              {words.length > 0 && (
                <section className={s.section}>
                  <h2 className={s.sectionTitle}>{t.relatedWords}</h2>
                  <div className={s.wordGrid}>
                    {words.map(w => (
                      <div key={w.id} className={s.wordCard}>
                        <div className={s.wordText}>{w.text}</div>
                        <div className={s.wordPhonetic}>{w.phonetic}</div>
                        <div className={s.wordTranslation}>{w.translation}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className={s.section}>
                <h2 className={s.sectionTitle}>{t.record}</h2>
                <p className={s.recordHint}>{t.recordHint}</p>
                <div className={s.recordControls}>
                  {!isRecording ? (
                    <button className={s.recordBtn} onClick={startRecording}>{t.record}</button>
                  ) : (
                    <button className={s.recordBtnActive} onClick={stopRecording}>{t.stopRecord}</button>
                  )}
                  {audioUrl && (
                    <>
                      <audio src={audioUrl} controls className={s.audioPlayer} />
                      <button
                        className={s.submitBtn}
                        onClick={submitRecording}
                        disabled={submitStatus !== "idle"}
                      >
                        {submitStatus === "submitting" ? t.submitting : submitStatus === "submitted" ? t.submitted : t.submit}
                      </button>
                    </>
                  )}
                </div>
              </section>
            </>
          ) : (
            <div className={s.empty}>{t.selectArticle}</div>
          )}
        </div>
      </main>
    </div>
  );
}
