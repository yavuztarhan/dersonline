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
  }
): AnnualPlanItem {
  const weekInfo = getAcademicWeek(haftaNo);
  return {
    ay: weekInfo ? weekInfo.month : "",
    hafta: weekInfo ? weekInfo.label : `${haftaNo}. HAFTA`,
    haftaNo,
    saat: data.saat || (weekInfo ? weekInfo.lessonHours : "5 SAAT"),
    unite: data.unite,
    konu: data.konu,
    ogrenme_ciktisi: data.ogrenme_ciktisi,
    outcomeCode: data.outcomeCode,
    surec_bilesenleri: data.surec_bilesenleri,
    ogrenme_kanitlari: data.ogrenme_kanitlari,
    sosyal_ve_duygusal_beceriler: data.sosyal_ve_duygusal_beceriler,
    degerler: data.degerler,
    okuryazarlik_becerileri: data.okuryazarlik_becerileri,
    degerlendirme: data.degerlendirme !== undefined ? data.degerlendirme : (weekInfo ? weekInfo.specialEvent : ""),
    gradeLevel
  };
}

// ============================================================================
// 5. SINIF MATEMATİK YILLIK DERS PLANI (37 HAFTA - MAARİF MODELİ)
// ============================================================================
export const ANNUAL_PLAN_5TH_GRADE: AnnualPlanItem[] = [
  createPlanItem(1, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Temel Geometrik Çizimler ve İnşalar",
    ogrenme_ciktisi: "MAT.5.3.1. Temel geometrik çizimler için matematiksel araç ve teknolojiden yararlanabilme",
    outcomeCode: "MAT.5.3.1",
    surec_bilesenleri: "a) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikme çiziminde gerekli araç ve teknolojileri tanır. b) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikmeyi oluşturmak için uygun olan araç ve teknolojileri belirler. c) Nokta, doğru, doğru parçası, ışın, açı, çember ve dikmeyi oluşturmak için uygun araç ve teknolojileri kullanır.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(2, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Temel Geometrik Çizimler ve İnşalar",
    ogrenme_ciktisi: "MAT.5.3.2. Temel geometrik çizimlere dayalı deneyimlerini yansıtabilme",
    outcomeCode: "MAT.5.3.2",
    surec_bilesenleri: "a) Temel geometrik çizimlere dayalı deneyimlerini gözden geçirir. b) Temel geometrik çizimlerin özelliklerine yönelik çıkarım yapar. c) Çıkarımını farklı örnekler üzerinden değerlendirir.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(3, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Açı Ölçme",
    ogrenme_ciktisi: "MAT.5.3.3. Açıları ölçmek için matematiksel araç ve teknolojiden yararlanabilme",
    outcomeCode: "MAT.5.3.3",
    surec_bilesenleri: "a) Açı ölçmek için gerekli araç ve teknolojiyi tanır. b) Açı ölçmek için uygun araç ve teknolojiyi belirler. c) Açı ölçmek için uygun araç ve teknolojiyi kullanır.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(4, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Açı Ölçme",
    ogrenme_ciktisi: "MAT.5.3.4. Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair çıkarım yapabilme",
    outcomeCode: "MAT.5.3.4",
    surec_bilesenleri: "a) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair varsayımlarda bulunur. b) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşan açıları belirleyerek listeler. c) Belirlediği açıları varsayımlarıyla karşılaştırır. ç) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşan açılara dair önerme sunar. d) Sunduğu önermelerin, doğruların oluşturduğu açıların incelenmesine yönelik katkısına dair gerekçe sunar.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(5, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Çokgenler ve Çember",
    ogrenme_ciktisi: "MAT.5.3.5. Çokgenleri düzlemde ardışık olarak kesişen doğruların oluşturduğu kapalı şekiller olarak yorumlayabilme",
    outcomeCode: "MAT.5.3.5",
    surec_bilesenleri: "a) Düzlemde en az üç doğrunun -son doğru ilk doğruyla kesişecek biçimde- ardışık kesişerek oluşturdukları durumları inceler. b) Düzlemde en az üç doğrunun -son doğru ilk doğruyla kesişecek biçimde- ardışık kesişimleri ile çeşitli çokgenler oluşturur. c) Çokgenlerin düzlemde en az üç doğrunun -son doğru ilk doğruyla kesişecek biçimde- ardışık kesişimleri ile meydana geldiğini ifade eder.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(6, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Çokgenler ve Çember",
    ogrenme_ciktisi: "MAT.5.3.6. Çokgenlerin özellikleri ile ilgili edindiği deneyimleri yansıtabilme",
    outcomeCode: "MAT.5.3.6",
    surec_bilesenleri: "a) Çokgenlerin özellikleri ile ilgili edindiği deneyimleri gözden geçirir. b) Çokgenlerin kenar ve açı özelliklerine dair çıkarım yapar. c) Çıkarımını farklı örnekler üzerinden değerlendirir.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(7, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Çokgenler ve Çember",
    ogrenme_ciktisi: "MAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilme",
    outcomeCode: "MAT.5.3.7",
    surec_bilesenleri: "a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(8, 5, {
    unite: "GEOMETRİK ŞEKİLLER",
    konu: "Çokgenler ve Çember",
    ogrenme_ciktisi: "MAT.5.3.7. Matematiksel araç ve teknoloji yardımıyla düzlemde iki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilen üçgenlerin kenar özelliklerine yönelik muhakeme yapabilme",
    outcomeCode: "MAT.5.3.7",
    surec_bilesenleri: "a) İki noktada kesişen çember çiftinin merkezleri ve kesişim noktalarından biri ile inşa edilebilecek üçgenlerin kenar özelliklerine yönelik varsayımlarda bulunur. b) Örnek çizimler üzerinden, kesişen iki çemberin merkezleri ve kesişim noktalarından biri ile inşa edilen çeşitkenar, ikizkenar ve eşkenar üçgenleri belirler. c) Belirlediği üçgenlerin özelliklerini varsayımları ile karşılaştırır. ç) Varsayımlarını, inşa ettiği üçgenler ile karşılaştırarak doğrulayabileceği önermeler şeklinde ifade eder. d) Sunduğu önermelerin katkısını değerlendirir. e) Çemberin özelliklerini kullanarak önermelerini doğrulamaya yönelik matematiksel gerekçeler sunar. f) Çemberin özelliklerinin benzer inşa süreçlerindeki rolünü değerlendirir.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kontrol listesi, Performans görevi, Öz değerlendirme ve Akran değerlendirme formları, Öğrenme günlüğü, Zihin haritası, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık/Kendini Tanıma, SDB1.2. Öz Düzenleme/Kendini Düzenleme, SDB1.3. Öz Yansıtma/Kendine Uyarlama, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(9, 5, {
    unite: "SAYILAR VE NİCELİKLER (1)",
    konu: "Çok Basamaklı Sayıları Okuma ve Yazma",
    ogrenme_ciktisi: "MAT.5.1.1. Altı basamaklı sayıları okuma ve yazmayı çok basamaklı sayılara genelleyebilme",
    outcomeCode: "MAT.5.1.1",
    surec_bilesenleri: "a) Günlük hayattaki farklı bağlamlardan yola çıkarak altıdan çok basamaklı sayılar hakkında bilgi toplar. b) Sayıların bölükleri ile okunuşları arasındaki ortak özellikleri belirler. c) Sayıların bölükleri ile okunuşları arasındaki örüntüler üzerinden basamak sayısı altıdan çok olan sayıların okunuş ve yazılışları hakkında önermelerde bulunur.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(10, 5, {
    unite: "SAYILAR VE NİCELİKLER (1)",
    konu: "Çözümleme",
    ogrenme_ciktisi: "MAT.5.1.1. Altı basamaklı sayıları okuma ve yazmayı çok basamaklı sayılara genelleyebilme",
    outcomeCode: "MAT.5.1.1",
    surec_bilesenleri: "a) Günlük hayattaki farklı bağlamlardan yola çıkarak altıdan çok basamaklı sayılar hakkında bilgi toplar. b) Sayıların bölükleri ile okunuşları arasındaki ortak özellikleri belirler. c) Sayıların bölükleri ile okunuşları arasındaki örüntüler üzerinden basamak sayısı altıdan çok olan sayıların okunuş ve yazılışları hakkında önermelerde bulunur.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi, Öz değerlendirme ve akran değerlendirme formları",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(11, 5, {
    unite: "SAYILAR VE NİCELİKLER (1)",
    konu: "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
    ogrenme_ciktisi: "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
    outcomeCode: "MAT.5.1.2",
    surec_bilesenleri: "a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi, Öz değerlendirme ve akran değerlendirme formları",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(12, 5, {
    unite: "SAYILAR VE NİCELİKLER (1)",
    konu: "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
    ogrenme_ciktisi: "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
    outcomeCode: "MAT.5.1.2",
    surec_bilesenleri: "a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi, Öz değerlendirme ve akran değerlendirme formları",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(13, 5, {
    unite: "SAYILAR VE NİCELİKLER (1)",
    konu: "Doğal Sayılarla Dört İşlem İçeren Problem Çözme",
    ogrenme_ciktisi: "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme",
    outcomeCode: "MAT.5.1.2",
    surec_bilesenleri: "a) Problemin içerdiği sayı ve işlem bileşenlerini belirler. b) Problemde verilenler ile istenenlerin gerektirdiği işlemler arasındaki ilişkiyi belirler. c) Problem bağlamıyla ilişkili verilenleri uygun matematiksel temsillere dönüştürür. ç) Problemi matematiksel temsiller kullanarak kendi ifadeleri ile açıklar. d) Problemin sonucuna ilişkin tahminde bulunur ve işlemleri gerçekleştirmek için stratejiler geliştirir. e) Belirlenen strateji veya stratejileri çözüm için uygular. f) Çözüm yollarını kontrol eder ve çözüme ulaştırmayan stratejiyi değiştirir. g) Problemin çözümü için kullandığı veya geliştirdiği stratejileri gözden geçirerek kısa yolları değerlendirir. ğ) Kullandığı strateji veya stratejileri farklı problemlerin çözümlerine geneller. h) Genellemenin geçerliliğini matematiksel örneklerle değerlendirir.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi, Öz değerlendirme ve akran değerlendirme formları",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(14, 5, {
    unite: "SAYILAR VE NİCELİKLER (1) - GEOMETRİK NİCELİKLER",
    konu: "Doğal Sayılarla Dört İşlem / Dikdörtgenin Çevre Uzunluğu ve Alanı",
    ogrenme_ciktisi: "MAT.5.1.2. Doğal sayılar ve işlemler içeren gerçek yaşam problemlerini çözebilme / MAT.5.4.1. Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde kenar uzunluklarını yorumlayabilme",
    outcomeCode: "MAT.5.4.1",
    surec_bilesenleri: "MAT.5.1.2 Problem çözme bileşenleri; MAT.5.4.1. a) Kenar uzunlukları doğal sayı olan dikdörtgenin çevre uzunluğundan olası kenarları inceler. b) Verilen çevreye sahip dikdörtgenler oluşturur. c) Farklı dikdörtgenlerin aynı çevreye sahip olabileceğini açıklar.",
    ogrenme_kanitlari: "Açık uçlu sorulardan oluşan çalışma kağıdı, İzleme testi, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(15, 5, {
    unite: "GEOMETRİK NİCELİKLER",
    konu: "Dikdörtgenin Çevre Uzunluğu ve Alanı",
    ogrenme_ciktisi: "MAT.5.4.1. Dikdörtgenin çevre uzunluğu verildiğinde kenar uzunluklarını yorumlayabilme / MAT.5.4.2. Birim karelerden yola çıkarak dikdörtgenin alanını değerlendirebilme",
    outcomeCode: "MAT.5.4.2",
    surec_bilesenleri: "MAT.5.4.2. a) Birim kareleri ölçüt belirler. b) Alanı seçilen birim karelerle ölçer. c) Birim kare sayısı ile iki ardışık kenar çarpımı ilişkisini inceler. ç) Dikdörtgenin alan bağıntısına ilişkin yargıda bulunur.",
    ogrenme_kanitlari: "İzleme testi, Açık uçlu sorular, Yapılandırılmış grid, Çalışma kağıdı, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
    degerler: "D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(16, 5, {
    unite: "GEOMETRİK NİCELİKLER",
    konu: "Dikdörtgenin Çevre Uzunluğu ve Alanı",
    ogrenme_ciktisi: "MAT.5.4.3. Kenar uzunlukları doğal sayı olan bir dikdörtgenin alanının ölçüsü verildiğinde çevre uzunluğunu, çevre uzunluğu verildiğinde alanını yorumlayabilme",
    outcomeCode: "MAT.5.4.3",
    surec_bilesenleri: "a) Alanı verilenin çevresini, çevresi verilenin alanını inceler. b) Aynı alana sahip farklı dikdörtgenlerin çevrelerini ve aynı çevreye sahip olanların alanlarını belirler. c) Çevre ve alan arasındaki bağımsız değişimleri ifade eder.",
    ogrenme_kanitlari: "İzleme testi, Açık uçlu sorular, Yapılandırılmış grid, Çalışma kağıdı, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
    degerler: "D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(17, 5, {
    unite: "GEOMETRİK NİCELİKLER",
    konu: "Dikdörtgenin Çevre Uzunluğu ve Alanı",
    ogrenme_ciktisi: "MAT.5.4.4. Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemleri çözebilme",
    outcomeCode: "MAT.5.4.4",
    surec_bilesenleri: "a) Matematiksel bileşenleri belirler. b) Bileşenler arasındaki ilişkileri belirler. c) Temsilleri dönüştürür. ç) Kendi ifadeleri ile açıklar. d) Tahminde bulunur ve strateji geliştirir. e) Stratejiyi uygular. f) Çözüm yollarını kontrol eder. g) Kısa yolları değerlendirir. ğ) Geneller. h) Geçerliliği değerlendirir.",
    ogrenme_kanitlari: "İzleme testi, Açık uçlu sorular, Yapılandırılmış grid, Çalışma kağıdı, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
    degerler: "D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(18, 5, {
    unite: "GEOMETRİK NİCELİKLER",
    konu: "Dikdörtgenin Çevre Uzunluğu ve Alanı / 1. Dönem Değerlendirmesi",
    ogrenme_ciktisi: "MAT.5.4.4. Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemleri çözebilme",
    outcomeCode: "MAT.5.4.4",
    surec_bilesenleri: "Problem çözme ve matematiksel modelleme basamaklarının 1. dönem kazanımlarıyla bütünleştirilmesi.",
    ogrenme_kanitlari: "İzleme testi, Açık uçlu sorular, Yapılandırılmış grid, Çalışma kağıdı, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.1. Uyum, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
    degerler: "D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(19, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Farklı Gösterimleri",
    ogrenme_ciktisi: "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
    outcomeCode: "MAT.5.1.3",
    surec_bilesenleri: "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) kullanımını anlar. b) Modelleri (yüzlük kart, somut modeller, sayı doğrusu) seçer. c) Modelleri kullanır. ç) Modelleri yorumlar. d) Modelleri kullanışlılık açısından karşılaştırır. e) Karar verir.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(20, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Farklı Gösterimleri",
    ogrenme_ciktisi: "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
    outcomeCode: "MAT.5.1.3",
    surec_bilesenleri: "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) kullanımını anlar. b) Modelleri (yüzlük kart, somut modeller, sayı doğrusu) seçer. c) Modelleri kullanır. ç) Modelleri yorumlar. d) Modelleri kullanışlılık açısından karşılaştırır. e) Karar verir.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(21, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Farklı Gösterimleri",
    ogrenme_ciktisi: "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme",
    outcomeCode: "MAT.5.1.3",
    surec_bilesenleri: "a) Kesirlerin farklı gösterimlerinin (bileşik, tam sayılı, ondalık, yüzde) kullanımını anlar. b) Modelleri (yüzlük kart, somut modeller, sayı doğrusu) seçer. c) Modelleri kullanır. ç) Modelleri yorumlar. d) Modelleri kullanışlılık açısından karşılaştırır. e) Karar verir.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(22, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Farklı Gösterimleri / Kesirlerin Karşılaştırılması",
    ogrenme_ciktisi: "MAT.5.1.3. Gerçek yaşam durumlarına karşılık gelen kesirleri farklı biçimlerde temsil edebilme / MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.1.4",
    surec_bilesenleri: "MAT.5.1.4. a) Varsayımda bulunur. b) Genellemeleri belirler. c) Sayı doğrusu ve şekil temsilleri üzerinde gösterir. ç) Önermeleri sunar. d) Gerekçelerle açıklar.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(23, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Karşılaştırılması",
    ogrenme_ciktisi: "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.1.4",
    surec_bilesenleri: "a) Varsayımda bulunur. b) Genellemeleri belirler. c) Sayı doğrusu ve şekil temsilleri üzerinde gösterir. ç) Önermeleri sunar. d) Gerekçelerle açıklar.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(24, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Karşılaştırılması",
    ogrenme_ciktisi: "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.1.4",
    surec_bilesenleri: "a) Varsayımda bulunur. b) Genellemeleri belirler. c) Sayı doğrusu ve şekil temsilleri üzerinde gösterir. ç) Önermeleri sunar. d) Gerekçelerle açıklar.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(25, 5, {
    unite: "SAYILAR VE NİCELİKLER (2)",
    konu: "Kesirlerin Karşılaştırılması",
    ogrenme_ciktisi: "MAT.5.1.4. Farklı gösterimlerle ifade edilen kesirlerin karşılaştırılmasına yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.1.4",
    surec_bilesenleri: "a) Varsayımda bulunur. b) Genellemeleri belirler. c) Sayı doğrusu ve şekil temsilleri üzerinde gösterir. ç) Önermeleri sunar. d) Gerekçelerle açıklar.",
    ogrenme_kanitlari: "Açık uçlu ve kısa cevaplı izleme testi, Çalışma kâğıdı, Öz ve akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB3. Finansal Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(26, 5, {
    unite: "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
    konu: "Kategorik Veri Dağılımları",
    ogrenme_ciktisi: "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
    outcomeCode: "MAT.5.5.1",
    surec_bilesenleri: "a) Araştırma gerektiren durumları fark eder. b) Sorular oluşturur. c) Plan yapar. ç) Anket soruları hazırlar. d) Veri toplar. e) Araç seçer (sıklık tablosu, sütun grafiği). f) Analiz eder. g) Sonuç elde eder. ğ) Gerekçeler sunar. h) Cevap düzeyini değerlendirir. ı) Yeniden planlar.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB4. Görsel Okuryazarlık, OB6. Vatandaşlık Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(27, 5, {
    unite: "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
    konu: "Kategorik Veri Dağılımları",
    ogrenme_ciktisi: "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
    outcomeCode: "MAT.5.5.1",
    surec_bilesenleri: "a) Araştırma gerektiren durumları fark eder. b) Sorular oluşturur. c) Plan yapar. ç) Anket soruları hazırlar. d) Veri toplar. e) Araç seçer. f) Analiz eder. g) Sonuç elde eder. ğ) Gerekçeler sunar. h) Değerlendirir. ı) Yeniden planlar.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB4. Görsel Okuryazarlık, OB6. Vatandaşlık Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(28, 5, {
    unite: "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
    konu: "Kategorik Veri Dağılımları",
    ogrenme_ciktisi: "MAT.5.5.1. Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme",
    outcomeCode: "MAT.5.5.1",
    surec_bilesenleri: "a) Araştırma gerektiren durumları fark eder. b) Sorular oluşturur. c) Plan yapar. ç) Anket soruları hazırlar. d) Veri toplar. e) Araç seçer. f) Analiz eder. g) Sonuç elde eder. ğ) Gerekçeler sunar. h) Değerlendirir. ı) Yeniden planlar.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB4. Görsel Okuryazarlık, OB6. Vatandaşlık Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(29, 5, {
    unite: "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ",
    konu: "Kategorik Veri Dağılımları / Başkalarının Verilerini Yorumlama",
    ogrenme_ciktisi: "MAT.5.5.1. Kategorik veri ile çalışabilme / MAT.5.5.2. Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumları tartışabilme",
    outcomeCode: "MAT.5.5.2",
    surec_bilesenleri: "MAT.5.5.2. a) İstatistiksel temellendirme yapar. b) Hataları ya da yanlılıkları tespit eder. c) Sonuç veya yorumları çürütür ya da kabul eder.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB4. Görsel Okuryazarlık, OB6. Vatandaşlık Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(30, 5, {
    unite: "İSTATİSTİKSEL ARAŞTIRMA SÜRECİ - İŞLEMLERLE CEBİRSEL DÜŞÜNME",
    konu: "Kategorik Veri Dağılımları / Eşitliğin Korunumu",
    ogrenme_ciktisi: "MAT.5.5.2. Veriye dayalı sonuçları tartışabilme / MAT.5.2.1. Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.2.1",
    surec_bilesenleri: "MAT.5.2.1. a) Değişme, birleşme ve dağılma özelliklerine yönelik varsayımlarda bulunur. b) Genellemeleri belirler. c) Çeşitli örnekler üzerinden sınar. ç) Sembolik temsil sunar. d) Gerekçe sunar.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık, OB4. Görsel Okuryazarlık, OB6. Vatandaşlık Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(31, 5, {
    unite: "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
    konu: "Değişme-Birleşme ve Dağılma Özellikleri",
    ogrenme_ciktisi: "MAT.5.2.1. Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme",
    outcomeCode: "MAT.5.2.1",
    surec_bilesenleri: "a) Eşitliğin korunumuna, doğal sayılarla toplama ve çarpma işlemlerinin değişme, birleşme; çarpmanın toplama ve çıkarma işlemleri üzerine dağılma özelliklerine yönelik varsayımlarda bulunur. b) İncelediği örnekler üzerinden varsayımına yönelik genellemeleri belirler. c) Genellemeleri sınar. ç) Matematiksel önerme sunar. d) Gerekçe sunar.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(32, 5, {
    unite: "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
    konu: "İşlem Önceliği ve Örüntüler",
    ogrenme_ciktisi: "MAT.5.2.2. Karşılaştığı günlük hayat ya da matematiksel durumlarda işlem önceliğini yorumlayabilme / MAT.5.2.3. Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme yapabilme",
    outcomeCode: "MAT.5.2.2",
    surec_bilesenleri: "MAT.5.2.2. a) Dört işlem içeren durumlarda işlem önceliğini inceler. b) İşlem önceliğini uygular. c) İşlem önceliğini açıklar. MAT.5.2.3. a) Örüntü ilişkilerini inceler. b) Kuralı geneller.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(33, 5, {
    unite: "İŞLEMLERLE CEBİRSEL DÜŞÜNME",
    konu: "Örüntüler",
    ogrenme_ciktisi: "MAT.5.2.3. Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme yapabilme",
    outcomeCode: "MAT.5.2.3",
    surec_bilesenleri: "a) Varsayımda bulunur. b) Terimleri inceleyerek kuralı belirler. c) Sınar. ç) Önermeyi sözel ve sembolik sunar. d) Gerekçeler sunar. e) Kapsayıcı örnekler verir. f) Benzer önermelere uygulanabilirliğini değerlendirir.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(34, 5, {
    unite: "İŞLEMLERLE CEBİRSEL DÜŞÜNME - VERİDEN OLASILIĞA",
    konu: "Temel Aritmetik İşlemler ve Algoritma / Öznel Olasılık",
    ogrenme_ciktisi: "MAT.5.2.4. Temel aritmetik işlem içeren durumlardaki algoritmaları yorumlayabilme / MAT.5.6.1. Olasılığın 0 ile 1 arasında olduğunu ifade edebilme",
    outcomeCode: "MAT.5.2.4",
    surec_bilesenleri: "MAT.5.2.4. a) Algoritmik yapıyı inceler. b) Tablo veya işlemlere dönüştürür. c) İlişkileri açıklar. MAT.5.6.1. a) Olası durumları inceler. b) Tahminlerini sayılara dönüştürür. c) Olasılığın 0 ile 1 arasında olduğunu ifade eder.",
    ogrenme_kanitlari: "Performans görevi, Öz değerlendirme ve akran değerlendirme formları, Gözlem formu, Çalışma kâğıtları",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D17. Tasarruf, D18. Temizlik",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(35, 5, {
    unite: "VERİDEN OLASILIĞA",
    konu: "Öznel Olasılık",
    ogrenme_ciktisi: "MAT.5.6.1. Herhangi bir olayın olasılığının 0 (imkânsız) ile 1 (kesin) arasında olduğunu ifade edebilme",
    outcomeCode: "MAT.5.6.1",
    surec_bilesenleri: "a) Olayları ve olası durumları inceler. b) Tahminlerini farklı sayı temsillerine dönüştürür. c) Olasılığın 0 ile 1 arasında (0 ve 1 dâhil) olduğunu ifade eder.",
    ogrenme_kanitlari: "Öz değerlendirme, Akran değerlendirme, Çalışma kâğıdı, Performans görevi, Gözlem formu, İzleme testleri",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB1.3. Öz Yansıtma, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(36, 5, {
    unite: "VERİDEN OLASILIĞA",
    konu: "Öznel Olasılık",
    ogrenme_ciktisi: "MAT.5.6.2. Olayları az ya da çok olasılıklı şeklinde yapılandırabilme",
    outcomeCode: "MAT.5.6.2",
    surec_bilesenleri: "a) Olayların olasılıklarına ilişkin mantıksal ilişkiler ortaya koyar. b) Kendi öz bilgisine dayanarak olasılıkları az veya çok olasılıklı şeklinde belirler.",
    ogrenme_kanitlari: "Öz değerlendirme, Akran değerlendirme, Çalışma kâğıdı, Performans görevi, Gözlem formu, İzleme testleri",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB1.3. Öz Yansıtma, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet",
    okuryazarlik_becerileri: "OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(37, 5, {
    unite: "YIL SONU DEĞERLENDİRME - SOSYAL ETKİNLİK",
    konu: "Yıl Sonu Matematik Şenliği & Genel Değerlendirme",
    ogrenme_ciktisi: "Yıl Sonu Genel Tekrar, Beceri ve Değerler Değerlendirmesi",
    outcomeCode: "MAT.5.GENEL",
    surec_bilesenleri: "Yıl boyunca edinilen tüm kavramsal ve sosyal-duygusal becerilerin gözden geçirilmesi ve yansıtılması.",
    ogrenme_kanitlari: "Yıl sonu proje sergisi, Portfolyo değerlendirmesi, Öğrenme günlüğü analizi",
    sosyal_ve_duygusal_beceriler: "SDB1.1, SDB1.2, SDB1.3, SDB2.1, SDB2.2, SDB2.3, SDB3.1, SDB3.2, SDB3.3",
    degerler: "Tüm Maarif Değerleri",
    okuryazarlik_becerileri: "Tüm Okuryazarlık Becerileri"
  })
];

// ============================================================================
// 6. SINIF MATEMATİK YILLIK DERS PLANI (37 HAFTA - MAARİF MODELİ)
// ============================================================================
export const ANNUAL_PLAN_6TH_GRADE: AnnualPlanItem[] = [
  createPlanItem(1, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Çarpanlar ve Katlar",
    ogrenme_ciktisi: "MAT.6.1.1. Bir doğal sayının çarpanlarını ve katlarını belirleyebilme",
    outcomeCode: "MAT.6.1.1",
    surec_bilesenleri: "a) Alan modelleri ve ritmik sayma ile doğal sayıların çarpan ikililerini belirler. b) Bir doğal sayının pozitif tam sayı katlarını oluşturur. c) Çarpan ve bölen kavramlarının özdeşliğini açıklar.",
    ogrenme_kanitlari: "Gözlem formu, Çalışma kâğıdı, Kolileme fabrikası görevleri, İzleme testi, Öğrenme günlüğü",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(2, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Çarpanlar ve Katlar",
    ogrenme_ciktisi: "MAT.6.1.1. Bir doğal sayının çarpanlarını ve katlarını belirleyebilme",
    outcomeCode: "MAT.6.1.1",
    surec_bilesenleri: "a) Çarpan gökkuşağı modeli ile küçükten büyüğe bölen dizilimi yapar. b) Ritmik sıçrama sayı doğrusunda kat ilişkilerini çözümler. c) Problem durumlarında çarpan-kat ilişkisini geneller.",
    ogrenme_kanitlari: "Etkinlik kağıdı (Gökkuşağı şifresi), Akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(3, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Bölünebilme Kriterleri",
    ogrenme_ciktisi: "MAT.6.1.2. 2, 3, 4, 5, 6, 9 ve 10'a kalansız bölünebilme kriterlerini gerekçelendirebilme",
    outcomeCode: "MAT.6.1.2",
    surec_bilesenleri: "a) 2, 5 ve 10 ile bölünebilmede son basamak çözümlemesi yapar. b) 10 tabanındaki basamak değerlerinin 2, 5 ve 10'un katı oluşundan yola çıkarak kriterin mantığını açıklar. c) Kargo dağıtım ve paketleme bağlamında son basamak analizini uygular.",
    ogrenme_kanitlari: "Bölünebilme dijital laboratuvarı, Basamak analizi çalışma kâğıdı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(4, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Bölünebilme Kriterleri",
    ogrenme_ciktisi: "MAT.6.1.2. 2, 3, 4, 5, 6, 9 ve 10'a kalansız bölünebilme kriterlerini gerekçelendirebilme",
    outcomeCode: "MAT.6.1.2",
    surec_bilesenleri: "a) 10=9+1 ve 100=99+1 eşitliklerinden yararlanarak 3 ve 9 ile bölünebilmede rakamlar toplamı kuralını ispatlar. b) 4 ve 6 ile bölünebilmede son iki basamak ve birleşik kriterleri (hem 2 hem 3) test eder. c) Kriptografik kasa şifresi çözme ve eksik basamak problemlerini çözer.",
    ogrenme_kanitlari: "Kasa şifresi etkinlik kağıdı, D/Y testi, Akıllı tahta basamak simülasyonu",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(5, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Asal Sayılar ve Asal Çarpanlar",
    ogrenme_ciktisi: "MAT.6.1.3. Asal sayıları ve bir doğal sayının asal çarpanlarını belirleyebilme",
    outcomeCode: "MAT.6.1.3",
    surec_bilesenleri: "a) 1 ve kendisinden başka böleni olmayan 1'den büyük doğal sayıları asal sayı olarak tanımlar. b) 1-100 tablosunda Eratosthenes kalburunu uygulayarak 25 asal sayıyı keşfeder. c) 1 sayısının neden asal olmadığını bölen sayısı ile gerekçelendirir.",
    ogrenme_kanitlari: "Eratosthenes kalburu etkinlik kâğıdı, Asal parkur oyunu, Gözlem formu",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Kendini Tanıma, SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği",
    degerler: "D3. Çalışkanlık, D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(6, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Asal Sayılar ve Asal Çarpanlar",
    ogrenme_ciktisi: "MAT.6.1.3. Asal sayıları ve bir doğal sayının asal çarpanlarını belirleyebilme",
    outcomeCode: "MAT.6.1.3",
    surec_bilesenleri: "a) Çarpan ağacı ve dikey bölme algoritması (bölen listesi) yöntemlerini kullanır. b) Bir doğal sayıyı asal çarpanlarının çarpımı ve üslü ifade biçiminde yazar. c) Kriptografide iki büyük asal sayının çarpımının rolünü inceler.",
    ogrenme_kanitlari: "Çarpan ağacı & algoritma çalışma kâğıdı, Asal şifreleme laboratuvarı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB3.2. Esneklik, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D6. Dürüstlük, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(7, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Ortak Bölen ve Ortak Kat",
    ogrenme_ciktisi: "MAT.6.1.4. İki doğal sayının ortak bölenleri ile ortak katlarını belirleyebilme ve ilgili problemleri çözebilme",
    outcomeCode: "MAT.6.1.4",
    surec_bilesenleri: "a) İki doğal sayının bölen listelerini ayrı ayrı oluşturup kesişim kümesini belirler. b) Farklı miktardaki sıvıları (zeytinyağı-nar ekşisi) eşit hacimli bidonlara bölme problemlerini çözümler. c) Ortak bölenler kümesinin en büyüğünü belirler (EBOB kısaltması kullanılmaz).",
    ogrenme_kanitlari: "Ortak bidonlama çalışma kâğıdı, Venn şeması dijital modeli, Problem çözme formu",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik"
  }),
  createPlanItem(8, 6, {
    unite: "SAYILAR VE NİCELİKLER (DOĞAL SAYILAR)",
    konu: "Ortak Bölen ve Ortak Kat",
    ogrenme_ciktisi: "MAT.6.1.4. İki doğal sayının ortak bölenleri ile ortak katlarını belirleyebilme ve ilgili problemleri çözebilme",
    outcomeCode: "MAT.6.1.4",
    surec_bilesenleri: "a) İki doğal sayının pozitif katlarını çift sayı doğrusunda eşleştirerek ortak katlarını belirler. b) Periyodik nöbet, otobüs seferi ve zil çalma problemlerini modeller. c) Ortak böleni yalnızca 1 olan sayıların aralarında asal olduğunu ifade eder.",
    ogrenme_kanitlari: "Ortak seferler çalışma kâğıdı, Aralarında asallık dedektörü, 1. Ünite izleme sınavı",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D14. Saygı, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB7. Veri Okuryazarlığı, OB8. Sürdürülebilirlik"
  }),
  createPlanItem(9, 6, {
    unite: "KÜMELER",
    konu: "Kümelerde Temel Kavramlar",
    ogrenme_ciktisi: "MAT.6.1.5. Kümeler ile ilgili temel kavramları anlayabilme",
    outcomeCode: "MAT.6.1.5",
    surec_bilesenleri: "a) İyi tanımlanmış nesneler topluluğunu küme olarak ifade eder. b) Liste, Venn şeması ve ortak özellik yöntemlerini kullanır. c) Elemanıdır (∈), elemanı değildir (∉) ve eleman sayısı s(A) sembollerini kullanır. ç) Boş kümeyi (∅ veya {}) modeller.",
    ogrenme_kanitlari: "Küme temsil çalışma kâğıdı, Sınıf nesneleri kümeleme oyunu, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB2.2. İş Birliği, SDB3.1. Uyum",
    degerler: "D6. Dürüstlük, D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(10, 6, {
    unite: "KÜMELER",
    konu: "Kümelerde Kesişim ve Birleşim",
    ogrenme_ciktisi: "MAT.6.1.5. Kümeler ile ilgili temel kavramları anlayabilme ve işlemleri uygulayabilme",
    outcomeCode: "MAT.6.1.5",
    surec_bilesenleri: "a) İki kümenin kesişim (∩) ve birleşim (∪) işlemlerini Venn şeması üzerinde gösterir. b) Günlük yaşam durumlarını küme işlemleriyle modeller. c) Ortak elemanları olan ve ayrık kümeleri ayırt eder.",
    ogrenme_kanitlari: "Venn şeması çalışma kâğıdı, Kesişim-birleşim kart oyunu, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D1. Adalet, D5. Duyarlılık, D7. Estetik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(11, 6, {
    unite: "TAM SAYILAR",
    konu: "Tam Sayıların Anlamı ve Temsili",
    ogrenme_ciktisi: "MAT.6.1.6. Tam sayıları tanıyabilme ve sayı doğrusunda gösterebilme",
    outcomeCode: "MAT.6.1.6",
    surec_bilesenleri: "a) Sıcaklık, deniz seviyesi, borç-alacak ve asansör durumlarından yola çıkarak yönlü sayıları anlamlandırır. b) Pozitif tam sayılar (+), negatif tam sayılar (-) ve 0 (başlangıç noktası) kavramlarını modeller.",
    ogrenme_kanitlari: "Yönlü sayılar posteri, Termometre ve asansör çalışma kâğıdı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB1.2. Öz Düzenleme, SDB3.1. Uyum",
    degerler: "D3. Çalışkanlık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(12, 6, {
    unite: "TAM SAYILAR",
    konu: "Tam Sayıları Karşılaştırma ve Sıralama",
    ogrenme_ciktisi: "MAT.6.1.6. Tam sayıları tanıyabilme ve sayı doğrusunda gösterebilme",
    outcomeCode: "MAT.6.1.6",
    surec_bilesenleri: "a) Tam sayıları yatay ve dikey sayı doğrusuna yerleştirir. b) Sayı doğrusunda sağa gidildikçe sayıların büyüdüğünü, sola gidildikçe küçüldüğünü açıklar. c) Negatif tam sayıların 0'a ve birbirine göre büyüklük ilişkilerini sıralar.",
    ogrenme_kanitlari: "Sayı doğrusu karşılaştırma kâğıdı, Sıralama kartları, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D1. Adalet, D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(13, 6, {
    unite: "TAM SAYILAR",
    konu: "Mutlak Değer",
    ogrenme_ciktisi: "MAT.6.1.6. Tam sayıları tanıyabilme ve sayı doğrusunda gösterebilme",
    outcomeCode: "MAT.6.1.6",
    surec_bilesenleri: "a) Bir tam sayının başlangıç noktasına (0'a) olan uzaklığını mutlak değer (|x|) olarak tanımlar. b) Uzaklığın negatif olamayacağını fark eder. c) Mutlak değer içeren sıralama ve karşılaştırma problemlerini çözer.",
    ogrenme_kanitlari: "Mutlak değer çalışma kâğıdı, Mesafe simülasyonu, Kısa cevaplı test",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB3.3. Sorumlu Karar Verme",
    degerler: "D6. Dürüstlük, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(14, 6, {
    unite: "KESİRLERLE İŞLEMLER",
    konu: "Kesirlerle Toplama ve Çıkarma",
    ogrenme_ciktisi: "MAT.6.1.7. Kesirlerle toplama ve çıkarma işlemlerini yapabilme",
    outcomeCode: "MAT.6.1.7",
    surec_bilesenleri: "a) Paydaları eşit veya birbiri ile kat ilişkisi olan kesirlerle toplama ve çıkarma yapar. b) Payda eşitlemenin birimleri eşitlemek anlamına geldiğini modeller üzerinde gösterir. c) Tam sayılı kesirlerle işlemleri kavrar.",
    ogrenme_kanitlari: "Kesir modelleri çalışma kâğıdı, Alan ve şerit modelleri, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(15, 6, {
    unite: "KESİRLERLE İŞLEMLER",
    konu: "Kesirlerle Toplama ve Çıkarma Problemleri",
    ogrenme_ciktisi: "MAT.6.1.7. Kesirlerle toplama ve çıkarma işlemlerini yapabilme ve problem çözebilme",
    outcomeCode: "MAT.6.1.7",
    surec_bilesenleri: "a) Kesirlerle toplama ve çıkarma gerektiren günlük hayat problemlerini çözer. b) Tahmin stratejilerini (yarıma, bütüne yakınlık) kullanarak işlem sonucunu yaklaşık olarak belirler. c) Çözüm adımlarını kontrol eder.",
    ogrenme_kanitlari: "Problem çözme kâğıdı, Akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D5. Duyarlılık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(16, 6, {
    unite: "KESİRLERLE İŞLEMLER",
    konu: "Kesirlerle Çarpma İşlemi",
    ogrenme_ciktisi: "MAT.6.1.8. Kesirlerle çarpma ve bölme işlemlerini yapabilme",
    outcomeCode: "MAT.6.1.8",
    surec_bilesenleri: "a) Bir doğal sayı ile bir kesrin çarpımını tekrarlı toplama ve modelleme ile açıklar. b) İki kesrin çarpımını alan modeli (dikdörtgensel bölge kesişimi) ile anlamlandırır. c) Bir sayıyı 1'den küçük bir kesirle çarptığında sonucun küçüldüğünü yorumlar.",
    ogrenme_kanitlari: "Alan modeli çalışma kâğıdı, Kesir çarpma laboratuvarı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(17, 6, {
    unite: "KESİRLERLE İŞLEMLER",
    konu: "Kesirlerle Bölme İşlemi",
    ogrenme_ciktisi: "MAT.6.1.8. Kesirlerle çarpma ve bölme işlemlerini yapabilme",
    outcomeCode: "MAT.6.1.8",
    surec_bilesenleri: "a) Bir doğal sayıyı bir kesre bölmeyi 'içinde kaç tane var' mantığıyla somutlaştırır. b) Bir kesri bir doğal sayıya bölmeyi parçalama olarak modeller. c) İki kesrin bölme işleminde ters çevirip çarpma kuralının gerekçesini birim kesirler üzerinden kavrar.",
    ogrenme_kanitlari: "Bölme modelleri çalışma kâğıdı, Sayı doğrusunda bölme etkinliği, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D1. Adalet, D3. Çalışkanlık, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(18, 6, {
    unite: "KESİRLERLE İŞLEMLER",
    konu: "Kesir Problemleri ve 1. Dönem Sonu Değerlendirmesi",
    ogrenme_ciktisi: "MAT.6.1.8. Kesirlerle ilgili çok adımlı problemleri çözebilme",
    outcomeCode: "MAT.6.1.8",
    surec_bilesenleri: "a) Dört işlem içeren kesir problemlerini çözer. b) 1. Dönem boyunca öğrenilen çarpanlar, bölünebilme, asallar, kümeler, tam sayılar ve kesirler konularının genel tekrarını yapar.",
    ogrenme_kanitlari: "Dönem sonu değerlendirme sınavı, Portfolyo sunumu, Öğrenme günlüğü analizi",
    sosyal_ve_duygusal_beceriler: "SDB1.1, SDB1.2, SDB1.3, SDB2.1, SDB2.2, SDB3.3",
    degerler: "Tüm Maarif Değerleri",
    okuryazarlik_becerileri: "Tüm Okuryazarlık Becerileri"
  }),
  createPlanItem(19, 6, {
    unite: "ONDALIK GÖSTERİM",
    konu: "Ondalık Gösterimleri Çözümleme ve Yuvarlama",
    ogrenme_ciktisi: "MAT.6.1.9. Ondalık gösterimleri verilen sayıları çözümleyebilme ve yuvarlayabilme",
    outcomeCode: "MAT.6.1.9",
    surec_bilesenleri: "a) Ondalık gösterimleri 10'un kuvvetleri ve basamak değerleri biçiminde çözümler. b) Ondalık gösterimleri istenen basamağa (onda birler, yüzde birler, birler) göre yuvarlar. c) Alışveriş ve tartım bağlamında yuvarlamayı uygular.",
    ogrenme_kanitlari: "Çözümleme ve yuvarlama kâğıdı, Fiyat etiketi analizi, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D6. Dürüstlük, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(20, 6, {
    unite: "ONDALIK GÖSTERİM",
    konu: "Ondalık Gösterimlerle Çarpma İşlemi",
    ogrenme_ciktisi: "MAT.6.1.9. Ondalık gösterimleri verilen sayılarla çarpma ve bölme işlemlerini yapabilme",
    outcomeCode: "MAT.6.1.9",
    surec_bilesenleri: "a) Ondalık gösterimleri verilen iki sayının çarpma işlemini yapar. b) Virgülün basamak kaydırma kuralını kesir çarpımı ile ilişkilendirir. c) 10, 100 ve 1000 ile kısa yoldan çarpma kuralını uygular.",
    ogrenme_kanitlari: "Ondalık çarpma çalışma kâğıdı, Kısa yol simülasyonu, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(21, 6, {
    unite: "ONDALIK GÖSTERİM",
    konu: "Ondalık Gösterimlerle Bölme ve Problemler",
    ogrenme_ciktisi: "MAT.6.1.9. Ondalık gösterimleri verilen sayılarla çarpma ve bölme işlemlerini yapabilme ve problem çözebilme",
    outcomeCode: "MAT.6.1.9",
    surec_bilesenleri: "a) Ondalık gösterimleri verilen sayıları böler; böleni virgülden kurtarma mantığını açıklar. b) 10, 100 ve 1000 ile kısa yoldan bölme yapar. c) Günlük hayat ve para hesabı problemlerini çözer.",
    ogrenme_kanitlari: "Ondalık problemler kâğıdı, Akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB2.1. İletişim, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D3. Çalışkanlık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık"
  }),
  createPlanItem(22, 6, {
    unite: "ORAN",
    konu: "Oran Kavramı ve İki Çokluğun Karşılaştırılması",
    ogrenme_ciktisi: "MAT.6.2.1. İki çokluğun birbirine oranını belirleyebilme",
    outcomeCode: "MAT.6.2.1",
    surec_bilesenleri: "a) İki çokluğun bölme yoluyla karşılaştırılmasını oran olarak ifade eder (a/b veya a:b). b) Oranın sırasının önemini açıklar. c) Oranı en sade biçimiyle ifade eder.",
    ogrenme_kanitlari: "Oran modelleri çalışma kâğıdı, Karışım ve tarif analizleri, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB2.2. İş Birliği, SDB3.1. Uyum",
    degerler: "D1. Adalet, D7. Estetik, D14. Saygı",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(23, 6, {
    unite: "ORAN",
    konu: "Birimli ve Birimsiz Oran",
    ogrenme_ciktisi: "MAT.6.2.1. Birimli ve birimsiz oranları ayırt edebilme",
    outcomeCode: "MAT.6.2.1",
    surec_bilesenleri: "a) Aynı birime sahip çoklukların oranının birimsiz oran olduğunu fark eder. b) Farklı birimlere sahip çoklukların (yol/zaman: km/sa veya m/sn) birimli oran olduğunu açıklar. c) Hız ve yoğunluk problemlerini çözümler.",
    ogrenme_kanitlari: "Birimli oran çalışma kâğıdı, Hız hesaplama etkinliği, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB8. Sürdürülebilirlik"
  }),
  createPlanItem(24, 6, {
    unite: "CEBİRSEL İFADELER",
    konu: "Cebirsel İfadelerin Anlamı",
    ogrenme_ciktisi: "MAT.6.2.2. Cebirsel ifadeleri yazabilme ve değerini hesaplayabilme",
    outcomeCode: "MAT.6.2.2",
    surec_bilesenleri: "a) Değişken (bilinmeyen: x, a, y), terim, katsayı ve sabit terim kavramlarını modeller. b) Günlük dildeki sözel durumları cebirsel ifadelere dönüştürür (Örn: Bir sayının 3 katının 5 fazlası: 3x+5).",
    ogrenme_kanitlari: "Cebir karoları çalışma kâğıdı, Sözel-cebirsel eşleştirme oyunu, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık"
  }),
  createPlanItem(25, 6, {
    unite: "CEBİRSEL İFADELER",
    konu: "Cebirsel İfadelerde Değer Hesaplama",
    ogrenme_ciktisi: "MAT.6.2.2. Cebirsel ifadeleri yazabilme ve değerini hesaplayabilme",
    outcomeCode: "MAT.6.2.2",
    surec_bilesenleri: "a) Değişkenin verilen farklı doğal sayı değerleri için cebirsel ifadenin sayısal değerini hesaplar. b) Benzer terimleri ayırt eder ve toplama-çıkarma ile sadeleştirir. c) Örüntülerin genel kuralını cebirsel olarak ifade eder.",
    ogrenme_kanitlari: "Değer hesaplama çalışma kâğıdı, Formül makinesi laboratuvarı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D6. Dürüstlük, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(26, 6, {
    unite: "VERİ ANALİZİ",
    konu: "İki Gruba Ait Araştırma Sorusu ve Veri Toplama",
    ogrenme_ciktisi: "MAT.6.3.1. İki gruba ait verileri toplayabilme, düzenleyebilme ve analiz edebilme",
    outcomeCode: "MAT.6.3.1",
    surec_bilesenleri: "a) İki veri grubunu karşılaştırmayı gerektiren araştırma soruları üretir (Örn: Kız ve erkek öğrencilerin kitap okuma süreleri). b) Örnekleme uygun anket ve veri toplama planı hazırlar.",
    ogrenme_kanitlari: "Araştırma planı formu, Anket hazırlama kâğıdı, Gözlem formu",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB2.1. İletişim, SDB2.2. İş Birliği, SDB2.3. Sosyal Farkındalık",
    degerler: "D5. Duyarlılık, D6. Dürüstlük, D14. Saygı",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB6. Vatandaşlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(27, 6, {
    unite: "VERİ ANALİZİ",
    konu: "İkili Sıklık Tablosu ve İkili Sütun Grafiği",
    ogrenme_ciktisi: "MAT.6.3.1. İki gruba ait verileri toplayabilme, düzenleyebilme ve analiz edebilme",
    outcomeCode: "MAT.6.3.1",
    surec_bilesenleri: "a) Toplanan verileri ikili sıklık tablosunda organize eder. b) Verileri ikili sütun grafiği ile görselleştirir. c) Grafiğin eksenlerini, ölçeğini ve başlığını doğru yapılandırır.",
    ogrenme_kanitlari: "Grafik çizim çalışma kâğıdı, Dijital grafik oluşturucu, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D18. Temizlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(28, 6, {
    unite: "VERİ ANALİZİ",
    konu: "Aritmetik Ortalama ve Açıklık",
    ogrenme_ciktisi: "MAT.6.3.1. Veri gruplarını aritmetik ortalama ve açıklık kullanarak karşılaştırabilme",
    outcomeCode: "MAT.6.3.1",
    surec_bilesenleri: "a) Bir veri grubunun aritmetik ortalamasını hesaplar ve merkezi eğilim olarak yorumlar. b) En büyük ve en küçük değer arasındaki farkı (açıklık) yayılma ölçüsü olarak belirler. c) İki grubu ortalama ve açıklık ile karşılaştırıp karar verir.",
    ogrenme_kanitlari: "Ortalama ve açıklık çalışma kâğıdı, Veri analizi performans görevi, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D6. Dürüstlük, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB7. Veri Okuryazarlığı"
  }),
  createPlanItem(29, 6, {
    unite: "AÇILAR",
    konu: "Komşu, Tümler ve Bütünler Açılar",
    ogrenme_ciktisi: "MAT.6.3.2. Açılar arasındaki ilişkileri belirleyebilme ve problem çözebilme",
    outcomeCode: "MAT.6.3.2",
    surec_bilesenleri: "a) Ortak bir kenarı ve köşesi olan açıları komşu açılar olarak tanımlar. b) Ölçüleri toplamı 90° olan açıları tümler açılar, 180° olan açıları bütünler açılar olarak adlandırır. c) Komşu tümler ve komşu bütünler açı problemlerini çözer.",
    ogrenme_kanitlari: "Açı modelleri çalışma kâğıdı, Açı ölçer ile çizimler, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D7. Estetik, D14. Saygı, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(30, 6, {
    unite: "AÇILAR",
    konu: "Ters Açılar ve Açı Problemleri",
    ogrenme_ciktisi: "MAT.6.3.2. Açılar arasındaki ilişkileri belirleyebilme ve problem çözebilme",
    outcomeCode: "MAT.6.3.2",
    surec_bilesenleri: "a) Kesişen iki doğrunun oluşturduğu zıt yönlü açıları ters açılar olarak tanımlar. b) Ters açıların ölçülerinin eşit olduğunu dinamik geometri ile gösterir. c) Mimarlık ve haritacılık bağlamında açı problemlerini çözümler.",
    ogrenme_kanitlari: "Ters açı çalışma kâğıdı, Geometri tahtası inşaları, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(31, 6, {
    unite: "ALAN ÖLÇME",
    konu: "Paralelkenarın Alanı",
    ogrenme_ciktisi: "MAT.6.4.1. Paralelkenar ve üçgenin alan bağıntılarını oluşturabilme",
    outcomeCode: "MAT.6.4.1",
    surec_bilesenleri: "a) Paralelkenarın tabanına ait yükseklik modellerini çizer. b) Paralelkenarı kesip dikdörtgene dönüştürerek Alan = Taban × Yükseklik (a·h) bağıntısını oluşturur. c) Farklı tabanlara ait yüksekliklerle alan hesaplar.",
    ogrenme_kanitlari: "Dönüşüm modelleri çalışma kâğıdı, Alan simülasyonu, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.2. Esneklik",
    degerler: "D3. Çalışkanlık, D7. Estetik, D17. Tasarruf",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(32, 6, {
    unite: "ALAN ÖLÇME",
    konu: "Üçgenin Alanı",
    ogrenme_ciktisi: "MAT.6.4.1. Paralelkenar ve üçgenin alan bağıntılarını oluşturabilme",
    outcomeCode: "MAT.6.4.1",
    surec_bilesenleri: "a) Dar, dik ve geniş açılı üçgenlerde tabana ait yükseklikleri çizer. b) İki eş üçgenin birleşerek paralelkenar oluşturmasından yola çıkarak Alan = (Taban × Yükseklik) / 2 bağıntısını gerekçelendirir. c) Çeşitli üçgen alanlarını hesaplar.",
    ogrenme_kanitlari: "Üçgen alanı çalışma kâğıdı, Geometrik kanıt modelleri, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D7. Estetik, D16. Sorumluluk",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(33, 6, {
    unite: "ALAN ÖLÇME",
    konu: "Alan Ölçme ve Arazi Ölçü Birimleri",
    ogrenme_ciktisi: "MAT.6.4.1. Alan ve arazi ölçü birimlerini tanıyabilme ve dönüştürebilme",
    outcomeCode: "MAT.6.4.1",
    surec_bilesenleri: "a) m², dm², cm², mm² ve km² arasındaki 100'er kat büyüyüp küçülme ilişkisini açıklar. b) Ar (a), dekar (daa/dönüm) ve hektar (ha) arazi ölçü birimlerini tanır. c) Tarım ve gayrimenkul alan problemlerini çözer.",
    ogrenme_kanitlari: "Birim dönüştürme kâğıdı, Arazi hesabı performans görevi, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.3. Öz Yansıtma, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D16. Sorumluluk, D17. Tasarruf, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB3. Finansal Okuryazarlık, OB8. Sürdürülebilirlik"
  }),
  createPlanItem(34, 6, {
    unite: "ÇEMBER",
    konu: "Çemberin Temel Elemanları ve Pi Sayısı",
    ogrenme_ciktisi: "MAT.6.4.2. Çemberin elemanlarını tanıyabilme ve çevre uzunluğunu hesaplayabilme",
    outcomeCode: "MAT.6.4.2",
    surec_bilesenleri: "a) Merkez, yarıçap (r), çap (R) kavramlarını modeller. b) Dairesel nesnelerin çevre uzunluğunun çapına oranının sabit bir sayı (Pi: π ≈ 3, 3.14 veya 22/7) olduğunu deneysel olarak keşfeder.",
    ogrenme_kanitlari: "İp ve cetvel ile Pi deneyi çalışma kâğıdı, Çember laboratuvarı, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.1. Öz Farkındalık, SDB2.2. İş Birliği, SDB3.1. Uyum",
    degerler: "D3. Çalışkanlık, D7. Estetik, D19. Vatanseverlik",
    okuryazarlik_becerileri: "OB2. Dijital Okuryazarlık, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(35, 6, {
    unite: "ÇEMBER",
    konu: "Çemberin Çevre Uzunluğu ve Problemleri",
    ogrenme_ciktisi: "MAT.6.4.2. Çemberin elemanlarını tanıyabilme ve çevre uzunluğunu hesaplayabilme",
    outcomeCode: "MAT.6.4.2",
    surec_bilesenleri: "a) Ç = 2·π·r bağıntısını kullanarak çember ve daire dilimlerinin çevre uzunluğunu hesaplar. b) Tekerlek turu, pist ve saat kadranı problemlerini modeller. c) Çözüm stratejilerini değerlendirir.",
    ogrenme_kanitlari: "Çevre problemleri çalışma kâğıdı, Akran değerlendirme, Performans görevi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D1. Adalet, D7. Estetik, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB4. Görsel Okuryazarlık"
  }),
  createPlanItem(36, 6, {
    unite: "GEOMETRİK CİSİMLER & SIVI ÖLÇME",
    konu: "Dikdörtgenler Prizmasının Hacmi ve Sıvı Ölçme",
    ogrenme_ciktisi: "MAT.6.4.3. Dikdörtgenler prizmasının hacim bağıntısını oluşturabilme ve sıvı ölçüleriyle ilişkilendirebilme",
    outcomeCode: "MAT.6.4.3",
    surec_bilesenleri: "a) Birim küplerle dikdörtgenler prizmasının hacmini (Taban Alanı × Yükseklik) modeller. b) Litre (L), desilitre (dL), santilitre (cL), mililitre (mL) ile 1 dm³ = 1 L ilişkisini kurar. c) Depo ve su tasarrufu problemlerini çözer.",
    ogrenme_kanitlari: "Hacim modelleri çalışma kâğıdı, Sıvı ölçümü deneyi, İzleme testi",
    sosyal_ve_duygusal_beceriler: "SDB1.2. Öz Düzenleme, SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
    degerler: "D3. Çalışkanlık, D5. Duyarlılık, D16. Sorumluluk, D17. Tasarruf",
    okuryazarlik_becerileri: "OB1. Bilgi Okuryazarlığı, OB8. Sürdürülebilirlik Okuryazarlığı"
  }),
  createPlanItem(37, 6, {
    unite: "YIL SONU DEĞERLENDİRME - SOSYAL ETKİNLİK",
    konu: "6. Sınıf Matematik Şenliği & Yıl Sonu Genel Değerlendirmesi",
    ogrenme_ciktisi: "6. Sınıf Matematik Yıl Sonu Genel Tekrar, Beceri ve Değerler Değerlendirmesi",
    outcomeCode: "MAT.6.GENEL",
    surec_bilesenleri: "Yıl boyunca edinilen tüm matematiksel kavramların, problem çözme stratejilerinin ve Maarif değerlerinin sergilenmesi.",
    ogrenme_kanitlari: "Yıl sonu proje sergisi, Portfolyo değerlendirmesi, Öğrenme günlüğü analizi",
    sosyal_ve_duygusal_beceriler: "SDB1.1, SDB1.2, SDB1.3, SDB2.1, SDB2.2, SDB2.3, SDB3.1, SDB3.2, SDB3.3",
    degerler: "Tüm Maarif Değerleri",
    okuryazarlik_becerileri: "Tüm Okuryazarlık Becerileri"
  })
];

// Tüm sınıfların birleşik planı
export const ANNUAL_PLAN_DATA: AnnualPlanItem[] = [
  ...ANNUAL_PLAN_5TH_GRADE,
  ...ANNUAL_PLAN_6TH_GRADE
];

// ============================================================================
// ARAMA VE ERİŞİM FONKSİYONLARI (LOOKUP FUNCTIONS)
// ============================================================================

/**
 * Kazanım koduna göre (Örn: "MAT.6.1.2", "MAT.5.3.1") yıllık plan maddesini döndürür.
 * Tarih ve hafta etiketini merkezi takvimden dinamik olarak getirir.
 */
export function getAnnualPlanByOutcomeCode(code: string, gradeLevel?: number): AnnualPlanItem | undefined {
  if (!code) return undefined;
  const cleanCode = code.trim();

  // Hedef sınıf düzeyini belirle (koddan veya parametreden)
  let targetGrade = gradeLevel;
  if (!targetGrade) {
    if (cleanCode.startsWith("MAT.5") || cleanCode.includes("5.")) targetGrade = 5;
    else if (cleanCode.startsWith("MAT.6") || cleanCode.includes("6.")) targetGrade = 6;
  }

  const dataset = targetGrade === 6 ? ANNUAL_PLAN_6TH_GRADE : targetGrade === 5 ? ANNUAL_PLAN_5TH_GRADE : ANNUAL_PLAN_DATA;

  const exact = dataset.find((p) => p.outcomeCode === cleanCode || p.ogrenme_ciktisi.includes(cleanCode));
  if (exact) return exact;

  return dataset.find((p) => cleanCode.startsWith(p.outcomeCode) || p.outcomeCode.startsWith(cleanCode));
}

/**
 * Hafta numarasına ve sınıf düzeyine göre yıllık plan maddesini döndürür.
 */
export function getAnnualPlanByWeek(weekNumber: number, gradeLevel = 5): AnnualPlanItem | undefined {
  const dataset = gradeLevel === 6 ? ANNUAL_PLAN_6TH_GRADE : ANNUAL_PLAN_5TH_GRADE;
  return dataset.find((p) => p.haftaNo === weekNumber);
}

/**
 * Belirtilen sınıf düzeyine ait tüm yıllık plan listesini döndürür.
 */
export function getAnnualPlanByGrade(gradeLevel: 5 | 6): AnnualPlanItem[] {
  return gradeLevel === 6 ? ANNUAL_PLAN_6TH_GRADE : ANNUAL_PLAN_5TH_GRADE;
}
