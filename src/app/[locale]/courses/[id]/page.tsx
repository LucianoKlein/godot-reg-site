"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { colors } from "@/lib/constants";
import QuizModal from "./QuizModal";
import NotesPanel from "./NotesPanel";
import ExercisePanel from "./ExercisePanel";
import CommentItem, { type Comment } from "./CommentItem";
import s from "./page.module.scss";

interface Episode {
  id: number;
  title: string;
  duration: string;
  watched: boolean;
  quizPassed: boolean;
}

const MOCK_EPISODES: Episode[] = [
  { id: 1, title: "第1节 课程介绍与学习目标", duration: "12:30", watched: false, quizPassed: false },
  { id: 2, title: "第2节 基础规则详解", duration: "18:45", watched: false, quizPassed: false },
  { id: 3, title: "第3节 术语与手势规范", duration: "15:20", watched: false, quizPassed: false },
  { id: 4, title: "第4节 操作流程演示", duration: "22:10", watched: false, quizPassed: false },
  { id: 5, title: "第5节 常见错误与纠正", duration: "16:55", watched: false, quizPassed: false },
  { id: 6, title: "第6节 实战模拟（上）", duration: "25:30", watched: false, quizPassed: false },
  { id: 7, title: "第7节 实战模拟（下）", duration: "28:15", watched: false, quizPassed: false },
  { id: 8, title: "第8节 考核要点总结", duration: "14:40", watched: false, quizPassed: false },
  { id: 9, title: "第9节 模拟考试讲解", duration: "20:00", watched: false, quizPassed: false },
  { id: 10, title: "第10节 结业与岗位指导", duration: "10:50", watched: false, quizPassed: false },
];

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
  const [currentEp, setCurrentEp] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [danmakuOn, setDanmakuOn] = useState(true);
  const [danmakuList, setDanmakuList] = useState<{ id: number; text: string; color: string; time: number }[]>([
    { id: 1, text: "讲得真好！", color: "#fff", time: 2 },
    { id: 2, text: "这里是重点", color: "#FACC15", time: 5 },
    { id: 3, text: "记笔记记笔记", color: "#4ADE80", time: 8 },
    { id: 4, text: "老师说得对", color: "#fff", time: 12 },
    { id: 5, text: "666", color: "#F87171", time: 15 },
    { id: 6, text: "太实用了", color: "#60A5FA", time: 20 },
    { id: 7, text: "这个手势要练", color: "#fff", time: 25 },
    { id: 8, text: "考试会考吗？", color: "#FACC15", time: 30 },
    { id: 9, text: "前排打卡", color: "#4ADE80", time: 1 },
    { id: 10, text: "学到了学到了", color: "#fff", time: 35 },
  ]);
  const [danmakuInput, setDanmakuInput] = useState("");
  const [danmakuColor, setDanmakuColor] = useState("#fff");
  const [danmakuSpeed, setDanmakuSpeed] = useState(2);
  const [danmakuDensity, setDanmakuDensity] = useState(2);
  const danmakuIdRef = useRef(11);
  const [comments, setComments] = useState([
    { id: 1, user: "扑克小王子", avatar: "🎭", time: "2025-03-15 14:30", content: "这节课讲得太清楚了，终于搞懂了发牌流程！", likes: 23, replies: [
      { id: 101, user: "Aiden老师", avatar: "👨‍🏫", time: "2025-03-15 15:00", content: "谢谢支持，有问题随时问！", likes: 8 },
      { id: 102, user: "学员小李", avatar: "🧑", time: "2025-03-15 16:20", content: "同感，之前一直搞混", likes: 3 },
    ]},
    { id: 2, user: "百家乐新手", avatar: "🃏", time: "2025-03-14 20:15", content: "请问老师，手势那部分能再详细讲一下吗？感觉实操的时候还是不太熟练。", likes: 15, replies: [
      { id: 201, user: "Aiden老师", avatar: "👨‍🏫", time: "2025-03-14 21:00", content: "下节课会有专门的手势练习环节，别急~", likes: 12 },
    ]},
    { id: 3, user: "老学员Leo", avatar: "😎", time: "2025-03-13 09:45", content: "二刷了，每次看都有新收获", likes: 31, replies: [] },
    { id: 4, user: "骰子爱好者", avatar: "🎲", time: "2025-03-12 18:30", content: "从骰子课过来的，发现基础课也很有帮助", likes: 9, replies: [] },
    { id: 5, user: "实习荷官", avatar: "🤵", time: "2025-03-11 11:00", content: "考核前来复习一遍，希望能过！", likes: 17, replies: [
      { id: 501, user: "扑克小王子", avatar: "🎭", time: "2025-03-11 12:30", content: "加油！考核不难的", likes: 5 },
    ]},
  ]);
  const [commentInput, setCommentInput] = useState("");
  const commentIdRef = useRef(100);
  const [activeTab, setActiveTab] = useState<"comment" | "notes" | "exercise">("comment");
  const [mobileEpOpen, setMobileEpOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SPEEDS = [0.5, 0.75, 1, 1.5, 2, 3];

  const locale = (params.locale as string) || "zh";
  const isEn = locale === "en";
  const t = {
    backToCourses: isEn ? "← Back to Courses" : "← 返回课程列表",
    courseId: isEn ? "Course ID" : "课程ID",
    directory: isEn ? "Course Directory" : "课程目录",
    episodes: isEn ? "episodes" : "集",
    selectEpisode: isEn ? "Episodes ▼" : "选集 ▼",
    collapse: isEn ? "Collapse ▲" : "收起 ▲",
    quizPassed: isEn ? "Quiz Done" : "已做题",
    watched: isEn ? "Watched" : "已看完",
    unwatched: isEn ? "Not Started" : "未学习",
    goQuiz: isEn ? "Take Quiz" : "去做题",
    danmakuOn: isEn ? "Danmaku ON" : "弹幕开",
    danmakuOff: isEn ? "Danmaku OFF" : "弹幕关",
    danmakuPlaceholder: isEn ? "Send a danmaku..." : "发条弹幕...",
    speedSlow: isEn ? "Slow" : "慢速",
    speedMedium: isEn ? "Medium" : "中速",
    speedFast: isEn ? "Fast" : "快速",
    densitySparse: isEn ? "Sparse" : "稀疏",
    densityMedium: isEn ? "Medium" : "适中",
    densityDense: isEn ? "Dense" : "密集",
    tabComment: isEn ? "Comments" : "评论",
    tabNotes: isEn ? "Notes" : "笔记",
    tabExercise: isEn ? "Exercises" : "练习",
    commentPlaceholder: isEn ? "Write a comment..." : "写条评论...",
    commentSubmit: isEn ? "Post" : "发表",
    duration: isEn ? "Duration" : "时长",
    send: isEn ? "Send" : "发送",
    me: isEn ? "Me" : "我",
    justNow: isEn ? "Just now" : "刚刚",
    total: isEn ? "Total" : "共",
  };

  useEffect(() => { setMounted(true); const user = localStorage.getItem("user"); if (!user) router.push(`/${locale}/login`); }, [router, locale]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = playbackRate; }, [playbackRate]);
  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume; }, [volume]);
  useEffect(() => {
    setVideoEnded(false); setShowQuiz(false); setIsPlaying(false);
    if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }, [currentEp]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
    else { videoRef.current.pause(); setIsPlaying(false); }
  };
  const goPrev = () => { if (currentEp > 0) setCurrentEp(currentEp - 1); };
  const goNext = () => {
    if (currentEp < episodes.length - 1) {
      if (!episodes[currentEp].quizPassed) { setShowQuiz(true); return; }
      setCurrentEp(currentEp + 1);
    }
  };
  const handleVideoEnd = () => {
    setVideoEnded(true); setIsPlaying(false);
    const updated = [...episodes]; updated[currentEp].watched = true; setEpisodes(updated);
    setShowQuiz(true);
  };
  const fmtTime = (sec: number) => { const m = Math.floor(sec / 60); const ss = Math.floor(sec % 60); return `${m}:${ss.toString().padStart(2, "0")}`; };
  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration; setCurrentTime(ratio * duration);
  };
  const sendDanmaku = () => {
    if (!danmakuInput.trim()) return;
    setDanmakuList(prev => [...prev, { id: danmakuIdRef.current++, text: danmakuInput.trim(), color: danmakuColor, time: currentTime }]);
    setDanmakuInput("");
  };
  const submitComment = () => {
    if (!commentInput.trim()) return;
    setComments(prev => [{ id: commentIdRef.current++, user: t.me, avatar: "😊", time: t.justNow, content: commentInput.trim(), likes: 0, replies: [] }, ...prev]);
    setCommentInput("");
  };
  const resetControlsTimer = () => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };
  const handlePlayerMouseEnter = () => { setShowControls(true); if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  const handlePlayerMouseLeave = () => { setShowControls(false); if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  const handlePlayerTap = () => {
    if (showControls) { setShowControls(false); if (controlsTimer.current) clearTimeout(controlsTimer.current); }
    else { setShowControls(true); resetControlsTimer(); }
  };

  if (!mounted) return null;
  const ep = episodes[currentEp];

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href={`/${locale}/courses`} className={s.headerBack}>{t.backToCourses}</a>
          <span className={s.headerId}>{t.courseId}: {params.id}</span>
        </div>
      </header>

      <div className={s.layout}>
        <div>
          <div
            onMouseEnter={handlePlayerMouseEnter}
            onMouseMove={() => { setShowControls(true); resetControlsTimer(); }}
            onMouseLeave={handlePlayerMouseLeave}
            onClick={handlePlayerTap}
            className={s.playerWrap}
          >
            <video ref={videoRef} src="/assets/6b2fc7968bd74703d08feeed044d30f7.mp4" className={s.video}
              onEnded={handleVideoEnd} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => { if (!dragging && videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
              onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
            />
            {danmakuOn && (
              <div className={s.danmakuLayer}>
                {danmakuList.map((d) => {
                  const rows = danmakuDensity === 1 ? 4 : danmakuDensity === 2 ? 6 : 8;
                  const row = d.id % rows;
                  const dur = danmakuSpeed === 1 ? 12 : danmakuSpeed === 2 ? 8 : 5;
                  return (
                    <span key={d.id} className={s.danmakuItem} style={{
                      top: `${(row / rows) * 85 + 2}%`, color: d.color,
                      left: '100%',
                      animation: `danmaku-scroll ${dur}s linear`, animationDelay: `${d.time % dur}s`,
                      animationFillMode: 'forwards',
                    }}>{d.text}</span>
                  );
                })}
              </div>
            )}
            {videoEnded && !showQuiz && (
              <div className={s.endOverlay}>
                <button onClick={(e) => { e.stopPropagation(); setShowQuiz(true); }} className={s.quizBtn}>{t.goQuiz}</button>
              </div>
            )}
            <div className={s.controls} onClick={e => e.stopPropagation()}
              onMouseEnter={() => { if (controlsTimer.current) clearTimeout(controlsTimer.current); }}
              style={{ opacity: showControls ? 1 : 0, pointerEvents: showControls ? "auto" : "none" }}>
              <div className={s.progressRow}>
                <span className={s.timeLabel}>{fmtTime(currentTime)}</span>
                <div ref={progressRef} onClick={seekTo}
                  onMouseDown={(e) => { setDragging(true); seekTo(e); }}
                  onMouseMove={(e) => { if (dragging) seekTo(e); }}
                  onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
                  className={s.progressTrack}>
                  <div className={s.progressFill} style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, transition: dragging ? "none" : "width 0.1s" }} />
                  <div className={s.progressThumb} style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                </div>
                <span className={s.timeLabel}>{fmtTime(duration)}</span>
              </div>
              <div className={s.btnRow}>
                <button onClick={goPrev} disabled={currentEp === 0} className={s.ctrlBtn} style={{ fontSize: 18 }}>⏮</button>
                <button onClick={togglePlay} className={s.ctrlBtn} style={{ fontSize: 22 }}>{isPlaying ? "⏸" : "▶"}</button>
                <button onClick={goNext} disabled={currentEp === episodes.length - 1} className={s.ctrlBtn} style={{ fontSize: 18 }}>⏭</button>
                <div className={s.divider} />
                <div className={s.speedWrap}>
                  <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className={s.speedBtn}>{playbackRate}x</button>
                  {showSpeedMenu && (
                    <div className={s.speedMenu}>
                      {SPEEDS.map(sp => (
                        <div key={sp} onClick={() => { setPlaybackRate(sp); setShowSpeedMenu(false); }}
                          className={`${s.speedItem} ${sp === playbackRate ? s.active : ""}`}>{sp}x</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={s.divider} />
                <span className={s.volumeIcon}>🔊</span>
                <input type="range" min={0} max={1} step={0.05} value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))} className={s.volumeSlider} />
                <div className={s.divider} />
                <button onClick={() => setDanmakuOn(!danmakuOn)}
                  className={`${s.danmakuToggle} ${danmakuOn ? s.on : ""}`}>{danmakuOn ? t.danmakuOn : t.danmakuOff}</button>
                <select value={danmakuSpeed} onChange={e => setDanmakuSpeed(Number(e.target.value))} className={s.danmakuSelect}>
                  <option value={1}>{t.speedSlow}</option><option value={2}>{t.speedMedium}</option><option value={3}>{t.speedFast}</option>
                </select>
                <select value={danmakuDensity} onChange={e => setDanmakuDensity(Number(e.target.value))} className={s.danmakuSelect}>
                  <option value={1}>{t.densitySparse}</option><option value={2}>{t.densityMedium}</option><option value={3}>{t.densityDense}</option>
                </select>
              </div>
              <div className={s.danmakuSend}>
                {["#fff", "#FACC15", "#4ADE80", "#60A5FA", "#F87171", "#C084FC"].map(c => (
                  <div key={c} onClick={() => setDanmakuColor(c)}
                    className={`${s.colorDot} ${danmakuColor === c ? s.active : ""}`} style={{ background: c }} />
                ))}
                <input value={danmakuInput} onChange={e => setDanmakuInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendDanmaku(); }}
                  placeholder={t.danmakuPlaceholder} className={s.danmakuInput} />
                <button onClick={sendDanmaku} className={s.sendBtn}>{t.send}</button>
              </div>
            </div>
            <div className={s.miniProgress} style={{ opacity: showControls ? 0 : 1 }}>
              <div className={s.miniProgressFill} style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            </div>
          </div>
          <div className={s.mobileEpBar}>
            <div onClick={() => setMobileEpOpen(!mobileEpOpen)}
              className={`${s.mobileEpToggle} ${mobileEpOpen ? s.open : ""}`}>
              <div className={s.mobileEpTitle}>
                <span className={s.mobileEpName}>{ep.title}</span>
                <span className={s.mobileEpCount}>{t.total}{episodes.length}{t.episodes}</span>
              </div>
              <span className={s.mobileEpArrow}>{mobileEpOpen ? t.collapse : t.selectEpisode}</span>
            </div>
            {mobileEpOpen && (
              <div className={s.mobileEpList}>
                {episodes.map((item, idx) => (
                  <div key={item.id} onClick={() => { setCurrentEp(idx); setMobileEpOpen(false); }}
                    className={`${s.mobileEpItem} ${idx === currentEp ? s.active : ""}`}>
                    <div className={s.mobileEpItemTitle}>{item.title}</div>
                    <div className={s.mobileEpItemMeta}>
                      <span>{item.duration}</span>
                      {item.quizPassed
                        ? <span className={`${s.statusTag} ${s.quizPassed}`}>{t.quizPassed}</span>
                        : item.watched
                          ? <span className={`${s.statusTag} ${s.watched}`}>{t.watched}</span>
                          : <span className={`${s.statusTag} ${s.unwatched}`}>{t.unwatched}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={s.epInfo}>
            <h2>{ep.title}</h2>
            <p>{t.duration}：{ep.duration}</p>
          </div>
          <div className={s.tabSection}>
            <div className={s.tabBar}>
              {([["comment", t.tabComment], ["notes", t.tabNotes], ["exercise", t.tabExercise]] as [typeof activeTab, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`${s.tabBtn} ${activeTab === key ? s.active : ""}`}>{label}</button>
              ))}
            </div>
            {activeTab === "comment" && (
              <div>
                <div className={s.commentInputRow}>
                  <div className={s.commentAvatar}>😊</div>
                  <input value={commentInput} onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") submitComment(); }}
                    placeholder={t.commentPlaceholder} className={s.commentInput} />
                  <button onClick={submitComment} className={s.commentSubmitBtn}>{t.commentSubmit}</button>
                </div>
                {comments.map(c => (
                  <CommentItem key={c.id} comment={c} locale={locale}
                    onLike={(id) => setComments(prev => prev.map(cm => cm.id === id ? { ...cm, likes: cm.likes + 1 } : cm))}
                    onReply={(id, text) => setComments(prev => prev.map(cm => cm.id === id ? { ...cm, replies: [...cm.replies, {
                      id: commentIdRef.current++, user: t.me, avatar: "😊", time: t.justNow, content: text, likes: 0,
                    }]} : cm))} />
                ))}
              </div>
            )}
            {activeTab === "notes" && <NotesPanel videoRef={videoRef} locale={locale} />}
            {activeTab === "exercise" && <ExercisePanel locale={locale} />}
          </div>
        </div>
        <div className={s.sidebar}>
          <div className={s.sidebarTitle}>{t.directory}（{episodes.length}{t.episodes}）</div>
          {episodes.map((item, idx) => (
            <div key={item.id} onClick={() => setCurrentEp(idx)}
              className={`${s.sidebarItem} ${idx === currentEp ? s.active : ""}`}>
              <div className={s.sidebarItemTitle}>{item.title}</div>
              <div className={s.sidebarItemMeta}>
                <span>{item.duration}</span>
                {item.quizPassed
                  ? <span className={`${s.sidebarStatusTag} ${s.quizPassed}`}>{t.quizPassed}</span>
                  : item.watched
                    ? <span className={`${s.sidebarStatusTag} ${s.watched}`}>{t.watched}</span>
                    : <span className={`${s.sidebarStatusTag} ${s.unwatched}`}>{t.unwatched}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showQuiz && <QuizModal locale={locale} onPass={() => {
        const updated = [...episodes]; updated[currentEp].quizPassed = true; setEpisodes(updated); setShowQuiz(false);
        if (currentEp < episodes.length - 1) setCurrentEp(currentEp + 1);
      }} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
