'use client';

import React from 'react';

interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({
  avatar,
  name = 'Kullanıcı',
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const isImage = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'));

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
  };

  const fallbackEmoji = '👤';
  const displayAvatar = avatar || fallbackEmoji;

  if (isImage) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden border border-slate-200/80 shadow-xs flex items-center justify-center bg-slate-100 ${sizeClasses[size]} ${className}`}>
        <img
          src={avatar!}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // fallback if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`shrink-0 rounded-2xl flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      <span>{displayAvatar}</span>
    </div>
  );
}
