'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import { UserAvatar } from '@/components/ui/user-avatar';
import { StudentUser } from '@/types/auth';
import {
  Trophy,
  Medal,
  Award,
  Zap,
  Sparkles,
  Flame,
  Star,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Crown,
  ChevronRight,
  Plus,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { StudentOutcomeDetailModal } from '@/components/gamification/student-outcome-detail-modal';

interface ClassLeaderboardProps {
  initialClassSection?: string;
  showTeacherControls?: boolean;
  availableClasses?: string[];
}

export function ClassLeaderboard({
  initialClassSection = '5-A',
  showTeacherControls = false,
  availableClasses
}: ClassLeaderboardProps) {
  const { currentUser, students, getVisibleStudents, awardPointsToStudent } = useAuth();
  const { playSound, addPoints } = useApp();

  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';
  const currentStudentId = isStudent ? currentUser?.id : null;

  // Teacher's registered classes strictly
  const teacherClasses: string[] = availableClasses && availableClasses.length > 0
    ? availableClasses
    : (currentUser as any)?.assignedClasses && (currentUser as any).assignedClasses.length > 0
      ? (currentUser as any).assignedClasses
      : [];

  // Selected Student for Detailed Outcome & Rubric Analytics Modal
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any | null>(null);

  // Initial class selection
  const defaultClass = isTeacher
    ? (teacherClasses.includes(initialClassSection) ? initialClassSection : teacherClasses[0] || initialClassSection)
    : initialClassSection;

  // Teacher Selected Class Filter & Search States
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [searchQuery, setSearchQuery] = useState('');
  const [rewardAmount, setRewardAmount] = useState<number>(25);

  // Sync if initialClassSection or teacherClasses change
  useEffect(() => {
    if (isTeacher) {
      if (initialClassSection && (teacherClasses.includes(initialClassSection) || initialClassSection === 'Tümü')) {
        setSelectedClass(initialClassSection);
      } else if (teacherClasses.length > 0 && selectedClass !== 'Tümü' && !teacherClasses.includes(selectedClass)) {
        setSelectedClass(teacherClasses[0]);
      }
    }
  }, [initialClassSection, teacherClasses, isTeacher]);

  // Student Own Class vs Teacher Selected Class (Students can ONLY see their own class)
  const studentClassSection = (currentUser as StudentUser)?.classSection || initialClassSection || '5-A';
  const effectiveClass = isStudent ? studentClassSection : selectedClass;

  // CLASS_OPTIONS strictly only from teacher's own registered classes!
  const CLASS_OPTIONS: string[] = isTeacher
    ? (teacherClasses.length > 1
        ? [...teacherClasses, 'Tümü']
        : teacherClasses.length === 1
          ? teacherClasses
          : [])
    : [studentClassSection];

  // Base students: For teachers, strictly only their visible registered students
  const baseStudents = isTeacher && currentUser?.role === 'teacher' && getVisibleStudents
    ? getVisibleStudents(currentUser)
    : students;

  // Filter & Sort Students by Points (XP)
  const filteredStudents = baseStudents
    .filter((s) => {
      const matchesClass = effectiveClass === 'Tümü'
        ? (isTeacher && teacherClasses.length > 0 ? teacherClasses.includes(s.classSection) : true)
        : s.classSection === effectiveClass;
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentNumber.includes(searchQuery);
      return matchesClass && matchesSearch;
    })
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const top3 = filteredStudents.slice(0, 3);

  // Student Rank Title Helper
  const getRankTitle = (points: number) => {
    if (points >= 600) return { title: 'Maarif Dehası', level: 'Seviye 6', color: 'from-amber-500 to-rose-600', icon: '👑' };
    if (points >= 450) return { title: 'Geometri Mimarı', level: 'Seviye 5', color: 'from-indigo-500 to-purple-600', icon: '💎' };
    if (points >= 300) return { title: 'Açı Ustası', level: 'Seviye 4', color: 'from-teal-500 to-emerald-600', icon: '⭐' };
    if (points >= 150) return { title: 'Matematik Kâşifi', level: 'Seviye 3', color: 'from-blue-500 to-cyan-600', icon: '🚀' };
    return { title: 'Genç Çırak', level: 'Seviye 1', color: 'from-slate-500 to-slate-700', icon: '🌱' };
  };

  const handleTeacherAwardXP = (studentId: string, amount: number = rewardAmount) => {
    playSound('bell');
    awardPointsToStudent(studentId, amount);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header with Title and Class Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Sınıf İçi Başarı Sıralaması & Lider Tablosu</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <span>Matematik Liderleri</span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-extrabold border border-teal-200">
              {effectiveClass === 'Tümü' ? 'Tüm Sınıflarım' : `${effectiveClass} Şubesi`}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isStudent
              ? `Yalnızca kayıtlı olduğunuz ${effectiveClass} şubesinin ders içi etkinlik ve oyun XP sıralaması gösterilmektedir.`
              : 'Ders içi oyunlar, bulmacalar ve değerlendirmelerden kazanılan XP puanlarına göre anlık sıralama.'}
          </p>
        </div>

        {/* Class Selection Tabs (Teachers / Admins) or Fixed Class Badge (Students) */}
        {isTeacher ? (
          CLASS_OPTIONS.length > 0 ? (
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-black self-stretch md:self-auto overflow-x-auto">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    playSound('select');
                    setSelectedClass(cls);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-slate-900 text-white shadow-sm font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {cls === 'Tümü' ? 'Tüm Sınıflarım' : `${cls} Şubesi`}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              Kayıtlı sınıfınız bulunmuyor
            </div>
          )
        ) : (
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 px-4 py-2.5 rounded-2xl shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm">
              🎓
            </div>
            <div>
              <div className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Kayıtlı Sınıfın</div>
              <div className="text-xs font-black text-slate-900">{effectiveClass} Şubesi Sıralaması</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. TOP 3 PODIUM DISPLAY */}
      {top3.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Zirvedeki Öğrenciler (İlk 3 Kürsüsü)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
            
            {/* 2nd Place (Silver) */}
            {top3[1] && (
              <div
                onClick={isTeacher ? () => {
                  playSound('select');
                  setSelectedStudentForDetail(top3[1]);
                } : undefined}
                className={`order-2 md:order-1 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-6 border-2 border-slate-300 shadow-sm flex flex-col items-center text-center relative group ${
                  isTeacher ? 'hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer' : 'cursor-default'
                }`}
                title={isTeacher ? "Kazanım Başarı ve Rubrik Karnesini İncele" : undefined}
              >
                <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-200 border-2 border-slate-400 text-slate-700 flex items-center justify-center font-black text-sm shadow-md">
                  🥈 2
                </div>
                <UserAvatar
                  avatar={top3[1].avatar}
                  name={top3[1].name}
                  size="lg"
                  className="w-16 h-16 border-2 border-slate-300 shadow-sm mt-2 group-hover:scale-105 transition-transform"
                />
                <h4 className="text-base font-black text-slate-900 mt-3 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                  <span>{top3[1].name}</span>
                  {isTeacher && <BarChart3 className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h4>
                <div className="text-xs text-slate-500 font-bold">{top3[1].classSection} • #{top3[1].studentNumber}</div>
                <div className="mt-3 px-3 py-1 rounded-xl bg-slate-200/80 text-slate-800 font-black text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{top3[1].points} XP</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">
                  {getRankTitle(top3[1].points).title}
                </div>
                {isTeacher && (
                  <div className="mt-2 text-[10px] font-extrabold text-teal-700 opacity-80 group-hover:opacity-100 flex items-center gap-1 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    <BarChart3 className="w-3 h-3 text-teal-600" />
                    <span>Kazanım Karnesini Gör</span>
                  </div>
                )}
              </div>
            )}

            {/* 1st Place (Gold - Taller & Highlighted) */}
            {top3[0] && (
              <div
                onClick={isTeacher ? () => {
                  playSound('select');
                  setSelectedStudentForDetail(top3[0]);
                } : undefined}
                className={`order-1 md:order-2 bg-gradient-to-b from-amber-50 via-yellow-50/60 to-amber-100/50 rounded-3xl p-6 sm:p-7 border-2 border-amber-400 shadow-xl flex flex-col items-center text-center relative group ${
                  isTeacher ? 'hover:scale-102 hover:border-amber-500 transition-all cursor-pointer' : 'cursor-default'
                }`}
                title={isTeacher ? "Kazanım Başarı ve Rubrik Karnesini İncele" : undefined}
              >
                <div className="absolute -top-5 px-3 py-1 rounded-full bg-amber-400 border-2 border-amber-500 text-slate-950 flex items-center gap-1 font-black text-xs shadow-lg animate-bounce">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>1. LİDER</span>
                </div>
                <UserAvatar
                  avatar={top3[0].avatar}
                  name={top3[0].name}
                  size="xl"
                  className="w-20 h-20 border-4 border-amber-400 shadow-lg ring-4 ring-amber-200 mt-2 group-hover:scale-105 transition-transform"
                />
                <h4 className="text-lg font-black text-slate-900 mt-3 group-hover:text-amber-800 transition-colors flex items-center gap-1">
                  <span>{top3[0].name}</span>
                  {isTeacher && <BarChart3 className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h4>
                <div className="text-xs text-amber-900 font-bold">{top3[0].classSection} • #{top3[0].studentNumber}</div>
                <div className="mt-3 px-4 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-base shadow-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{top3[0].points} XP</span>
                </div>
                <div className="text-xs text-amber-700 font-extrabold mt-1">
                  🏆 {getRankTitle(top3[0].points).title}
                </div>
                {isTeacher && (
                  <div className="mt-2 text-[10px] font-black text-slate-950 flex items-center gap-1 bg-amber-300/80 px-3 py-1 rounded-lg border border-amber-400 shadow-xs">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-950" />
                    <span>Kazanım Karnesini İncele</span>
                  </div>
                )}
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {top3[2] && (
              <div
                onClick={isTeacher ? () => {
                  playSound('select');
                  setSelectedStudentForDetail(top3[2]);
                } : undefined}
                className={`order-3 md:order-3 bg-gradient-to-b from-orange-50/50 to-amber-50/80 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col items-center text-center relative group ${
                  isTeacher ? 'hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer' : 'cursor-default'
                }`}
                title={isTeacher ? "Kazanım Başarı ve Rubrik Karnesini İncele" : undefined}
              >
                <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-200 border-2 border-amber-400 text-amber-900 flex items-center justify-center font-black text-sm shadow-md">
                  🥉 3
                </div>
                <UserAvatar
                  avatar={top3[2].avatar}
                  name={top3[2].name}
                  size="lg"
                  className="w-16 h-16 border-2 border-amber-300 shadow-sm mt-2 group-hover:scale-105 transition-transform"
                />
                <h4 className="text-base font-black text-slate-900 mt-3 group-hover:text-teal-700 transition-colors flex items-center gap-1">
                  <span>{top3[2].name}</span>
                  {isTeacher && <BarChart3 className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h4>
                <div className="text-xs text-slate-500 font-bold">{top3[2].classSection} • #{top3[2].studentNumber}</div>
                <div className="mt-3 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>{top3[2].points} XP</span>
                </div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">
                  {getRankTitle(top3[2].points).title}
                </div>
                {isTeacher && (
                  <div className="mt-2 text-[10px] font-extrabold text-teal-700 opacity-80 group-hover:opacity-100 flex items-center gap-1 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    <BarChart3 className="w-3 h-3 text-teal-600" />
                    <span>Kazanım Karnesini Gör</span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. RANKINGS TABLE & LIST VIEW */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Tüm Sınıf Sıralaması ({filteredStudents.length} Öğrenci)
            {isTeacher && (
              <> • <span className="text-teal-700 font-bold">Öğrenciye tıklayarak karnesini açabilirsiniz</span></>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Öğrenci adı veya no ara..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 space-y-2">
              <div className="text-3xl">🏆</div>
              <div className="font-bold text-sm text-slate-700">
                {effectiveClass === 'Tümü' ? 'Kayıtlı öğrenci bulunmuyor.' : `${effectiveClass} şubesinde henüz kayıtlı öğrenci bulunmuyor.`}
              </div>
              <div className="text-xs text-slate-400">
                Öğrenciler puan (XP) kazandıkça liderlik sıralaması burada listelenecektir.
              </div>
            </div>
          ) : (
            filteredStudents.map((student, idx) => {
            const rank = idx + 1;
            const rankInfo = getRankTitle(student.points);
            const isMe = currentStudentId === student.id;

            return (
              <div
                key={student.id}
                onClick={isTeacher ? () => {
                  playSound('select');
                  setSelectedStudentForDetail(student);
                } : undefined}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isTeacher ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isMe
                    ? 'bg-teal-50/80 border-teal-400 ring-2 ring-teal-400 shadow-md scale-101'
                    : rank <= 3
                    ? isTeacher
                      ? 'bg-slate-50/60 border-slate-200 hover:bg-teal-50/40 hover:border-teal-300 hover:shadow-sm'
                      : 'bg-slate-50/60 border-slate-200'
                    : isTeacher
                    ? 'bg-white border-slate-200/80 hover:bg-teal-50/30 hover:border-teal-300 hover:shadow-sm'
                    : 'bg-white border-slate-200/80'
                }`}
                title={isTeacher ? `${student.name} - Kazanım Başarı ve Rubrik Karnesini Aç` : undefined}
              >
                {/* Left: Rank + Avatar + Name */}
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : rank === 3
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    #{rank}
                  </div>

                  <UserAvatar
                    avatar={student.avatar}
                    name={student.name}
                    size="md"
                    className={`w-10 h-10 border border-slate-200 shrink-0 ${isTeacher ? 'group-hover:scale-105 transition-transform' : ''}`}
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-black text-slate-900 text-sm ${isTeacher ? 'group-hover:text-teal-800 transition-colors' : ''}`}>
                        {student.name}
                      </span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-black">
                          Sen
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-slate-400">
                        {student.classSection} • #{student.studentNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">
                        {rankInfo.icon} {rankInfo.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        🏆 {student.unlockedBadges?.length || 1} Rozet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: XP Score, Detail Button & Optional Teacher Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-amber-600 flex items-center justify-end gap-1">
                      <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{student.points} XP</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">Toplam Başarı Puanı</div>
                  </div>

                  {/* Teacher Detail Badge Button */}
                  {isTeacher && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('select');
                        setSelectedStudentForDetail(student);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-2xs"
                      title="Kazanım Karnesini Görüntüle"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
                      <span className="hidden md:inline">Kazanım Karnesi</span>
                      <ChevronRight className="w-3 h-3 text-teal-500" />
                    </button>
                  )}

                  {/* Teacher Quick Award XP Button */}
                  {isTeacher && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeacherAwardXP(student.id, rewardAmount);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                      title="Öğrenciye derse katılımı için +25 XP ödülü ver"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-600" />
                      <span>+25 XP</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* STUDENT DETAILED OUTCOME & RUBRIC COMPARISON MODAL (TEACHER ONLY) */}
      {isTeacher && (
        <StudentOutcomeDetailModal
          isOpen={!!selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          student={selectedStudentForDetail}
          allStudents={baseStudents}
          onAwardXp={handleTeacherAwardXP}
          isTeacher={isTeacher}
        />
      )}

    </div>
  );
}
