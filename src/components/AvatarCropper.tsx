"use client";
import React, { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import s from "./AvatarCropper.module.scss";

interface Props {
  currentAvatar?: string | null;
  onUploaded: (url: string) => void;
  locale?: string;
}

const dict: Record<string, Record<string, string>> = {
  zh: { change: "更换头像", cancel: "取消", confirm: "确认", uploading: "上传中..." },
  en: { change: "Change Avatar", cancel: "Cancel", confirm: "Confirm", uploading: "Uploading..." },
};

function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, 256, 256);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))), "image/jpeg", 0.85);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

export default function AvatarCropper({ currentAvatar, onUploaded, locale = "zh" }: Props) {
  const t = dict[locale] || dict.zh;
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_: Area, area: Area) => {
    setCroppedArea(area);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedArea) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      const form = new FormData();
      form.append("file", blob, "avatar.jpg");
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.avatar = data.avatar;
        localStorage.setItem("user", JSON.stringify(user));
        onUploaded(data.avatar);
      }
    } catch { /* ignore */ }
    setUploading(false);
    setImageSrc(null);
  };

  const initial = currentAvatar || undefined;

  return (
    <div className={s.wrapper}>
      <div className={s.avatarCircle} onClick={() => fileRef.current?.click()}>
        {initial ? (
          <img src={initial} alt="avatar" className={s.avatarImg} />
        ) : (
          <span className={s.avatarPlaceholder}>👤</span>
        )}
        <div className={s.avatarOverlay}>{t.change}</div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />

      {imageSrc && (
        <div className={s.modal}>
          <div className={s.cropContainer}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className={s.actions}>
            <button className={s.cancelBtn} onClick={() => setImageSrc(null)}>{t.cancel}</button>
            <button className={s.confirmBtn} onClick={handleConfirm} disabled={uploading}>
              {uploading ? t.uploading : t.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
