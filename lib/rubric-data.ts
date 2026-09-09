import { SelfAssessmentRubric } from '@/types';

export const OUTCOME_RUBRICS: Record<string, SelfAssessmentRubric> = {
  'MAT.6.1.1': {
    id: 'rubric-mat-6-1-1',
    outcomeId: 'MAT.6.1.1',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Bir Doğal Sayının Çarpanları ve Katları',
    description:
      'Karşılaştığınız problem durumlarında bir doğal sayının çarpan ve katlarına yönelik muhakeme yapabilme, alan ve gökkuşağı modellerini kullanma becerilerinizi dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Çarpan Kavramını Anlama (Bölen İlişkisi & Kalansız Bölme)',
        category: 'Kavramsal Anlama & Alan Modeli',
        levelDescriptions: {
          1: 'Sayının çarpanlarını bulurken eksik bırakır, kalansız bölme ilişkisini kuramaz.',
          2: 'Küçük sayıların çarpanlarını bulur, büyük sayılarda bazı çarpanları atlar.',
          3: 'Bir doğal sayının tüm pozitif çarpanlarını sistematik (alan/gökkuşağı) olarak bulur.',
          4: 'Çarpan sayısı ile sayının geometrik modelleri arasında bağıntı kurar ve geneller.'
        }
      },
      {
        id: 'c2',
        title: 'Kat Kavramını Uygulama (Ritmik Sayma & Aralık Sınırlamaları)',
        category: 'Matematiksel Uygulama & Örüntü',
        levelDescriptions: {
          1: 'Bir sayının katlarını ritmik saymada zorlanır, işlem hatası yapar.',
          2: 'Sayının ardışık katlarını yazar fakat aralık sınırlamalarında (örn: 50 ile 100 arası) zorlanır.',
          3: 'İstenen aralıktaki katları eksiksiz listeler ve kat ilişkisini doğru yorumlar.',
          4: 'Farklı iki sayının kat örüntülerini karşılaştırarak ortak kat mantığını açıklar.'
        }
      },
      {
        id: 'c3',
        title: 'Problem Durumunda Muhakeme (İyilik Kolisi & Paylaştırma)',
        category: 'Problem Çözme & Karar Verme',
        levelDescriptions: {
          1: 'Verilen bağlamda çarpan mı kat mı kullanacağına karar veremez.',
          2: 'Öğretmen rehberliğinde çarpan/kat ilişkisini probleme uygular.',
          3: 'Günlük hayat problemlerinde çarpan ve katları bağımsız olarak doğru modeller.',
          4: 'Problemi birden fazla stratejiyle çözer, gerekçelendirir ve yeni problem kurgular.'
        }
      },
      {
        id: 'c4',
        title: 'Matematiksel Temsil ve Dil (Alan Modeli, Gökkuşağı, Sayı Doğrusu)',
        category: 'Temsil & Matematiksel Dil',
        levelDescriptions: {
          1: 'Çarpanları rastgele yazar, gösterim modellerini kullanamaz.',
          2: 'Sadece liste yöntemini kullanır, modelleme araçlarını sınırlı kullanır.',
          3: 'Alan modeli, gökkuşağı ve sayı doğrusu temsillerini amacına uygun kullanır.',
          4: 'Temsiller arası geçiş yapar ve çıkarımlarını matematiksel önermelerle ifade eder.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bir doğal sayının çarpanı ile böleninin aynı anlama geldiğini biliyorum.' },
      { id: 'chk2', text: 'Dikdörtgensel alan modelini kullanarak bir sayının tüm çarpanlarını eksiksiz bulabiliyorum.' },
      { id: 'chk3', text: 'Gökkuşağı yönteminde uçlardaki sayıların çarpımının ana sayıyı verdiğini fark ettim.' },
      { id: 'chk4', text: 'Bir sayının katlarını belirli bir sınıra kadar ritmik ve hatasız listeleyebiliyorum.' },
      { id: 'chk5', text: 'Günlük hayatta paylaştırma ve paketleme problemlerinde çarpanlardan yararlanabiliyorum.' }
    ]
  },
  'MAT.5.3.4': {
    id: 'rubric-mat-5-3-4',
    outcomeId: 'MAT.5.3.4',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Doğruların Durumları ve Açı Çıkarımları',
    description:
      'Düzlemde iki veya üç doğrunun durumları, ters, komşu, tümler, bütünler açılar ve geometrik çıkarım yapma becerilerinizi dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Doğruların Durumlarını Tanıma (Kesişen, Paralel, Dik, Kesen)',
        category: 'Kavramsal Anlama & Sınıflandırma',
        levelDescriptions: {
          1: 'Kesişen, paralel, dik ve kesen doğruların özelliklerini ve aralarındaki farkları karıştırıyorum.',
          2: 'Paralel ve dik doğruları ayırt ediyorum fakat kesen doğrunun oluşturduğu açıları açıklamakta zorlanıyorum.',
          3: 'Kesişen, dik, paralel, çakışık ve kesen doğruları doğru tanımlıyor; paralel doğruların açı oluşturmadığını biliyorum.',
          4: 'Düzlemde iki ve üç doğrunun tüm durumlarını eksiksiz sınıflandırıp modelleyebiliyor, kesişim noktaları ve açı oluşumunu tam açıklıyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Ters Açıların Eşitliğini Keşfetme ve Uygulama',
        category: 'Geometrik Çıkarım & Aksiyom',
        levelDescriptions: {
          1: 'Kesişen iki doğrudan oluşan karşılıklı açıların (ters açılar) eşit olduğunu hatırlamakta zorlanıyorum.',
          2: 'Ters açıların eşit olduğunu biliyorum fakat eğik kesişen doğrularda ters açı çiftlerini belirlemekte tereddüt ediyorum.',
          3: 'Kesişen iki doğrudan oluşan karşılıklı açıların ters açılar olduğunu ve ölçülerinin daima eşit (a = c, b = d) olduğunu gösteriyorum.',
          4: 'Ters açıların eşitliğini dinamik geometri yazılımında (OB2) ve problem durumlarında hatasız uygulayıp kanıtlayabiliyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Tümler, Bütünler ve Komşu Açı İlişkilerini Çözümleme',
        category: 'Matematiksel Muhakeme & Hesaplama',
        levelDescriptions: {
          1: 'Tümler (90°) ve bütünler (180°) açıların derece toplamlarını birbirine karıştırıyorum.',
          2: 'Tümler ve bütünler açı toplamlarını biliyorum ancak komşu tümler ve komşu bütünler açıları şekilde ayırt etmekte zorlanıyorum.',
          3: 'Ölçüleri toplamı 90° olan açıları tümler, 180° olanları bütünler olarak adlandırıyor ve doğru üzerindeki komşu bütünler açıları hesaplıyorum.',
          4: 'Tümler ve bütünler açı ilişkilerini cebirsel ve geometrik modellerle hatasız çözümlüyor, komşu açıların iç bölgelerinin ayrık olduğunu gerekçelendiriyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Üç Doğrunun Durumları ve Açı Önermeleri (OB2 & MAB3)',
        category: 'Tablo Temsili & Önerme Geliştirme',
        levelDescriptions: {
          1: 'Üç doğrunun kesişiminde oluşan açıları saymakta ve tabloya kaydetmekte zorlanıyorum.',
          2: 'Üç doğrunun durumlarını gözlemliyorum fakat açı çeşitlerine dair genel bir önerme kurmakta desteğe ihtiyaç duyuyorum.',
          3: 'Üç doğrunun tek noktada kesişimi veya paralel-kesen durumlarında oluşan açıları tablo temsili (MAB3) üzerinde listeleyip önermeler sunabiliyorum.',
          4: 'İki ve üç doğru için geliştirdiğim açı önermelerini üçten fazla doğrunun durumlarına genelleştirebiliyor ve mantıksal gerekçeler sunuyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Mantıksal Çıkarım (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Açı ölçümü ve tablo doldurma aşamalarında rastgele tahminler yapıyor, kontrol etmiyorum.',
          2: 'Hata yaptığımda ipucu ile düzeltiyorum ancak nedenini matematiksel olarak açıklamakta zorlanıyorum.',
          3: 'Açıölçer ve dinamik laboratuvar araçlarıyla ölçümlerimi sabırla kontrol ediyor, varsayımlarımı ölçüm sonuçlarıyla sınıyorum.',
          4: 'Kendi öğrenme sürecimi eleştirel değerlendiriyor, geometrik varsayımlarımı kanıtlayıp öğrenme günlüğüne derinlikli çıkarımlar aktarıyorum.'
        }
      }
    ]
  },
  'MAT.5.3.3': {
    id: 'rubric-mat-5-3-3',
    outcomeId: 'MAT.5.3.3',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Açıları Ölçme ve Matematiksel Araç Kullanımı',
    description:
      'Bu rubrik ile açı kavramını anlama, açıölçeri (iletki) kullanma, açıları sınıflandırma ve kavram yanılgılarını aşma düzeyinizi dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Açı Kavramı ve İsimlendirme',
        category: 'Kavramsal Anlama & Sembolik Temsil',
        levelDescriptions: {
          1: 'Açının iki ışından oluştuğunu ve köşe harfinin ortada olması gerektiğini karıştırıyorum.',
          2: 'Açının köşesini tanıyorum ancak sembolle gösterirken köşe harfini bazen ortaya yazmayı unutuyorum.',
          3: 'Açının başlangıç noktası ortak iki ışından oluştuğunu biliyor, sembolle (AOB veya O) doğru yazabiliyorum.',
          4: 'Açıyı köşe ve kollar üzerinden hatasız isimlendiriyor, açı sembolü (∠AOB) ve ölçü gösterimini (s(∠AOB)=60°) tam uyguluyorum.'
        }
      },
      {
        id: 'c2',
        title: 'İletki (Açıölçer) Kullanımı ve Doğru Cetvel Seçimi',
        category: 'Matematiksel Araç ve Teknoloji',
        levelDescriptions: {
          1: 'İletkinin merkezini açının köşesine koymakta ve taban koluna hizalamakta zorlanıyorum.',
          2: 'İletkiyi köşeye koyabiliyorum fakat iç ve dış cetvel (ters açı) arasında tereddüt yaşıyorum.',
          3: 'İletkiyi açının köşesine ve tabanına tam oturtup açının yönüne göre doğru cetvelden dereceyi okuyorum.',
          4: 'Uzayda eğik, ters veya dikey duran açıları iletkiyi serbestçe döndürüp sıfırlayarak tam isabetle (±1°) ölçüyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Açı Türlerini Sınıflandırma (Dar, Dik, Geniş, Doğru)',
        category: 'Matematiksel Muhakeme & Sınıflandırma',
        levelDescriptions: {
          1: 'Dik açıyı (90°) tanıyorum fakat dar ve geniş açıların derece sınırlarını karıştırıyorum.',
          2: 'Açının 90°den küçük veya büyük olduğunu fark ediyorum fakat sınıflandırmada bazen tereddüt ediyorum.',
          3: 'Açıları ölçülerine göre dar (<90°), dik (90°), geniş (>90°) ve doğru (180°) açı olarak doğru sınıflandırıyorum.',
          4: 'Açı türlerini hem görsel tahminle hem de iletkiyle anında sınıflandırıp gerçek hayattaki modellerle eşleştiriyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Kavram Yanılgısını Aşma (Işın Kollarının Uzunluğu)',
        category: 'Eleştirel Düşünme & Maarif İlkesi',
        levelDescriptions: {
          1: 'Açının kollarının (ışınlarının) boyu uzadığında açının derecesinin de büyüyeceğini düşünüyorum.',
          2: 'Kollar uzadığında açının değişmediğini biliyorum ancak nedenini ışınların sonsuza uzamasıyla açıklamakta zorlanıyorum.',
          3: 'Açının kolları uzatılsa bile açıklığın ve açıölçer derecesinin kesinlikle değişmediğini açıklayabiliyorum.',
          4: 'Işınların sonsuza uzama özelliğini kullanarak kol boyunun açıyı değiştirmediğini arkadaşlarıma gerekçeleriyle kanıtlıyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Dijital Radar Simülasyonu (SDB1.2 - SDB1.3)',
        category: 'Süreç Becerileri & Öz Yansıtma',
        levelDescriptions: {
          1: 'Radar oyununda ve simülasyonlarda rastgele tahminler yapıyor, hatalarımı kontrol etmiyorum.',
          2: 'Hata yaptığımda ipucuna bakıyorum ancak hatamın nedenini kendi başıma bulmakta zorlanıyorum.',
          3: 'Açı radarında iletkiyi doğru döndürüp ayarlayarak lazer antenini hedefe kilitliyor ve kendi ölçümümü kontrol ediyorum.',
          4: 'Kendi öğrenme sürecimi eleştirel değerlendiriyor, hata nedenini (iç/dış ölçek, merkez kayması) anında fark edip düzeltiyorum.'
        }
      }
    ]
  },
  'MAT.5.3.2': {
    id: 'rubric-mat-5-3-2',
    outcomeId: 'MAT.5.3.2',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Temel Geometrik Çizimler ve Matematiksel Araçlar',
    description:
      'Ölçüsüz cetvel, pergel ve gönye ile yapılan temel geometrik çizimleri ve bu çizimlerden elde edilen matematiksel çıkarımları değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Ölçüsüz Cetvel ve İki Noktadan Tek Doğru Çıkarımı',
        category: 'Kavramsal Muhakeme & Doğru İnşası',
        levelDescriptions: {
          1: 'Ölçüsüz cetvelin uzunluk ölçmek için değil düz çizgi çizmek için kullanıldığını karıştırıyorum.',
          2: 'İki noktadan doğru çiziyorum fakat iki noktadan sadece tek bir doğru geçebileceği kuralını açıklamakta zorlanıyorum.',
          3: 'Herhangi iki farklı noktadan yalnız ve yalnız tek bir doğru çizilebileceğini ölçüsüz cetvel kullanarak gösteriyorum.',
          4: 'İki noktadan tek bir doğru geçme ilkesini ve ölçüsüz cetvelin geometrik mantığını gerekçeleriyle tam açıklıyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Pergel ile Çember ve Yarıçap Eşitliği Çıkarımı',
        category: 'Matematiksel Araç & Çember Geometrisi',
        levelDescriptions: {
          1: 'Pergelin sabit ayağı ile kalem ayağının rolünü karıştırıyor, yarıçapın sabit kaldığını fark edemiyorum.',
          2: 'Pergelle çember çizebiliyorum fakat merkezden çember üzerindeki noktalara giden doğru parçalarının (yarıçap) eşit olduğunu açıklamada zorlanıyorum.',
          3: 'Çemberin merkezinden çember üzerindeki tüm noktalara çizilen doğru parçalarının eşit uzunlukta (yarıçap r) olduğunu biliyor ve gösteriyorum.',
          4: 'Yarıçap uzunlukları eşit olan çemberleri pergel açıklığını koruyarak hatasız inşa ediyor ve tüm yarıçapların eşitliğini matematiksel olarak kanıtlıyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Pergel ve Cetvelle Işın/Açı Kollarında Eşit Parça Kesme',
        category: 'Geometrik İnşa & Adımlama',
        levelDescriptions: {
          1: 'Pergel açıklığını bozmadan ardışık parça kesme adımlarını uygulamakta zorlanıyorum.',
          2: 'Işın üzerinde pergel ile yay kesiyorum fakat açının iki kolunda aynı açıklıkla eşit parça işaretlemekte tereddüt ediyorum.',
          3: 'Bir ışının başlangıç noktasından itibaren ve bir açının her iki kolundan pergel açıklığıyla ardışık eşit parçalar ([AB]=[BC]=[CD]) kesebiliyorum.',
          4: 'Kareli ve çizgisiz düzlemde pergel ve ölçüsüz cetvelle eşit uzunlukta doğru parçalarını hatasız aktarıp inşa ediyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Gönye ile Dış Noktadan Tek Dikme Çizimi',
        category: 'Matematiksel Araç & Diklik',
        levelDescriptions: {
          1: 'Gönyenin 90 derecelik dik köşesini taban doğrusuna oturtmakta zorlanıyorum.',
          2: 'Gönyeyle dikme çizebiliyorum ancak dışındaki bir noktadan sadece tek bir dikme indirilebileceği kuralını açıklayamıyorum.',
          3: 'Bir doğruya dışındaki bir noktadan yalnız bir dikme çizilebildiğini, farklı noktalardan eşit veya farklı dikmeler çizilebileceğini gösteriyorum.',
          4: 'Gönyeyi taban doğrusu üzerinde kaydırarak dış noktadan tek dikmeyi hatasız inşa ediyor ve diklik sembolü (⊥) ile ifade ediyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Eşit Uzaklıktaki Noktalar ve Paralel Doğrular İnşası (OB2)',
        category: 'Modelleme & Matematiksel Çıkarım',
        levelDescriptions: {
          1: 'Paralel doğruların arasındaki mesafenin her yerde eşit olması gerektiğini karıştırıyorum.',
          2: 'Gönyeyle eşit uzaklıkta noktalar alabiliyorum ancak bunları birleştirerek paralel ray modeli oluşturmakta desteğe ihtiyaç duyuyorum.',
          3: 'Bir doğruya gönye ile eşit mesafede noktalar belirleyip birleştirerek paralel doğru (d₁ // d₂) inşa ediyor ve tren rayı modeliyle ilişkilendiriyorum.',
          4: 'Dinamik geometri simülasyonunda mesafe değişse bile paralelliğin bozulmadığını (OB2) ve doğruların hiçbir zaman kesişmeyeceğini tam açıklıyorum.'
        }
      }
    ]
  },
  'MAT.5.3.1': {
    id: 'rubric-mat-5-3-1',
    outcomeId: 'MAT.5.3.1',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Temel Geometrik Kavramlar ve Çizimler',
    description:
      'Nokta, doğru, doğru parçası ve ışın kavramlarını ayırt etme, sembolik olarak gösterme ve çizim araçlarını kullanma becerinizi değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Kavramsal Ayırt Etme (Nokta, Doğru, Doğru Parçası, Işın)',
        category: 'Kavramsal Anlama',
        levelDescriptions: {
          1: 'Doğru, doğru parçası ve ışının sınır durumlarını (uç noktalarını) karıştırıyorum.',
          2: 'Doğru ve doğru parçasını ayırt ediyorum fakat ışının tek yönde sonsuza uzamasını açıklamakta zorlanıyorum.',
          3: 'Dört temel kavramı başlangıç/bitiş sınırlarına ve uzunluklarının ölçülebilirliğine göre doğru ayırt ediyorum.',
          4: 'Kavramların tüm geometrik özelliklerini, uzunluk durumlarını ve modellerini eksiksiz açıklayabiliyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Sembolik Temsilleri Doğru Kullanma',
        category: 'Matematiksel Dil ve Semboller',
        levelDescriptions: {
          1: 'Köşeli parantez [ ve ] işaretlerinin sınırlı uç noktayı gösterdiğini karıştırıyorum.',
          2: 'Doğru parçası [AB] sembolünü biliyorum fakat ışın [AB ve doğru AB sembollerinde tereddüt ediyorum.',
          3: 'AB, [AB], [AB sembollerini modelleriyle doğru eşleştiriyorum.',
          4: 'Sembolik dili matematiksel iletişimde hatasız kullanıyor, uzunluk sembolü |AB| ile nesne sembolünü ayırt ediyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Gerçek Yaşam Modelleriyle İlişkilendirme',
        category: 'Matematiksel Modelleme',
        levelDescriptions: {
          1: 'Çevremdeki nesneleri geometrik kavramlarla ilişkilendirmekte zorlanıyorum.',
          2: 'Cetveli doğru parçasına benzetiyorum ancak elektrik teli veya lazer ışığını eşleştirmede zorlanıyorum.',
          3: 'Lazer ışığını ışına, cetveli doğru parçasına, tren rayını doğruya başarıyla eşleştiriyorum.',
          4: 'Çevremdeki karmaşık yapıları inceleyip doğru, ışın ve doğru parçası modellerini özgün örneklerle açıklıyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Çizim ve Geometrik Araç Kullanımı',
        category: 'Psikomotor & Dijital Beceriler',
        levelDescriptions: {
          1: 'Cetvel ve dijital çizim araçlarında başlangıç ve ok uçlarını çizmekte zorlanıyorum.',
          2: 'Cetvelle doğru parçası çiziyorum fakat ışının ok ucunu bazen yanlış yöne koyuyorum.',
          3: 'Cetvel ve sanal tahta araçlarıyla nokta, doğru, doğru parçası ve ışın çizimlerini hatasız yapıyorum.',
          4: 'Geometrik çizimleri yüksek hassasiyetle tamamlıyor, arkadaşlarımın çizimlerindeki hataları düzeltebiliyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Yansıtma ve Öğrenme Günlüğü (SDB1.3)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Öğrenme sürecimi değerlendirmekte ve ne öğrendiğimi yazmakta zorlanıyorum.',
          2: 'Öğrendiklerimi kısaca yazıyorum ancak kavramsal derinlik kurmakta zorlanıyorum.',
          3: 'Öğrenme günlüğünde kendi güçlü ve gelişmeye açık yönlerimi doğru tespit ediyorum.',
          4: 'Öğrenme günlüğüne matematiksel çıkarımlarımı ve şaşırtıcı keşiflerimi detaylı ve özgün şekilde yansıtıyorum.'
        }
      }
    ]
  }
};

/**
 * Generates an outcome-specific dynamic rubric for any outcome.
 */
export function getRubricForOutcome(outcomeId: string, outcomeTitle: string, outcomeCode: string): SelfAssessmentRubric {
  if (OUTCOME_RUBRICS[outcomeId]) {
    return OUTCOME_RUBRICS[outcomeId];
  }

  // Dynamic Maarif Model 5-Criteria Rubric Generator
  return {
    id: `rubric-${outcomeId}`,
    outcomeId,
    title: `Öğrenci Öz Değerlendirme Rubriği: ${outcomeTitle}`,
    description: `"${outcomeCode} - ${outcomeTitle}" kazanımına yönelik kavramsal anlama, araç kullanımı, muhakeme ve öz düzenleme becerilerinizi dereceli olarak değerlendiriniz.`,
    criteria: [
      {
        id: 'c1',
        title: 'Kazanım Temel Kavramlarını Anlama',
        category: 'Kavramsal Anlama',
        levelDescriptions: {
          1: 'Konudaki temel matematiksel kavramları ve tanımları hatırlamakta zorlanıyorum.',
          2: 'Temel kavramları kısmen tanıyorum ancak aralarındaki ilişkileri açıklamakta zorlanıyorum.',
          3: 'Konudaki kavramları ve temel özellikleri doğru şekilde anlıyor ve ifade edebiliyorum.',
          4: 'Kavramları derinlemesine kavradım; kavramlar arası bağlantıları ve matematiksel mantığı tam açıklayabiliyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Matematiksel Araç ve Teknoloji Kullanımı',
        category: 'Araç & Teknoloji Becerisi',
        levelDescriptions: {
          1: 'Ders araçlarını (cetvel, iletki, dijital simülatör) kullanırken rehberliğe ihtiyaç duyuyorum.',
          2: 'Araçları temel düzeyde kullanabiliyorum ancak karmaşık durumlarda yardım alıyorum.',
          3: 'Matematiksel araçları ve dijital laboratuvarı bağımsız ve doğru şekilde kullanıyorum.',
          4: 'Tüm matematiksel ve dijital araçları ustalıkla kullanarak ölçüm ve modellemeleri hatasız yapıyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Problem Çözme ve Günlük Hayat Modellemesi',
        category: 'Uygulama ve Modelleme',
        levelDescriptions: {
          1: 'Öğrendiğim matematiksel bilgileri günlük hayat durumlarında fark etmekte zorlanıyorum.',
          2: 'Basit günlük hayat problemlerinde konuyu uygulayabiliyorum.',
          3: 'Gerçek yaşam senaryolarını matematiksel olarak modelleyip doğru çözümlere ulaşıyorum.',
          4: 'Öğrendiklerimi yeni ve alışılmadık durumlara transfer ediyor, özgün model ve örnekler üretebiliyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Kavram Yanılgılarını Fark Etme ve Çözümleme',
        category: 'Eleştirel Düşünme & Muhakeme',
        levelDescriptions: {
          1: 'Konuyla ilgili yaygın yanılgılara düşüyor, doğru gerekçeyi bulmakta zorlanıyorum.',
          2: 'Yanılgıyı fark ettiğimde düzeltiyorum ancak nedenini matematiksel olarak açıklamakta zorlanıyorum.',
          3: 'Kavram yanılgılarını fark ediyor, kural ve gerekçeleriyle birlikte doğruyu açıklayabiliyorum.',
          4: 'Olası yanılgıları önceden tahmin ediyor, akranlarıma mantıksal ve görsel kanıtlarla doğruyu gösteriyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Öğrenme Sorumluluğu (SDB1.2 - SDB1.3)',
        category: 'Süreç Bileşeni & Öz Yansıtma',
        levelDescriptions: {
          1: 'Öğrenme sürecimi ve hatalarımı kendi başıma değerlendirmekte zorlanıyorum.',
          2: 'Hatalarımı öğretmenim veya sistem uyardığında fark edip düzeltiyorum.',
          3: 'Kendi öğrenme sürecimi takip ediyor, nerede hata yaptığımı anlayıp kendimi geliştiriyorum.',
          4: 'Öğrenme hedeflerimi belirliyor, öğrenme günlüğünde derinlikli yansıtma yapıyor ve sorumluluk alıyorum.'
        }
      }
    ]
  };
}
