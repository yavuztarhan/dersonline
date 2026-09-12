'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/auth-store';
import { useApp } from '@/lib/store';
import {
  MessageRecord,
  getInboxForUser,
  getSentForUser,
  getUnreadMessageCount,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  canUserMessageRecipient,
  DAILY_MESSAGE_LIMIT,
  getRemainingDailyMessages,
  getDailySentMessageCount,
  formatMessageDateTime,
  syncMessagesWithDatabase
} from '@/lib/message-store';
import { checkContentSafety } from '@/lib/profanity-filter';
import { UserAvatar } from '@/components/ui/user-avatar';
import {
  Mail,
  Send,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Reply,
  X,
  Plus,
  Search,
  Clock,
  ShieldCheck,
  User,
  School,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface MessageInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'inbox' | 'sent' | 'compose';
  prefilledRecipientId?: string;
  /** If set, recipient is locked and cannot be changed (direct message from student list) */
  lockedRecipientId?: string;
}

export function MessageInboxModal({
  isOpen,
  onClose,
  defaultTab = 'inbox',
  prefilledRecipientId,
  lockedRecipientId
}: MessageInboxModalProps) {
  const { currentUser, teachers, students, admins, getVisibleStudents } = useAuth();
  const { playSound } = useApp();

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>(defaultTab);
  const [inboxMessages, setInboxMessages] = useState<MessageRecord[]>([]);
  const [sentMessages, setSentMessages] = useState<MessageRecord[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Compose State
  const [recipientId, setRecipientId] = useState<string>(lockedRecipientId || prefilledRecipientId || '');
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [composeError, setComposeError] = useState<string | null>(null);
  const [composeSuccess, setComposeSuccess] = useState<boolean>(false);

  // Class/section filter for teacher compose tab (e.g. "5-A", "6-B", "all")
  const [classSectionFilter, setClassSectionFilter] = useState<string>('all');

  const userId = currentUser?.id || 'guest';
  const userRole = currentUser?.role || 'student';


  // Load messages
  const reloadMessages = () => {
    if (!currentUser) return;
    const inbox = getInboxForUser(userId);
    const sent = getSentForUser(userId);
    setInboxMessages(inbox);
    setSentMessages(sent);

    // Veritabanı ile çift yönlü arka plan senkronizasyonu
    syncMessagesWithDatabase(userId, currentUser.email).then(() => {
      setInboxMessages(getInboxForUser(userId));
      setSentMessages(getSentForUser(userId));
    });
  };

  useEffect(() => {
    if (isOpen) {
      reloadMessages();
      setClassSectionFilter('all');
      if (lockedRecipientId) {
        setRecipientId(lockedRecipientId);
        setActiveTab('compose');
      } else {
        setActiveTab(defaultTab);
        if (prefilledRecipientId) {
          setRecipientId(prefilledRecipientId);
          setActiveTab('compose');
        }
      }
    }
  }, [isOpen, defaultTab, prefilledRecipientId, lockedRecipientId, userId]);


  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build Hierarchically Allowed Recipient List (Admins strictly hidden from recipient dropdown)
  const allowedRecipients = React.useMemo(() => {
    if (!currentUser) return [];

    const list: { id: string; name: string; role: 'admin' | 'teacher' | 'student'; roleLabel: string; avatar: string; extraInfo?: string; classSection?: string }[] = [];

    // 1. If Admin: Can message Teachers (Admins not shown as recipients)
    if (userRole === 'admin') {
      teachers.forEach((t) => {
        list.push({
          id: t.id,
          name: t.name,
          role: 'teacher',
          roleLabel: 'Öğretmen',
          avatar: t.avatar || '👨‍🏫',
          extraInfo: `${t.school || 'Okul'} (${t.branch || 'Matematik'})`
        });
      });
    }

    // 2. If Teacher: Can message visible Students only (Admins hidden from recipient list)
    if (userRole === 'teacher') {
      const visible = getVisibleStudents(currentUser);
      visible.forEach((s) => {
        list.push({
          id: s.id,
          name: s.name,
          role: 'student',
          roleLabel: 'Öğrenci',
          avatar: s.avatar || '🎓',
          extraInfo: `${s.classSection || '5-A'} • No: ${s.studentNumber || '-'}`,
          classSection: s.classSection || ''
        });
      });
    }

    // 3. If Student: Can message Teachers only (Admins hidden from recipient list)
    if (userRole === 'student') {
      teachers.forEach((t) => {
        list.push({
          id: t.id,
          name: t.name,
          role: 'teacher',
          roleLabel: 'Öğretmen',
          avatar: t.avatar || '👨‍🏫',
          extraInfo: `${t.school || 'Okul'} (${t.branch || 'Matematik'})`
        });
      });
    }

    return list;
  }, [currentUser, userRole, teachers, getVisibleStudents]);

  // Unique class sections for filter dropdown (teacher only)
  const classSectionOptions = React.useMemo(() => {
    if (userRole !== 'teacher') return [];
    const sections = new Set<string>();
    allowedRecipients.forEach((r) => { if (r.classSection) sections.add(r.classSection); });
    return Array.from(sections).sort((a, b) => a.localeCompare(b, 'tr-TR', { numeric: true }));
  }, [allowedRecipients, userRole]);

  // Recipients filtered by class section (when teacher role)
  const filteredRecipients = React.useMemo(() => {
    if (userRole !== 'teacher' || classSectionFilter === 'all') return allowedRecipients;
    return allowedRecipients.filter((r) => r.classSection === classSectionFilter);
  }, [allowedRecipients, classSectionFilter, userRole]);


  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const unreadCount = inboxMessages.filter((m) => !m.read).length;

  // Real-time Content Safety check
  const safetyStatus = checkContentSafety(content);
  const remainingChars = 300 - content.length;
  const remainingDaily = getRemainingDailyMessages(userId);

  const handleOpenMessage = (msg: MessageRecord) => {
    setSelectedMessage(msg);
    if (!msg.read && msg.receiverId === userId) {
      markMessageAsRead(msg.id);
      reloadMessages();
    }
  };

  const handleDeleteMsg = (msgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    deleteMessage(msgId);
    if (selectedMessage?.id === msgId) setSelectedMessage(null);
    reloadMessages();
  };

  const handleStartReply = (msg: MessageRecord) => {
    const replyTargetId = msg.senderId;
    setRecipientId(replyTargetId);
    setSubject(msg.title.startsWith('Ynt:') ? msg.title : `Ynt: ${msg.title}`);
    setContent('');
    setSelectedMessage(null);
    setActiveTab('compose');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setComposeError(null);

    if (remainingDaily <= 0) {
      setComposeError(`Günlük ${DAILY_MESSAGE_LIMIT} mesaj gönderme sınırına ulaştınız. Yarın tekrar mesaj gönderebilirsiniz.`);
      return;
    }

    if (!recipientId) {
      setComposeError('Lütfen mesaj göndermek istediğiniz kişiyi seçiniz.');
      return;
    }

    const targetRecipient = allowedRecipients.find((r) => r.id === recipientId);
    if (!targetRecipient) {
      setComposeError('Geçersiz alıcı seçimi veya yetki kısıtlaması.');
      return;
    }

    if (!content.trim()) {
      setComposeError('Lütfen mesaj metnini yazınız.');
      return;
    }

    if (!safetyStatus.isClean) {
      setComposeError(safetyStatus.warningMessage || 'Mesajınız uygunsuz ifadeler içerdiği için iletilemez.');
      return;
    }

    const res = sendMessage({
      senderId: userId,
      senderName: currentUser?.name || 'Kullanıcı',
      senderRole: userRole,
      senderAvatar: currentUser?.avatar || (userRole === 'student' ? '🎓' : '👨‍🏫'),
      receiverId: targetRecipient.id,
      receiverName: targetRecipient.name,
      receiverRole: targetRecipient.role,
      title: subject.trim() || 'Genel Mesaj',
      content: content.trim()
    });

    if (!res.success) {
      setComposeError(res.error || 'Mesaj gönderilemedi.');
      return;
    }

    playSound('success');
    setComposeSuccess(true);
    setContent('');
    setSubject('');
    reloadMessages();

    setTimeout(() => {
      setComposeSuccess(false);
      setActiveTab('sent');
    }, 900);
  };

  // Filtered lists
  const filteredInbox = inboxMessages.filter(
    (m) =>
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSent = sentMessages.filter(
    (m) =>
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[90vh] max-h-[750px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              ✉️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Maarif İletişim & Mesaj Merkezi
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                    {unreadCount} Yeni
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {userRole === 'admin'
                  ? 'Yönetici İletişim Portalı'
                  : userRole === 'teacher'
                  ? 'Öğretmen İletişim & Öğrenci Bildirim Masası'
                  : 'Öğretmenime Soru & Mesaj İletişimi'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Kapat (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-6 pt-3 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('inbox');
                setSelectedMessage(null);
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'inbox'
                  ? 'border-teal-600 text-teal-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Inbox className="w-4 h-4 text-teal-600" />
              <span>Gelen Kutusu</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-teal-600 text-white rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('sent');
                setSelectedMessage(null);
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'sent'
                  ? 'border-teal-600 text-teal-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Send className="w-4 h-4 text-indigo-600" />
              <span>Giden Kutusu</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('compose');
                setSelectedMessage(null);
              }}
              className={`px-4 py-2.5 rounded-t-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                activeTab === 'compose'
                  ? 'border-teal-600 text-teal-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Yeni Mesaj Yaz</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* ========================================================= */}
          {/* TAB 1: GELEN KUTUSU (INBOX) */}
          {/* ========================================================= */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Gelen mesajlarda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Message List or Detail Reader */}
              {selectedMessage ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>← Mesaj Listesine Dön</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartReply(selectedMessage)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5 text-teal-600" />
                        <span>Yanıtla</span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteMsg(selectedMessage.id, e)}
                        className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Mesajı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                    <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {selectedMessage.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Gönderen: {selectedMessage.senderName}</span>
                      <span>•</span>
                      <span>{formatMessageDateTime(selectedMessage.createdAt)}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>
                </div>
              ) : filteredInbox.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredInbox.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                        !msg.read
                          ? 'bg-teal-50/50 border-teal-200 hover:border-teal-400 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-base flex items-center justify-center shrink-0 border border-slate-200">
                          {msg.senderAvatar || '✉️'}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-xs text-slate-900 truncate">
                              {msg.senderName}
                            </span>
                            {!msg.read && (
                              <span className="px-2 py-0.2 rounded-full bg-teal-600 text-white font-black text-[9px]">
                                Yeni
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {msg.title}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                            {msg.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold">
                          {formatMessageDateTime(msg.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleDeleteMsg(msg.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                  <div className="text-3xl">📭</div>
                  <div className="font-black text-sm text-slate-700">Gelen Kutunuz Boş</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Henüz size gönderilmiş bir mesaj bulunmamaktadır.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: GİDEN KUTUSU (SENT) */}
          {/* ========================================================= */}
          {activeTab === 'sent' && (
            <div className="space-y-4">
              
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Gönderilen mesajlarda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {filteredSent.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredSent.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">Alıcı:</span>
                          <span className="font-black text-xs text-slate-900">{msg.receiverName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {formatMessageDateTime(msg.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800">{msg.title}</div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                  <div className="text-3xl">📤</div>
                  <div className="font-black text-sm text-slate-700">Giden Mesaj Bulunmuyor</div>
                  <p className="text-xs text-slate-400">
                    Henüz kimseye mesaj göndermediniz.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: YENİ MESAJ YAZ (COMPOSE) */}
          {/* ========================================================= */}
          {activeTab === 'compose' && (
            <form onSubmit={handleSendMessage} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Daily Quota Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Yeni Mesaj Oluştur</h4>
                    <p className="text-[10px] text-slate-500">
                      {userRole === 'student' ? 'Öğretmeninize ders ve ödev sorularınızı iletebilirsiniz.' : 'Hiyerarşik kurallar dahilinde mesaj iletin.'}
                    </p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 shadow-2xs ${
                  remainingDaily > 0
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  <span>⚡ Günlük Mesaj Hakkı:</span>
                  <span className={`px-1.5 py-0.2 rounded-md ${
                    remainingDaily > 0 ? 'bg-teal-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {remainingDaily} / {DAILY_MESSAGE_LIMIT}
                  </span>
                </div>
              </div>

              {/* If Daily Quota Reached Banner */}
              {remainingDaily <= 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Günlük Mesajlaşma Sınırına Ulaştınız (5/5)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    Topluluk ve iletişim düzenini korumak amacıyla her kullanıcı günde en fazla <strong>5 mesaj</strong> gönderebilir. Yeni mesaj hakkınız her gece saat <strong>00:00</strong>'da otomatik olarak sıfırlanacaktır.
                  </p>
                </div>
              )}

              {composeSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mesajınız başarıyla iletildi!</span>
                </div>
              )}

              {composeError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{composeError}</span>
                </div>
              )}

              {/* Recipient Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Alıcı Seçiniz</span>
                  <span className="text-[10px] text-teal-700 font-bold">
                    {userRole === 'student'
                      ? 'Yalnızca Öğretmenlerinize mesaj yazabilirsiniz'
                      : userRole === 'teacher'
                      ? 'Yalnızca Kayıtlı Öğrencilerinize mesaj yazabilirsiniz'
                      : 'Öğretmen Listesi'}
                  </span>
                </label>

                {/* Locked recipient badge (direct message from student list) */}
                {lockedRecipientId ? (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-teal-50 border border-teal-300 rounded-xl">
                    <span className="text-base">{allowedRecipients.find(r => r.id === lockedRecipientId)?.avatar || '🎓'}</span>
                    <span className="font-black text-xs text-teal-900">
                      {allowedRecipients.find(r => r.id === lockedRecipientId)?.name || 'Öğrenci'}
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold ml-1">
                      {allowedRecipients.find(r => r.id === lockedRecipientId)?.extraInfo || ''}
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[9px] font-black uppercase tracking-wide">Sabit Alıcı</span>
                  </div>
                ) : (
                  <>
                    {/* Class/Section filter for teacher */}
                    {userRole === 'teacher' && classSectionOptions.length > 0 && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-500">Şubeye Göre Filtrele:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => { setClassSectionFilter('all'); setRecipientId(''); }}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${classSectionFilter === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Tümü
                          </button>
                          {classSectionOptions.map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => { setClassSectionFilter(sec); setRecipientId(''); }}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all cursor-pointer ${classSectionFilter === sec ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              {sec}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <select
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      disabled={remainingDaily <= 0}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">-- Lütfen Alıcı Seçiniz --</option>
                      {filteredRecipients.map((rec) => (
                        <option key={rec.id} value={rec.id}>
                          {rec.avatar} {rec.name} ({rec.roleLabel}) {rec.extraInfo ? `- ${rec.extraInfo}` : ''}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>


              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Mesaj Konusu
                </label>
                <input
                  type="text"
                  placeholder="Örn: Grup Ödevi veya Kazanım Sorusu"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={remainingDaily <= 0}
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Message Content with 300 char limiter and live profanity filter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Mesajınız (Maks. 300 Karakter)
                  </label>
                  <span className={`text-[11px] font-bold ${remainingChars < 30 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {content.length} / 300
                  </span>
                </div>
                <textarea
                  placeholder={remainingDaily > 0 ? "Mesajınızı nezaket ve saygı kurallarına uygun şekilde yazınız..." : "Günlük mesaj limitine ulaştınız."}
                  value={content}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      setContent(e.target.value);
                      if (composeError) setComposeError(null);
                    }
                  }}
                  disabled={remainingDaily <= 0}
                  rows={5}
                  className={`w-full p-3.5 bg-slate-50 border rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    !safetyStatus.isClean
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'
                  }`}
                  required
                />
              </div>

              {/* Live Safety Warning if bad word typed */}
              {!safetyStatus.isClean && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Uygunsuz veya kural dışı kelime algılandı. Lütfen mesajınızı düzeltiniz.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={remainingDaily <= 0 || !safetyStatus.isClean || !content.trim() || !recipientId}
                  className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                    remainingDaily > 0 && safetyStatus.isClean && content.trim() && recipientId
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Mesajı Gönder</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}
