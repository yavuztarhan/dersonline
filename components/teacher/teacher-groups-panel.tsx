'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  StudentGroup,
  GroupTask,
  getGroupsForClass,
  getStoredGroupTasks,
  createGroupsAuto,
  createGroupManual,
  deleteGroup,
  assignTaskToGroup,
  gradeGroupTask,
  toggleGroupPeerEvaluation
} from '@/lib/student-group-store';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  Users,
  Plus,
  Sparkles,
  Dices,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Send,
  Star,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';

interface TeacherGroupsPanelProps {
  selectedClass: string;
  onSelectClass?: (cls: string) => void;
  availableClasses: string[];
}

export function TeacherGroupsPanel({
  selectedClass,
  onSelectClass,
  availableClasses
}: TeacherGroupsPanelProps) {
  const { currentUser, getVisibleStudents, awardPointsToStudent } = useAuth();
  const { playSound } = useApp();

  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [tasks, setTasks] = useState<GroupTask[]>([]);

  // Modals state
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoGroupSize, setAutoGroupSize] = useState<number>(3);

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualGroupName, setManualGroupName] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTargetGroupId, setTaskTargetGroupId] = useState<string>('all');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskOutcomeCode, setTaskOutcomeCode] = useState('MAT.5.3.4');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-25');
  const [taskXpReward, setTaskXpReward] = useState<number>(150);

  // Review & Grade Task Modal
  const [reviewingTask, setReviewingTask] = useState<GroupTask | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState('');

  const reloadData = () => {
    const classGroups = getGroupsForClass(selectedClass);
    const allTasks = getStoredGroupTasks().filter((t) => t.classSection === selectedClass || selectedClass === 'Tümü');
    setGroups(classGroups);
    setTasks(allTasks);
  };

  useEffect(() => {
    reloadData();
  }, [selectedClass]);

  const teacherName = currentUser?.name || 'Öğretmen';
  const teacherId = currentUser?.id || 'tch-101';

  // Visible students for this teacher in selected class
  const classStudents = getVisibleStudents(currentUser).filter(
    (s) => s.classSection === selectedClass || selectedClass === 'Tümü'
  );

  // 1. Handle Auto Group Creation
  const handleCreateAutoGroups = () => {
    playSound('click');
    if (classStudents.length === 0) {
      alert('Bu sınıfta gruplanacak öğrenci bulunmuyor.');
      return;
    }

    createGroupsAuto(selectedClass, autoGroupSize, classStudents, teacherId, teacherName);
    playSound('success');
    setShowAutoModal(false);
    reloadData();
  };

  // 2. Handle Manual Group Creation
  const handleCreateManualGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGroupName.trim() || selectedStudentIds.length === 0) {
      alert('Lütfen grup adını belirleyiniz ve en az 1 öğrenci seçiniz.');
      return;
    }

    const chosenStudents = classStudents.filter((s) => selectedStudentIds.includes(s.id));
    createGroupManual(manualGroupName, selectedClass, chosenStudents, teacherId, teacherName);

    playSound('success');
    setShowManualModal(false);
    setManualGroupName('');
    setSelectedStudentIds([]);
    reloadData();
  };

  // 3. Handle Task Assignment
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDescription.trim()) {
      alert('Lütfen görev başlığını ve açıklamasını doldurunuz.');
      return;
    }

    playSound('click');

    const targetGroups =
      taskTargetGroupId === 'all'
        ? groups
        : groups.filter((g) => g.id === taskTargetGroupId);

    if (targetGroups.length === 0) {
      alert('Görev atanacak grup bulunamadı.');
      return;
    }

    targetGroups.forEach((grp) => {
      assignTaskToGroup({
        groupId: grp.id,
        groupName: grp.name,
        classSection: selectedClass,
        teacherId,
        teacherName,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        outcomeCode: taskOutcomeCode,
        outcomeTitle: 'Geometrik Çıkarım & Düzlemde Doğruların Durumu',
        dueDate: taskDueDate,
        xpReward: Number(taskXpReward) || 150
      });
    });

    playSound('success');
    setShowTaskModal(false);
    setTaskTitle('');
    setTaskDescription('');
    reloadData();
  };

  // 4. Handle Task Approval & XP Distribution
  const handleGradeTask = (isApproved: boolean) => {
    if (!reviewingTask) return;
    playSound('success');

    gradeGroupTask(reviewingTask.id, teacherFeedbackInput, isApproved);

    // If approved, award XP to all members in this group!
    if (isApproved) {
      const targetGroup = groups.find((g) => g.id === reviewingTask.groupId);
      if (targetGroup) {
        targetGroup.members.forEach((member) => {
          awardPointsToStudent(member.id, reviewingTask.xpReward);
        });
      }
    }

    setReviewingTask(null);
    setTeacherFeedbackInput('');
    reloadData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Top Bar: Class Selector & Action Buttons */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Class Selection */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            👥
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Şube Seçimi</div>
            <div className="flex items-center gap-2 mt-0.5">
              {availableClasses.map((cls) => (
                <button
                  key={cls}
                  onClick={() => onSelectClass && onSelectClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-teal-700 text-white shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cls} Şubesi
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          <button
            onClick={() => {
              playSound('click');
              setShowAutoModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Öğrencileri Otomatik Gruplara Dağıt"
          >
            <Dices className="w-4 h-4 text-amber-300" />
            <span>Otomatik Grupla 🎲</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowManualModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Manuel Grup Ekle</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setShowTaskModal(true);
            }}
            disabled={groups.length === 0}
            className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 ${
              groups.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Grup Ödevi / Görevi Ata</span>
          </button>
        </div>

      </div>

      {/* 2. Groups & Collaborative Tasks Grid */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {groups.map((group) => {
            const groupTasks = tasks.filter((t) => t.groupId === group.id);

            return (
              <div
                key={group.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-teal-400/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Accent Top Bar */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${group.colorGradient}`} />

                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  
                  {/* Group Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900">
                          {group.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200">
                          {group.members.length} Üye
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold">
                        {group.classSection} Sınıfı • Maarif Çalışma Takımı
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`"${group.name}" grubunu silmek istediğinize emin misiniz?`)) {
                          playSound('click');
                          deleteGroup(group.id);
                          reloadData();
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Grubu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Members Pill List */}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                      Grup Arkadaşları
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((member) => (
                        <div
                          key={member.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs font-bold text-slate-800"
                        >
                          <span className="text-sm">{member.avatar || '🎓'}</span>
                          <span>{member.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">({member.studentNumber})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Peer Evaluation Status & Toggle Checkbox */}
                  <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id={`peer-toggle-${group.id}`}
                        checked={!!group.peerEvaluationEnabled}
                        onChange={(e) => {
                          playSound('click');
                          toggleGroupPeerEvaluation(group.id, e.target.checked, 'MAT.5.3.3', 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme');
                          reloadData();
                        }}
                        className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                      />
                      <label htmlFor={`peer-toggle-${group.id}`} className="text-xs font-black text-indigo-950 cursor-pointer flex items-center gap-1.5 select-none">
                        <span>Akran Değerlendirmesi</span>
                        {group.peerEvaluationEnabled ? (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                            Kapalı
                          </span>
                        )}
                      </label>
                    </div>

                    <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      {group.peerEvaluationOutcomeCode || 'MAT.5.3.3'}
                    </span>
                  </div>

                  {/* Group Tasks Sub-Section */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-400">
                      <span>Gruba Atanan Görevler ({groupTasks.length})</span>
                    </div>

                    {groupTasks.length > 0 ? (
                      <div className="space-y-2">
                        {groupTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-extrabold text-slate-900 leading-snug">
                                {task.title}
                              </div>
                              
                              {/* Task Status Badge */}
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
                                  task.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : task.status === 'submitted'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {task.status === 'approved'
                                  ? 'Onaylandı ⭐'
                                  : task.status === 'submitted'
                                  ? 'Teslim Edildi 📥'
                                  : 'Bekliyor ⏳'}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {task.description}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>Teslim: {task.dueDate}</span>
                              </span>
                              <span className="text-amber-700 font-black flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                                +{task.xpReward} XP
                              </span>
                            </div>

                            {/* If submitted, show review button */}
                            {task.status === 'submitted' && (
                              <div className="pt-1">
                                <button
                                  onClick={() => {
                                    playSound('click');
                                    setReviewingTask(task);
                                    setTeacherFeedbackInput(task.teacherFeedback || '');
                                  }}
                                  className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ödevi İncele & Değerlendir</span>
                                </button>
                              </div>
                            )}

                            {task.teacherFeedback && (
                              <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900 font-medium">
                                <strong>Öğretmen Notu:</strong> {task.teacherFeedback}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-[11px] text-slate-400">
                        Bu gruba henüz bir ödev veya görev atanmadı.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-3">
          <div className="text-4xl">👥</div>
          <h3 className="text-base font-black text-slate-900">
            {selectedClass} Şubesinde Henüz Grup Oluşturulmadı
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Öğrencilerinizi otomatik olarak 2'şerli, 3'erli veya 4'erli takımlara ayırabilir ya da manuel olarak özel çalışma grupları kurabilirsiniz.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowAutoModal(true)}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Dices className="w-4 h-4 text-amber-300" />
              <span>Otomatik Gruplama Sihirbazını Başlat</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: AUTO GROUP WIZARD */}
      {/* ========================================================================= */}
      {showAutoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Dices className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">Otomatik Gruplama</h3>
              </div>
              <button
                onClick={() => setShowAutoModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>{selectedClass}</strong> şubesindeki <strong>{classStudents.length} öğrenci</strong> adil ve dengeli bir şekilde rastgele çalışma gruplarına ayrılacaktır.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Grup Başına Düşen Öğrenci Sayısı
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setAutoGroupSize(size)}
                    className={`py-3 px-2 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                      autoGroupSize === size
                        ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {size}'şer Kişilik
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold pt-1">
                Tahmini: {Math.ceil(classStudents.length / autoGroupSize)} farklı çalışma takımı oluşturulacak.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAutoModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleCreateAutoGroups}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Grupları Oluştur 🎲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANUAL GROUP CREATION */}
      {/* ========================================================================= */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateManualGroup}
            className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base text-slate-900">Manuel Grup Oluştur</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Grup Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Harezmi Matematik Takımı"
                  value={manualGroupName}
                  onChange={(e) => setManualGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Grup Üyelerini Seçiniz ({selectedStudentIds.length} Seçildi)</span>
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                  {classStudents.map((stu) => {
                    const isChecked = selectedStudentIds.includes(stu.id);
                    return (
                      <label
                        key={stu.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds([...selectedStudentIds, stu.id]);
                              } else {
                                setSelectedStudentIds(selectedStudentIds.filter((id) => id !== stu.id));
                              }
                            }}
                            className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500"
                          />
                          <span>{stu.avatar || '🎓'}</span>
                          <span>{stu.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">No: {stu.studentNumber}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Grubu Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASSIGN COLLABORATIVE TASK */}
      {/* ========================================================================= */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAssignTask}
            className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-base text-slate-900">Grup Ödevi / Görevi Ata</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1 flex-1">
              
              {/* Target Group Selector */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Hedef Grup
                </label>
                <select
                  value={taskTargetGroupId}
                  onChange={(e) => setTaskTargetGroupId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  <option value="all">🌟 Tüm Gruplara Aynı Görevi Ata ({groups.length} Grup)</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      👥 {g.name} ({g.members.length} Üye)
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Title */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Görev Başlığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Doğruların Durumu ve Açı Modeli Maketi"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>

              {/* Task Description */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Görev Açıklaması & Yönergeler
                </label>
                <textarea
                  placeholder="Grup üyelerinin ne yapacağını, hangi malzemeleri kullanacağını ve sunum detaylarını yazınız..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                  required
                />
              </div>

              {/* Due Date & XP Reward */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Son Teslim Tarihi
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Ödül (XP)
                  </label>
                  <input
                    type="number"
                    value={taskXpReward}
                    onChange={(e) => setTaskXpReward(Number(e.target.value))}
                    min={50}
                    max={500}
                    step={25}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
              >
                Görevi Ata 🚀
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REVIEW & GRADE SUBMITTED TASK */}
      {/* ========================================================================= */}
      {reviewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-slate-900">Grup Ödevi İnceleme & Değerlendirme</h3>
              </div>
              <button
                onClick={() => setReviewingTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-500 uppercase text-[10px]">Grup & Görev</div>
                <div className="font-black text-slate-900 text-sm">{reviewingTask.groupName} - {reviewingTask.title}</div>
                <div className="text-slate-600 text-[11px]">{reviewingTask.description}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <div className="font-bold text-amber-800 uppercase text-[10px]">
                  Öğrenci Teslim Notu (Gönderen: {reviewingTask.submittedByStudentName || 'Grup Temsilcisi'})
                </div>
                <div className="text-slate-800 text-xs font-medium whitespace-pre-wrap">
                  {reviewingTask.submissionNote || 'Teslim notu eklenmedi.'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
                  Öğretmen Geri Bildirimi & Notu
                </label>
                <textarea
                  placeholder="Gruba tebrik veya geliştirme önerilerinizi yazınız..."
                  value={teacherFeedbackInput}
                  onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleGradeTask(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Geliştirme İste
              </button>
              <button
                type="button"
                onClick={() => handleGradeTask(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Onayla & Gruba +{reviewingTask.xpReward} XP Tanımla</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
