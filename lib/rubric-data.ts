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
          1: 'Sayının çarpanlarını bulurken eksik bırakıyorum, kalansız bölme ilişkisini kuramıyorum.',
          2: 'Küçük sayıların çarpanlarını bulabiliyorum ancak büyük sayılarda bazı çarpanları atlıyorum.',
          3: 'Bir doğal sayının tüm pozitif çarpanlarını sistematik (alan/gökkuşağı) olarak bulabiliyorum.',
          4: 'Çarpan sayısı ile sayının geometrik modelleri arasında bağıntı kurup genelliyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Kat Kavramını Uygulama (Ritmik Sayma & Aralık Sınırlamaları)',
        category: 'Matematiksel Uygulama & Örüntü',
        levelDescriptions: {
          1: 'Bir sayının katlarını ritmik saymada zorlanıyorum, işlem hatası yapıyorum.',
          2: 'Sayının ardışık katlarını yazabiliyorum fakat aralık sınırlamalarında (örn: 50 ile 100 arası) zorlanıyorum.',
          3: 'İstenen aralıktaki katları eksiksiz listeliyor ve kat ilişkisini doğru yorumluyorum.',
          4: 'Farklı iki sayının kat örüntülerini karşılaştırarak ortak kat mantığını açıkça açıklayabiliyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Problem Durumunda Muhakeme (İyilik Kolisi & Paylaştırma)',
        category: 'Problem Çözme & Karar Verme',
        levelDescriptions: {
          1: 'Verilen problem durumunda çarpan mı kat mı kullanacağıma karar vermekte zorlanıyorum.',
          2: 'Öğretmenimin veya ipuçlarının rehberliğinde çarpan/kat ilişkisini probleme uygulayabiliyorum.',
          3: 'Günlük hayat problemlerinde çarpan ve katları bağımsız olarak doğru modelliyorum.',
          4: 'Problemi birden fazla stratejiyle çözüyor, gerekçelendiriyor ve yeni problem kurgulayabiliyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Matematiksel Temsil ve Dil (Alan Modeli, Gökkuşağı, Sayı Doğrusu)',
        category: 'Temsil & Matematiksel Dil',
        levelDescriptions: {
          1: 'Çarpanları rastgele yazıyorum, gösterim modellerini (alan/gökkuşağı) kullanmakta zorlanıyorum.',
          2: 'Sadece liste yöntemini kullanabiliyorum, modelleme araçlarını sınırlı kullanıyorum.',
          3: 'Alan modeli, gökkuşağı ve sayı doğrusu temsillerini amacına uygun ve doğru kullanıyorum.',
          4: 'Temsiller arası geçiş yapabiliyor ve çıkarımlarımı matematiksel önermelerle ifade ediyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Öğrenme Sorumluluğu (SDB1.2 - SDB1.3)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Çarpan ve kat bulma adımlarında rastgele tahminler yapıyor, kontrol etmiyorum.',
          2: 'Hata yaptığımda ipucu ile düzeltiyorum ancak nedenini matematiksel olarak açıklamakta zorlanıyorum.',
          3: 'Çarpan ağacı ve alan modelleriyle çözümlerimi sabırla kontrol ediyor, eksiklerimi fark ediyorum.',
          4: 'Kendi öğrenme sürecimi eleştirel değerlendiriyor, çarpan-kat çıkarımlarımı öğrenme günlüğüne derinlikli aktarıyorum.'
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
  'MAT.6.1.2': {
    id: 'rubric-mat-6-1-2',
    outcomeId: 'MAT.6.1.2',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Bölünebilme Kriterleri (2, 3, 4, 5, 6, 9, 10)',
    description:
      'Doğal sayıların basamak değerlerini ve katlarını inceleyerek 2, 3, 4, 5, 6, 9 ve 10 ile kalansız bölünebilme kriterlerine ilişkin çıkarım yapma ve pratik karar verme becerilerinizi değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Son Basamak Kriterlerini Uygulama (2, 5 ve 10 ile Bölünebilme)',
        category: 'Kavramsal Anlama & Son Basamak',
        levelDescriptions: {
          1: '2, 5 ve 10 ile bölünebilmede birler basamağına bakılması gerektiğini karıştırıyorum.',
          2: 'Çift sayıların 2\'ye, sonu 0 ve 5 olanların 5\'e bölündüğünü biliyorum ancak 10 ile kalan ilişkisinde zorlanıyorum.',
          3: 'Birler basamağını inceleyerek bir sayının 2, 5 ve 10 ile tam bölünüp bölünmediğini ve kalanını doğru bulabiliyorum.',
          4: 'Birler basamağı 0 olan sayıların 2, 5 ve 10\'un ortak katı olduğunu basamak değerleriyle tam açıklayıp genelliyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Rakamlar Toplamı Kuralı ve Basamak Çözümleme (3 ve 9 ile Bölünebilme)',
        category: 'Matematiksel Muhakeme & Basamak Toplamı',
        levelDescriptions: {
          1: '3 ve 9 ile bölünebilmede rakamları toplamak yerine birler basamağına bakma hatasına düşüyorum.',
          2: 'Rakamları toplayarak 3\'ün katı olup olmadığını buluyorum fakat 9 ile bölünebilme ve kalan bulmada zorlanıyorum.',
          3: 'Rakamları toplamı 3\'ün katı olanların 3\'e, 9\'un katı olanların 9\'a bölündüğünü ve kalanı hatasız hesaplıyorum.',
          4: '100=99+1 basamak açılımı üzerinden 3 ve 9 kurallarının mantıksal ispatını yapıp 9\'a bölünenin 3\'e de bölüneceğini kanıtlıyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Son İki Basamak ve Çift Kriter Muhakemesi (4 ve 6 ile Bölünebilme)',
        category: 'Analiz & Çoklu Kriter',
        levelDescriptions: {
          1: '4 ile bölünebilmede son iki basamağa, 6 ile bölünebilmede hem 2 hem 3 şartına bakmayı unutuyorum.',
          2: '4 ve 6 kurallarını hatırlıyorum ancak bilinmeyen basamaklı sorularda tüm değerleri bulmakta zorlanıyorum.',
          3: 'Son iki basamağı 00 veya 4\'ün katı olanları 4\'e; hem çift hem rakamlar toplamı 3k olanları 6\'ya doğru çözümlüyorum.',
          4: 'Yüzlüklerin 4\'e bölündüğünü gerekçelendirip 6 ile bölünebilen hiçbir sayının tek olamayacağını matematiksel olarak izah ediyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Problem Durumlarında Pratik Bölünebilme ve Algoritmik Çıkarım',
        category: 'Uygulama & Problem Çözme',
        levelDescriptions: {
          1: 'Problem durumlarında bölme işlemi yapmadan kural uygulayarak pratik karar vermekte zorlanıyorum.',
          2: 'Basit paketleme ve basamak bulma sorularında ipucuyla kuralları uygulayabiliyorum.',
          3: 'Günlük hayat problemlerinde (koli, oturma düzeni, şifre) bölünebilme kurallarını bağımsız ve doğru kullanıyorum.',
          4: 'T.C. kimlik veya barkod algoritmalarında bölünebilme mantığını modelleyip alternatif stratejiler üretiyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Öğrenme Sorumluluğu (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Bölünebilme adımlarında rastgele tahminler yapıyor, kontrollerimi yapmıyorum.',
          2: 'Hata yaptığımda öğretmenim uyardığında düzeltiyorum ancak nedenini açıklamakta zorlanıyorum.',
          3: 'Bölünebilme kurallarını adım adım kontrol ediyor, basamak toplama ve son basamak hatalarımı fark edip düzeltiyorum.',
          4: 'Kendi öğrenme sürecimi eleştirel değerlendiriyor, bölünebilme çıkarımlarımı öğrenme günlüğüne derinlikli aktarıyorum.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Birler basamağı çift olan sayıların 2 ile, 0 veya 5 olanların 5 ile tam bölündüğünü biliyorum.' },
      { id: 'chk2', text: 'Bir sayının 3 veya 9 ile bölünebilmesi için rakamları toplamına bakılması gerektiğini anladım.' },
      { id: 'chk3', text: 'Yüzlükler 4\'e tam bölündüğü için 4 kuralında sadece son iki basamağın incelendiğini kavradım.' },
      { id: 'chk4', text: 'Bir sayının 6 ile bölünebilmesi için hem çift hem de 3\'ün katı olması gerektiğini biliyorum.' },
      { id: 'chk5', text: 'Bölme işlemi yapmadan bölünebilme kurallarıyla günlük hayatta pratik kararlar alabiliyorum.' }
    ]
  },
  'MAT.6.1.3': {
    id: 'rubric-mat-6-1-3',
    outcomeId: 'MAT.6.1.3',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Asal Sayılar ve Asal Çarpanlar',
    description:
      'Asal sayı kavramını anlama, Eratosthenes kalburunu deneyimleme, asal çarpan ağacı ve algoritması ile sayıları çözümleme becerilerinizi dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Asal Sayı Kavramı ve 1-100 Arası Asallar (Eratosthenes Kalburu)',
        category: 'Kavramsal Anlama & Sınıflandırma',
        levelDescriptions: {
          1: '1\'in neden asal olmadığını ve asal sayıların sadece 2 böleni olduğunu karıştırıyorum.',
          2: 'Küçük asal sayıları tanıyorum fakat iki basamaklı tek sayıların (örn: 51, 91) asallığında tereddüt ediyorum.',
          3: '1 ile 100 arasındaki 25 asal sayıyı Eratosthenes kalburu mantığıyla doğru tespit edip sınıflandırıyorum.',
          4: '2\'nin yegâne çift asal olduğunu ve tüm bileşik sayıların asalların çarpımı olduğunu matematiksel olarak açıklıyorum.'
        }
      },
      {
        id: 'c2',
        title: 'Asal Çarpan Ağacı ile Sayıların Çözümlenmesi',
        category: 'Görsel Modelleme & Ayrıştırma',
        levelDescriptions: {
          1: 'Çarpan ağacında dalları ayırırken asal olmayan sayılarda takılıyor, yaprakları tamamlayamıyorum.',
          2: 'Ağaç dallarını oluşturuyorum ancak en alt satırdaki asal yaprakları eksik yazabiliyorum.',
          3: 'Bileşik sayıları asal çarpan ağacı modeliyle adım adım dallandırıp asal yapraklara ulaşıyorum.',
          4: 'Farklı dallanmaların (örn: 24 = 2×12 veya 4×6) en altta daima aynı asal yaprakları verdiğini genelliyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Asal Çarpan Algoritması (Bölen Listesi) ve Üslü Gösterim',
        category: 'Algoritmik Düşünme & Sembolik Temsil',
        levelDescriptions: {
          1: 'Bölen listesinde asal olmayan sayılara (örn: 4, 6) bölme hatası yapıyorum.',
          2: 'Dikey çizgide bölme işlemlerini yapabiliyorum fakat üslü ifade biçiminde yazarken üsleri karıştırıyorum.',
          3: 'Bir sayıyı en küçük asaldan başlayarak 1\'e kadar bölüyor ve üslü gösterimini hatasız yazıyorum.',
          4: 'Asal çarpanların üsleri ile sayının toplam çarpan sayısı arasındaki bağlantıyı fark edip derinlikli yorumluyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Gerçek Yaşam, Kriptografi ve Problem Çözme',
        category: 'Uygulama & Disiplinler Arası',
        levelDescriptions: {
          1: 'Asal sayıların günlük hayat ve şifrelemedeki rolünü kavramakta zorlanıyorum.',
          2: 'Asal çarpanlarla ilgili basit problemleri çözebiliyorum.',
          3: 'Asal sayı özelliklerini alan, çevre ve şifreleme problemlerinde doğru modelleyip çözüyorum.',
          4: 'RSA şifreleme ve dijital güvenlikte iki büyük asalın çarpım gücünü kavrayıp yeni problem senaryoları kurguluyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Öğrenme Sorumluluğu (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Asal sayı testlerinde acele ediyor, bölünebilme kontrollerini yapmadan karar veriyorum.',
          2: 'Hata yaptığımda ipucu ile düzeltiyorum ancak neden asal olmadığını açıklamada zorlanıyorum.',
          3: 'Bölen listesi ve kalbur adımlarını sabırla kontrol ediyor, işlem hatalarımı kendi başıma düzeltiyorum.',
          4: 'Kendi öğrenme hedeflerimi belirliyor, asal sayılarla ilgili çıkarımlarımı öğrenme günlüğüme özgün şekilde yansıtıyorum.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: '1 sayısının asal olmadığını, en küçük ve tek çift asal sayının 2 olduğunu biliyorum.' },
      { id: 'chk2', text: 'Eratosthenes kalburunu kullanarak 1-100 arasındaki asal sayıları tespit edebiliyorum.' },
      { id: 'chk3', text: 'Bileşik bir doğal sayıyı çarpan ağacı yöntemiyle asal yapraklarına ayırabiliyorum.' },
      { id: 'chk4', text: 'Bölen listesi algoritmasını kullanarak bir sayıyı asal çarpanlarının üslü çarpımı şeklinde yazabiliyorum.' },
      { id: 'chk5', text: 'Asal sayıların siber güvenlik ve şifreleme sistemlerindeki önemini kavradım.' }
    ]
  },
  'MAT.6.1.4': {
    id: 'rubric-mat-6-1-4',
    outcomeId: 'MAT.6.1.4',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Ortak Kat ve Ortak Bölen',
    description:
      'İki doğal sayının ortak bölen ve ortak katlarını problem bağlamlarında inceleme, modellerle temsil etme ve aralarında asallığı yorumlama becerilerinizi değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'İki Sayının Ortak Bölenlerini Belirleme ve Modelleme',
        category: 'Kavramsal Anlama & Kesişim Kümesi',
        levelDescriptions: {
          1: 'İki sayının bölenlerini ayrı ayrı bulurken zorlanıyor, ortak olanları belirleyemiyorum.',
          2: 'Küçük sayıların ortak bölenlerini buluyorum fakat büyük sayılarda bazı ortak bölenleri atlıyorum.',
          3: 'İki doğal sayının tüm bölenlerini listeleyip kesişim kümesindeki ortak bölenleri eksiksiz bulabiliyorum.',
          4: 'Ortak bölenler kümesini Venn şeması ve alan ızgarası ile modelleyip en büyük ortak bölenin mantığını açıklıyorum.'
        }
      },
      {
        id: 'c2',
        title: 'İki Sayının Ortak Katlarını Çift Sayı Doğrusunda İnceleme',
        category: 'Örüntü & Sayı Doğrusu Temsili',
        levelDescriptions: {
          1: 'Ortak katları bulurken ritmik saymada işlem hatası yapıyor, ortak noktaları kaçırıyorum.',
          2: 'İlk ortak katı bulabiliyorum ancak ardışık ortak katların kuralını genellemekte desteğe ihtiyaç duyuyorum.',
          3: 'Çift sayı doğrusu ve tablo üzerinde iki sayının katlarını eşleştirerek istenen aralıktaki ortak katları eksiksiz listeliyorum.',
          4: 'Ortak katların en küçük ortak katın katları şeklinde sonsuza kadar devam ettiğini çift sayı doğrusunda kanıtlıyorum.'
        }
      },
      {
        id: 'c3',
        title: 'Aralarında Asal Sayıların Mantığını Kavrama',
        category: 'Matematiksel Muhakeme & Çıkarım',
        levelDescriptions: {
          1: 'Aralarında asal olabilmek için sayıların tek tek asal olması gerektiğini zannediyorum.',
          2: '1\'den başka ortak böleni olmadığını fark ediyorum ancak aralarında asal sayı çiftlerini belirlerken tereddüt ediyorum.',
          3: 'Kendileri asal olmasa bile ortak böleni yalnızca 1 olan sayıların (örn: 8 ve 15) aralarında asal olduğunu biliyorum.',
          4: 'Ardışık sayıların daima aralarında asal olduğunu matematiksel olarak gerekçelendirip özgün örneklerle açıklıyorum.'
        }
      },
      {
        id: 'c4',
        title: 'Gerçek Yaşam Problemleri (Merhamet, Paylaşım, Periyot)',
        category: 'Problem Çözme & Değerler',
        levelDescriptions: {
          1: 'Verilen problemde ortak bölen mi yoksa ortak kat mı kullanacağıma karar vermekte zorlanıyorum.',
          2: 'Eşit aralıklı fidan dikimi veya ortak sefer problemlerini öğretmenimin yönlendirmesiyle çözebiliyorum.',
          3: 'Sokak hayvanlarına eşit paketleme, tarla sulama ve ortak nöbet problemlerini bağımsız olarak doğru modelliyorum.',
          4: 'Çoklu stratejiler kullanarak problem bağlamlarını optimize ediyor (en az paket, en az fidan) ve gerekçelendiriyorum.'
        }
      },
      {
        id: 'c5',
        title: 'Öz Düzenleme ve Sosyal Farkındalık (SDB2.3 - D9 Merhamet)',
        category: 'Süreç Becerileri & Yansıtma',
        levelDescriptions: {
          1: 'Problem çözümlerinde ve grup paylaşımlarında iş birliği yapmakta zorlanıyorum.',
          2: 'Hatalarımı fark ettiğimde düzeltiyorum ancak grup tartışmalarına katkım sınırlı kalıyor.',
          3: 'Yardımlaşma ve merhamet bağlamlı problemlerde matematiksel modellerimi özenle kuruyor ve kontrol ediyorum.',
          4: 'Kendi öğrenme sürecimi eleştirel değerlendiriyor, merhamet ve tasarruf değerleriyle matematiği harmanlayıp günlüğüme yansıtıyorum.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'İki doğal sayıyı aynı anda kalansız bölen sayıların "ortak bölenler" olduğunu biliyorum.' },
      { id: 'chk2', text: 'İki sayının ortak katlarının en küçük ortak katın katları şeklinde devam ettiğini anladım.' },
      { id: 'chk3', text: '1\'den başka ortak böleni olmayan iki sayının "aralarında asal" olduğunu kavradım.' },
      { id: 'chk4', text: 'Sokak hayvanlarına eşit mama paketleme ve fidan dikme problemlerinde ortak bölenleri kullanabiliyorum.' },
      { id: 'chk5', text: 'Periyodik otobüs seferleri ve nöbet problemlerinde ortak katlarla doğru hesaplama yapabiliyorum.' }
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
    ],
    checklistItems: [
      { id: 'chk1', text: 'Düzlemde kesişen, paralel ve dik doğruların farklarını biliyorum.' },
      { id: 'chk2', text: 'Kesişen iki doğrudan oluşan ters açıların ölçülerinin eşit olduğunu anladım.' },
      { id: 'chk3', text: 'Tümler (90°) ve bütünler (180°) açı hesaplamalarını doğru yapabiliyorum.' },
      { id: 'chk4', text: 'Komşu açıların ortak bir ışını paylaştığını ve iç bölgelerinin ayrık olduğunu fark ettim.' },
      { id: 'chk5', text: 'Üç doğrunun tek noktada kesişiminde oluşan açıları tablo üzerinde analiz edebiliyorum.' }
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
    ],
    checklistItems: [
      { id: 'chk1', text: 'Açıyı köşe harfi ortada olacak şekilde sembolle doğru isimlendirebiliyorum.' },
      { id: 'chk2', text: 'İletkinin merkezini açının köşesine yerleştirip doğru cetvelden dereceyi okuyabiliyorum.' },
      { id: 'chk3', text: 'Açıları dar, dik, geniş ve doğru açı olarak hatasız sınıflandırabiliyorum.' },
      { id: 'chk4', text: 'Işın kollarının uzunluğu değişse bile açının ölçüsünün değişmediğini biliyorum.' },
      { id: 'chk5', text: 'Dijital radar ve simülasyon araçlarıyla açı ölçümlerimi kontrol edebiliyorum.' }
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
    ],
    checklistItems: [
      { id: 'chk1', text: 'Ölçüsüz cetvelle iki farklı noktadan sadece tek bir doğru geçebileceğini anladım.' },
      { id: 'chk2', text: 'Pergel kullanarak merkezden eşit uzaklıktaki noktalar kümesini (çember) çizebiliyorum.' },
      { id: 'chk3', text: 'Bir ışın veya açı kolu üzerinde pergel açıklığıyla eşit parçalar kesebiliyorum.' },
      { id: 'chk4', text: 'Gönye yardımıyla bir doğruya dışındaki noktadan tek dikme çizebiliyorum.' },
      { id: 'chk5', text: 'Eşit uzaklıktaki noktaları birleştirerek paralel doğrular inşa edebiliyorum.' }
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
    ],
    checklistItems: [
      { id: 'chk1', text: 'Nokta, doğru, doğru parçası ve ışın arasındaki sınır farklarını biliyorum.' },
      { id: 'chk2', text: '[AB], [AB ve AB sembollerini modelleriyle hatasız eşleştirebiliyorum.' },
      { id: 'chk3', text: 'Çevremdeki nesneleri (lazer ışını, cetvel, tren rayı) geometrik modellerle ilişkilendirebiliyorum.' },
      { id: 'chk4', text: 'Cetvel ve dijital çizim araçlarıyla doğru, doğru parçası ve ışın çizebiliyorum.' },
      { id: 'chk5', text: 'Öğrenme günlüğümde güçlü ve geliştirmem gereken yönlerimi ifade edebiliyorum.' }
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
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bu kazanıma ait temel kavram ve tanımları anladım.' },
      { id: 'chk2', text: 'Matematiksel ve dijital araçları bağımsız olarak kullanabiliyorum.' },
      { id: 'chk3', text: 'Öğrendiğim kavramları günlük hayat problemlerine uygulayabiliyorum.' },
      { id: 'chk4', text: 'Kavram yanılgılarını fark edip doğru çözümleri gerekçelendirebiliyorum.' },
      { id: 'chk5', text: 'Öğrenme sürecimi ve gelişimimi kendi dilimle değerlendirebiliyorum.' }
    ]
  };
}
