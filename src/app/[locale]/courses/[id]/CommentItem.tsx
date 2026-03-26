"use client";
import React, { useState } from "react";
import s from "./CommentItem.module.scss";

export interface Reply { id: number; user: string; avatar: string; time: string; content: string; likes: number }
export interface Comment { id: number; user: string; avatar: string; time: string; content: string; likes: number; replies: Reply[] }

const dict = {
  zh: { reply: "回复", collapse: "收起回复", repliesCount: "条回复", placeholder: "回复..." },
  en: { reply: "Reply", collapse: "Collapse", repliesCount: "replies", placeholder: "Reply..." },
};

export default function CommentItem({ comment, onLike, onReply, locale = "zh" }: {
  comment: Comment;
  onLike: (id: number) => void;
  onReply: (id: number, text: string) => void;
  locale?: string;
}) {
  const t = dict[locale as keyof typeof dict] || dict.zh;
  const [showReplies, setShowReplies] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const submitReply = () => {
    if (!replyInput.trim()) return;
    onReply(comment.id, replyInput.trim());
    setReplyInput(""); setShowReplyBox(false); setShowReplies(true);
  };

  return (
    <div className={s.root}>
      <div className={s.row}>
        <div className={s.avatar}>{comment.avatar}</div>
        <div className={s.body}>
          <div className={s.meta}>
            <span className={s.userName}>{comment.user}</span>
            <span className={s.time}>{comment.time}</span>
          </div>
          <p className={s.content}>{comment.content}</p>
          <div className={s.actions}>
            <span className={s.actionBtn} onClick={() => onLike(comment.id)}>👍 {comment.likes}</span>
            <span className={s.actionBtn} onClick={() => setShowReplyBox(!showReplyBox)}>{t.reply}</span>
            {comment.replies.length > 0 && (
              <span className={s.toggleReplies} onClick={() => setShowReplies(!showReplies)}>
                {showReplies ? t.collapse : `${comment.replies.length} ${t.repliesCount}`}
              </span>
            )}
          </div>
          {showReplyBox && (
            <div className={s.replyBox}>
              <input value={replyInput} onChange={e => setReplyInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitReply(); }}
                placeholder={t.placeholder}
                className={s.replyInput}
              />
              <button onClick={submitReply} className={s.replyBtn}>{t.reply}</button>
            </div>
          )}
          {showReplies && comment.replies.length > 0 && (
            <div className={s.repliesWrap}>
              {comment.replies.map(r => (
                <div key={r.id} className={s.replyItem}>
                  <div className={s.replyAvatar}>{r.avatar}</div>
                  <div>
                    <div className={s.replyMeta}>
                      <span className={s.replyUser}>{r.user}</span>
                      <span className={s.replyTime}>{r.time}</span>
                    </div>
                    <p className={s.replyContent}>{r.content}</p>
                    <span className={s.replyLikes}>👍 {r.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
