'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  getPendingPeerEvaluationsForStudent,
  PendingPeerEvaluationItem
} from '@/lib/peer-evaluation-store';
import { PeerAssessmentRubricModal } from '@/components/lesson-phases/peer-assessment-rubric-modal';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Star,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export function StudentPeerEvaluationCard() {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [items, setItems] = useState<PendingPeerEvaluationItem[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<PendingPeerEvaluationItem | null>(null);

  const reload = () => {
    if (!currentUser || currentUser.role !== 'student') return;
    const list = getPendingPeerEvaluationsForStudent(currentUser.id);
    setItems(list);
  };

  useEffect(() => {
    reload();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== 'student') return null;
  if (items.length === 0) return null; // Only render when teacher enabled peer evaluation for the group

  const studentUser = currentUser as any;
  const pendingCount = items.filter((i) => !i.isCompleted).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/80 shadow-sm space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Akran Değerlendirme Görevleri</span>
            </span>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black animate-pulse">
                ⚡ {pendingCount} Değerlendirme Bekliyor
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tümü Tamamlandı</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-black text-slate-900">
            Takım Arkadaşlarını Değerlendir & +25 XP Kazan
          </h3>
          <p className="text-xs text-slate-500">
            Öğretmeniniz grup çalışmanız için akran değerlendirmesini aktif etti. Takımındaki her arkadaşın için hazır rubrik formunu doldurarak onların gelişimine destek ol.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold text-right shrink-0">
          <div className="text-[10px] text-indigo-600 uppercase font-black">Ödül</div>
          <div>Her Form İçin +25 XP</div>
        </div>
      </div>

      {/* Teammates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isDone = item.isCompleted;
          const target = item.targetMember;

          return (
            <div
              key={`${item.group.id}-${target.id}`}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-300/80 hover:border-emerald-400'
                  : 'bg-white border-amber-300 hover:border-indigo-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                
                {/* Top Info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                    Grup: {item.group.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.outcomeCode}
                  </span>
                </div>

                {/* Target Student Identity */}
                <div className="flex items-center gap-3">
                  <UserAvatar
                    avatar={target.avatar}
                    name={target.name}
                    size="md"
                    className="w-12 h-12 border-2 border-indigo-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate">
                      {target.name}
                    </h4>
                    <div className="text-xs text-slate-500">
                      {target.classSection} • No: #{target.studentNumber}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-1">
                  <strong>Kazanım:</strong> {item.outcomeTitle}
                </div>

                {/* Completion Status */}
                {isDone && item.completedRecord && (
                  <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Değerlendirme Tamamlandı</span>
                    </span>
                    <span className="font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[11px]">
                      %{item.completedRecord.percentage} ({item.completedRecord.totalScore}/20P)
                    </span>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  playSound('select');
                  setActiveModalItem(item);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  isDone
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 active:scale-95'
                }`}
              >
                {isDone ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Değerlendirmeyi İncele / Güncelle</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Akran Formunu Doldur (+25 XP)</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          );
        })}
      </div>

      {/* Modal */}
      {activeModalItem && (
        <PeerAssessmentRubricModal
          isOpen={!!activeModalItem}
          onClose={() => {
            setActiveModalItem(null);
            reload();
          }}
          targetStudent={{
            id: activeModalItem.targetMember.id,
            name: activeModalItem.targetMember.name,
            studentNumber: activeModalItem.targetMember.studentNumber,
            avatar: activeModalItem.targetMember.avatar,
            classSection: activeModalItem.targetMember.classSection
          }}
          evaluatorStudent={{
            id: studentUser.id,
            name: studentUser.name,
            studentNumber: studentUser.studentNumber || '104',
            avatar: studentUser.avatar
          }}
          groupId={activeModalItem.group.id}
          groupName={activeModalItem.group.name}
          outcomeCode={activeModalItem.outcomeCode}
          outcomeTitle={activeModalItem.outcomeTitle}
          onCompleted={() => {
            reload();
          }}
        />
      )}

    </div>
  );
}
