import { getAcademicWeek, getAcademicWeekLabel, AcademicWeek } from "./academic-calendar";

export interface AnnualPlanItem {
  ay: string;
  hafta: string;
  haftaNo: number;
  saat: string;
  unite: string;
  konu: string;
  ogrenme_ciktisi: string;
  outcomeCode: string;
  surec_bilesenleri: string;
  ogrenme_kanitlari: string;
  sosyal_ve_duygusal_beceriler: string;
  degerler: string;
  okuryazarlik_becerileri: string;
  degerlendirme: string;
  farklilastirma?: string;
  okul_temelli_planlama?: string;
  gradeLevel: number;
}

/**
 * Yardımcı oluşturucu fonksiyon:
 * Haftalık tarih ve ay bilgilerini merkezi akademik takvimden (lib/academic-calendar.ts) dinamik çeker.
 */
function createPlanItem(
  haftaNo: number,
  gradeLevel: number,
  data: {
    saat?: string;
    unite: string;
    konu: string;
    ogrenme_ciktisi: string;
    outcomeCode: string;
    surec_bilesenleri: string;
    ogrenme_kanitlari: string;
    sosyal_ve_duygusal_beceriler: string;
    degerler: string;
    okuryazarlik_becerileri: string;
    degerlendirme?: string;
    farklilastirma?: string;
    okul_temelli_planlama?: string;
  }
): AnnualPlanItem {
  const weekInfo = getAcademicWeek(haftaNo);
  return {
    ay: weekInfo ? weekInfo.month : "",
    hafta: weekInfo ? weekInfo.label : `${haftaNo}. HAFTA`,
    haftaNo,
    saat: data.saat ? (data.saat.includes("SAAT") ? data.saat : `${data.saat} SAAT`) : (weekInfo ? weekInfo.lessonHours : "5 SAAT"),
    unite: data.unite,
    konu: data.konu,
    ogrenme_ciktisi: data.ogrenme_ciktisi,
    outcomeCode: data.outcomeCode,
    surec_bilesenleri: data.surec_bilesenleri,
    ogrenme_kanitlari: data.ogrenme_kanitlari,
    sosyal_ve_duygusal_beceriler: data.sosyal_ve_duygusal_beceriler,
    degerler: data.degerler,
    okuryazarlik_becerileri: data.okuryazarlik_becerileri,
    degerlendirme: (data.degerlendirme && data.degerlendirme.trim().length > 0) ? data.degerlendirme : (weekInfo ? weekInfo.specialEvent : ""),
    farklilastirma: data.farklilastirma || "",
    okul_temelli_planlama: data.okul_temelli_planlama || "",
    gradeLevel
  };
}

/**
 * 5. Sınıf Yıllık Plan Verisi (MEB Türkiye Yüzyılı Maarif Modeli)
 */
export const ANNUAL_PLAN_5TH_GRADE: AnnualPlanItem[] = [
  createPlanItem(1, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Temel Geometrik Çizimler ve İnşalar",
      "ogrenme_ciktisi": "MAT.5.3.1. Temel geometrik çizimler için matematiksel araç ve teknolojiden yararlanabilme",
      "outcomeCode": "MAT.5.3.1",
      "surec_bilesenleri": "a) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikme çiziminde gerekli araç ve teknolojileri tanır. b) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikmeyi oluşturmak için uygun olan araç ve teknolojileri belirler. c) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikmeyi oluşturmak için uygun araç ve teknolojileri kullanır.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "2026-2027 Eğitim-Öğretim yılı başlangıcı"
  }),
  createPlanItem(2, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Temel Geometrik Çizimler ve İnşalar",
      "ogrenme_ciktisi": "MAT.5.3.2. Temel geometrik çizimlere dayalı deneyimlerini yansıtabilme",
      "outcomeCode": "MAT.5.3.2",
      "surec_bilesenleri": "a) Temel geometrik çizimlere dayalı deneyimlerini gözden geçirir. b) Temel geometrik çizimlerin özelliklerine yönelik çıkarım yapar. c) Çıkarımını farklı örnekler üzerinden değerlendirir.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(3, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Açı Ölçme",
      "ogrenme_ciktisi": "MAT.5.3.3. Açıları ölçmek için matematiksel araç ve teknolojiden yararlanabilme",
      "outcomeCode": "MAT.5.3.3",
      "surec_bilesenleri": "a) Açı ölçmek için gerekli araç ve teknolojiyi tanır. b) Açı ölçmek için uygun araç ve teknolojiyi belirler. c) Açı ölçmek için uygun araç ve teknolojiyi kullanır.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(4, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Açı Ölçme",
      "ogrenme_ciktisi": "MAT.5.3.4. Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair çıkarım yapabilme",
      "outcomeCode": "MAT.5.3.4",
      "surec_bilesenleri": "a) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair varsayımlarda bulunur. b) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşan açıları belirleyerek listeler. c) Belirlediği açıları varsayımlarıyla karşılaştırır. ç) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşan açılara dair önerme sunar. d) Sunduğu önermelerin, doğruların oluşturduğu açıların incelenmesine yönelik katkısına dair gerekçe sunar.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(5, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Çokgenler ve Çember",
      "ogrenme_ciktisi": "MAT.5.3.5. Çokgenleri düzlemde ardışık olarak kesişen doğruların oluşturduğu kapalı şekiller olarak yorumlayabilme",
      "outcomeCode": "MAT.5.3.5",
      "surec_bilesenleri": "a) Düzlemde en az üç doğrunun -son doğru ilk doğruyla kesişecek biçimde- ardışık kesişerek oluşturdukları durumları inceler. b) Düzlemde en az üç doğrunun - son doğru ilk doğruyla kesişecek biçimde - ardışık kesişimleri ile çeşitli çokgenler oluşturur. c) Çokgenlerin düzlemde en az üç doğrunun -son doğru ilk doğruyla kesişecek biçimde ardışık kesişimleri ile meydana geldiğini ifade eder.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(6, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Çokgenler ve Çember",
      "ogrenme_ciktisi": "MAT.5.3.6. Çokgenlerin özellikleri ile ilgili edindiği deneyimleri yansıtabilme",
      "outcomeCode": "MAT.5.3.6",
      "surec_bilesenleri": "a) Çokgenlerin özellikleri ile ilgili edindiği deneyimleri gözden geçirir. b) Çokgenlerin kenar ve açı özelliklerine dair çıkarım yapar. c) Çıkarımını farklı örnekler üzerinden değerlendirir.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(7, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLERGEOMETRİK ŞEKİLLERGEOMETRİK ŞEKİLLER",
      "konu": "Çokgenler ve ÇemberÇokgenler ve ÇemberÇokgenler ve Çember",
      "ogrenme_ciktisi": "MAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilmeMAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilmeMAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilme",
      "outcomeCode": "MAT.5.3.7",
      "surec_bilesenleri": "a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.",
      "ogrenme_kanitlari": "Gözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testiGözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testiGözlem formu Çalışman kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal FarkındalıkSDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal FarkındalıkSDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.VatanseverlikD7. Estetik D19.VatanseverlikD7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel OkuryazarlıkOB2. Dijital Okuryazarlık OB4. Görsel OkuryazarlıkOB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "Cumhuriyet Bayramı"
  }),
  createPlanItem(8, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Çokgenler ve Çember",
      "ogrenme_ciktisi": "MAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilme",
      "outcomeCode": "MAT.5.3.7",
      "surec_bilesenleri": "a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.",
      "ogrenme_kanitlari": "Gözlem formu Çalışma kâğıdı Kontrol listesi Performans görevi Öz değerlendirme Akran değerlendirme formları Öğrenme günlüğü Zihin haritası İzleme testi",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D7. Estetik D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "Kızılay Haftası"
  }),
  createPlanItem(9, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Çok Basamaklı Sayıları Okuma ve Yazma",
      "ogrenme_ciktisi": "MAT.5.1.1. Altı basamaklı sayıları okuma ve yazmayı çok basamaklı sayılara genelleyebilme",
      "outcomeCode": "MAT.5.1.1",
      "surec_bilesenleri": "a) Günlük hayattaki farklı bağlamlardan yola çıkarak altıdan çok basamaklı sayılar hakkında bilgi toplar. b) Sayıların bölükleri ile okunuşları arasındaki ortak özellikleri belirler. c) Sayıların bölükleri ile okunuşları arasındaki örüntüler üzerinden basamak sayısı altıdan çok olan sayıların okunuş ve yazılışları hakkında önermelerde bulunur.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "Atatürk Haftası"
  }),
  createPlanItem(10, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Çözümleme",
      "ogrenme_ciktisi": "MAT.5.1.1. Altı basamaklı sayıları okuma ve yazmayı çok basamaklı sayılara genelleyebilme",
      "outcomeCode": "MAT.5.1.1",
      "surec_bilesenleri": "a) Günlük hayattaki farklı bağlamlardan yola çıkarak altıdan çok basamaklı sayılar hakkında bilgi toplar. b) Sayıların bölükleri ile okunuşları arasındaki ortak özellikleri belirler. c) Sayıların bölükleri ile okunuşları arasındaki örüntüler üzerinden basamak sayısı altıdan çok olan sayıların okunuş ve yazılışları hakkında önermelerde bulunur.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi Öz değerlendirme ve akran değerlendirme formları",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "Öğretmenler Günü"
  }),
  createPlanItem(11, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
      "outcomeCode": "MAT.5.1.2",
      "surec_bilesenleri": "MAT.5.1.2. a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi Öz değerlendirme ve akran değerlendirme formları",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(12, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
      "outcomeCode": "MAT.5.1.2",
      "surec_bilesenleri": "a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi Öz değerlendirme ve akran değerlendirme formları",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(13, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
      "outcomeCode": "MAT.5.1.2",
      "surec_bilesenleri": "a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi Öz değerlendirme ve akran değerlendirme formları",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(14, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (1) GEOMETRİK NİCELİKLER",
      "konu": "Doğal Sayılarla Dört İşlem İçeren Problem Çözme Dikdörtgenin Çevre Uzunluğu ve Alanı",
      "ogrenme_ciktisi": "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme MAT.5.4.1. Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde kenar uzunluklarını yorumlayabilme",
      "outcomeCode": "MAT.5.1.2",
      "surec_bilesenleri": "MAT.5.1.2 a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir. MAT.5.4.1. a) Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde olası kenar uzunluklarını inceler. b) Verilen çevre uzunluğuna sahip ve kenar uzunlukları doğal sayı olan dikdörtgen oluşturur. c) Kenar uzunlukları doğal sayı olan farklı dikdörtgenlerin aynı çevre uzunluğuna sahip olabileceğini açıklar.",
      "ogrenme_kanitlari": "Açık uçlu sorulardan oluşan çalışma kağıdı İzleme testi Performans görevi Öz değerlendirme ve akran değerlendirme formları",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği SDB3.2. Esneklik",
      "degerler": "D3. Çalışkanlık D7 Estetik D16. Sorumluluk D17. Tasarruf",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(15, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Dikdörtgenin Çevre Uzunluğu ve Alanı",
      "ogrenme_ciktisi": "MAT.5.4.1. Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde kenar uzunluklarını yorumlayabilme MAT.5.4.2. Birim karelerden yola çıkarak dikdörtgenin alanını değerlendirebilme",
      "outcomeCode": "MAT.5.4.1",
      "surec_bilesenleri": "MAT.5.4.1. a) Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde olası kenar uzunluklarını inceler. b) Verilen çevre uzunluğuna sahip ve kenar uzunlukları doğal sayı olan dikdörtgen oluşturur. c) Kenar uzunlukları doğal sayı olan farklı dikdörtgenlerin aynı çevre uzunluğuna sahip olabileceğini açıklar. MAT.5.4.2. a) Dikdörtgenin alanını ölçmede, seçtiği birim kareleri ölçüt olarak belirler. b) Dikdörtgenin alanını seçilen birim karelerle ölçer. c) Birim kare sayısının dikdörtgenin iki ardışık kenar uzunluğu ile ilişkisini inceler. ç) Dikdörtgenin alan bağıntısına (iki ardışık kenarın uzunlukları çarpımı) ilişkin yargıda bulunur.",
      "ogrenme_kanitlari": "İzleme test Açık uçlu sorular Yapılandırılmış grid Çalışma kağıdı Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB3.1. Uyum SDB3.2. Esneklik SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik D14.Saygı",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "Yılbaşı Tatili"
  }),
  createPlanItem(16, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Dikdörtgenin Çevre Uzunluğu ve Alanı",
      "ogrenme_ciktisi": "MAT.5.4.3. Kenar uzunlukları doğal sayı olan bir dikdörtgenin alanının ölçüsü verildiğinde çevre uzunluğunu, çevre uzunluğu verildiğinde alanını yorumlayabilme",
      "outcomeCode": "MAT.5.4.3",
      "surec_bilesenleri": "a) Alanının ölçüsü verilen bir dikdörtgenin çevre uzunluğunu, çevre uzunluğu verilen bir dikdörtgenin alanını inceler. b) Aynı alana sahip farklı dikdörtgenlerin çevre uzunluklarını ve aynı çevre uzunluğuna sahip farklı dikdörtgenlerin alanlarını belirler. c) Aynı çevre uzunluğuna sahip dikdörtgenlerin farklı alanlara ve aynı alana sahip dikdörtgenlerin farklı çevre uzunluklarına sahip olabileceğini ifade eder.",
      "ogrenme_kanitlari": "İzleme testi Açık uçlu sorular Yapılandırılmış grid Çalışma kağıdı Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB3.1. Uyum SDB3.2. Esneklik SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik D14.Saygı",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "SINAV HAFTASI"
  }),
  createPlanItem(17, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Dikdörtgenin Çevre Uzunluğu ve Alanı",
      "ogrenme_ciktisi": "MAT.5.4.4. Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemleri çözebilme",
      "outcomeCode": "MAT.5.4.4",
      "surec_bilesenleri": "a) Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemlerde ilgili matematiksel bileşenleri (şekil, uzunluk, alan ölçüleri gibi) belirler. b) Matematiksel bileşenler arasındaki ilişkileri belirler. c) Problem bağlamındaki temsilleri farklı temsillere dönüştürür. ç) Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlediği stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "İzleme testi Açık uçlu sorular Yapılandırılmış grid Çalışma kağıdı Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB3.1. Uyum SDB3.2. Esneklik SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik D14.Saygı",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(18, 5, {
      "saat": "5 SAAT",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Dikdörtgenin Çevre Uzunluğu ve Alanı",
      "ogrenme_ciktisi": "MAT.5.4.4. Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemleri çözebilme",
      "outcomeCode": "MAT.5.4.4",
      "surec_bilesenleri": "a) Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemlerde ilgili matematiksel bileşenleri (şekil, uzunluk, alan ölçüleri gibi) belirler. b) Matematiksel bileşenler arasındaki ilişkileri belirler. c) Problem bağlamındaki temsilleri farklı temsillere dönüştürür. ç) Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlediği stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "İzleme testi Açık uçlu sorular Yapılandırılmış grid Çalışma kağıdı Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB3.1. Uyum SDB3.2. Esneklik SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik D14.Saygı",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık OB4. Görsel Okuryazarlık",
      "degerlendirme": "Birinci Dönemin Sona Ermesi"
  }),
  createPlanItem(19, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Farklı Gösterimleri",
      "ogrenme_ciktisi": "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
      "outcomeCode": "MAT.5.1.3",
      "surec_bilesenleri": "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) gerçek yaşam durumu içerisindeki kullanımını anlar. b) Gerçek yaşam durumlarında karşılaşılan kesirlerin farklı gösterimlerini ilişkilendirmek için farklı modelleri (yüzlük kart, somut modeller, sayı doğrusu gibi) seçer. c) Seçilen modelleri kullanır. ç)Kullanılan modelleri kesirlerin farklı gösterimleri ile yorumlar. d) Benzer durumlarda kullanılabilecek farklı modelleri kullanışlılık açısından karşılaştırır. e) Karşılaştırdığı modellerin kullanışlılığına ilişkin karar verir.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": "İkinci Yarıyıl Başlangıcı"
  }),
  createPlanItem(20, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Farklı Gösterimleri",
      "ogrenme_ciktisi": "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
      "outcomeCode": "MAT.5.1.3",
      "surec_bilesenleri": "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) gerçek yaşam durumu içerisindeki kullanımını anlar. b) Gerçek yaşam durumlarında karşılaşılan kesirlerin farklı gösterimlerini ilişkilendirmek için farklı modelleri (yüzlük kart, somut modeller, sayı doğrusu gibi) seçer. c) Seçilen modelleri kullanır. ç) Kullanılan modelleri kesirlerin farklı gösterimleri ile yorumlar. d) Benzer durumlarda kullanılabilecek farklı modelleri kullanışlılık açısından karşılaştırır. e) Karşılaştırdığı modellerin kullanışlılığına ilişkin karar verir.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(21, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Farklı Gösterimleri",
      "ogrenme_ciktisi": "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
      "outcomeCode": "MAT.5.1.3",
      "surec_bilesenleri": "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) gerçek yaşam durumu içerisindeki kullanımını anlar. b) Gerçek yaşam durumlarında karşılaşılan kesirlerin farklı gösterimlerini ilişkilendirmek için farklı modelleri (yüzlük kart, somut modeller, sayı doğrusu gibi) seçer. c) Seçilen modelleri kullanır. ç) Kullanılan modelleri kesirlerin farklı gösterimleri ile yorumlar. d) Benzer durumlarda kullanılabilecek farklı modelleri kullanışlılık açısından karşılaştırır. e) Karşılaştırdığı modellerin kullanışlılığına ilişkin karar verir.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(22, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Farklı Gösterimleri Kesirlerin Karşılaştırılması",
      "ogrenme_ciktisi": "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.1.3",
      "surec_bilesenleri": "MAT.5.1.3. a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) gerçek yaşam durumu içerisindeki kullanımını anlar. b) Gerçek yaşam durumlarında karşılaşılan kesirlerin farklı gösterimlerini ilişkilendirmek için farklı modelleri (yüzlük kart, somut modeller, sayı doğrusu gibi) seçer. c) Seçilen modelleri kullanır. ç) Kullanılan modelleri kesirlerin farklı gösterimleri ile yorumlar. d) Benzer durumlarda kullanılabilecek farklı modelleri kullanışlılık açısından karşılaştırır. e) Karşılaştırdığı modellerin kullanışlılığına ilişkin karar verir. MAT.5.1.4 a) Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik varsayımda bulunur. b) Varsayımındaki ilişkileri inceleyerek kesirlerin karşılaştırılmasına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını sayı doğrusu, şekil gibi temsiller üzerinde gösterir. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik matematiksel önermeleri sözel ya da sembolik temsil ile sunar. d) Sunduğu önermelerin tahmin etme becerisine katkısını gerekçelerle açıklar.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(23, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Karşılaştırılması",
      "ogrenme_ciktisi": "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.1.4",
      "surec_bilesenleri": "a) Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik varsayımda bulunur. b) Varsayımındaki ilişkileri inceleyerek kesirlerin karşılaştırılmasına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını sayı doğrusu, şekil gibi temsiller üzerinde gösterir. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik matematiksel önermeleri sözel ya da sembolik temsil ile sunar. d) Sunduğu önermelerin tahmin etme becerisine katkısını gerekçelerle açıklar.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(24, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Karşılaştırılması",
      "ogrenme_ciktisi": "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.1.4",
      "surec_bilesenleri": "a) Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik varsayımda bulunur. b) Varsayımındaki ilişkileri inceleyerek kesirlerin karşılaştırılmasına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını sayı doğrusu, şekil gibi temsiller üzerinde gösterir. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik matematiksel önermeleri sözel ya da sembolik temsil ile sunar. d) Sunduğu önermelerin tahmin etme becerisine katkısını gerekçelerle açıklar.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(25, 5, {
      "saat": "5 SAAT",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerin Karşılaştırılması",
      "ogrenme_ciktisi": "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.1.4",
      "surec_bilesenleri": "a) Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik varsayımda bulunur. b) Varsayımındaki ilişkileri inceleyerek kesirlerin karşılaştırılmasına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını sayı doğrusu, şekil gibi temsiller üzerinde gösterir. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik matematiksel önermeleri sözel ya da sembolik temsil ile sunar. d) Sunduğu önermelerin tahmin etme becerisine katkısını gerekçelerle açıklar.",
      "ogrenme_kanitlari": "Açık uçlu ve kısa cevaplı sorulardan oluşan izleme testi Açık uçlu sorulardan oluşan çalışma kâğıdı Öz ve akran değerlendirme formları Performans görevi",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet D5. Duyarlılık D14. Saygı D16. Sorumluluk D17. Tasarruf D19. Vatanseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık OB7. Veri Okuryazarlığı",
      "degerlendirme": "SINAV HAFTASI"
  }),
  createPlanItem(26, 5, {
      "saat": "5 SAAT",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.5.5.1",
      "surec_bilesenleri": "a) Kategorik veriye dayanan istatistiksel araştırma gerektiren durumları fark eder. b) Kategorik veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur. c) Kategorik veriye ulaşmak için plan yapar. ç) Kategorik veriye ve araştırma sorusuna uygun anket soruları hazırlar. d) Anketi kullanarak veri toplar veya hazır veriye ulaşır. e) Veri görselleştirme aracını (sıklık tablosu, sütun grafiği, daire grafiği, nokta grafiği gibi) seçme gerekçelerini belirtir. f) Toplanan veriyi uygun görselleştirme aracı ile analiz eder. g) Araştırma sonuçlarını elde eder. ğ) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar. h) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirir. ı) Araştırma süreci adımlarını değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB4. Görsel Okuryazarlık OB6. Vatandaşlık Okuryazarlığı OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(27, 5, {
      "saat": "5 SAAT",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.5.5.1",
      "surec_bilesenleri": "a) Kategorik veriye dayanan istatistiksel araştırma gerektiren durumları fark eder. b) Kategorik veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur. c) Kategorik veriye ulaşmak için plan yapar. ç) Kategorik veriye ve araştırma sorusuna uygun anket soruları hazırlar. d) Anketi kullanarak veri toplar veya hazır veriye ulaşır. e) Veri görselleştirme aracını (sıklık tablosu, sütun grafiği, daire grafiği, nokta grafiği gibi) seçme gerekçelerini belirtir. f) Toplanan veriyi uygun görselleştirme aracı ile analiz eder. g) Araştırma sonuçlarını elde eder. ğ) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar. h) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirir. ı) Araştırma süreci adımlarını değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB4. Görsel Okuryazarlık OB6. Vatandaşlık Okuryazarlığı OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(28, 5, {
      "saat": "5 SAAT",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.5.5.1",
      "surec_bilesenleri": "a) Kategorik veriye dayanan istatistiksel araştırma gerektiren durumları fark eder. b) Kategorik veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur. c) Kategorik veriye ulaşmak için plan yapar. ç) Kategorik veriye ve araştırma sorusuna uygun anket soruları hazırlar. d) Anketi kullanarak veri toplar veya hazır veriye ulaşır. e) Veri görselleştirme aracını (sıklık tablosu, sütun grafiği, daire grafiği, nokta grafiği gibi) seçme gerekçelerini belirtir. f) Toplanan veriyi uygun görselleştirme aracı ile analiz eder. g) Araştırma sonuçlarını elde eder. ğ) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar. h) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirir. ı) Araştırma süreci adımlarını değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB4. Görsel Okuryazarlık OB6. Vatandaşlık Okuryazarlığı OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı"
  }),
  createPlanItem(29, 5, {
      "saat": "5 SAAT",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme MAT.5.5.2. Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumları tartışabilme",
      "outcomeCode": "MAT.5.5.1",
      "surec_bilesenleri": "MAT.5.5.1. a) Kategorik veriye dayanan istatistiksel araştırma gerektiren durumları fark eder. b) Kategorik veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur. c) Kategorik veriye ulaşmak için plan yapar. ç) Kategorik veriye ve araştırma sorusuna uygun anket soruları hazırlar. d) Anketi kullanarak veri toplar veya hazır veriye ulaşır. e) Veri görselleştirme aracını (sıklık tablosu, sütun grafiği, daire grafiği, nokta grafiği gibi) seçme gerekçelerini belirtir. f) Toplanan veriyi uygun görselleştirme aracı ile analiz eder. g) Araştırma sonuçlarını elde eder. ğ) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar. h) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirir. ı) Araştırma süreci adımlarını değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar. MAT.5.5.2. a) Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumlara yönelik istatistiksel temellendirme yapar. b) Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumlara yönelik hataları ya da yanlılıkları tespit eder. c) Başkaları tarafından oluşturulan kategorik veriye dayalı sonuç veya yorumları çürütür ya da kabul eder.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB4. Görsel Okuryazarlık OB6. Vatandaşlık Okuryazarlığı OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "1 Mayıs İşçi Bayramı"
  }),
  createPlanItem(30, 5, {
      "saat": "5 SAAT",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ İŞLEMLERLE CEBİRSEL DÜŞÜNME",
      "konu": "Kategorik Veri Dağılımları Eşitliğin Korunumu",
      "ogrenme_ciktisi": "MAT.5.5.2. Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumları tartışabilme MAT.5.2.1. Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.5.2",
      "surec_bilesenleri": "MAT.5.5.2. a) Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumlara yönelik istatistiksel temellendirme yapar. b) Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumlara yönelik hataları ya da yanlılıkları tespit eder. c) Başkaları tarafından oluşturulan kategorik veriye dayalı sonuç veya yorumları çürütür ya da kabul eder. MAT.5.2.1. a) Eşitliğin korunumuna, doğal sayılarla toplama ve çarpma işlemlerinin değişme, birleşme; çarpmanın toplama ve çıkarma işlemleri üzerine dağılma özelliklerine yönelik varsayımlarda bulunur. b) İncelediği örnekler üzerinden varsayımına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını çeşitli örnekler üzerinden sınar. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği matematiksel bir önermeyi sözel ve sembolik temsil ile sunar. d) Sunduğu önermenin katkısına yönelik gerekçe sunar.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı OB2. Dijital Okuryazarlık OB3. Finansal Okuryazarlık OB4. Görsel Okuryazarlık OB6. Vatandaşlık Okuryazarlığı OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": ""
  }),
  createPlanItem(31, 5, {
      "saat": "5 SAAT",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
      "konu": "Değişme-Birleşme ve Dağılma Özellikleri",
      "ogrenme_ciktisi": "MAT.5.2.1. Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.5.2.1",
      "surec_bilesenleri": "a) Eşitliğin korunumuna, doğal sayılarla toplama ve çarpma işlemlerinin değişme, birleşme; çarpmanın toplama ve çıkarma işlemleri üzerine dağılma özelliklerine yönelik varsayımlarda bulunur. b) İncelediği örnekler üzerinden varsayımına yönelik genellemeleri belirler. c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını çeşitli ör nekler üzerinden sınar. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği matematiksel bir önermeyi sözel ve sembolik temsil ile sunar. d) Sunduğu önermenin katkısına yönelik gerekçe sunar.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(32, 5, {
      "saat": "5 SAAT",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
      "konu": "İşlem Önceliği Örüntüler",
      "ogrenme_ciktisi": "MAT.5.2.2. Karşılaştığı günlük hayat ya da matematiksel durumlarda işlem önceliğini yorumlayabilme MAT.5.2.3. Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.5.2.2",
      "surec_bilesenleri": "MAT.5.2.2. a) Doğal sayılarla dört işlem içeren problemlerde ve sayı cümlelerinde işlem önceliğini inceler. b) Karşılaştığı doğal sayılarla dört işlem içeren problemlerde ve sayı cümlelerinde işlem önceliğini uygular. c) Karşılaştığı durumlarda işlem önceliğini açıklar. MAT.5.2.3. a) Örüntülerdeki ilişkilere yönelik varsayımda bulunur. b) Varsayıma yönelik örüntüdeki terimleri inceleyerek örüntünün kuralına ilişkin genellemeleri belirler. c) Genellediği ilişkilerin varsayımını karşılayıp karşılamadığını sınar. ç)Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği önermeyi sözel ve sembolik temsiller kullanarak sunar. d) Sunduğu önermenin kullanışlılığına yönelik gerekçeler sunar. e) Sunduğu önermenin geçerliliğini destekleyen kapsayıcı örnekler verir. f) İşe koştuğu doğrulamanın benzer önermelere uygulanıp uygulanamayacağını değerlendirir.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": "19 Mayıs Atatürk’ü Anma Gençlik ve Spor Bayramı"
  }),
  createPlanItem(33, 5, {
      "saat": "5 SAAT",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
      "konu": "Örüntüler",
      "ogrenme_ciktisi": "MAT.5.2.3. Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.5.2.3",
      "surec_bilesenleri": "MAT.5.2.3. a) Örüntülerdeki ilişkilere yönelik varsayımda bulunur. b) Varsayıma yönelik örüntüdeki terimleri inceleyerek örüntünün kuralına ilişkin genellemeleri belirler. c) Genellediği ilişkilerin varsayımını karşılayıp karşılamadığını sınar. ç) Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği önermeyi sözel ve sembolik temsiller kullanarak sunar. d) Sunduğu önermenin kullanışlılığına yönelik gerekçeler sunar. e) Sunduğu önermenin geçerliliğini destekleyen kapsayıcı örnekler verir. f) İşe koştuğu doğrulamanın benzer önermelere uygulanıp uygulanamayacağını değerlendirir.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(34, 5, {
      "saat": "5 SAAT",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VERİDEN OLASILIĞA",
      "konu": "Temel Aritmetik İşlemler ve Algoritma Öznel Olasılık",
      "ogrenme_ciktisi": "MAT.5.2.4. Temel aritmetik işlem içeren durumlardaki algoritmaları yorumlayabilme MAT.5.6.1. Herhangi bir olayın olasılığının 0 (imkânsız) ile 1 (kesin) arasında (0 ve 1 dâhil)",
      "outcomeCode": "MAT.5.2.4",
      "surec_bilesenleri": "MAT.5.2.4. a) Temel aritmetik işlem içeren durumlardaki algoritmik yapıyı inceler. b) İncelediği durumlardaki algoritmik yapıyı tablo temsiline veya aritmetik işlemlere dönüştürür. c) Dönüştürdüğü algoritmik yapının içerdiği matematiksel ilişkileri sözlü olarak ifade eder. MAT.5.6.1. a) Olayları ve olası durumları inceler. b) Bir olayın olasılığına dair tahminlerini farklı sayı temsillerine dönüştürür. c) Kendi ifadeleriyle tahminde bulunduğu bir olayın olasılığının 0 ile 1 arasında (0 ve 1 dâhil) olduğunu ifade eder.",
      "ogrenme_kanitlari": "Performans görevi Öz değerlendirme ve akran değerlendirme formları Gözlem formu Çalışma kâğıtları",
      "sosyal_ve_duygusal_beceriler": "SDB1.1. Öz Farkındalık/Kendini Tanıma SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB2.1. İletişim SDB2.2. İş Birliği SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık D6. Dürüstlük D17. Tasarruf D18. Temizlik",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(35, 5, {
      "saat": "5 SAAT",
      "unite": "VERİDEN OLASILIĞA",
      "konu": "Öznel Olasılık",
      "ogrenme_ciktisi": "MAT.5.6.1. Herhangi bir olayın olasılığının 0 (imkânsız) ile 1 (kesin) arasında (0 ve 1 dâhil)",
      "outcomeCode": "MAT.5.6.1",
      "surec_bilesenleri": "a) Olayları ve olası durumları inceler. b) Bir olayın olasılığına dair tahminlerini farklı sayı temsillerine dönüştürür. c) Kendi ifadeleriyle tahminde bulunduğu bir olayın olasılığının 0 ile 1 arasında (0 ve 1 dâhil) olduğunu ifade eder.",
      "ogrenme_kanitlari": "Öz değerlendirme Akran değerlendirme ve grup değerlendirme formları Kısa cevaplı ya da açık uçlu sorulardan oluşan çalışma kâğıdı Performans görevi Gözlem formu İzleme testleri",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.1. İletişim SDB2.2. İş Birliği SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": "SINAV HAFTASI"
  }),
  createPlanItem(36, 5, {
      "saat": "5 SAAT",
      "unite": "VERİDEN OLASILIĞA",
      "konu": "Öznel Olasılık",
      "ogrenme_ciktisi": "MAT.5.6.2. Olayları az ya da çok olasılıklı şeklinde yapılandırabilme",
      "outcomeCode": "MAT.5.6.2",
      "surec_bilesenleri": "a) Olayların olasılıklarına ilişkin nedensel veya mantıksal ilişkiler ortaya koyar. b) Kendi öz bilgisi ile elde ettiği ilişkilere dayanarak olayların olasılıklarını az veya çok olasılıklı şeklinde ortaya koyar.",
      "ogrenme_kanitlari": "Öz değerlendirme Akran değerlendirme ve grup değerlendirme formları Kısa cevaplı ya da açık uçlu sorulardan oluşan çalışma kâğıdı Performans görevi Gözlem formu İzleme testleri",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Öz Düzenleme/Kendini Düzenleme SDB1.3. Öz Yansıtma/Kendine Uyarlama SDB2.1. İletişim SDB2.2. İş Birliği SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet",
      "okuryazarlik_becerileri": "OB4. Görsel Okuryazarlık",
      "degerlendirme": ""
  }),
  createPlanItem(37, 5, {
      "saat": "5 SAAT",
      "unite": "YIL SONU DEĞERLENDİRME-SOSYAL ETKİNLİK",
      "konu": "|  |  |  |  |  |  | Ders Yılının Sona ermesi",
      "ogrenme_ciktisi": "",
      "outcomeCode": "MAT.5.37",
      "surec_bilesenleri": "",
      "ogrenme_kanitlari": "",
      "sosyal_ve_duygusal_beceriler": "",
      "degerler": "",
      "okuryazarlik_becerileri": "",
      "degerlendirme": ""
  })
];

/**
 * 6. Sınıf Yıllık Plan Verisi (MEB Türkiye Yüzyılı Maarif Modeli)
 */
export const ANNUAL_PLAN_6TH_GRADE: AnnualPlanItem[] = [
  createPlanItem(1, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Bir Doğal Sayının Çarpanları ve Katları",
      "ogrenme_ciktisi": "MAT.6.1.1. Karşılaştığı problem durumlarında bir doğal sayının çarpan ve katlarına yönelik muhakeme yapabilme",
      "outcomeCode": "MAT.6.1.1",
      "surec_bilesenleri": "a) Karşılaştığı durumlarda bir doğal sayının çarpan ve katlarına yönelik  varsayımlarda bulunur.\nb) Varsayımına yönelik örnek durumların içerdiği ilişkileri inceleyerek bir doğal sayının çarpan ve katlarına  ilişkin genellemeleri belirler.\nc) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını çeşitli modellerle gösterir. \nç)  Varsayımı ile ilgili ulaştığı sonuca yönelik doğrulayabileceği matematiksel bir önermeyi sözel ya da sembolik temsil  ile sunar.\nd) Farklı problemlerin pratik yoldan çözümüne yönelik oluşturduğu  önermenin gerekçelerini sunar. \ne) Önermenin geçerliliğini destekleyen kapsayıcı örnekler verir. \nf) İşe koştuğu doğrulamanın benzer önermelere uygulanıp uygulanamayacağını değerlendirir.",
      "ogrenme_kanitlari": "Tanılayıcı dallanmış ağaç, Öz değerlendirme , Akran değerlendirme, Grup değerlendirme, İzleme testi, Gelişim raporu , Performans görevi, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim , SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D9. Merhamet , D14. Saygı",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(2, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Bölünebilme Kriterleri",
      "ogrenme_ciktisi": "MAT.6.1.2. Bir doğal sayının 2, 3, 4, 5, 6, 9 ve 10 ile tam bölünebilme kriterlerine ilişkin çıkarım yapabilme",
      "outcomeCode": "MAT.6.1.2",
      "surec_bilesenleri": "a) Bir doğal sayının katlarını veya basamak değerlerini dikkate alarak 2, 3, 4, 5, 6, 9 ve 10’a tam bölünebilme kriterleri ile ilgili varsayımlarda bulunur.\nb) 2, 3, 4, 5, 6, 9 ve 10’un katlarını ve basamak değerlerini inceleyerek genellemeleri belirler.\nc) Elde ettiği  genellemelerin, varsayımını karşılayıp karşılamadığını örnekler ile sınar.\nç)  Bir doğal sayının 2, 3, 4, 5, 6, 9 ve 10 ile tam bölünebilmesindeki kriterlere ilişkin önerme sunar.\nd) Bir doğal sayının 2, 3, 4, 5, 6, 9 ve 10 ile tam bölünebilmesindeki kriterlerin farklı durumlarda kullanışlılığını değerlendirir.",
      "ogrenme_kanitlari": "Tanılayıcı dallanmış ağaç, Öz değerlendirme , Akran değerlendirme, Grup değerlendirme, İzleme testi, Gelişim raporu , Performans görevi, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim , SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D9. Merhamet , D14. Saygı",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık",
      "degerlendirme": "15 Temmuz Demokrasi ve Millî Birlik Günü",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(3, 6, {
      "saat": "2+3",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Asal Sayılar ve Asal Çarpanlar  Bir Doğal Sayının Çarpanları ve Katları",
      "ogrenme_ciktisi": "MAT.6.1.3. Bir doğal sayının asal olma durumunu ve asal çarpanlarını çözümleyebilme\n\nMAT.6.1.4.  Günlük hayat problemleri ya da matematiksel durumlar üzerinden ortak kat ve ortak böleni yorumlayabilme",
      "outcomeCode": "MAT.6.1.3",
      "surec_bilesenleri": "MAT.6.1.3.\na)  Bir doğal sayının asal olup olmadığını ve asal çarpanlarını belirler.\nb) Asal sayıların özelliklerini ve bir doğal sayı ile asal çarpanları arasındaki ilişkileri belirler. \n\nMAT.6.1.4\na) Problemlerde ya da matematiksel durumlarda verilen iki sayının ortak katlarını ve ortak bölenlerini inceler.\nb) İncelediği ortak kat veya ortak bölen ilişkilerini çizim, tablo ve sayı doğrusu gibi matematiksel temsillerle ifade eder.\nc) İki sayının ortak katlarını ve ortak bölenlerini kendi ifadelerini kullanarak açıklar.",
      "ogrenme_kanitlari": "Tanılayıcı dallanmış ağaç, Öz değerlendirme , Akran değerlendirme, Grup değerlendirme, İzleme testi, Gelişim raporu , Performans görevi, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim , SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D9. Merhamet , D14. Saygı",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(3, 6, {
      "saat": "2+3",
      "unite": "SAYILAR VE NİCELİKLER (1)",
      "konu": "Asal Sayılar ve Asal Çarpanlar  Bir Doğal Sayının Çarpanları ve Katları",
      "ogrenme_ciktisi": "MAT.6.1.3. Bir doğal sayının asal olma durumunu ve asal çarpanlarını çözümleyebilme\n\nMAT.6.1.4.  Günlük hayat problemleri ya da matematiksel durumlar üzerinden ortak kat ve ortak böleni yorumlayabilme",
      "outcomeCode": "MAT.6.1.4",
      "surec_bilesenleri": "MAT.6.1.3.\na)  Bir doğal sayının asal olup olmadığını ve asal çarpanlarını belirler.\nb) Asal sayıların özelliklerini ve bir doğal sayı ile asal çarpanları arasındaki ilişkileri belirler. \n\nMAT.6.1.4\na) Problemlerde ya da matematiksel durumlarda verilen iki sayının ortak katlarını ve ortak bölenlerini inceler.\nb) İncelediği ortak kat veya ortak bölen ilişkilerini çizim, tablo ve sayı doğrusu gibi matematiksel temsillerle ifade eder.\nc) İki sayının ortak katlarını ve ortak bölenlerini kendi ifadelerini kullanarak açıklar.",
      "ogrenme_kanitlari": "Tanılayıcı dallanmış ağaç, Öz değerlendirme , Akran değerlendirme, Grup değerlendirme, İzleme testi, Gelişim raporu , Performans görevi, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim , SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D9. Merhamet , D14. Saygı",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(4, 6, {
      "saat": "5",
      "unite": "VERİDEN OLASILIĞA",
      "konu": "Deneysel Olasılık",
      "ogrenme_ciktisi": "MAT.6.6.1. Bir olayın olasılığını gözleme dayalı tahmin edebilme",
      "outcomeCode": "MAT.6.6.1",
      "surec_bilesenleri": "a)  Bir olayın olasılığı ile deneylerden elde ettiği veriyi ilişkilendirir.\nb)  Deneye ait tekrar sayısı ile deneyin çıktılarının göreli sıklıklarının ilişkisine yönelik çıkarım yapar.\nc)  Çıkarımlardan hareketle olasılık değerini belirleme için göreli sıklığın kullanımına yönelik yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Performans görevi, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği",
      "degerler": "D3. Çalışkanlık",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık,  OB7. Veri Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(4, 6, {
      "saat": "5",
      "unite": "VERİDEN OLASILIĞA",
      "konu": "Deneysel Olasılık",
      "ogrenme_ciktisi": "MAT.6.6.1. Bir olayın olasılığını gözleme dayalı tahmin edebilme",
      "outcomeCode": "MAT.6.6.1",
      "surec_bilesenleri": "a)  Bir olayın olasılığı ile deneylerden elde ettiği veriyi ilişkilendirir.\nb)  Deneye ait tekrar sayısı ile deneyin çıktılarının göreli sıklıklarının ilişkisine yönelik çıkarım yapar.\nc)  Çıkarımlardan hareketle olasılık değerini belirleme için göreli sıklığın kullanımına yönelik yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Performans görevi, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği",
      "degerler": "D3. Çalışkanlık",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık,  OB7. Veri Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(5, 6, {
      "saat": "4+1",
      "unite": "VERİDEN OLASILIĞA  SAYILAR VE NİCELİKLER(2)",
      "konu": "Deneysel Olasılık  Ondalık Gösterimleri Çözümleme",
      "ogrenme_ciktisi": "MAT.6.6.1. Bir olayın olasılığını gözleme dayalı tahmin edebilme\n\n MAT.6.1.5. Gerçek yaşam durumlarında ondalık gösterimlerin basamak değerlerini kesirlerden yararlanarak yorumlayabilme",
      "outcomeCode": "MAT.6.6.1",
      "surec_bilesenleri": "MAT.6.6.1.\na)  Bir olayın olasılığı ile deneylerden elde ettiği veriyi ilişkilendirir.\nb)  Deneye ait tekrar sayısı ile deneyin çıktılarının göreli sıklıklarının ilişkisine yönelik çıkarım yapar.\nc)  Çıkarımlardan hareketle olasılık değerini belirleme için göreli sıklığın kullanımına yönelik yargıda bulunur.\n\n MAT.6.1.5.\na) Ondalık gösterimlerin basamak değerlerini inceler.\nb) Ondalık gösterimlerin basamak değerlerini paydası 10, 100 ve 1000   olan kesirlerin toplamlarını kullanarak yeniden ifade eder.\nc) Ondalık gösterimlerin basamak değerlerini kendi cümleleriyle açıklar.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Performans görevi, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği",
      "degerler": "D3. Çalışkanlık",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık,  OB7. Veri Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(5, 6, {
      "saat": "4+1",
      "unite": "VERİDEN OLASILIĞA  SAYILAR VE NİCELİKLER(2)",
      "konu": "Deneysel Olasılık  Ondalık Gösterimleri Çözümleme",
      "ogrenme_ciktisi": "MAT.6.6.1. Bir olayın olasılığını gözleme dayalı tahmin edebilme\n\n MAT.6.1.5. Gerçek yaşam durumlarında ondalık gösterimlerin basamak değerlerini kesirlerden yararlanarak yorumlayabilme",
      "outcomeCode": "MAT.6.1.5",
      "surec_bilesenleri": "MAT.6.6.1.\na)  Bir olayın olasılığı ile deneylerden elde ettiği veriyi ilişkilendirir.\nb)  Deneye ait tekrar sayısı ile deneyin çıktılarının göreli sıklıklarının ilişkisine yönelik çıkarım yapar.\nc)  Çıkarımlardan hareketle olasılık değerini belirleme için göreli sıklığın kullanımına yönelik yargıda bulunur.\n\n MAT.6.1.5.\na) Ondalık gösterimlerin basamak değerlerini inceler.\nb) Ondalık gösterimlerin basamak değerlerini paydası 10, 100 ve 1000   olan kesirlerin toplamlarını kullanarak yeniden ifade eder.\nc) Ondalık gösterimlerin basamak değerlerini kendi cümleleriyle açıklar.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Performans görevi, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu, Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.2. İş Birliği",
      "degerler": "D3. Çalışkanlık",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık,  OB7. Veri Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(6, 6, {
      "saat": "3+2",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Ondalık Gösterimleri Çözümleme  Kesir-Bölme İlişkisi",
      "ogrenme_ciktisi": "MAT.6.1.5. Gerçek yaşam durumlarında ondalık gösterimlerin basamak değerlerini kesirlerden yararlanarak yorumlayabilme\n\nMAT.6.1.6. Kesir ve bölme işlemi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme",
      "outcomeCode": "MAT.6.1.5",
      "surec_bilesenleri": "MAT.6.1.5.\na) Ondalık gösterimlerin basamak değerlerini inceler.\nb) Ondalık gösterimlerin basamak değerlerini paydası 10, 100 ve 1000   olan kesirlerin toplamlarını kullanarak yeniden ifade eder.\nc) Ondalık gösterimlerin basamak değerlerini kendi cümleleriyle açıklar.\n\nMAT.6.1.6.\na) Kâğıt-kalemle ve hesap makinesinde bölme işlemi gerçekleştirerek kesirlerin ondalık gösterimlerine ilişkin gözlem yapar.\nb) Kesirlerin sonlu ve devirli ondalık gösterimlerine ait örüntüleri belirler.\nc) Örüntülerde keşfedilen ilişkileri geneller.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme) , SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(6, 6, {
      "saat": "3+2",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Ondalık Gösterimleri Çözümleme  Kesir-Bölme İlişkisi",
      "ogrenme_ciktisi": "MAT.6.1.5. Gerçek yaşam durumlarında ondalık gösterimlerin basamak değerlerini kesirlerden yararlanarak yorumlayabilme\n\nMAT.6.1.6. Kesir ve bölme işlemi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme",
      "outcomeCode": "MAT.6.1.6",
      "surec_bilesenleri": "MAT.6.1.5.\na) Ondalık gösterimlerin basamak değerlerini inceler.\nb) Ondalık gösterimlerin basamak değerlerini paydası 10, 100 ve 1000   olan kesirlerin toplamlarını kullanarak yeniden ifade eder.\nc) Ondalık gösterimlerin basamak değerlerini kendi cümleleriyle açıklar.\n\nMAT.6.1.6.\na) Kâğıt-kalemle ve hesap makinesinde bölme işlemi gerçekleştirerek kesirlerin ondalık gösterimlerine ilişkin gözlem yapar.\nb) Kesirlerin sonlu ve devirli ondalık gösterimlerine ait örüntüleri belirler.\nc) Örüntülerde keşfedilen ilişkileri geneller.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme) , SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(7, 6, {
      "saat": "3+(2)*",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesir-Bölme İlişkisi",
      "ogrenme_ciktisi": "MAT.6.1.6. Kesir ve bölme işlemi arasındaki ilişkiye yönelik tümevarımsal akıl yürütebilme",
      "outcomeCode": "MAT.6.1.6",
      "surec_bilesenleri": "a) Kâğıt-kalemle ve hesap makinesinde bölme işlemi gerçekleştirerek kesirlerin ondalık gösterimlerine ilişkin gözlem yapar.\nb) Kesirlerin sonlu ve devirli ondalık gösterimlerine ait örüntüleri belirler.\nc) Örüntülerde keşfedilen ilişkileri geneller.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "29 Ekim Cumhuriyet Bayramı",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(8, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(8, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(9, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "Atatürk Haftası (10-16 Kasım)",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(9, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "Atatürk Haftası (10-16 Kasım)",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(10, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "24 Kasım Öğretmenler Günü",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(11, 6, {
      "saat": "5",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "a) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "3 Aralık Dünya Engelliler Günü",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(12, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme  Uzunluk Ölçme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme\n\nMAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "MAT.6.1.7.\na) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.\n\nMAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(12, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme  Uzunluk Ölçme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme\n\nMAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme",
      "outcomeCode": "MAT.6.1.8",
      "surec_bilesenleri": "MAT.6.1.7.\na) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.\n\nMAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(12, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme  Uzunluk Ölçme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme\n\nMAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme",
      "outcomeCode": "MAT.6.1.7",
      "surec_bilesenleri": "MAT.6.1.7.\na) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.\n\nMAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(12, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)",
      "konu": "Kesirlerle Dört İşlem İçeren Problem Çözme  Uzunluk Ölçme",
      "ogrenme_ciktisi": "MAT.6.1.7. Gerçek yaşam durumlarında karşılaşılan kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem gerektiren problemleri çözebilme\n\nMAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme",
      "outcomeCode": "MAT.6.1.8",
      "surec_bilesenleri": "MAT.6.1.7.\na) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde sayı ve işlem bileşenlerini  belirler.\nb) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. \nc) Kesir, ondalık ve yüzde gösterimleri ile ilgili dört işlem problemlerinde problem bağlamına uygun temsilleri (şekil, tablo, diyagram gibi) kullanır.\nç)  Kullanılan temsil üzerinden problemi kendi ifadeleri ile açıklar.\nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. \ne) Stratejileri işe koşarak problemleri çözer.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemlerin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. \nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh)  Genellemenin geçerliliğini değerlendirir.\n\nMAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.",
      "ogrenme_kanitlari": "Çalışma kâğıdı, Açık uçlu sorular, İzleme testi, Sayı kartları, Görsel kartlar, Performans görevi, Analitik dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB1.3. Kendine Uyarlama (Öz Yansıtma) , SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
      "degerler": "D4. Dostluk , D5. Duyarlılık D14.Saygı, D16. Sorumluluk, D17. Tasarruf, D18. Temizlik , D19.Vatanseverlik",
      "okuryazarlik_becerileri": "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık OB8. Sürdürülebilirlik Okuryazarlığı",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(13, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)           İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Uzunluk Ölçme  Kategorik ve Nicel (Kesikli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme\n\nMAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.1.8",
      "surec_bilesenleri": "MAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.\n\nMAT.6.5.1. \na) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık)",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(13, 6, {
      "saat": "4+1",
      "unite": "SAYILAR VE NİCELİKLER (2)           İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Uzunluk Ölçme  Kategorik ve Nicel (Kesikli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.1.8. Karşılaştığı günlük hayat ya da matematiksel durumlarda standart uzunluk ölçme birimlerini değerlendirebilme\n\nMAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "MAT.6.1.8.\na) Uzunluk ölçme birimlerinden metreyi ölçüt olarak belirler.\nb) Standart ölçme birimlerini kullanarak ölçme yapar.\nc) Ölçme sonuçlarını belirlediği ölçme birimleri ile karşılaştırır.\nç) Karşılaştırmalarına ilişkin yargıda bulunur.\n\nMAT.6.5.1. \na) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "Tutum, Yatırım ve Türk Malları Haftası (12-18 Aralık)",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(14, 6, {
      "saat": "5",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Kesikli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "a) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(15, 6, {
      "saat": "3+(2)*",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Sürekli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "a) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(16, 6, {
      "saat": "5",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Sürekli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "a) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(17, 6, {
      "saat": "5",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Sürekli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "a) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(18, 6, {
      "saat": "1+4",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Sürekli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme\n\nMAT.6.5.2. Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumları tartışabilme",
      "outcomeCode": "MAT.6.5.1",
      "surec_bilesenleri": "MAT.6.5.1.\na) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.\n\nMAT.6.5.2.\na) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumlara yönelik istatistiksel temellendirme yapar.\nb) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumlara yönelik hataları ya da yanlılıkları tespit eder.\nc) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumları çürütür ya da kabul eder.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(18, 6, {
      "saat": "1+4",
      "unite": "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
      "konu": "Kategorik ve Nicel (Sürekli) Veri Dağılımları",
      "ogrenme_ciktisi": "MAT.6.5.1. Kategorik veya nicel (kesikli) veri ile çalışabilme ve veriye dayalı karar verebilme\n\nMAT.6.5.2. Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumları tartışabilme",
      "outcomeCode": "MAT.6.5.2",
      "surec_bilesenleri": "MAT.6.5.1.\na) Kategorik veya nicel (kesikli) veriye dayanan istatistiksel araştırma gerektiren \ndurumları fark eder.\nb) Kategorik veya nicel (kesikli) veriye dayanan betimleme veya karşılaştırma gerektirebilecek araştırma soruları oluşturur.\nc) Kategorik veya nicel (kesikli) veriye ulaşmak için plan yapar.\nç)  Araştırma sorusuna uygun hazırlanan anket sorularını kullanarak veri toplar \nveya hazır veriye ulaşır. \nd) Veri görselleştirme (kök-yaprak gösterimi, nokta grafiği gibi) ve özetleme (aritmetik ortalama, ortanca, tepe değer ve açıklık) araçlarını seçme gerekçelerini belirtir.\ne) Toplanan veriyi uygun araçlarla analiz eder.\nf) Araştırmada ulaştığı sonuçlara yönelik gerekçeler sunar.\ng) Araştırma sonuçlarının araştırma sorusuna ne düzeyde cevap verdiğini değerlendirerek araştırma sürecine uygun olmayan adımları yeniden planlar.\n\nMAT.6.5.2.\na) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumlara yönelik istatistiksel temellendirme yapar.\nb) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumlara yönelik hataları ya da yanlılıkları tespit eder.\nc) Başkaları tarafından oluşturulan kategorik veya nicel (kesikli) veriye dayalı istatistiksel sonuç veya yorumları çürütür ya da kabul eder.",
      "ogrenme_kanitlari": "Akran değerlendirme formu, Çalışma kâğıdı, Performans görevi, Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D1. Adalet, D3. Çalışkanlık, D5. Duyarlılık, D6. Dürüstlük, D8. Mahremiyet, D14. Saygı, D17. Tasarruf",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(19, 6, {
      "saat": "5",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "İki Paralel Doğrunun Bir Kesenile Oluşturduğu Açılar",
      "ogrenme_ciktisi": "MAT.6.3.1. Düzlemde iki paralel doğru ve bir kesen ile oluşan açıları sınıflandırabilme",
      "outcomeCode": "MAT.6.3.1",
      "surec_bilesenleri": "a) Düzlemde iki paralel doğru ve bir kesen ile oluşan açıları belirler.\nb) Düzlemde iki paralel doğru ve bir kesen ile oluşan açıları ayrıştırır.\nc) Düzlemde iki paralel doğru ve bir kesen ile oluşan açıları tasnif eder.\nç)  Bu tasnife göre açıları adlandırır.",
      "ogrenme_kanitlari": ", , Çalışma kâğıdı, Performans görevi, Zihin haritası, İzleme testi, Analitik dereceli puanlama anahtarı, Bütüncül dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.1. İletişim, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D3. Çalışkanlık, D4. Dostluk, D16. Sorumluluk",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(20, 6, {
      "saat": "5",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Üçgenin Açıları Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen ve Karenin Kenar, Açı ve Köşegen Özellikleri",
      "ogrenme_ciktisi": "MAT.6.3.2. Matematiksel araç ve teknolojiden yararlanarak iki paralel doğrunun iki kesenle oluşturduğu şekillerin özelliklerine dair çıkarım yapabilme",
      "outcomeCode": "MAT.6.3.2",
      "surec_bilesenleri": "a) Düzlemde iki paralel doğrunun iki kesenle oluşturduğu şekillerin özelliklerine dair varsayımda bulunur.\nb) Oluşan şekilleri çeşitli özelliklerine göre listeler.\nc) Oluşan şekilleri kenar ve açı özelliklerini dikkate alarak varsayımları ile karşılaştırır.\nç)  Oluşan şekillerin iç açılarının ölçüleri toplamına ve yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen, karenin ortak özelliklerine dair önermeler sunar.\nd)   Sunduğu önermelerin dörtgenlerin sınıflandırılmasına yönelik katkısını değerlendirir.",
      "ogrenme_kanitlari": ", , Çalışma kâğıdı, Performans görevi, Zihin haritası, İzleme testi, Analitik dereceli puanlama anahtarı, Bütüncül dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.1. İletişim, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D3. Çalışkanlık, D4. Dostluk, D16. Sorumluluk",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(21, 6, {
      "saat": "5",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen ve Karenin Kenar, Açı ve Köşegen Özellikleri",
      "ogrenme_ciktisi": "MAT.6.3.3. Matematiksel araç ve teknolojiden yararlanarak birbirlerini ortalayan doğru parçalarını köşegen kabul eden dörtgenlere yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.6.3.3",
      "surec_bilesenleri": "a) Birbirlerini ortalayan doğru parçalarını köşegen kabul eden dörtgenlere yönelik varsayımlarda bulunur.\nb) Birbirlerini ortalayan doğru parçalarını köşegen kabul eden dörtgenleri oluşturur ve listeler.\nc) Oluşturulan dörtgenleri varsayımları ile karşılaştırır.\nç)  Özelliklerine bağlı olarak birbirlerini ortalayan doğru parçalarını köşegen kabul eden dörtgenlere yönelik önermeler sunar.\nd) Sunduğu önermelerin dörtgenlerin farklı yollardan tanımlanmasına yönelik katkısını değerlendirir.",
      "ogrenme_kanitlari": ", , Çalışma kâğıdı, Performans görevi, Zihin haritası, İzleme testi, Analitik dereceli puanlama anahtarı, Bütüncül dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.1. İletişim, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D3. Çalışkanlık, D4. Dostluk, D16. Sorumluluk",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(22, 6, {
      "saat": "5",
      "unite": "GEOMETRİK ŞEKİLLER",
      "konu": "Üçgenin Açıları Yamuk, Paralelkenar, Eşkenar Dörtgen, Dikdörtgen ve Karenin Kenar, Açı ve Köşegen Özellikleri",
      "ogrenme_ciktisi": "MAT.6.3.4. Üçgen, yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen ve karenin açıları ile ilgili problemleri çözebilme",
      "outcomeCode": "MAT.6.3.4",
      "surec_bilesenleri": "a) Üçgen, yamuk, paralelkenar, eşkenar dörtgen, dikdörtgen ve karenin açıları ile \nilgili problemlerde matematiksel bileşenleri (şekil, açı ölçüsü, kenar uzunluğu, paralellik, diklik  gibi) belirler.\nb) Matematiksel bileşenler arasındaki  ilişkiyi belirler.\nc) Problem bağlamındaki temsilleri farklı temsillere dönüştürür.\nç)  Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar.\nd) Problemin çözümü  için stratejiler geliştirir.\ne) Belirlenen  stratejileri çözüm için uygular.\nf) Çözüm yollarını kontrol eder ve  çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek \nalternatif çözüm yollarını değerlendirir.\nğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": ", , Çalışma kâğıdı, Performans görevi, Zihin haritası, İzleme testi, Analitik dereceli puanlama anahtarı, Bütüncül dereceli puanlama anahtarı, Öz değerlendirme formu, Akran değerlendirme formu, Grup değerlendirme formu",
      "sosyal_ve_duygusal_beceriler": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.1. İletişim, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D3. Çalışkanlık, D4. Dostluk, D16. Sorumluluk",
      "okuryazarlik_becerileri": "OB2. Dijital Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(23, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Bilinmeyen Nicelikler",
      "ogrenme_ciktisi": "MAT.6.2.1. Gerçek yaşam durumlarında bilinen niceliklerden bilinmeyen niceliklere ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.6.2.1",
      "surec_bilesenleri": "a) Gerçek yaşam durumlarında nicelikleri belirler.\nb) Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.\nc) Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.\nç) Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.\nd) Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.\ne) Verilen cebirsel ifadelere yönelik varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik  genellemeleri belirler.\nf) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadeler ile sınar.\ng) Doğrulayabileceği sözel ve cebirsel ifadeleri farklı değişken ve değerlerle sözel ve cebirsel olarak yeniden ifade eder. \nğ) Cebirsel ifadelerin matematiğin farklı alanlarında ve gerçek yaşam durumlarında kullanımına yönelik katkısını ifade eder.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Performans görevi , Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü (12 Mart)    Şehitler Günü (18 Mart)   Türk Dünyası ve Toplulukları Haftası",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(23, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Bilinmeyen Nicelikler",
      "ogrenme_ciktisi": "MAT.6.2.1. Gerçek yaşam durumlarında bilinen niceliklerden bilinmeyen niceliklere ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.6.2.1",
      "surec_bilesenleri": "a) Gerçek yaşam durumlarında nicelikleri belirler.\nb) Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.\nc) Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.\nç) Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.\nd) Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.\ne) Verilen cebirsel ifadelere yönelik varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik  genellemeleri belirler.\nf) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadeler ile sınar.\ng) Doğrulayabileceği sözel ve cebirsel ifadeleri farklı değişken ve değerlerle sözel ve cebirsel olarak yeniden ifade eder. \nğ) Cebirsel ifadelerin matematiğin farklı alanlarında ve gerçek yaşam durumlarında kullanımına yönelik katkısını ifade eder.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Performans görevi , Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü (12 Mart)    Şehitler Günü (18 Mart)   Türk Dünyası ve Toplulukları Haftası",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(23, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Bilinmeyen Nicelikler",
      "ogrenme_ciktisi": "MAT.6.2.1. Gerçek yaşam durumlarında bilinen niceliklerden bilinmeyen niceliklere ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.6.2.1",
      "surec_bilesenleri": "a) Gerçek yaşam durumlarında nicelikleri belirler.\nb) Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.\nc) Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.\nç) Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.\nd) Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.\ne) Verilen cebirsel ifadelere yönelik varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik  genellemeleri belirler.\nf) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadeler ile sınar.\ng) Doğrulayabileceği sözel ve cebirsel ifadeleri farklı değişken ve değerlerle sözel ve cebirsel olarak yeniden ifade eder. \nğ) Cebirsel ifadelerin matematiğin farklı alanlarında ve gerçek yaşam durumlarında kullanımına yönelik katkısını ifade eder.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Performans görevi , Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(24, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Bilinmeyen Nicelikler",
      "ogrenme_ciktisi": "MAT.6.2.1. Gerçek yaşam durumlarında bilinen niceliklerden bilinmeyen niceliklere ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.6.2.1",
      "surec_bilesenleri": "a) Gerçek yaşam durumlarında nicelikleri belirler.\nb) Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.\nc) Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.\nç) Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.\nd) Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.\ne) Verilen cebirsel ifadelere yönelik varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik  genellemeleri belirler.\nf) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadeler ile sınar.\ng) Doğrulayabileceği sözel ve cebirsel ifadeleri farklı değişken ve değerlerle sözel ve cebirsel olarak yeniden ifade eder. \nğ) Cebirsel ifadelerin matematiğin farklı alanlarında ve gerçek yaşam durumlarında kullanımına yönelik katkısını ifade eder.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Performans görevi , Bütüncül dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(25, 6, {
      "saat": "3+(2)*",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Bilinmeyen Nicelikler",
      "ogrenme_ciktisi": "MAT.6.2.1. Gerçek yaşam durumlarında bilinen niceliklerden bilinmeyen niceliklere ilişkin muhakeme yapabilme",
      "outcomeCode": "MAT.6.2.1",
      "surec_bilesenleri": "a) Gerçek yaşam durumlarında nicelikleri belirler.\nb) Nicelikler arasındaki ilişkileri tablo temsili kullanarak belirler.\nc) Nicelikler arasındaki ilişkileri cebirsel olarak ifade eder.\nç) Cebirsel ifadenin anlamını kendi cümleleri ile açıklar.\nd) Yorumladığı cebirsel ifadelere karşılık gelen durumlara yönelik varsayımda bulunur.\ne) Verilen cebirsel ifadelere yönelik varsayımda bulunduğu durumları inceleyerek değişkenlerin ve cebirsel ifadelerin anlamlarına yönelik  genellemeleri belirler.\nf) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını farklı sözel ve cebirsel ifadeler ile sınar.\ng) Doğrulayabileceği sözel ve cebirsel ifadeleri farklı değişken ve değerlerle sözel ve cebirsel olarak yeniden ifade eder. \nğ) Cebirsel ifadelerin matematiğin farklı alanlarında ve gerçek yaşam durumlarında kullanımına yönelik katkısını ifade eder.",
      "ogrenme_kanitlari": "Çalışma Kâğıtları , İzleme Testi, Performans Görevi , Bütüncül Dereceli Puanlama Anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(26, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Örüntü",
      "ogrenme_ciktisi": "MAT.6.2.2. Sayı ve şekil örüntülerini yorumlayabilme",
      "outcomeCode": "MAT.6.2.2",
      "surec_bilesenleri": "a) Sayı ve şekil örüntülerindeki ilişkileri inceler.\nb) İncelediği ilişkileri tablo, grafik ve sözel temsiller aracılığıyla ifade eder. \nc) Farklı temsillerle gösterilen ilişkilerden yola çıkarak örüntülerdeki yapıları cebirsel olarak ifade eder.",
      "ogrenme_kanitlari": "Çalışma Kâğıtları , İzleme Testi, Performans Görevi , Bütüncül Dereceli Puanlama Anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(27, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Örüntü",
      "ogrenme_ciktisi": "MAT.6.2.2. Sayı ve şekil örüntülerini yorumlayabilme",
      "outcomeCode": "MAT.6.2.2",
      "surec_bilesenleri": "a) Sayı ve şekil örüntülerindeki ilişkileri inceler.\nb) İncelediği ilişkileri tablo, grafik ve sözel temsiller aracılığıyla ifade eder. \nc) Farklı temsillerle gösterilen ilişkilerden yola çıkarak örüntülerdeki yapıları cebirsel olarak ifade eder.",
      "ogrenme_kanitlari": "Çalışma Kâğıtları , İzleme Testi, Performans Görevi , Bütüncül Dereceli Puanlama Anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(28, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Cebirsel İfadeler ve Algoritma",
      "ogrenme_ciktisi": "MAT.6.2.3. Cebirsel ifadeler içeren durumlardaki algoritmaları yorumlayabilme",
      "outcomeCode": "MAT.6.2.3",
      "surec_bilesenleri": "a) Cebirsel ifadeler içeren durumlardaki algoritmik yapıyı inceler.\nb) İncelediği durumlardaki algoritmik yapıyı tablo temsiline veya cebirsel ifadelere dönüştürür.\nc) Dönüştürdüğü algoritmik yapının içerdiği matematiksel ilişkileri sözel olarak ifade eder.",
      "ogrenme_kanitlari": "Çalışma Kâğıtları , İzleme Testi, Performans Görevi , Bütüncül Dereceli Puanlama Anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "23 Nisan Ulusal Egemenlik Çocuk Bayramı",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(29, 6, {
      "saat": "5",
      "unite": "İŞLEMLERLE CEBİRSEL DÜŞÜNME VE DEĞİŞİMLER",
      "konu": "Cebirsel İfadeler ve Algoritma",
      "ogrenme_ciktisi": "MAT.6.2.3. Cebirsel ifadeler içeren durumlardaki algoritmaları yorumlayabilme",
      "outcomeCode": "MAT.6.2.3",
      "surec_bilesenleri": "a) Cebirsel ifadeler içeren durumlardaki algoritmik yapıyı inceler.\nb) İncelediği durumlardaki algoritmik yapıyı tablo temsiline veya cebirsel ifadelere dönüştürür.\nc) Dönüştürdüğü algoritmik yapının içerdiği matematiksel ilişkileri sözel olarak ifade eder.",
      "ogrenme_kanitlari": "Çalışma Kâğıtları , İzleme Testi, Performans Görevi , Bütüncül Dereceli Puanlama Anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB2.1. İletişim, SDB2.3. Sosyal Farkındalık",
      "degerler": "D5. Duyarlılık, D9. Merhamet, D17. Tasarruf, D20. Yardımseverlik",
      "okuryazarlik_becerileri": "OB3. Finansal Okuryazarlık",
      "degerlendirme": "29 Nisan Kût'ül Amâre Zaferi    1 Mayıs Emek ve Dayanışma Günü",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(30, 6, {
      "saat": "5",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Uzunluk ve Alan Ölçme Birimleri Arasındaki İlişki",
      "ogrenme_ciktisi": "MAT.6.4.1. Uzunluk ve alan ölçme birimleri arasındaki ilişkilerle ilgili analojik akıl yürütebilme",
      "outcomeCode": "MAT.6.4.1",
      "surec_bilesenleri": "a) Uzunluk ve alan ölçme birimleri arasındaki ilişkileri gözlemler.\nb) Uzunluk ve alan ölçme birimleri arasındaki ilişkiyi tespit eder.\nc) Uzunluk ve alan ölçme birimleri arasında kurulan ilişkiden hareketle alan ölçme birimleri arasındaki ilişkiye dair çıkarım yapar.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(31, 6, {
      "saat": "5",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Paralelkenar ve Üçgenin Alanı",
      "ogrenme_ciktisi": "MAT.6.4.2. Dikdörtgenin alan bağıntısına yönelik deneyimlerini paralelkenar ve üçgenin alan bağıntılarına yansıtabilme",
      "outcomeCode": "MAT.6.4.2",
      "surec_bilesenleri": "a) Dikdörtgenin alan bağıntısını gözden geçirir. \nb) Dikdörtgenin alan bağıntısından yola çıkarak paralelkenar ve üçgenin alan bağıntıları hakkında çıkarım yapar.\nc) Çıkarımını farklı örnekler üzerinden değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(32, 6, {
      "saat": "5",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Uzunluk ve Alan Ölçme Birimleri Arasındaki İlişki Paralelkenar ve Üçgenin Alanı",
      "ogrenme_ciktisi": "MAT.6.4.3. Geometrik şekillerin alanları ile modellenen gerçek yaşam durumlarına yönelik problem çözebilme",
      "outcomeCode": "MAT.6.4.3",
      "surec_bilesenleri": "a) Geometrik şekillerin alanları ile modellenen gerçek yaşam probleminde ilgili matematiksel bileşenleri (alan, şekil, uzunluk, alan ölçme birimleri gibi) belirler. \nb) Matematiksel bileşenler arasındaki ilişkiyi belirler.  \nc) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. \nç)  Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar.\nd) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir.\ne) Belirlediği stratejileri çözüm için uygular.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir.\nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "19 Msyıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(33, 6, {
      "saat": "5",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Paralelkenar ve Üçgenin Alanı",
      "ogrenme_ciktisi": "MAT.6.4.3. Geometrik şekillerin alanları ile modellenen gerçek yaşam durumlarına yönelik problem çözebilme",
      "outcomeCode": "MAT.6.4.3",
      "surec_bilesenleri": "a) Geometrik şekillerin alanları ile modellenen gerçek yaşam probleminde ilgili matematiksel bileşenleri (alan, şekil, uzunluk, alan ölçme birimleri gibi) belirler. \nb) Matematiksel bileşenler arasındaki ilişkiyi belirler.  \nc) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. \nç)  Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar.\nd) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir.\ne) Belirlediği stratejileri çözüm için uygular.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir.\nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "İstanbul'un Fethi(29 Mayıs)",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(34, 6, {
      "saat": "3+(2)*",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Çemberin ve Çapın Uzunlukları Arasındaki İlişki",
      "ogrenme_ciktisi": "MAT.6.4.4. Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.6.4.4",
      "surec_bilesenleri": "a) Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik varsayımlarda bulunur.\nb) Çemberlerin uzunlukları ile çap uzunlukları arasındaki ilişkileri listeler.\nc) Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiyi varsayımlarıyla karşılaştırır.\nç)  Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik önermeler sunar.\nd)   Elde ettiği ilişkiye yönelik değerlendirmeler yapar.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(35, 6, {
      "saat": "5",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Çemberin ve Çapın Uzunlukları Arasındaki İlişki",
      "ogrenme_ciktisi": "MAT.6.4.4. Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik çıkarım yapabilme",
      "outcomeCode": "MAT.6.4.4",
      "surec_bilesenleri": "a) Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik varsayımlarda bulunur.\nb) Çemberlerin uzunlukları ile çap uzunlukları arasındaki ilişkileri listeler.\nc) Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiyi varsayımlarıyla karşılaştırır.\nç)  Çemberin uzunluğu ile çap uzunluğu arasındaki ilişkiye yönelik önermeler sunar.\nd)   Elde ettiği ilişkiye yönelik değerlendirmeler yapar.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(36, 6, {
      "saat": "3+2",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Çemberin ve Çapın Uzunlukları Arasındaki İlişki  Çemberde Merkez Açı ve Gördüğü Yay Uzunluğu",
      "ogrenme_ciktisi": "MAT.6.4.5. Çap veya yarıçap uzunluğu verilen bir çemberin uzunluğu ile ilgili problemleri çözebilme\n\nMAT.6.4.6. Çemberde merkez açının ölçüsü ile gördüğü yayın uzunluğu arasındaki ilişkiye dair tümevarımsal akıl yürütebilme",
      "outcomeCode": "MAT.6.4.5",
      "surec_bilesenleri": "MAT.6.4.5. \na) Çap veya yarıçap uzunluğu verilen bir çemberin uzunluğu ile ilgili problemlerde ilgili matematiksel bileşenleri (çap, yarıçap, çevre uzunluğu gibi) belirler. \nb) Matematiksel bileşenler arasındaki ilişkiyi belirler.\nc) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür.\nç) Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar. \nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir.\ne) Belirlediği stratejileri çözüm için uygular.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir.\nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.\n\nMAT.6.4.6. \na) Çemberde farklı ölçülere sahip merkez açıların gördüğü yayların uzunluklarına ilişkin gözlem yapar.\nb) Merkez açıların ölçüleri ile gördükleri yayların uzunlukları arasındaki ilişkiye dair örüntü bulur.\nc) Merkez açının ölçüsü ile gördüğü yayın uzunluğu arasındaki ilişkiye dair genelleme yapar.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  }),
  createPlanItem(36, 6, {
      "saat": "3+2",
      "unite": "GEOMETRİK NİCELİKLER",
      "konu": "Çemberin ve Çapın Uzunlukları Arasındaki İlişki  Çemberde Merkez Açı ve Gördüğü Yay Uzunluğu",
      "ogrenme_ciktisi": "MAT.6.4.5. Çap veya yarıçap uzunluğu verilen bir çemberin uzunluğu ile ilgili problemleri çözebilme\n\nMAT.6.4.6. Çemberde merkez açının ölçüsü ile gördüğü yayın uzunluğu arasındaki ilişkiye dair tümevarımsal akıl yürütebilme",
      "outcomeCode": "MAT.6.4.6",
      "surec_bilesenleri": "MAT.6.4.5. \na) Çap veya yarıçap uzunluğu verilen bir çemberin uzunluğu ile ilgili problemlerde ilgili matematiksel bileşenleri (çap, yarıçap, çevre uzunluğu gibi) belirler. \nb) Matematiksel bileşenler arasındaki ilişkiyi belirler.\nc) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür.\nç) Matematiksel temsillere dönüştürdüğü problemi kendi ifadeleri ile açıklar. \nd) Problemlerin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir.\ne) Belirlediği stratejileri çözüm için uygular.\nf) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir.\ng) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek alternatif çözüm yollarını değerlendirir.\nğ)  Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller.\nh) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.\n\nMAT.6.4.6. \na) Çemberde farklı ölçülere sahip merkez açıların gördüğü yayların uzunluklarına ilişkin gözlem yapar.\nb) Merkez açıların ölçüleri ile gördükleri yayların uzunlukları arasındaki ilişkiye dair örüntü bulur.\nc) Merkez açının ölçüsü ile gördüğü yayın uzunluğu arasındaki ilişkiye dair genelleme yapar.",
      "ogrenme_kanitlari": "Çalışma kâğıtları , İzleme testi, Zihin haritası, Öz değerlendirme formu, Akran değerlendirme formu, Performans görevi , Bütüncül dereceli puanlama anahtarı, Analitik dereceli puanlama anahtarı",
      "sosyal_ve_duygusal_beceriler": "SDB1.3. Kendine Uyarlama (Öz Yansıtma), SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.3. Sorumlu Karar Verme",
      "degerler": "D7. Estetik, D10. Mütevazılık, D14. Saygı",
      "okuryazarlik_becerileri": "OB2.Dijital Okuryazarlık , OB4. Görsel Okuryazarlık",
      "degerlendirme": "",
      "farklilastirma": "Farklılaştırma kapsamındaki tüm uygulamalar; öğrencilerin ilgi, ihtiyaç ve istekleri göz önünde bulundurularak öğretmenler tarafından hazırbulunuşluk düzeyi, öğrenme hızı ve öğrenme profillerine göre gruplandırma yapılarak; içerik, süreç, öğrenme ortamı ve ürün boyutlarında uyarlamalar geliştirilerek; esnek öğretim yöntem ve teknikleri kullanılarak; süreç içinde sürekli, geliştirici (biçimlendirici) değerlendirmelerle izlenip gerekli düzenlemeler yapılarak planlanır ve yürütülür.",
      "okul_temelli_planlama": "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri; yerel  çalışmalar, sosyal etkinlikler, proje ve okuma çalışmaları, araştırma ve gözlem gibi çalışmalar için ayrılan süredir.  Söz konusu çalışmalar için ayrılan süre, eğitim öğretim yılı içinde planlanır ve yıllık planlarda ifade edilir. Eğitim  öğretim yılı başında yapılması kararlaştırılan çalışmalar; okulun, öğrencinin ve çevrenin ihtiyaçları dikkate alınarak  yıl içerisinde güncellenebilir. Bu planlamalar kapsamında yürütülecek öğretim faaliyetleri; öğrenci katılımını desteklemeli, yaparak ve yaşayarak öğrenmeye olanak tanımalı, öğrencinin bütüncül gelişimine hizmet etmelidir.                                                                                        *Bu çerçeve planda belirtilen okul temelli planlama haftaları örnek olarak sunulmuştur. Planlama, zümre öğretmenler kurulunda alınan kararlara göre  okul ve ders koşulları göz önünde bulundurularak yapılmalıdır."
  })
];

/**
 * Varsayılan (tüm) yıllık plan verisi
 */
export const ANNUAL_PLAN_DATA: AnnualPlanItem[] = [
  ...ANNUAL_PLAN_5TH_GRADE,
  ...ANNUAL_PLAN_6TH_GRADE
];

/**
 * Kazanım koduna ve sınıf seviyesine göre yıllık plan maddesini getirir.
 * Birden fazla haftaya yayılan kazanımlar için tüm haftaları birleştirerek döner.
 */
export function getAnnualPlanByOutcomeCode(
  outcomeCode: string,
  gradeLevel?: number
): AnnualPlanItem | undefined {
  const plans = gradeLevel === 6 
    ? ANNUAL_PLAN_6TH_GRADE 
    : (gradeLevel === 5 ? ANNUAL_PLAN_5TH_GRADE : ANNUAL_PLAN_DATA);

  const matched = plans.filter((item) => {
    if (item.outcomeCode === outcomeCode) return true;
    if (item.ogrenme_ciktisi && item.ogrenme_ciktisi.includes(outcomeCode)) return true;
    return false;
  });

  if (matched.length === 0) {
    // Fallback: search in entire ANNUAL_PLAN_DATA
    const fallback = ANNUAL_PLAN_DATA.filter((item) => 
      item.outcomeCode === outcomeCode || (item.ogrenme_ciktisi && item.ogrenme_ciktisi.includes(outcomeCode))
    );
    if (fallback.length === 0) return undefined;
    if (fallback.length === 1) return fallback[0];
    return mergeAnnualPlanItems(fallback);
  }

  if (matched.length === 1) {
    return matched[0];
  }

  return mergeAnnualPlanItems(matched);
}

/**
 * Birden fazla haftaya yayılan kazanım maddelerini tek bir plan nesnesinde birleştirir.
 */
function mergeAnnualPlanItems(items: AnnualPlanItem[]): AnnualPlanItem {
  const first = items[0];
  const last = items[items.length - 1];
  
  const haftaLabels = Array.from(new Set(items.map(i => i.haftaNo))).sort((a, b) => a - b);
  const weekStartInfo = getAcademicWeek(haftaLabels[0]);
  const weekEndInfo = getAcademicWeek(haftaLabels[haftaLabels.length - 1]);
  
  let combinedHafta = first.hafta;
  if (haftaLabels.length > 1 && weekStartInfo && weekEndInfo) {
    const startParts = weekStartInfo.formattedDateRange.split(" ");
    const startDay = startParts[0].split("-")[0];
    const startMonth = startParts[1] || weekStartInfo.month;

    const endParts = weekEndInfo.formattedDateRange.split(" ");
    const endDay = endParts[0].split("-")[1] || endParts[0];
    const endMonth = endParts[1] || weekEndInfo.month;

    if (startMonth === endMonth) {
      combinedHafta = `${haftaLabels[0]}-${haftaLabels[haftaLabels.length - 1]}. HAFTA (${startDay}-${endDay} ${endMonth})`;
    } else {
      combinedHafta = `${haftaLabels[0]}-${haftaLabels[haftaLabels.length - 1]}. HAFTA (${startDay} ${startMonth} - ${endDay} ${endMonth})`;
    }
  }

  const combinedSaat = Array.from(new Set(items.map(i => i.saat))).join(" + ");
  
  return {
    ...first,
    hafta: combinedHafta,
    saat: combinedSaat,
    degerlendirme: Array.from(new Set(items.map(i => i.degerlendirme).filter(Boolean))).join(" | ") || first.degerlendirme
  };
}

/**
 * Hafta numarasına ve sınıf seviyesine göre yıllık plan maddesini getirir.
 */
export function getAnnualPlanByWeek(
  haftaNo: number,
  gradeLevel: number = 5
): AnnualPlanItem | undefined {
  const plans = gradeLevel === 6 ? ANNUAL_PLAN_6TH_GRADE : ANNUAL_PLAN_5TH_GRADE;
  return plans.find((item) => item.haftaNo === haftaNo);
}

/**
 * Sınıf seviyesine göre tüm yıllık plan listesini döndürür.
 */
export function getAnnualPlanForGrade(gradeLevel: number): AnnualPlanItem[] {
  return gradeLevel === 6 ? ANNUAL_PLAN_6TH_GRADE : ANNUAL_PLAN_5TH_GRADE;
}
