'use client';

import React from 'react';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function AdminPage() {
  return (
    <AuthGuard
      requiredRole="admin"
      title="Yönetici (Admin) Masası Girişi"
      description="Öğretmen başvurularını onaylamak, 81 il okul kayıtlarını ve sistem verilerini yönetmek için yönetici girişi yapınız."
    >
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </AuthGuard>
  );
}
