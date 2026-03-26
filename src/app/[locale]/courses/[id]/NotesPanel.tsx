"use client";
import React, { useState, useRef } from "react";
import s from "./NotesPanel.module.scss";

interface Note { id: number; time: number; content: string; createdAt: string }

const MOCK_NOTES: Note[] = [
  { id: 1, time: 15, content: "## 发牌流程要点\n\n1. 先确认桌面清空\n2. 洗牌展示\n3. 切牌后开始发牌\n\n> 注意：每一步都要让摄像头拍到", createdAt: "2025-03-15 14:32" },
  { id: 2, time: 68, content: "### 手势规范\n\n- 手掌朝上，五指张开\n- 动作幅度要大，确保清晰可见\n- **禁止**单手操作", createdAt: "2025-03-15 14:35" },
  { id: 3, time: 142, content: "切牌的标准姿势：\n\n1. 左手固定牌堆\n2. 右手从中间抽出\n3. 放置到顶部\n\n`练习至少50次`", createdAt: "2025-03-15 14:40" },
];

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const renderMd = (md: string) => {
  return md
    .replace(/^### (.+)$/gm, '<h4 style="font-size:14px;font-weight:700;margin:8px 0 4px">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:8px 0 4px">$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #7C3AED;padding-left:10px;color:rgba(255,255,255,0.6);margin:6px 0">$1</blockquote>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(124,58,237,0.15);padding:1px 5px;border-radius:4px;font-size:12px">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:16px;font-size:13px">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:16px;font-size:13px;list-style:decimal">$1</li>')
    .replace(/\n/g, '<br/>');
};

const dict = {
  zh: { addNote: "+ 添加笔记（当前时间点）", timePoint: "时间点", markdownSupport: "支持 Markdown 语法", placeholder: "在这里写笔记，支持 Markdown...", empty: "暂无笔记，点击上方按钮添加", cancel: "取消", save: "保存", justNow: "刚刚" },
  en: { addNote: "+ Add Note (at current time)", timePoint: "Time", markdownSupport: "Markdown supported", placeholder: "Write your notes here, Markdown supported...", empty: "No notes yet. Click the button above to add one.", cancel: "Cancel", save: "Save", justNow: "Just now" },
};

export default function NotesPanel({ videoRef, locale = "zh" }: { videoRef: React.RefObject<HTMLVideoElement | null>; locale?: string }) {
  const t = dict[locale as keyof typeof dict] || dict.zh;
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const noteIdRef = useRef(100);

  const jumpTo = (time: number) => {
    if (videoRef.current) { videoRef.current.currentTime = time; videoRef.current.play().catch(() => {}); }
  };

  const saveNote = () => {
    if (!draft.trim()) return;
    const time = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    setNotes(prev => [{ id: noteIdRef.current++, time, content: draft.trim(), createdAt: t.justNow }, ...prev]);
    setDraft(""); setEditing(false);
  };

  return (
    <div>
      {!editing ? (
        <button onClick={() => { setEditing(true); setDraft(""); }} className={s.addBtn}>
          {t.addNote}
        </button>
      ) : (
        <div className={s.editor}>
          <div className={s.editorHint}>
            {t.timePoint}：{fmtTime(videoRef.current?.currentTime ?? 0)}　|　{t.markdownSupport}
          </div>
          <textarea value={draft} onChange={e => setDraft(e.target.value)}
            placeholder={t.placeholder}
            className={s.textarea}
          />
          <div className={s.editorActions}>
            <button onClick={() => setEditing(false)} className={s.cancelBtn}>{t.cancel}</button>
            <button onClick={saveNote} className={s.saveBtn}>{t.save}</button>
          </div>
        </div>
      )}
      {notes.length === 0 && <p className={s.empty}>{t.empty}</p>}
      {notes.map(n => (
        <div key={n.id} className={s.card}>
          <div className={s.cardHeader}>
            <span className={s.timeTag} onClick={() => jumpTo(n.time)}>{fmtTime(n.time)}</span>
            <span className={s.dateTag}>{n.createdAt}</span>
          </div>
          <div className={s.cardContent} dangerouslySetInnerHTML={{ __html: renderMd(n.content) }} />
        </div>
      ))}
    </div>
  );
}
