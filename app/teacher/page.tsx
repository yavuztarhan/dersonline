'use client';

import React from 'react';
import { TeacherDashboard } from '@/components/teacher/teacher-dashboard';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function TeacherPage() {
  return (
    <AuthGuard
      requiredRole="teacher"
      title="Öğretmen Paneli Girişi"
      description="Sınıf yönetimi, akıllı tahta kazanım takibi ve öğrenci puanlarını yönetmek için öğretmen hesabınızla giriş yapınız."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TeacherDashboard />
      </div>
    </AuthGuard>
  );
}
