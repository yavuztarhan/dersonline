export interface StandaloneGame {
  id: string;
  title: string;
  category: 'math' | 'logic' | 'memory' | 'speed' | 'strategy';
  categoryLabel: string;
  categoryIcon: string;
  badge: string;
  badgeColor: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'İleri' | 'Tüm Seviyeler';
  duration: string;
  xpReward: number;
  playsCount: number;
  rating: number;
  gradient: string;
  isAvailable: boolean;
  comingSoon?: boolean;
}

export const STANDALONE_GAMES: StandaloneGame[] = [
  {
    id: 'carpim-tablosu',
    title: 'Çarpım Tablosu Çarpışması',
    category: 'math',
    categoryLabel: 'Matematik & Hız',
    categoryIcon: '✖️',
    badge: 'Aktif & Popüler 🌟',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: '1-10 arası sayıların çarpımını 20 saniye içinde en hızlı şekilde çözün. Her doğru cevapta +1 saniye ve ekstra puan kazanın!',
    difficulty: 'Tüm Seviyeler',
    duration: '20+ sn',
    xpReward: 100,
    playsCount: 24,
    rating: 5.0,
    gradient: 'from-teal-500 via-emerald-500 to-amber-500',
    isAvailable: true,
    comingSoon: false,
  },
  {
    id: 'zeka-bulmacasi',
    title: 'Geometri & Mantık Labirenti',
    category: 'logic',
    categoryLabel: 'Zeka & Strateji',
    categoryIcon: '🧠',
    badge: 'Yakında',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    description: 'Açı ve şekil bloklarını yerleştirerek çıkış yolunu bulun, geometrik düşünme becerinizi geliştirin.',
    difficulty: 'Orta',
    duration: '5 dk',
    xpReward: 100,
    playsCount: 0,
    rating: 4.9,
    gradient: 'from-teal-600 via-emerald-600 to-cyan-600',
    isAvailable: false,
    comingSoon: true,
  },
  {
    id: 'hafiza-kartlari',
    title: 'Kavram & Eşleştirme Kartları',
    category: 'memory',
    categoryLabel: 'Zeka & Hafıza',
    categoryIcon: '🃏',
    badge: 'Yakında',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    description: 'Matematiksel kavramlar, semboller ve tanımları doğru eşleştirerek hafıza puanlarını toplayın.',
    difficulty: 'Kolay',
    duration: '2-4 dk',
    xpReward: 50,
    playsCount: 0,
    rating: 4.8,
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    isAvailable: false,
    comingSoon: true,
  },
  {
    id: 'hiz-reaksiyon',
    title: 'Sayı Avcısı & Refleks',
    category: 'speed',
    categoryLabel: 'Hız & Dikkat',
    categoryIcon: '⚡',
    badge: 'Yakında',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    description: 'Ekrana gelen kurallara uygun sayıları en hızlı şekilde yakalayın, kombo çarpanlarını katlayın.',
    difficulty: 'İleri',
    duration: '2 dk',
    xpReward: 60,
    playsCount: 0,
    rating: 4.9,
    gradient: 'from-rose-600 via-red-600 to-amber-600',
    isAvailable: false,
    comingSoon: true,
  }
];
