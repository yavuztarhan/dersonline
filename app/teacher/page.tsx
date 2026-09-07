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
      <div className="container mx-auto px-4 py-8">
        <TeacherDashboard />
      </div>
    </AuthGuard>
  );
}
