'use client';

import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const normalizeAvatarUrl = (url?: string | null): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  if (trimmed.includes('googleusercontent.com') || /\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return null;
};

const isEmojiOrShortSymbol = (str?: string | null): boolean => {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  // If longer than 8 chars or contains common ASCII letters/URL chars, it's not a single emoji
  if (trimmed.length > 8 || /[a-zA-Z0-9_\-\.\:\/\?=\&\%]/.test(trimmed)) {
    return false;
  }
  return true;
};

const getInitials = (nameStr?: string): string => {
  if (!nameStr) return '👤';
  const clean = nameStr.trim();
  if (!clean) return '👤';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function UserAvatar({
  avatar,
  name = 'Kullanıcı',
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = normalizeAvatarUrl(avatar);

  useEffect(() => {
    setImgError(false);
  }, [avatar]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
  };

  const isImage = !imgError && Boolean(imageUrl);

  if (isImage && imageUrl) {
    return (
      <div
        className={`relative shrink-0 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center bg-slate-100 select-none ${sizeClasses[size]} ${className}`}
      >
        <img
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If not an image or failed to load: check if avatar is a short emoji
  const hasValidEmoji = isEmojiOrShortSymbol(avatar);
  const fallbackContent = hasValidEmoji ? avatar : (getInitials(name) || '👤');

  return (
    <div
      className={`shrink-0 rounded-2xl overflow-hidden flex items-center justify-center select-none font-bold ${sizeClasses[size]} ${className}`}
    >
      <span className="truncate leading-none">{fallbackContent}</span>
    </div>
  );
}

