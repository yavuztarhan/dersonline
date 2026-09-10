'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  StudentGroup,
  GroupTask,
  getGroupForStudent,
  getTasksForGroup,
  submitGroupTask
} from '@/lib/student-group-store';
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  MessageSquare,
  FileText,
  Star,
  X,
  Upload,
  Layers
} from 'lucide-react';

export function StudentGroupsCard() {
  const { currentUser } = useAuth();
  const { playSound } = useApp();

  const [myGroup, setMyGroup] = useState<StudentGroup | null>(null);
  const [tasks, setTasks] = useState<GroupTask[]>([]);

  // Task Submission Modal
  const [submittingTask, setSubmittingTask] = useState<GroupTask | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  const reloadData = () => {
    if (!currentUser) return;
    const studentId = currentUser.id;
    const studentNumber = (currentUser as any)?.studentNumber;
    const group = getGroupForStudent(studentId, studentNumber);
    setMyGroup(group);

    if (group) {
      const groupTasks = getTasksForGroup(group.id);
      setTasks(groupTasks);
    } else {
      setTasks([]);
    }
  };

  useEffect(() => {
    reloadData();
  }, [currentUser]);

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask || !submissionNote.trim()) {
      alert('Lütfen grup çalışması teslim notunu veya linkini yazınız.');
      return;
    }

    playSound('success');
    submitGroupTask(submittingTask.id, currentUser?.name || 'Öğrenci', submissionNote.trim());
    setSubmittingTask(null);
    setSubmissionNote('');
    reloadData();
  };

  if (!myGroup) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-lg">
            👥
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Çalışma Takımım & Grup Ödevlerim
            </h3>
            <p className="text-xs text-slate-400">
              Öğretmeniniz tarafından sınıf grupları oluşturulduğunda takım arkadaşlarınız ve ortak ödevleriniz burada listelenecektir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      
      {/* Top Banner with Group Gradient */}
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${myGroup.colorGradient} text-white relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider border border-white/20">
              <Users className="w-3.5 h-3.5 text-white" />
              <span>Maarif Çalışma Takımı ({myGroup.classSection})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {myGroup.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Öğretmen: {myGroup.teacherName} • Takımınızla birlikte görevleri tamamlayarak ekstra XP kazanın!
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-black text-white shrink-0">
            {myGroup.members.length} Takım Arkadaşı
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 pt-0 space-y-6">
        
        {/* 1. Group Members List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span>Grup Arkadaşlarım</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myGroup.members.map((member) => {
              const isMe = member.id === currentUser?.id || member.studentNumber === (currentUser as any)?.studentNumber;

              return (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isMe
                      ? 'bg-teal-50/80 border-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-lg flex items-center justify-center shadow-xs">
                      {member.avatar || '🎓'}
                    </div>
                    <div>
                      <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {isMe && (
                          <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.2 rounded-full font-black">
                            Sen
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        No: {member.studentNumber} • {member.classSection}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Group Tasks & Collaborative Homeworks */}
        <div className="space-y-3 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Ortak Grup Görevlerimiz ({tasks.length})</span>
            </h3>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-black text-sm sm:text-base text-slate-900">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-teal-700 font-bold">
                        {task.outcomeCode} • {task.outcomeTitle}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full shrink-0 w-fit ${
                        task.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : task.status === 'submitted'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {task.status === 'approved'
                        ? 'Öğretmen Onayladı ⭐'
                        : task.status === 'submitted'
                        ? 'Teslim Edildi 📥'
                        : 'Görev Bekliyor ⏳'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-100">
                    {task.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-4 text-slate-500 font-semibold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Son Teslim: {task.dueDate}</span>
                      </span>
                      <span className="text-amber-700 font-black flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        +{task.xpReward} XP Ödülü
                      </span>
                    </div>

                    {/* Submission Button or Status */}
                    {task.status !== 'approved' && (
                      <button
                        onClick={() => {
                          playSound('click');
                          setSubmittingTask(task);
                          setSubmissionNote(task.submissionNote || '');
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{task.status === 'submitted' ? 'Teslim Notunu Güncelle' : 'Grup Ödevini Teslim Et'}</span>
                      </button>
                    )}
                  </div>

                  {/* Submission note preview */}
                  {task.submissionNote && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold text-[10px] text-amber-800 uppercase">
                        Gönderilen Not ({task.submittedByStudentName || 'Grup'}):
                      </div>
                      <p className="text-[11px] leading-snug">{task.submissionNote}</p>
                    </div>
                  )}

                  {/* Teacher feedback preview */}
                  {task.teacherFeedback && (
                    <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                      <div className="font-bold text-[10px] text-teal-800 uppercase">
                        Öğretmen Değerlendirmesi:
                      </div>
                      <p className="text-[11px] leading-snug">{task.teacherFeedback}</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
              Grubunuza henüz aktif bir görev atanmadı.
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT GROUP TASK */}
      {/* ========================================================================= */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSubmitTask}
            className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">Grup Görevi Teslimi</h3>
              </div>
              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-black text-slate-900">{submittingTask.title}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{submittingTask.description}</div>
              </div>

              <div className="space-y-1.5">
                <label className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
                  Grup Çalışması Açıklaması & Notunuz
                </label>
                <textarea
                  placeholder="Grup olarak yaptığınız çalışmayı, bulgularınızı veya paylaşım linkinizi yazınız..."
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Ödevi Öğretmene İlet</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
