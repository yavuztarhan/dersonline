'use client';

import React from 'react';
import { StudentDashboard } from '@/components/student/student-dashboard';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function StudentPage() {
  return (
    <AuthGuard
      requiredRole="student"
      title="Öğrenci Masası Girişi"
      description="Rozetlerinizi, kazanım ilerlemenizi ve matematik ödevlerinizi görmek için öğrenci hesabınızla giriş yapınız."
    >
      <div className="container mx-auto px-4 py-8">
        <StudentDashboard />
      </div>
    </AuthGuard>
  );
}
