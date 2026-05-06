"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Play,
  Pause,
  Mic,
  MicOff,
  Languages,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import s from "./page.module.scss";

interface Phrase {
  text: string;
  translation: string;
  kk: string;
  dj: string;
  ipa: string;
}

interface Sentence {
  id: number;
  text: string;
  translation: string;
  kk: string;
  dj: string;
  ipa: string;
  phrases: Phrase[];
}

interface ArticleData {
  id: number;
  title: string;
  content: string;
  translation: string;
  sentences: Sentence[];
}

const dict: Record<string, Record<string, string>> = {
  zh: {
    back: "返回",
    play: "播放",
    pause: "暂停",
    followRead: "跟读",
    recording: "录音中",
    phonetic: "音标",
    knowledge: "知识点",
    kk: "KK",
    dj: "DJ",
    ipa: "IPA",
    noSentences: "暂无句子数据",
    phoneticType: "音标类型",
  },
  en: {
    back: "Back",
    play: "Play",
    pause: "Pause",
    followRead: "Follow",
    recording: "Recording",
    phonetic: "Phonetic",
    knowledge: "Knowledge",
    kk: "KK",
    dj: "DJ",
    ipa: "IPA",
    noSentences: "No sentence data",
    phoneticType: "Phonetic type",
  },
};

export default function ArticleReadPage() {
  const params = useParams();
  const locale = (params.locale as string) || "zh";
  const missionId = params.id as string;
  const articleId = params.articleId as string;
  const t = dict[locale] || dict.zh;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [phoneticType, setPhoneticType] = useState<"kk" | "dj" | "ipa">("kk");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [phoneticVisible, setPhoneticVisible] = useState<Set<number>>(new Set());
  const [knowledgeVisible, setKnowledgeVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch(`/api/english/articles/${articleId}`)
      .then(r => r.json())
      .then((data: ArticleData) => {
        if (data && data.id) setArticle(data);
      })
      .catch(() => {});
  }, [articleId]);

  const toggleSet = (set: Set<number>, id: number): Set<number> => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const handlePlay = (id: number) => {
    setRecordingId(null);
    setPlayingId(prev => (prev === id ? null : id));
  };

  const handleRecord = (id: number) => {
    setPlayingId(null);
    setRecordingId(prev => (prev === id ? null : id));
  };

  if (!article) return <div className={s.page}><div className={s.loading}>Loading...</div></div>;

  const sentences = article.sentences || [];

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href={`/${locale}/english/missions/${missionId}`} className={s.backBtn}>
          <ChevronLeft size={18} /> {t.back}
        </Link>
        <h1 className={s.title}>{article.title}</h1>
      </header>

      <div className={s.globalBar}>
        <span className={s.globalLabel}>{t.phoneticType}</span>
        <div className={s.phoneticTabs}>
          {(["kk", "dj", "ipa"] as const).map(pt => (
            <button
              key={pt}
              className={`${s.phoneticTab} ${phoneticType === pt ? s.activeTab : ""}`}
              onClick={() => setPhoneticType(pt)}
            >
              {t[pt]}
            </button>
          ))}
        </div>
      </div>

      <main className={s.main}>
        {sentences.length === 0 && <div className={s.empty}>{t.noSentences}</div>}
        {sentences.map((sent, i) => {
          const sid = sent.id || i;
          const isPlaying = playingId === sid;
          const isRecording = recordingId === sid;
          const showPhonetic = phoneticVisible.has(sid);
          const showKnowledge = knowledgeVisible.has(sid);
          const hasPhrases = sent.phrases && sent.phrases.length > 0;

          return (
            <div key={sid} className={s.card}>
              <div className={s.cardBody}>
                <span className={s.sentenceNum}>{i + 1}</span>
                <div className={s.sentenceContent}>
                  <div className={s.sentenceText}>{sent.text}</div>
                  {showPhonetic && sent[phoneticType] && (
                    <div className={s.phonetic}>{sent[phoneticType]}</div>
                  )}
                  {sent.translation && (
                    <div className={s.translation}>{sent.translation}</div>
                  )}
                </div>
              </div>

              <div className={s.toolbar}>
                <button
                  className={`${s.toolBtn} ${isPlaying ? s.toolBtnActive : ""}`}
                  onClick={() => handlePlay(sid)}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span className={s.toolLabel}>{isPlaying ? t.pause : t.play}</span>
                </button>

                <button
                  className={`${s.toolBtn} ${isRecording ? s.toolBtnRecording : ""}`}
                  onClick={() => handleRecord(sid)}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  <span className={s.toolLabel}>{isRecording ? t.recording : t.followRead}</span>
                </button>

                <button
                  className={`${s.toolBtn} ${showPhonetic ? s.toolBtnActive : ""}`}
                  onClick={() => setPhoneticVisible(prev => toggleSet(prev, sid))}
                >
                  <Languages size={16} />
                  <span className={s.toolLabel}>{t.phonetic}</span>
                </button>

                {hasPhrases && (
                  <button
                    className={`${s.toolBtn} ${showKnowledge ? s.toolBtnActive : ""}`}
                    onClick={() => setKnowledgeVisible(prev => toggleSet(prev, sid))}
                  >
                    <Lightbulb size={16} />
                    <span className={s.toolLabel}>{t.knowledge}</span>
                    {showKnowledge ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
              </div>

              {showKnowledge && hasPhrases && (
                <div className={s.knowledgePanel}>
                  {sent.phrases.map((p, j) => (
                    <div key={j} className={s.phraseItem}>
                      <span className={s.phraseText}>{p.text}</span>
                      <span className={s.phraseDash}>—</span>
                      <span className={s.phraseTranslation}>{p.translation}</span>
                      {p[phoneticType] && (
                        <span className={s.phrasePhonetic}>{p[phoneticType]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
