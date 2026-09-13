export interface AnnouncementItem {
  id: string;
  badge: string;
  badgeColor: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  title: string;
  description: string;
  date: string;
  isNew?: boolean;
  link?: string;
  linkText?: string;
  icon: 'book' | 'game' | 'pen' | 'sparkles';
}

export const LATEST_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-mat-723',
    badge: 'Yeni Ders Akışı',
    badgeColor: 'indigo',
    title: 'MAT 7.2.3 / 7.1.2 Ders Akışı Eklendi',
    description: '7. Sınıf Rasyonel Sayılar konusuna ait hikâye görselleri, keşif laboratuvarı ve çift taraflı etkinlik kağıdı yayına alındı.',
    date: 'Yeni Eklendi',
    isNew: true,
    link: '/lesson/MAT.7.1.2',
    linkText: 'Ders Akışını Başlat',
    icon: 'book'
  },
  {
    id: 'ann-rational-game',
    badge: 'Genel Oyunlar',
    badgeColor: 'emerald',
    title: 'Rasyonel Sayılar Karşılaştırma Oyunu Eklendi',
    description: 'Genel Oyunlar Merkezine kademelere (5, 6, 7, 8. Sınıf) göre filtrelenebilir yeni matematik oyunları ve interaktif laboratuvar modülü eklendi.',
    date: 'Yeni Oyun',
    isNew: true,
    link: '/games',
    linkText: 'Oyunları Oyna',
    icon: 'game'
  },
  {
    id: 'ann-pen-upgrade',
    badge: 'Araç İyileştirmesi',
    badgeColor: 'amber',
    title: 'Kalem Aracında İyileştirme Yapıldı',
    description: 'Ders akışlarındaki dijital çizim ve kalem motoru yenilendi. Akıllı tahta dokunmatik ekranları ve fare çizimleri artık anında ve pürüzsüz tepki veriyor.',
    date: 'Güncellendi',
    isNew: true,
    link: '/lesson/MAT.5.3.1',
    linkText: 'Tahtada Test Et',
    icon: 'pen'
  }
];
