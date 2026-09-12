'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  ClassroomFileRecord,
  getVisibleClassroomFilesForStudent,
  exportClassroomFileToPdf
} from '@/lib/class-files-store';
import { getPendingPeerEvaluationsForStudent } from '@/lib/peer-evaluation-store';
import { ClassLeaderboard } from '@/components/gamification/class-leaderboard';
import { StudentGroupsCard } from '@/components/student/student-groups-card';
import { StudentPeerEvaluationCard } from '@/components/student/student-peer-evaluation-card';
import { StudentBoardHistoryCard } from '@/components/student/student-board-history-card';
import { WhiteboardViewerModal } from '@/components/whiteboard/whiteboard-viewer-modal';
import { FeedbackButton } from '@/components/feedback/feedback-button';
import { MascotCharacter } from '@/components/mascot';
import { MASCOT_CONFIG } from '@/lib/mascot-config';
import {
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  School,
  FolderOpen,
  Download,
  Layers,
  Loader2,
  Search,
  Trophy,
  Users,
  Eye,
  FileText,
  Star,
  Flame,
  LayoutDashboard,
  Target
} from 'lucide-react';

const STUDENT_SUBJECTS = [
  { name: 'Matematik', icon: '📐', desc: 'Sayılar, Geometri & İşlemler' },
  { name: 'Fen Bilimleri', icon: '🔬', desc: 'Deneyler, Canlılar & Madde' },
  { name: 'Türkçe', icon: '📚', desc: 'Okuma, Yazma & Dilbilgisi' },
  { name: 'Sosyal Bilgiler', icon: '🌍', desc: 'Tarih, Kültür & Yaşam' },
  { name: 'İngilizce', icon: '🌐', desc: 'Vocabulary & Communication' },
  { name: 'Din Kültürü ve Ahlak Bilgisi', icon: '🕌', desc: 'Ahlak & Değerler' }
];

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const { studentPoints, studentBadges, playSound } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('Matematik');
  const [activeTab, setActiveTab] = useState<'overview' | 'board_history' | 'peer_eval' | 'groups' | 'leaderboard' | 'files'>('overview');
  const [files, setFiles] = useState<ClassroomFileRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'whiteboard_note' | 'activity_sheet'>('all');
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ClassroomFileRecord | null>(null);
  const [pendingPeerCount, setPendingPeerCount] = useState<number>(0);

  const student = currentUser && currentUser.role === 'student' ? currentUser : null;
  const studentClass = student?.classSection || '5-A';

  const studentSubjectXP = (student as any)?.subjectPoints?.[selectedSubject] ?? (selectedSubject === 'Matematik' ? (student?.points || studentPoints || 100) : 0);
  const studentTotalXP = student?.points || studentPoints || 100;

  const getMascotGreeting = (subj: string) => {
    switch (subj) {
      case 'Matematik':
        return '"Matematik yolculuğunda harika ilerliyorsun! Bugün hangi sırrı çözeceğiz?"';
      case 'Fen Bilimleri':
        return '"Fen Bilimleri dünyasındaki deneyler ve doğanın sırları seni bekliyor!"';
      case 'Türkçe':
        return '"Türkçe ile kelimelerin büyülü dünyasını keşfetmeye hazır mısın?"';
      case 'Sosyal Bilgiler':
        return '"Tarihin ve coğrafyanın izinde yeni maceralara atılalım!"';
      case 'İngilizce':
        return '"Let\'s learn and practice English together today!"';
      default:
        return `"${subj} dersinde başarı basamaklarını tırmanmaya devam et!"`;
    }
  };

  useEffect(() => {
    const visible = getVisibleClassroomFilesForStudent(studentClass, student);
    setFiles(visible);
    if (student?.id) {
      const pending = getPendingPeerEvaluationsForStudent(student.id);
      setPendingPeerCount(pending.length);
    }
  }, [studentClass, student]);

  const relevantFiles = files.filter((f) => {
    const isSheet =
      f.fileType === 'activity_sheet' ||
      f.tags?.includes('Etkinlik Kağıdı') ||
      f.id?.startsWith('file-activity-') ||
      f.title.toLowerCase().includes('etkinlik');

    const matchesType =
      fileTypeFilter === 'all' ||
      (fileTypeFilter === 'activity_sheet' && isSheet) ||
      (fileTypeFilter === 'whiteboard_note' && !isSheet);

    const matchesSearch =
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.outcomeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const handleDownloadFilePDF = async (file: ClassroomFileRecord) => {
    try {
      setDownloadingFileId(file.id);
      playSound('select');
      await exportClassroomFileToPdf(file, student?.school);
      playSound('success');
    } catch (err) {
      console.error('PDF indirme hatası:', err);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. STUDENT GAMIFIED HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <UserAvatar
            avatar={student?.avatar}
            name={student?.name}
            size="xl"
            className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-blue-400 bg-blue-500/20 text-blue-200 shadow-inner shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black">{student?.name || 'Çırak Hasan'}</h1>
              <span className="px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold text-xs">
                {student?.classSection || '5-A Sınıfı'} • No: #{student?.studentNumber || '104'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <School className="w-4 h-4 text-blue-400" />
                <span>{student?.school || 'Edirne Selimiye İmam Hatip Ortaokulu'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Selim Mascot & XP Pill */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end flex-wrap sm:flex-nowrap">
          
          {/* Selim Companion Greeting */}
          <div className="flex items-center gap-3.5 bg-white/10 border border-white/20 backdrop-blur-md p-3.5 rounded-2xl shadow-md hover:bg-white/15 transition-all">
            <div className="relative shrink-0 flex items-center justify-center">
              <MascotCharacter
                pose="pointing"
                size="lg"
                showBadge
                badgeText="Selim"
              />
            </div>
            <div className="max-w-[200px] space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  Öğrenme Yoldaşı
                </span>
              </div>
              <div className="text-xs text-slate-100 font-semibold leading-tight">
                {getMascotGreeting(selectedSubject)}
              </div>
            </div>
          </div>

          {/* XP / Point Pill & Feedback Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-400/40 backdrop-blur-sm flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
                ⚡
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <span>{selectedSubject} Puanın:</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  +{studentSubjectXP} XP
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Genel Toplam: +{studentTotalXP} XP
                </div>
              </div>
            </div>

            {/* Icon-Only Feedback Button */}
            <FeedbackButton
              contextTitle="Öğrenci Paneli"
              tooltip="Öğrenci Paneli & Dersler Hakkında Görüş Bildir"
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 shadow-sm transition-all cursor-pointer flex items-center justify-center active:scale-95"
              iconClassName="w-5 h-5 text-amber-300"
            />
          </div>

        </div>
      </div>

      {/* DERS SEÇİM ÇUBUĞU (SUBJECT SELECTOR) */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📚</span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">Ders Seçimi:</span>
            <span className="text-xs text-slate-500 font-medium">Görüntülemek istediğiniz dersi seçin</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black">
            Seçili Ders: {selectedSubject}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STUDENT_SUBJECTS.map((subj) => {
            const isSelected = selectedSubject === subj.name;
            const pts = (student as any)?.subjectPoints?.[subj.name] ?? (subj.name === 'Matematik' ? (student?.points || studentPoints || 100) : 0);

            return (
              <button
                key={subj.name}
                type="button"
                onClick={() => {
                  playSound('select');
                  setSelectedSubject(subj.name);
                }}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between border-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                    : 'bg-slate-50 hover:bg-white border-slate-200/80 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{subj.icon}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {pts} XP
                  </span>
                </div>
                <div className={`font-black text-xs leading-tight truncate ${
                  isSelected ? 'text-teal-950 font-black' : 'text-slate-800'
                }`}>
                  {subj.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXECUTIVE TABBED MODULE SWITCHER (6 Primary Sections) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-2 bg-slate-200/60 rounded-3xl border border-slate-300/70 shadow-inner">
        
        {/* Tab 1: Genel Bakış & Rozetler */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('overview');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'overview'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'overview' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200">
              {studentBadges.filter((b) => b.unlocked).length} Rozet
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'overview' ? 'text-teal-950' : 'text-slate-800'}`}>
              Genel Bakış
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Rozetler & Oyunlar
            </div>
          </div>
          {activeTab === 'overview' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* Tab 2: Tahtaya Kalkma & Başarım */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('board_history');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'board_history'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'board_history' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <Target className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black border border-teal-200">
              Karnem
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'board_history' ? 'text-teal-950' : 'text-slate-800'}`}>
              Tahtaya Kalkma
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Başarım & Rapor
            </div>
          </div>
          {activeTab === 'board_history' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* Tab 2: Akran Değerlendirme */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('peer_eval');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'peer_eval'
              ? 'bg-white shadow-md border-teal-600 ring-2 ring-teal-600/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'peer_eval' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {pendingPeerCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                {pendingPeerCount} Bekliyor
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200">
                +25 XP
              </span>
            )}
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'peer_eval' ? 'text-teal-950' : 'text-slate-800'}`}>
              Akran Değerlendirme
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Takım İncelemeleri
            </div>
          </div>
          {activeTab === 'peer_eval' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

        {/* Tab 3: Çalışma Gruplarım */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('groups');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'groups'
              ? 'bg-white shadow-md border-indigo-500 ring-2 ring-indigo-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'groups' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200">
              Takımım
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'groups' ? 'text-indigo-950' : 'text-slate-800'}`}>
              Çalışma Grubum
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Grup Ödevleri
            </div>
          </div>
          {activeTab === 'groups' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Tab 4: Sınıf Sıralaması */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('leaderboard');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'leaderboard'
              ? 'bg-white shadow-md border-amber-500 ring-2 ring-amber-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'leaderboard' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200">
              {studentClass}
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'leaderboard' ? 'text-amber-950' : 'text-slate-800'}`}>
              Sınıf Sıralaması
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              XP Lider Tablosu
            </div>
          </div>
          {activeTab === 'leaderboard' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-amber-500 rounded-full" />
          )}
        </button>

        {/* Tab 5: Sınıf Dosyaları & Notlar */}
        <button
          type="button"
          onClick={() => {
            playSound('select');
            setActiveTab('files');
          }}
          className={`relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-left flex flex-col justify-between border-2 ${
            activeTab === 'files'
              ? 'bg-white shadow-md border-teal-500 ring-2 ring-teal-500/10'
              : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-300/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeTab === 'files' ? 'bg-teal-600 text-white shadow-sm' : 'bg-teal-50 text-teal-700'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black border border-teal-200">
              {files.length} Dosya
            </span>
          </div>
          <div>
            <div className={`font-black text-xs leading-snug tracking-tight ${activeTab === 'files' ? 'text-teal-950' : 'text-slate-800'}`}>
              Sınıf Dosyaları
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
              Notlar & Etkinlikler
            </div>
          </div>
          {activeTab === 'files' && (
            <div className="absolute -bottom-[2px] left-4 right-4 h-1 bg-teal-600 rounded-full" />
          )}
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 3. TAB CONTENTS */}
      {/* ========================================================================= */}

      {/* TAB 1: OVERVIEW & BADGES */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Gamified Badges Showcase (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Rozet Vitrinim</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kazanımları, oyunları ve akran formlarını tamamlayarak yeni rozetler aç!
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black border border-amber-200">
                {studentBadges.filter((b) => b.unlocked).length} / {studentBadges.length} Kazanıldı
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                    badge.unlocked
                      ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      badge.unlocked ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 truncate">{badge.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access & Game Hub (1 Col) */}
          <div className="space-y-4">
            {/* Standalone Games Card */}
            <Link
              href="/games"
              onClick={() => playSound('click')}
              className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-teal-600 text-white shadow-md flex flex-col justify-between group hover:scale-[1.01] transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🎮
                </div>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Yeni Oyunlar
                </span>
              </div>
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>Oyun Salonu & Zeka Arenası</span>
                </h4>
                <p className="text-xs text-indigo-100 mt-1">
                  Çarpım Tablosu Hız Arenası, Matematik Çarkı ve refleks oyunlarıyla puanını katla!
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-white/20">
                <span className="text-teal-200">Hemen Oyna</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>

            {/* Board Participation Quick Access Card */}
            <div
              onClick={() => {
                playSound('select');
                setActiveTab('board_history');
              }}
              className="p-5 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white shadow-md flex items-center justify-between gap-3 group transition-all cursor-pointer hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center text-lg shrink-0">
                  🎯
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black truncate">
                    Tahtaya Kalkma & Gelişim Grafiğim
                  </div>
                  <div className="text-[11px] text-teal-100 truncate">
                    Başarı yüzdelerini ve PDF karneni incele
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
            </div>

            {/* Home Page Lessons Discovery Link */}
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="p-5 rounded-3xl bg-white border-2 border-teal-100 hover:border-teal-400 shadow-sm flex items-center justify-between gap-3 group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg shrink-0">
                  📐
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 truncate">
                    Tüm Maarif Dersleri
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Ana sayfadan haftalık ders akışlarına eriş
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

        </div>
      )}

      {/* TAB 2: BOARD PARTICIPATION HISTORY */}
      {activeTab === 'board_history' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <StudentBoardHistoryCard activeSubject={selectedSubject} />
        </div>
      )}

      {/* TAB 3: PEER EVALUATION */}
      {activeTab === 'peer_eval' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <StudentPeerEvaluationCard />
        </div>
      )}

      {/* TAB 3: GROUPS & TEAMWORK */}
      {activeTab === 'groups' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <StudentGroupsCard />
        </div>
      )}

      {/* TAB 4: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <ClassLeaderboard initialClassSection={studentClass} activeSubject={selectedSubject} />
        </div>
      )}

      {/* TAB 5: CLASSROOM FILES & WHITEBOARD ARCHIVE */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <FolderOpen className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {studentClass} Sınıfımın Ders Notları & Etkinlik Arşivi
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Öğretmeninin derste akıllı tahta üzerinde işlediği tüm çizimleri ve sınıfa gönderdiği etkinlik kağıtlarını buradan inceleyebilir ve PDF olarak indirebilirsin.
              </p>
            </div>

            {/* Filters: Search & Type */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
              {/* Type Filter */}
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="all">Tüm Dosyalar</option>
                <option value="whiteboard_note">📐 Beyaz Tahta Notları</option>
                <option value="activity_sheet">📝 Etkinlik Kağıtları</option>
              </select>

              {/* Mini Search */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Not veya konu ara..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {relevantFiles.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
              <div className="text-3xl">📂</div>
              <div className="font-bold text-slate-700 text-sm">Aramanıza uygun ders notu veya etkinlik kağıdı bulunamadı</div>
              <p>Öğretmenin akıllı tahtada ders notu kaydettiğinde veya etkinlik kağıdını sınıfa gönderdiğinde burada görünecek.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relevantFiles.map((file) => {
                const isSheet =
                  file.fileType === 'activity_sheet' ||
                  file.tags?.includes('Etkinlik Kağıdı') ||
                  file.id?.startsWith('file-activity-') ||
                  file.title.toLowerCase().includes('etkinlik');

                return (
                  <div
                    key={file.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-black uppercase">
                            {file.outcomeCode}
                          </span>
                          {/* Distinct Type Badge */}
                          {isSheet ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200 flex items-center gap-1">
                              <span>📝</span>
                              <span>Etkinlik Kağıdı</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-black border border-teal-200 flex items-center gap-1">
                              <span>📐</span>
                              <span>Beyaz Tahta</span>
                            </span>
                          )}
                        </div>
                        
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{file.pageCount} Sayfa</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {file.title}
                      </h4>

                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {file.outcomeTitle}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>{file.authorName}</span>
                        <span>{new Date(file.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      {/* 1. Görüntüle */}
                      <button
                        type="button"
                        onClick={() => {
                          playSound('select');
                          setViewingFile(file);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Ders notunu salt okunur modda tam ekran görüntüle"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600" />
                        <span>Görüntüle</span>
                      </button>

                      {/* 2. PDF İndir */}
                      <button
                        type="button"
                        onClick={() => handleDownloadFilePDF(file)}
                        disabled={downloadingFileId === file.id}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Bu ders notunu PDF olarak cihazına indir"
                      >
                        {downloadingFileId === file.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>İndiriliyor...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF İndir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Whiteboard Pure Read-Only Viewer Modal */}
      {viewingFile && (
        <WhiteboardViewerModal
          isOpen={!!viewingFile}
          onClose={() => setViewingFile(null)}
          file={viewingFile}
        />
      )}

    </div>
  );
}
