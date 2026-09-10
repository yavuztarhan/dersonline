/**
 * Maarif Akademi Maskot Yapılandırması & Özellik Bayrağı (Feature Flag)
 * 
 * Bu dosya, platformun maskotu "Selim" (Anadolu'nun Matematik Dahisi) ile ilgili
 * tüm görsel, metin ve durum yönetimini tek bir merkezden kontrol eder.
 * 
 * EĞER MASKOT ÖZELLİĞİNDEN VAZGEÇİLİRSE:
 * Sadece `enabled: false` yapmak veya ortam değişkenine `NEXT_PUBLIC_ENABLE_MASCOT=false`
 * vermek yeterlidir. Tüm maskot bileşenleri sayfaların düzenini bozmadan otomatik olarak
 * devre dışı kalır ve sistem eski yalın haline döner.
 */

export type MascotPose =
  | 'proud'      // Kendinden emin, gururlu (Hoş geldin, Profil, Seviye)
  | 'pointing'   // Hedefi işaret eden, azimli (Hedef, Yönlendirme, Başlangıç)
  | 'success'    // Başarmış, kolları havada (Rozet, Puan, Tebrik)
  | 'curious'    // Merakla gökyüzüne/geleceğe bakan (Keşif, Hikaye)
  | 'running'    // Heyecanla koşan, projeleri olan (Hızlı eylem, Derse başla)
  | 'thinking'   // Derin düşünceli, kafasında hesaplar (İpucu, Bulmaca, Problem)
  | 'farewell'   // Selam verip gülümseyen (Çıkış bileti, Günlük, Yansıtma)
  | 'measuring'; // Pusula/pergel ile ölçüm yapan (Atölye, Çizim, Geometri)

export interface MascotConfig {
  enabled: boolean;
  name: string;
  title: string;
  role: string;
  origin: string;
  bio: string;
  poses: Record<MascotPose, string>;
  quotes: {
    heroWelcome: string;
    storyIntro: string;
    labCompass: string;
    thinkingHint: string;
    puzzleCheer: string;
    celebrateXP: string;
    exitJournal: string;
    teacherHelp: string;
  };
}

export const MASCOT_CONFIG: MascotConfig = {
  // Global Açma/Kapama: İster buradan false yapın, ister NEXT_PUBLIC_ENABLE_MASCOT=false verin
  enabled: process.env.NEXT_PUBLIC_ENABLE_MASCOT !== 'false',
  name: 'Selim',
  title: "Anadolu'nun Matematik Dahisi",
  role: 'Maarif Öğrenme Yoldaşı & Genç Geometri Çırağı',
  origin: "Anadolu'nun bereketli topraklarından bilimin ve fennin ışığına koşan çalışkan bir Türk genci",
  bio: "Meraklı, çalışkan ve azimli. Geometriyi doğadaki düzenle, sayıları ise hayatın ritmiyle keşfetmeyi çok sever.",
  
  poses: {
    proud: '/mascot/selim-proud.png',
    pointing: '/mascot/selim-pointing.png',
    success: '/mascot/selim-success.png',
    curious: '/mascot/selim-curious.png',
    running: '/mascot/selim-running.png',
    thinking: '/mascot/selim-thinking.png',
    farewell: '/mascot/selim-farewell.png',
    measuring: '/mascot/selim-measuring.png',
  },

  quotes: {
    heroWelcome: 'Matematik evrenin gizli alfabesidir! Bugün hangi sırrı birlikte çözeceğiz?',
    storyIntro: 'Tarihin ve doğanın izinde bir geometri yolculuğuna çıkmaya hazır mısın?',
    labCompass: 'Pergel ve iletkin elinde mi? Hassas ölçümlerle harikalar inşa edebiliriz!',
    thinkingHint: 'Her karmaşık problemin ardında sade ve zarif bir matematik kuralı saklıdır.',
    puzzleCheer: 'Harika bir zihin jimnastiği! Doğru bağlantıyı kurdun!',
    celebrateXP: 'Tebrikler! Azmin ve sabrınla bir Maarif rozetini daha hak ettin!',
    exitJournal: 'Öğrendiklerini günlüğüne dökmek, bilginin zihninde kök salmasını sağlar.',
    teacherHelp: 'Öğretmenim, akıllı tahtadaki bu adım için kavram yanılgısı tüyolarını derledim!',
  },
};

export function isMascotEnabled(): boolean {
  return MASCOT_CONFIG.enabled;
}
