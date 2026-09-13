import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
// import { InstagramPromoStudio } from '@/components/promo/instagram-promo-studio';

export const metadata: Metadata = {
  title: 'Instagram Tanıtım Kiti & Slayt Stüdyosu – Maarif Akademi',
  description:
    'Türkiye Yüzyılı Maarif Modeli Matematik Platformu için hazırlanan 10 slaytlık Instagram tanıtım gönderisi, görsel şablonları ve kopyalanabilir açıklama metni.'
};

export default function TanitimPage() {
  // Geçici olarak yoruma alındı, daha sonra tekrar açılabilir:
  // return <InstagramPromoStudio />;
  notFound();
}

