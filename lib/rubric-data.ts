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
  },
  'MAT.7.1.1': {
    id: 'rubric-mat-7-1-1',
    outcomeId: 'MAT.7.1.1',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Tam Sayılardan Rasyonel Sayılara',
    description:
      'Doğal sayı, tam sayı ve rasyonel sayı kümelerini yorumlama, sayı doğrusunda temsil, mutlak değer mantığı ve akıllı ev enerji dengesini analiz etme becerilerinizi dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Sayı Kümelerini Yorumlama (N ⊂ Z ⊂ Q)',
        category: 'Kavramsal Anlama & Sayı Kümeleri',
        levelDescriptions: {
          1: 'Doğal sayı, tam sayı ve rasyonel sayı kümelerini birbirine karıştırıyorum; gizli payda kuralını hatırlamakta zorlanıyorum.',
          2: 'Pozitif sayıları kümelere ayırabiliyorum fakat negatif tam sayıların da rasyonel sayı olduğunu ve paydanın 0 olamayacağını bazen unutuyorum.',
          3: 'Her tam sayının paydası 1 olan bir rasyonel sayı olduğunu ve N ⊂ Z ⊂ Q ilişkisini doğru açıklarım. Paydanın sıfır olamayacağını bilirim.',
          4: 'Sayı kümeleri arasındaki hiyerarşiyi Euler şemasıyla eksiksiz açıklar, farklı rasyonel temsilleri (-a/b = (-a)/b = a/(-b)) ve tanımsızlık durumlarını gerekçeleriyle savunurum.'
        }
      },
      {
        id: 'c2',
        title: 'Sayı Doğrusunda Temsil ve Dilimleme',
        category: 'Matematiksel Temsil & Sayı Doğrusu',
        levelDescriptions: {
          1: 'Rasyonel sayıların sayı doğrusunda hangi iki tam sayı arasında yer aldığını bulmakta zorlanıyorum.',
          2: 'Pozitif rasyonel sayıları sayı doğrusunda dilimleyerek gösterebiliyorum fakat negatif rasyonel sayıları gösterirken yönü karıştırıyorum.',
          3: 'Pozitif ve negatif rasyonel sayıların yer alacağı ardışık iki tam sayıyı doğru belirler, aralığı paydaya göre eşit parçalara bölerek noktayı hatasız bulurum.',
          4: 'Farklı paydalara sahip rasyonel sayıları aynı sayı doğrusunda hassas şekilde dilimleyip karşılaştırabilir, rasyonel sayıların yoğunluk özelliğini açıklarım.'
        }
      },
      {
        id: 'c3',
        title: 'Mutlak Değer ve Uzaklık Anlayışı',
        category: 'Matematiksel Muhakeme & Mutlak Değer',
        levelDescriptions: {
          1: 'Mutlak değerin yalnızca işareti artı yapma ezberi olduğunu düşünüyor, sıfıra olan uzaklık anlamını kuramıyorum.',
          2: 'Tam sayıların mutlak değerini bulabiliyorum ancak rasyonel sayıların mutlak değerini sayı doğrusunda uzaklık olarak modellemekte zorlanıyorum.',
          3: 'Pozitif ve negatif rasyonel sayıların mutlak değerinin başlangıç noktasına (0) olan uzaklık olduğunu bilir ve |-a/b| = |a/b| eşitliğini açıklarım.',
          4: 'Mutlak değeri referans noktasına göre sapma, tolerans ve denge durumlarında (enerji dengesi, hedef sapması) bir analiz aracı olarak yetkinlikle kullanırım.'
        }
      },
      {
        id: 'c4',
        title: 'Finansal ve Görsel Okuryazarlık (Gerçek Yaşam Bağlantısı - D17 / OB3 / OB4)',
        category: 'Gerçek Yaşam Modellemesi & Tasarruf',
        levelDescriptions: {
          1: 'Akıllı ev sayaç verilerindeki pozitif ve negatif değerleri günlük hayatla ilişkilendirmekte zorlanıyorum.',
          2: 'Güneş enerjisi üretimi ve şebeke tüketimini artı/eksi olarak ifade edebiliyorum ancak toplam enerji dengesini yorumlamakta yardıma ihtiyaç duyuyorum.',
          3: 'Akıllı ev enerji tüketim ve üretim verilerini rasyonel sayılarla modeller, sıfır noktasına göre tasarruf/israf durumunu mutlak değerle doğru analiz ederim.',
          4: 'Enerji verimliliği raporlarını grafik ve sayı doğrusu üzerinde yorumlayarak hane bütçesi ve çevre için sürdürülebilir tasarruf önerileri geliştiririm.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Her doğal sayının bir tam sayı ve her tam sayının bir rasyonel sayı (N ⊂ Z ⊂ Q) olduğunu açıklarım.' },
      { id: 'chk2', text: 'Bir tam sayıyı a/b şeklinde paydası 1 olacak biçimde (gizli payda) yazabilirim.' },
      { id: 'chk3', text: 'Paydası 0 olan kesirli ifadelerin matematiksel olarak tanımsız olduğunu bilirim.' },
      { id: 'chk4', text: 'Sayı doğrusunda negatif ve pozitif rasyonel sayıları doğru aralığı eşit parçalara bölerek gösterebilirim.' },
      { id: 'chk5', text: 'Günlük hayattaki tasarruf veya tüketim sapmalarını mutlak değer kullanarak analiz edebilirim.' }
    ]
  },
  'MAT.7.1.1-2': {
    id: 'rubric-mat-7-1-1-2',
    outcomeId: 'MAT.7.1.1-2',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Rasyonel Sayıların Sayı Doğrusunda Derinleşmesi ve Yoğunluğu',
    description:
      'Bileşik kesirleri tam sayılı kesre dönüştürme, sayı doğrusunda hassas dilimleme, iki rasyonel sayı arasındaki yoğunluk (sonsuz nokta) özelliği ve mutlak değerle tolerans/sapma analizini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Bileşik Kesirden Sayı Doğrusuna Konumlandırma',
        category: 'Matematiksel Temsil & Sayı Doğrusu',
        levelDescriptions: {
          1: 'Bileşik kesirleri tam sayılı kesre çevirmekte ve sayı doğrusunda hangi iki tam sayı arasında olduğunu bulmakta zorlanıyorum.',
          2: 'Bileşik kesirleri tam sayılı kesre çevirebiliyorum fakat negatif kesirlerin yönünü belirlerken hata yapıyorum.',
          3: 'Bileşik kesirleri tam sayılı kesre dönüştürerek ardışık iki tam sayıyı belirler, payda kadar eşit parçaya bölüp noktayı hatasız konumlandırırım.',
          4: 'Bileşik, tam sayılı ve ondalık temsiller arasındaki dönüşümleri zihinden ilişkilendirir; sayı doğrusundaki hassas konumlarını gerekçelendirerek savunurum.'
        }
      },
      {
        id: 'c2',
        title: 'Rasyonel Sayıların Yoğunluk Özelliği (Sonsuz Nokta)',
        category: 'Kavramsal Muhakeme & Yoğunluk',
        levelDescriptions: {
          1: 'İki rasyonel sayı arasında başka bir rasyonel sayı olamayacağını veya sonlu sayıda sayı olduğunu düşünüyorum.',
          2: 'İki kesir arasında sayı bulmak için paydaları eşitlemem gerektiğini biliyorum fakat sonsuz çoklukta sayı türetme mantığını kuramıyorum.',
          3: 'Herhangi iki rasyonel sayı arasında genişletme yoluyla yeni rasyonel sayılar bularak aralarında sonsuz nokta bulunduğunu açıklarım.',
          4: 'Yoğunluk özelliğini mikroskop modeliyle açıklar; iki rasyonel sayının aritmetik ortalamasının daima bu aralıkta yer aldığını matematiksel olarak ispatlarım.'
        }
      },
      {
        id: 'c3',
        title: 'Mutlak Değer ve Mesafe Analizi',
        category: 'Matematiksel Muhakeme & Mutlak Değer',
        levelDescriptions: {
          1: 'Mutlak değerin yalnızca işareti silme işlemi olduğunu düşünüyor, sıfır noktasına olan uzaklık kavramını kullanamıyorum.',
          2: 'Sıfıra olan mesafenin yönü olmadığını biliyorum fakat rasyonel sayılarda mutlak değer karşılaştırmalarında zorlanıyorum.',
          3: 'Bir rasyonel sayının mutlak değerinin başlangıç noktasına (0) olan uzaklık olduğunu bilir, |-a/b| = |a/b| eşitliğini sayı doğrusunda modellerim.',
          4: 'Mutlak değeri tolerans, hata payı ve kalite kontrol analizlerinde bir karar verme aracı olarak başarıyla uygularım.'
        }
      },
      {
        id: 'c4',
        title: 'Gerçek Yaşam ve Çevre Modellemesi (15 Temmuz Parkı / Tasarruf)',
        category: 'Gerçek Yaşam Modellemesi & Tasarruf',
        levelDescriptions: {
          1: 'Su deposu rezerv verilerini ve sensör değerlerini rasyonel sayılarla ilişkilendirmekte zorlanıyorum.',
          2: 'Depodaki su açığını ve fazlasını rasyonel sayılarla ifade edebiliyorum fakat sıfır dengesini analiz etmekte desteğe ihtiyaç duyuyorum.',
          3: 'Su deposundaki rezerv açığı/fazlasını ve basınç sensörü verilerini rasyonel sayılarla modeller, tasarruf ve tolerans durumlarını doğru yorumlarım.',
          4: 'Akıllı park ve çevre yönetiminde su tasarrufu, kaynak verimliliği ve sensör kalibrasyonu için matematiksel temelli sürdürülebilir modeller öneririm.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bileşik kesirleri tam sayılı kesre dönüştürerek sayı doğrusundaki doğru aralığı bulabilirim.' },
      { id: 'chk2', text: 'Negatif rasyonel sayıları sayı doğrusunda sıfırdan sola doğru doğru adımlarla yerleştirebilirim.' },
      { id: 'chk3', text: 'İki rasyonel sayı arasında genişletme yaparak sonsuz sayıda rasyonel sayı olduğunu açıklarım.' },
      { id: 'chk4', text: 'Bir rasyonel sayının mutlak değerinin sıfır noktasına olan gerçek uzaklık olduğunu bilirim.' },
      { id: 'chk5', text: 'Günlük hayatta su tasarrufu ve tolerans paylarını rasyonel modellerle analiz edebilirim.' }
    ]
  },
  'MAT.7.1.2': {
    id: 'rubric-mat-7-1-2',
    outcomeId: 'MAT.7.1.2',
    title: 'Öğrenci Öz Değerlendirme Rubriği: Rasyonel Sayıları Karşılaştırma ve Sıralama',
    description:
      'Pay ve payda eşitleme stratejileri, yarıma (1/2) ve bütüne (1) referans alma yöntemleri, negatif sayılarda sıfıra yakınlık/mutlak değer ilkeleri ile dinamik terazi ve termometre modellerini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Pay ve Payda Eşitleme Stratejileri (Birim Kesir & Dilim Sayısı)',
        category: 'Kavramsal Anlama & Birim Kesir',
        levelDescriptions: {
          1: 'Payları eşit kesirlerde paydası büyük olanın neden daha küçük olduğunu açıklamakta zorlanıyorum; genişletme yapmadan sıralayamıyorum.',
          2: 'Paydaları eşitleyerek sıralama yapabiliyorum fakat payları eşit kesirlerde birim kesir büyüklüğü (dilim genişliği) mantığını kurmakta zorlanıyorum.',
          3: 'Payları eşit kesirlerde paydası küçük olanın daha büyük dilim belirttiğini açıklar, paydaları eşit kesirlerde payı büyük olanın daha büyük olduğunu kuralına uygun uygularım.',
          4: 'Verilen kesir setine göre pay mı yoksa payda mı eşitlemenin daha pratik olduğunu anında analiz eder, en sade ortak kat stratejisiyle hızlıca sıralarım.'
        }
      },
      {
        id: 'c2',
        title: 'Yarıma (1/2) ve Bütüne (1) Referans Alma (Zihinsel Karşılaştırma)',
        category: 'Matematiksel Muhakeme & Referans Noktaları',
        levelDescriptions: {
          1: 'Büyük sayılardan oluşan kesirlerde işlem yapmadan 1/2 veya 1 ile kıyaslama yapma stratejisini anlayamıyorum.',
          2: 'Bir kesrin yarımdan büyük mü küçük mü olduğunu belirleyebiliyorum ancak iki kesri aynı anda yarıma mesafesine göre kıyaslamakta zorlanıyorum.',
          3: 'Bütüne veya yarıma olan uzaklıkları (eksik parça / artık parça yöntemi) kullanarak ortak payda aramaksızın zihinden hatasız karşılaştırma yaparım.',
          4: 'Referans noktası stratejisini yeni ve karmaşık rasyonel sayılarda esnekçe kullanır, gerekçemi sayı doğrusu ve lazer metresi üzerinde kanıtlayarak açıklarım.'
        }
      },
      {
        id: 'c3',
        title: 'Negatif Rasyonel Sayılarda Sıfıra Yakınlık & Mutlak Değer İlkesi',
        category: 'Sayı Hissi & Negatif Sıralama',
        levelDescriptions: {
          1: 'Negatif rasyonel sayıları sıralarken pozitif sayılar gibi düşünüyor, -5/6\'nın -2/3\'ten büyük olduğunu sanıyorum (kavram yanılgısı).',
          2: 'Negatif kesirlerin pozitiflerin tersi olduğunu ezberden biliyorum ancak sayı doğrusunda sıfıra olan mesafe ile büyüklük ilişkisini açıklamakta zorlanıyorum.',
          3: 'Negatif rasyonel sayılarda mutlak değeri küçük (sıfıra daha yakın veya sayı doğrusunda daha sağda) olanın daha büyük olduğunu kuralına uygun uygularım.',
          4: 'Negatif rasyonel sayıları dondurucu hava sıcaklığı, deniz seviyesi veya borç/alacak bağlamlarında zihinsel modellerle görselleştirir ve sıralamayı gerekçelendiririm.'
        }
      },
      {
        id: 'c4',
        title: 'Çoklu Temsil, Sayı Doğrusu ve Denge Terazisi ile Modelleme',
        category: 'Matematiksel Modelleme & Araç Kullanımı',
        levelDescriptions: {
          1: 'Kesirleri denge terazisinde veya sayı doğrusunda karşılaştırma modellerine dönüştürmekte desteğe ihtiyaç duyuyorum.',
          2: 'Terazide ağır basan tarafın sayı doğrusundaki yönünü eşleştirebiliyorum ancak ara adımları modellemekte zorlanıyorum.',
          3: 'Verilen rasyonel sayıları sayı doğrusunda doğru ardışıklıkla yerleştirir, denge terazisi simülasyonunda eğim yönüyle büyüklük ilişkisini doğru modellerim.',
          4: 'Sayı doğrusu, terazi modeli ve sembolik (<, =, >) ifadeler arasında akıcı geçişler yapar; akranlarıma görsel modeller üzerinden ispat sunarım.'
        }
      },
      {
        id: 'c5',
        title: 'Gerçek Yaşam Problemleri & Kavram Yanılgısı Dedektifliği (SDB1.2 - SDB3.3)',
        category: 'Eleştirel Düşünme & Gerçek Yaşam',
        levelDescriptions: {
          1: 'Günlük hayat problemlerinde (meteoroloji sıcaklıkları, rüzgar türbini hızları) kesirleri karşılaştırmakta ve yanılgıları fark etmekte zorlanıyorum.',
          2: 'Hatalı bir sıralama verildiğinde sonucun yanlış olduğunu hissediyorum ancak hangi kuralın ihlal edildiğini matematiksel dille açıklayamıyorum.',
          3: 'Palandöken hava durumu veya yenilenebilir enerji verilerindeki rasyonel değerleri doğru sıralar, sık yapılan kavram yanılgılarını (örn. paydası büyük olan büyüktür yanılgısı) tespit edip düzeltirim.',
          4: 'Gerçek yaşam senaryolarında rasyonel büyüklükleri karar verme (en verimli türbin, en soğuk pist) süreçlerinde stratejik bir veri analiz aracı olarak etkinlikle kullanırım.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Payları eşit rasyonel sayılarda paydası küçük olanın daha büyük olduğunu bilirim.' },
      { id: 'chk2', text: 'Paydaları farklı kesirleri uygun ortak katlarla genişleterek paydalarını eşitleyebilirim.' },
      { id: 'chk3', text: 'Büyük kesirleri 1/2 veya 1 referans noktasına olan yakınlıklarına göre zihinden kıyaslarım.' },
      { id: 'chk4', text: 'Negatif rasyonel sayılarda sıfıra daha yakın olan sayının daha büyük olduğunu bilirim.' },
      { id: 'chk5', text: 'Karışık işaretli ve biçimli rasyonel sayıları küçükten büyüğe hatasız sıralayabilirim.' }
    ]
  },
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

/**
 * Türkiye Yüzyılı Maarif Modeli - Akran Değerlendirme Rubrikleri (3. Şahıs / Gözlemci Dili)
 */
export const PEER_OUTCOME_RUBRICS: Record<string, SelfAssessmentRubric> = {
  'MAT.6.1.1': {
    id: 'peer-rubric-mat-6-1-1',
    outcomeId: 'MAT.6.1.1',
    title: 'Akran Değerlendirme Rubriği: Bir Doğal Sayının Çarpanları ve Katları',
    description:
      'Takım arkadaşınızın doğal sayının çarpan ve katlarına yönelik muhakeme yapabilme, alan ve gökkuşağı modellerini kullanma becerilerini ve grup içi iş birliğini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Çarpan Kavramını Anlama (Bölen İlişkisi & Kalansız Bölme)',
        category: 'Kavramsal Anlama & Alan Modeli',
        levelDescriptions: {
          1: 'Sayının çarpanlarını bulurken eksik bırakıyor, kalansız bölme ilişkisini kurmakta zorlanıyor.',
          2: 'Küçük sayıların çarpanlarını bulabiliyor ancak büyük sayılarda bazı çarpanları atlıyor.',
          3: 'Bir doğal sayının tüm pozitif çarpanlarını sistematik (alan/gökkuşağı) olarak bulabiliyor.',
          4: 'Çarpan sayısı ile sayının geometrik modelleri arasında bağıntı kurup arkadaşlarına tam açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'Kat Kavramını Uygulama (Ritmik Sayma & Aralık Sınırlamaları)',
        category: 'Matematiksel Uygulama & Örüntü',
        levelDescriptions: {
          1: 'Bir sayının katlarını ritmik saymada zorlanıyor, işlem hatası yapabiliyor.',
          2: 'Sayının ardışık katlarını yazabiliyor fakat aralık sınırlamalarında (örn: 50 ile 100 arası) zorlanıyor.',
          3: 'İstenen aralıktaki katları eksiksiz listeliyor ve kat ilişkisini doğru yorumluyor.',
          4: 'Farklı iki sayının kat örüntülerini karşılaştırarak ortak kat mantığını açıkça izah edebiliyor.'
        }
      },
      {
        id: 'c3',
        title: 'Problem Durumunda Muhakeme (İyilik Kolisi & Paylaştırma)',
        category: 'Problem Çözme & Karar Verme',
        levelDescriptions: {
          1: 'Verilen problem durumunda çarpan mı kat mı kullanacağına karar vermekte zorlanıyor.',
          2: 'Öğretmenin veya ipuçlarının rehberliğinde çarpan/kat ilişkisini probleme uygulayabiliyor.',
          3: 'Günlük hayat problemlerinde çarpan ve katları bağımsız olarak doğru modelliyor.',
          4: 'Problemi birden fazla stratejiyle çözüyor, gerekçelendiriyor ve takıma yeni çözümler sunuyor.'
        }
      },
      {
        id: 'c4',
        title: 'Matematiksel Temsil ve Dil (Alan Modeli, Gökkuşağı, Sayı Doğrusu)',
        category: 'Temsil & Matematiksel Dil',
        levelDescriptions: {
          1: 'Çarpanları rastgele yazıyor, gösterim modellerini (alan/gökkuşağı) kullanmakta zorlanıyor.',
          2: 'Sadece liste yöntemini kullanabiliyor, modelleme araçlarını sınırlı kullanıyor.',
          3: 'Alan modeli, gökkuşağı ve sayı doğrusu temsillerini amacına uygun ve doğru kullanıyor.',
          4: 'Temsiller arası geçiş yapabiliyor ve çıkarımlarını matematiksel önermelerle net biçimde ifade ediyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Öğrenme Sorumluluğu (SDB1.2 - SDB1.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Grup çalışmasında çarpan ve kat bulma adımlarında rastgele tahminler yapıyor, kontrol etmiyor.',
          2: 'Hata yaptığında ipucu ile düzeltiyor ancak nedenini açıklamakta zorlanıyor.',
          3: 'Çarpan ağacı ve alan modelleriyle çözümlerini sabırla kontrol ediyor, takım arkadaşlarına destek oluyor.',
          4: 'Grup çalışmalarına aktif liderlik ediyor, çözümlerini ve gerekçelerini arkadaşlarıyla paylaşıyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bir doğal sayının çarpanı ile böleninin aynı anlama geldiğini kavradı.' },
      { id: 'chk2', text: 'Dikdörtgensel alan modelini kullanarak sayının çarpanlarını bulabiliyor.' },
      { id: 'chk3', text: 'Gökkuşağı yönteminde uçlardaki sayıların çarpım ilişkisini fark etti.' },
      { id: 'chk4', text: 'Bir sayının katlarını belirli bir sınıra kadar ritmik ve hatasız listeleyebiliyor.' },
      { id: 'chk5', text: 'Grup içi paylaştırma ve problem çözümlerine aktif katkı sağlıyor.' }
    ]
  },
  'MAT.6.1.2': {
    id: 'peer-rubric-mat-6-1-2',
    outcomeId: 'MAT.6.1.2',
    title: 'Akran Değerlendirme Rubriği: Bölünebilme Kriterleri (2, 3, 4, 5, 6, 9, 10)',
    description:
      'Takım arkadaşınızın 2, 3, 4, 5, 6, 9 ve 10 ile kalansız bölünebilme kriterlerini uygulama, analiz etme ve problem çözme becerilerini değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Son Basamak Kriterlerini Uygulama (2, 5 ve 10 ile Bölünebilme)',
        category: 'Kavramsal Anlama & Son Basamak',
        levelDescriptions: {
          1: '2, 5 ve 10 ile bölünebilmede birler basamağına bakılması gerektiğini karıştırıyor.',
          2: 'Çift sayıların 2\'ye, sonu 0 ve 5 olanların 5\'e bölündüğünü biliyor ancak 10 ile kalan ilişkisinde zorlanıyor.',
          3: 'Birler basamağını inceleyerek bir sayının 2, 5 ve 10 ile tam bölünüp bölünmediğini ve kalanını doğru bulabiliyor.',
          4: 'Birler basamağı 0 olan sayıların 2, 5 ve 10\'un ortak katı olduğunu basamak değerleriyle arkadaşlarına tam açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'Rakamlar Toplamı Kuralı ve Basamak Çözümleme (3 ve 9 ile Bölünebilme)',
        category: 'Matematiksel Muhakeme & Basamak Toplamı',
        levelDescriptions: {
          1: '3 ve 9 ile bölünebilmede rakamları toplamak yerine birler basamağına bakma hatasına düşebiliyor.',
          2: 'Rakamları toplayarak 3\'ün katı olup olmadığını buluyor fakat 9 ile bölünebilme ve kalan bulmada zorlanıyor.',
          3: 'Rakamları toplamı 3\'ün katı olanların 3\'e, 9\'un katı olanların 9\'a bölündüğünü ve kalanı hatasız hesaplıyor.',
          4: '100=99+1 basamak açılımı üzerinden 3 ve 9 kurallarının mantıksal ispatını yapıp grupta kanıtlıyor.'
        }
      },
      {
        id: 'c3',
        title: 'Son İki Basamak ve Çift Kriter Muhakemesi (4 ve 6 ile Bölünebilme)',
        category: 'Analiz & Çoklu Kriter',
        levelDescriptions: {
          1: '4 ile bölünebilmede son iki basamağa, 6 ile bölünebilmede hem 2 hem 3 şartına bakmayı unutabiliyor.',
          2: '4 ve 6 kurallarını hatırlıyor ancak bilinmeyen basamaklı sorularda tüm değerleri bulmakta zorlanıyor.',
          3: 'Son iki basamağı 00 veya 4\'ün katı olanları 4\'e; hem çift hem rakamlar toplamı 3k olanları 6\'ya doğru çözümlüyor.',
          4: 'Yüzlüklerin 4\'e bölündüğünü gerekçelendirip 6 ile bölünebilen hiçbir sayının tek olamayacağını matematiksel olarak izah ediyor.'
        }
      },
      {
        id: 'c4',
        title: 'Problem Durumlarında Pratik Bölünebilme ve Algoritmik Çıkarım',
        category: 'Uygulama & Problem Çözme',
        levelDescriptions: {
          1: 'Problem durumlarında bölme işlemi yapmadan kural uygulayarak pratik karar vermekte zorlanıyor.',
          2: 'Basit paketleme ve basamak bulma sorularında ipucuyla kuralları uygulayabiliyor.',
          3: 'Günlük hayat problemlerinde (koli, oturma düzeni, şifre) bölünebilme kurallarını bağımsız ve doğru kullanıyor.',
          4: 'T.C. kimlik veya barkod algoritmalarında bölünebilme mantığını modelleyip alternatif stratejiler üretiyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Öğrenme Sorumluluğu (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Bölünebilme adımlarında rastgele tahminler yapıyor, kontrollerini yapmıyor.',
          2: 'Hata yaptığında öğretmen veya takım arkadaşı uyardığında düzeltiyor ancak nedenini açıklamakta zorlanıyor.',
          3: 'Bölünebilme kurallarını adım adım kontrol ediyor, basamak toplama ve son basamak hatalarını fark edip düzeltiyor.',
          4: 'Grup çalışmalarına etkin katkı sağlıyor, bölünebilme çıkarımlarını gerekçeleriyle arkadaşlarına aktarabiliyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Birler basamağı çift olan sayıların 2 ile, 0 veya 5 olanların 5 ile bölündüğünü biliyor.' },
      { id: 'chk2', text: '3 ve 9 kurallarında rakamlar toplamına bakılması gerektiğini kavradı.' },
      { id: 'chk3', text: '4 kuralında son iki basamağın incelendiğini uyguluyor.' },
      { id: 'chk4', text: '6 ile bölünebilmede hem 2 hem 3 koşulunu doğru kontrol ediyor.' },
      { id: 'chk5', text: 'Grup etkinliklerinde bölünebilme kurallarını pratik kararlar için kullanıyor.' }
    ]
  },
  'MAT.6.1.3': {
    id: 'peer-rubric-mat-6-1-3',
    outcomeId: 'MAT.6.1.3',
    title: 'Akran Değerlendirme Rubriği: Asal Sayılar ve Asal Çarpanlar',
    description:
      'Takım arkadaşınızın asal sayı kavramını kavrama, Eratosthenes kalburunu deneyimleme, asal çarpan ağacı ve bölen listesi ile sayıları çözümleme becerilerini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Asal Sayı Kavramı ve 1-100 Arası Asallar (Eratosthenes Kalburu)',
        category: 'Kavramsal Anlama & Sınıflandırma',
        levelDescriptions: {
          1: '1\'in neden asal olmadığını ve asal sayıların sadece 2 böleni olduğunu karıştırıyor.',
          2: 'Küçük asal sayıları tanıyor fakat iki basamaklı tek sayıların (örn: 51, 91) asallığında tereddüt ediyor.',
          3: '1 ile 100 arasındaki 25 asal sayıyı Eratosthenes kalburu mantığıyla doğru tespit edip sınıflandırıyor.',
          4: '2\'nin tek çift asal olduğunu ve tüm bileşik sayıların asalların çarpımı olduğunu arkadaşlarına tam açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'Asal Çarpan Ağacı ile Sayıların Çözümlenmesi',
        category: 'Görsel Modelleme & Ayrıştırma',
        levelDescriptions: {
          1: 'Çarpan ağacında dalları ayırırken asal olmayan sayılarda takılıyor, yaprakları tamamlayamıyor.',
          2: 'Ağaç dallarını oluşturuyor ancak en alt satırdaki asal yaprakları eksik yazabiliyor.',
          3: 'Bileşik sayıları asal çarpan ağacı modeliyle adım adım dallandırıp asal yapraklara ulaşıyor.',
          4: 'Farklı dallanmaların (örn: 24 = 2×12 veya 4×6) en altta daima aynı asal yaprakları verdiğini grupta kanıtlıyor.'
        }
      },
      {
        id: 'c3',
        title: 'Asal Çarpan Algoritması (Bölen Listesi) ve Üslü Gösterim',
        category: 'Algoritmik Düşünme & Sembolik Temsil',
        levelDescriptions: {
          1: 'Bölen listesinde asal olmayan sayılara (örn: 4, 6) bölme hatası yapabiliyor.',
          2: 'Dikey çizgide bölme işlemlerini yapabiliyor fakat üslü ifade biçiminde yazarken üsleri karıştırıyor.',
          3: 'Bir sayıyı en küçük asaldan başlayarak 1\'e kadar bölüyor ve üslü gösterimini hatasız yazıyor.',
          4: 'Asal çarpanların üsleri ile sayının toplam çarpan sayısı arasındaki bağlantıyı fark edip derinlikli yorumluyor.'
        }
      },
      {
        id: 'c4',
        title: 'Gerçek Yaşam, Kriptografi ve Problem Çözme',
        category: 'Uygulama & Disiplinler Arası',
        levelDescriptions: {
          1: 'Asal sayıların günlük hayat ve şifrelemedeki rolünü kavramakta zorlanıyor.',
          2: 'Asal çarpanlarla ilgili basit problemleri çözebiliyor.',
          3: 'Asal sayı özelliklerini alan, çevre ve şifreleme problemlerinde doğru modelleyip çözüyor.',
          4: 'RSA şifreleme ve dijital güvenlikte iki büyük asalın çarpım gücünü kavrayıp takıma yeni senaryolar sunuyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Öğrenme Sorumluluğu (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Asal sayı testlerinde acele ediyor, bölünebilme kontrollerini yapmadan karar veriyor.',
          2: 'Hata yaptığında ipucu ile düzeltiyor ancak neden asal olmadığını açıklamada zorlanıyor.',
          3: 'Bölen listesi ve kalbur adımlarını sabırla kontrol ediyor, işlem hatalarını kendi başına düzeltiyor.',
          4: 'Grup arkadaşlarına asal çarpan algoritmasında yol gösteriyor, çözümlerini kanıtlayarak paylaşıyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: '1 sayısının asal olmadığını, en küçük asalın 2 olduğunu biliyor.' },
      { id: 'chk2', text: 'Eratosthenes kalburunu kullanarak asal sayıları tespit edebiliyor.' },
      { id: 'chk3', text: 'Bileşik sayıları çarpan ağacı yöntemiyle asal yapraklarına ayırabiliyor.' },
      { id: 'chk4', text: 'Bölen listesi algoritmasıyla asal çarpanların üslü çarpımını yazabiliyor.' },
      { id: 'chk5', text: 'Grup çalışmalarında asal sayıların şifreleme ve güvenlikle ilişkisini yorumluyor.' }
    ]
  },
  'MAT.6.1.4': {
    id: 'peer-rubric-mat-6-1-4',
    outcomeId: 'MAT.6.1.4',
    title: 'Akran Değerlendirme Rubriği: Ortak Kat ve Ortak Bölen',
    description:
      'Takım arkadaşınızın iki doğal sayının ortak bölen ve ortak katlarını inceleme, modellerle temsil etme ve aralarında asallığı yorumlama becerilerini değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'İki Sayının Ortak Bölenlerini Belirleme ve Modelleme',
        category: 'Kavramsal Anlama & Kesişim Kümesi',
        levelDescriptions: {
          1: 'İki sayının bölenlerini ayrı ayrı bulurken zorlanıyor, ortak olanları belirleyemiyor.',
          2: 'Küçük sayıların ortak bölenlerini buluyor fakat büyük sayılarda bazı ortak bölenleri atlıyor.',
          3: 'İki doğal sayının tüm bölenlerini listeleyip kesişim kümesindeki ortak bölenleri eksiksiz bulabiliyor.',
          4: 'Ortak bölenler kümesini Venn şeması ve alan ızgarası ile modelleyip en büyük ortak bölenin mantığını açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'İki Sayının Ortak Katlarını Çift Sayı Doğrusunda İnceleme',
        category: 'Örüntü & Sayı Doğrusu Temsili',
        levelDescriptions: {
          1: 'Ortak katları bulurken ritmik saymada işlem hatası yapıyor, ortak noktaları kaçırıyor.',
          2: 'İlk ortak katı bulabiliyor ancak ardışık ortak katların kuralını genellemekte desteğe ihtiyaç duyuyor.',
          3: 'Çift sayı doğrusu ve tablo üzerinde iki sayının katlarını eşleştirerek istenen aralıktaki ortak katları eksiksiz listeliyor.',
          4: 'Ortak katların en küçük ortak katın katları şeklinde devam ettiğini çift sayı doğrusunda kanıtlıyor.'
        }
      },
      {
        id: 'c3',
        title: 'Aralarında Asal Sayıların Mantığını Kavrama',
        category: 'Matematiksel Muhakeme & Çıkarım',
        levelDescriptions: {
          1: 'Aralarında asal olabilmek için sayıların tek tek asal olması gerektiğini zannediyor.',
          2: '1\'den başka ortak böleni olmadığını fark ediyor ancak aralarında asal sayı çiftlerini belirlerken tereddüt ediyor.',
          3: 'Kendileri asal olmasa bile ortak böleni yalnızca 1 olan sayıların (örn: 8 ve 15) aralarında asal olduğunu biliyor.',
          4: 'Ardışık sayıların daima aralarında asal olduğunu matematiksel olarak gerekçelendirip arkadaşlarına açıklıyor.'
        }
      },
      {
        id: 'c4',
        title: 'Gerçek Yaşam Problemleri (Merhamet, Paylaşım, Periyot)',
        category: 'Problem Çözme & Değerler',
        levelDescriptions: {
          1: 'Verilen problemde ortak bölen mi yoksa ortak kat mı kullanacağına karar vermekte zorlanıyor.',
          2: 'Eşit aralıklı fidan dikimi veya ortak sefer problemlerini rehberlikle çözebiliyor.',
          3: 'Sokak hayvanlarına eşit paketleme, tarla sulama ve ortak nöbet problemlerini bağımsız olarak doğru modelliyor.',
          4: 'Çoklu stratejiler kullanarak problem bağlamlarını optimize ediyor (en az paket, en az fidan) ve gerekçelendiriyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Sosyal Farkındalık (SDB2.3 - D9 Merhamet)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Problem çözümlerinde ve grup paylaşımlarında iş birliği yapmakta zorlanıyor.',
          2: 'Hatalarını fark ettiğinde düzeltiyor ancak grup tartışmalarına katkısı sınırlı kalıyor.',
          3: 'Yardımlaşma ve merhamet bağlamlı problemlerde matematiksel modellerini özenle kuruyor ve kontrol ediyor.',
          4: 'Grup çalışmasında adil görev dağılımı yapıyor, merhamet ve tasarruf değerleriyle arkadaşlarına destek oluyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'İki doğal sayıyı kalansız bölen sayıların "ortak bölenler" olduğunu biliyor.' },
      { id: 'chk2', text: 'Ortak katların en küçük ortak katın katları şeklinde devam ettiğini kavradı.' },
      { id: 'chk3', text: '1\'den başka ortak böleni olmayan sayıların "aralarında asal" olduğunu uyguluyor.' },
      { id: 'chk4', text: 'Paylaşım ve paketleme problemlerinde ortak bölenleri doğru kullanabiliyor.' },
      { id: 'chk5', text: 'Periyodik sefer ve nöbet problemlerinde ortak katlarla hesaplama yapabiliyor.' }
    ]
  },
  'MAT.5.3.4': {
    id: 'peer-rubric-mat-5-3-4',
    outcomeId: 'MAT.5.3.4',
    title: 'Akran Değerlendirme Rubriği: Doğruların Durumları ve Açı Çıkarımları',
    description:
      'Takım arkadaşınızın düzlemde iki veya üç doğrunun durumları, ters, komşu, tümler, bütünler açılar ve geometrik çıkarım yapma becerilerini değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Doğruların Durumlarını Tanıma (Kesişen, Paralel, Dik, Kesen)',
        category: 'Kavramsal Anlama & Sınıflandırma',
        levelDescriptions: {
          1: 'Kesişen, paralel, dik ve kesen doğruların özelliklerini ve aralarındaki farkları karıştırıyor.',
          2: 'Paralel ve dik doğruları ayırt ediyor fakat kesen doğrunun oluşturduğu açıları açıklamakta zorlanıyor.',
          3: 'Kesişen, dik, paralel, çakışık ve kesen doğruları doğru tanımlıyor; paralel doğruların açı oluşturmadığını biliyor.',
          4: 'Düzlemde iki ve üç doğrunun tüm durumlarını eksiksiz sınıflandırıp modelleyebiliyor, açı oluşumunu arkadaşlarına tam açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'Ters Açıların Eşitliğini Keşfetme ve Uygulama',
        category: 'Geometrik Çıkarım & Aksiyom',
        levelDescriptions: {
          1: 'Kesişen iki doğrudan oluşan karşılıklı açıların (ters açılar) eşit olduğunu hatırlamakta zorlanıyor.',
          2: 'Ters açıların eşit olduğunu biliyor fakat eğik kesişen doğrularda ters açı çiftlerini belirlemekte tereddüt ediyor.',
          3: 'Kesişen iki doğrudan oluşan karşılıklı açıların ters açılar olduğunu ve ölçülerinin daima eşit olduğunu gösteriyor.',
          4: 'Ters açıların eşitliğini dinamik geometri yazılımında ve problem durumlarında hatasız uygulayıp kanıtlayabiliyor.'
        }
      },
      {
        id: 'c3',
        title: 'Tümler, Bütünler ve Komşu Açı İlişkilerini Çözümleme',
        category: 'Matematiksel Muhakeme & Hesaplama',
        levelDescriptions: {
          1: 'Tümler (90°) ve bütünler (180°) açıların derece toplamlarını birbirine karıştırıyor.',
          2: 'Tümler ve bütünler açı toplamlarını biliyor ancak komşu tümler ve komşu bütünler açıları şekilde ayırt etmekte zorlanıyor.',
          3: 'Ölçüleri toplamı 90° olan açıları tümler, 180° olanları bütünler olarak adlandırıyor ve doğru üzerindeki komşu bütünler açıları hesaplıyor.',
          4: 'Tümler ve bütünler açı ilişkilerini cebirsel ve geometrik modellerle hatasız çözümlüyor, komşu açıların ayrık bölgelerini gerekçelendiriyor.'
        }
      },
      {
        id: 'c4',
        title: 'Üç Doğrunun Durumları ve Açı Önermeleri (OB2 & MAB3)',
        category: 'Tablo Temsili & Önerme Geliştirme',
        levelDescriptions: {
          1: 'Üç doğrunun kesişiminde oluşan açıları saymakta ve tabloya kaydetmekte zorlanıyor.',
          2: 'Üç doğrunun durumlarını gözlemliyor fakat açı çeşitlerine dair genel bir önerme kurmakta desteğe ihtiyaç duyuyor.',
          3: 'Üç doğrunun tek noktada kesişimi veya paralel-kesen durumlarında oluşan açıları tablo temsili üzerinde listeleyip önermeler sunabiliyor.',
          4: 'İki ve üç doğru için geliştirdiği açı önermelerini üçten fazla doğrunun durumlarına genelleştirebiliyor ve mantıksal gerekçeler sunuyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Mantıksal Çıkarım (SDB1.2 - SDB3.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Açı ölçümü ve tablo doldurma aşamalarında rastgele tahminler yapıyor, kontrol etmiyor.',
          2: 'Hata yaptığında ipucu ile düzeltiyor ancak nedenini matematiksel olarak açıklamakta zorlanıyor.',
          3: 'Açıölçer ve dinamik laboratuvar araçlarıyla ölçümlerini sabırla kontrol ediyor, varsayımlarını ölçüm sonuçlarıyla sınıyor.',
          4: 'Grup ortamında geometrik varsayımlarını kanıtlayıp arkadaşlarıyla fikir alışverişinde bulunuyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Kesişen, paralel ve dik doğruların özelliklerini biliyor.' },
      { id: 'chk2', text: 'Kesişen doğrularda ters açıların eşitliğini kavradı.' },
      { id: 'chk3', text: 'Tümler ve bütünler açı hesaplamalarını doğru yapabiliyor.' },
      { id: 'chk4', text: 'Komşu açıların ortak ışınını ve iç bölgelerini ayırt edebiliyor.' },
      { id: 'chk5', text: 'Üç doğrunun kesişiminde oluşan açı durumlarını analiz edebiliyor.' }
    ]
  },
  'MAT.5.3.3': {
    id: 'peer-rubric-mat-5-3-3',
    outcomeId: 'MAT.5.3.3',
    title: 'Akran Değerlendirme Rubriği: Açıları Ölçme ve Matematiksel Araç Kullanımı',
    description:
      'Takım arkadaşınızın açı kavramını anlama, açıölçeri (iletki) kullanma, açıları sınıflandırma ve kavram yanılgılarını aşma düzeyini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Açı Kavramı ve İsimlendirme',
        category: 'Kavramsal Anlama & Sembolik Temsil',
        levelDescriptions: {
          1: 'Açının iki ışından oluştuğunu ve köşe harfinin ortada olması gerektiğini karıştırıyor.',
          2: 'Açının köşesini tanıyor ancak sembolle gösterirken köşe harfini bazen ortaya yazmayı unutuyor.',
          3: 'Açının başlangıç noktası ortak iki ışından oluştuğunu biliyor, sembolle (AOB veya O) doğru yazabiliyor.',
          4: 'Açıyı köşe ve kollar üzerinden hatasız isimlendiriyor, açı sembolü (∠AOB) ve ölçü gösterimini tam uyguluyor.'
        }
      },
      {
        id: 'c2',
        title: 'İletki (Açıölçer) Kullanımı ve Doğru Cetvel Seçimi',
        category: 'Matematiksel Araç ve Teknoloji',
        levelDescriptions: {
          1: 'İletkinin merkezini açının köşesine koymakta ve taban koluna hizalamakta zorlanıyor.',
          2: 'İletkiyi köşeye koyabiliyor fakat iç ve dış cetvel (ters açı) arasında tereddüt yaşıyor.',
          3: 'İletkiyi açının köşesine ve tabanına tam oturtup açının yönüne göre doğru cetvelden dereceyi okuyor.',
          4: 'Uzayda eğik, ters veya dikey duran açıları iletkiyi serbestçe döndürüp sıfırlayarak tam isabetle (±1°) ölçüyor.'
        }
      },
      {
        id: 'c3',
        title: 'Açı Türlerini Sınıflandırma (Dar, Dik, Geniş, Doğru)',
        category: 'Matematiksel Muhakeme & Sınıflandırma',
        levelDescriptions: {
          1: 'Dik açıyı (90°) tanıyor fakat dar ve geniş açıların derece sınırlarını karıştırıyor.',
          2: 'Açının 90°den küçük veya büyük olduğunu fark ediyor fakat sınıflandırmada bazen tereddüt ediyor.',
          3: 'Açıları ölçülerine göre dar (<90°), dik (90°), geniş (>90°) ve doğru (180°) açı olarak doğru sınıflandırıyor.',
          4: 'Açı türlerini hem görsel tahminle hem de iletkiyle anında sınıflandırıp gerçek hayattaki modellerle eşleştiriyor.'
        }
      },
      {
        id: 'c4',
        title: 'Kavram Yanılgısını Aşma (Işın Kollarının Uzunluğu)',
        category: 'Eleştirel Düşünme & Maarif İlkesi',
        levelDescriptions: {
          1: 'Açının kollarının (ışınlarının) boyu uzadığında açının derecesinin de büyüyeceğini düşünüyor.',
          2: 'Kollar uzadığında açının değişmediğini biliyor ancak nedenini ışınların sonsuza uzamasıyla açıklamakta zorlanıyor.',
          3: 'Açının kolları uzatılsa bile açıklığın ve açıölçer derecesinin kesinlikle değişmediğini açıklayabiliyor.',
          4: 'Işınların sonsuza uzama özelliğini kullanarak kol boyunun açıyı değiştirmediğini grup arkadaşlarına gerekçeleriyle kanıtlıyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Dijital Radar Simülasyonu (SDB1.2 - SDB1.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Radar oyununda ve simülasyonlarda rastgele tahminler yapıyor, hatalarını kontrol etmiyor.',
          2: 'Hata yaptığında ipucuna bakıyor ancak hatasının nedenini kendi başına bulmakta zorlanıyor.',
          3: 'Açı radarında iletkiyi doğru döndürüp ayarlayarak lazer antenini hedefe kilitliyor ve ölçümünü kontrol ediyor.',
          4: 'Grup çalışmasında açı ölçümünde yüksek hassasiyet gösteriyor, hata nedenini anında fark edip düzeltiyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Açıyı köşe harfi ortada olacak şekilde sembolle doğru isimlendirebiliyor.' },
      { id: 'chk2', text: 'İletkinin merkezini açının köşesine yerleştirip doğru cetvelden dereceyi okuyor.' },
      { id: 'chk3', text: 'Açıları dar, dik, geniş ve doğru açı olarak hatasız sınıflandırıyor.' },
      { id: 'chk4', text: 'Işın kollarının boyu uzasa da açının ölçüsünün değişmediğini kavradı.' },
      { id: 'chk5', text: 'Dijital radar ve simülasyon araçlarıyla açı ölçümlerini başarıyla tamamlıyor.' }
    ]
  },
  'MAT.5.3.2': {
    id: 'peer-rubric-mat-5-3-2',
    outcomeId: 'MAT.5.3.2',
    title: 'Akran Değerlendirme Rubriği: Temel Geometrik Çizimler ve Matematiksel Araçlar',
    description:
      'Takım arkadaşınızın ölçüsüz cetvel, pergel ve gönye ile yaptığı geometrik çizimleri ve bu çizimlerden elde ettiği matematiksel çıkarımları değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Ölçüsüz Cetvel ve İki Noktadan Tek Doğru Çıkarımı',
        category: 'Kavramsal Muhakeme & Doğru İnşası',
        levelDescriptions: {
          1: 'Ölçüsüz cetvelin uzunluk ölçmek için değil düz çizgi çizmek için kullanıldığını karıştırıyor.',
          2: 'İki noktadan doğru çiziyor fakat iki noktadan sadece tek bir doğru geçebileceği kuralını açıklamakta zorlanıyor.',
          3: 'Herhangi iki farklı noktadan yalnız ve yalnız tek bir doğru çizilebileceğini ölçüsüz cetvel kullanarak gösteriyor.',
          4: 'İki noktadan tek bir doğru geçme ilkesini ve ölçüsüz cetvelin geometrik mantığını gerekçeleriyle tam açıklıyor.'
        }
      },
      {
        id: 'c2',
        title: 'Pergel ile Çember ve Yarıçap Eşitliği Çıkarımı',
        category: 'Matematiksel Araç & Çember Geometrisi',
        levelDescriptions: {
          1: 'Pergelin sabit ayağı ile kalem ayağının rolünü karıştırıyor, yarıçapın sabit kaldığını fark edemiyor.',
          2: 'Pergelle çember çizebiliyor fakat merkezden çember üzerindeki noktalara giden yarıçapların eşitliğini açıklamada zorlanıyor.',
          3: 'Çemberin merkezinden çember üzerindeki tüm noktalara çizilen doğru parçalarının eşit uzunlukta olduğunu biliyor ve gösteriyor.',
          4: 'Yarıçap uzunlukları eşit olan çemberleri pergel açıklığını koruyarak hatasız inşa ediyor ve yarıçap eşitliğini kanıtlıyor.'
        }
      },
      {
        id: 'c3',
        title: 'Pergel ve Cetvelle Işın/Açı Kollarında Eşit Parça Kesme',
        category: 'Geometrik İnşa & Adımlama',
        levelDescriptions: {
          1: 'Pergel açıklığını bozmadan ardışık parça kesme adımlarını uygulamakta zorlanıyor.',
          2: 'Işın üzerinde pergel ile yay kesiyor fakat açının iki kolunda aynı açıklıkla eşit parça işaretlemekte tereddüt ediyor.',
          3: 'Bir ışının başlangıç noktasından itibaren ve bir açının her iki kolundan pergel açıklığıyla ardışık eşit parçalar kesebiliyor.',
          4: 'Kareli ve çizgisiz düzlemde pergel ve ölçüsüz cetvelle eşit uzunlukta doğru parçalarını hatasız aktarıp inşa ediyor.'
        }
      },
      {
        id: 'c4',
        title: 'Gönye ile Dış Noktadan Tek Dikme Çizimi',
        category: 'Matematiksel Araç & Diklik',
        levelDescriptions: {
          1: 'Gönyenin 90 derecelik dik köşesini taban doğrusuna oturtmakta zorlanıyor.',
          2: 'Gönyeyle dikme çizebiliyor ancak dışındaki bir noktadan sadece tek bir dikme indirilebileceği kuralını açıklayamıyor.',
          3: 'Bir doğruya dışındaki bir noktadan yalnız bir dikme çizilebildiğini, farklı noktalardan eşit dikmeler çizilebileceğini gösteriyor.',
          4: 'Gönyeyi taban doğrusu üzerinde kaydırarak dış noktadan tek dikmeyi hatasız inşa ediyor ve diklik sembolü (⊥) ile ifade ediyor.'
        }
      },
      {
        id: 'c5',
        title: 'Eşit Uzaklıktaki Noktalar ve Paralel Doğrular İnşası (OB2)',
        category: 'Modelleme & Matematiksel Çıkarım',
        levelDescriptions: {
          1: 'Paralel doğruların arasındaki mesafenin her yerde eşit olması gerektiğini karıştırıyor.',
          2: 'Gönyeyle eşit uzaklıkta noktalar alabiliyor ancak bunları birleştirerek paralel ray modeli oluşturmakta desteğe ihtiyaç duyuyor.',
          3: 'Bir doğruya gönye ile eşit mesafede noktalar belirleyip birleştirerek paralel doğru (d₁ // d₂) inşa ediyor ve tren rayı modeliyle ilişkilendiriyor.',
          4: 'Dinamik geometri simülasyonunda mesafe değişse bile paralelliğin bozulmadığını ve doğruların kesişmeyeceğini tam açıklıyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Ölçüsüz cetvelle iki noktadan tek bir doğru geçtiğini kavradı.' },
      { id: 'chk2', text: 'Pergel kullanarak çember ve yarıçap eşitliğini çizebiliyor.' },
      { id: 'chk3', text: 'Pergel açıklığıyla ışın üzerinde eşit parçalar kesebiliyor.' },
      { id: 'chk4', text: 'Gönye yardımıyla doğruya dış noktadan tek dikme çizebiliyor.' },
      { id: 'chk5', text: 'Eşit uzaklıktaki noktaları birleştirerek paralel doğrular inşa edebiliyor.' }
    ]
  },
  'MAT.5.3.1': {
    id: 'peer-rubric-mat-5-3-1',
    outcomeId: 'MAT.5.3.1',
    title: 'Akran Değerlendirme Rubriği: Temel Geometrik Kavramlar ve Çizimler',
    description:
      'Takım arkadaşınızın nokta, doğru, doğru parçası ve ışın kavramlarını ayırt etme, sembolik olarak gösterme ve çizim araçlarını kullanma becerilerini değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Kavramsal Ayırt Etme (Nokta, Doğru, Doğru Parçası, Işın)',
        category: 'Kavramsal Anlama',
        levelDescriptions: {
          1: 'Doğru, doğru parçası ve ışının sınır durumlarını (uç noktalarını) karıştırıyor.',
          2: 'Doğru ve doğru parçasını ayırt ediyor fakat ışının tek yönde sonsuza uzamasını açıklamakta zorlanıyor.',
          3: 'Dört temel kavramı başlangıç/bitiş sınırlarına ve uzunluklarının ölçülebilirliğine göre doğru ayırt ediyor.',
          4: 'Kavramların tüm geometrik özelliklerini, uzunluk durumlarını ve modellerini eksiksiz açıklayabiliyor.'
        }
      },
      {
        id: 'c2',
        title: 'Sembolik Temsilleri Doğru Kullanma',
        category: 'Matematiksel Dil ve Semboller',
        levelDescriptions: {
          1: 'Köşeli parantez [ ve ] işaretlerinin sınırlı uç noktayı gösterdiğini karıştırıyor.',
          2: 'Doğru parçası [AB] sembolünü biliyor fakat ışın [AB ve doğru AB sembollerinde tereddüt ediyor.',
          3: 'AB, [AB], [AB sembollerini modelleriyle doğru eşleştiriyor.',
          4: 'Sembolik dili matematiksel iletişimde hatasız kullanıyor, uzunluk sembolü |AB| ile nesne sembolünü ayırt ediyor.'
        }
      },
      {
        id: 'c3',
        title: 'Gerçek Yaşam Modelleriyle İlişkilendirme',
        category: 'Matematiksel Modelleme',
        levelDescriptions: {
          1: 'Çevresindeki nesneleri geometrik kavramlarla ilişkilendirmekte zorlanıyor.',
          2: 'Cetveli doğru parçasına benzetiyor ancak elektrik teli veya lazer ışığını eşleştirmede zorlanıyor.',
          3: 'Lazer ışığını ışına, cetveli doğru parçasına, tren rayını doğruya başarıyla eşleştiriyor.',
          4: 'Çevresindeki karmaşık yapıları inceleyip doğru, ışın ve doğru parçası modellerini özgün örneklerle açıklıyor.'
        }
      },
      {
        id: 'c4',
        title: 'Çizim ve Geometrik Araç Kullanımı',
        category: 'Psikomotor & Dijital Beceriler',
        levelDescriptions: {
          1: 'Cetvel ve dijital çizim araçlarında başlangıç ve ok uçlarını çizmekte zorlanıyor.',
          2: 'Cetvelle doğru parçası çiziyor fakat ışının ok ucunu bazen yanlış yöne koyuyor.',
          3: 'Cetvel ve sanal tahta araçlarıyla nokta, doğru, doğru parçası ve ışın çizimlerini hatasız yapıyor.',
          4: 'Geometrik çizimleri yüksek hassasiyetle tamamlıyor, takım arkadaşlarının çizimlerindeki hataları düzeltebiliyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve İletişim (SDB1.3)',
        category: 'Süreç Becerileri & İş Birliği',
        levelDescriptions: {
          1: 'Grup çalışmalarında öğrenme adımlarını ve çizimlerini değerlendirmekte zorlanıyor.',
          2: 'Grupta üstlendiği görevleri yerine getiriyor ancak kavramsal derinlik kurmakta zorlanıyor.',
          3: 'Grup çalışmasında takım arkadaşlarına yapıcı destek oluyor, kendi ve takımının güçlü yönlerini fark ediyor.',
          4: 'Grup içi matematiksel tartışmalara aktif katılıyor, çizim ve çıkarımlarını arkadaşlarına net ve özgün şekilde aktarıyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Nokta, doğru, doğru parçası ve ışın arasındaki farkları kavradı.' },
      { id: 'chk2', text: '[AB], [AB ve AB sembollerini modelleriyle eşleştirebiliyor.' },
      { id: 'chk3', text: 'Çevresindeki nesneleri geometrik modellerle ilişkilendirebiliyor.' },
      { id: 'chk4', text: 'Cetvel ve dijital çizim araçlarıyla çizimleri hatasız yapabiliyor.' },
      { id: 'chk5', text: 'Grup içi iş birliğinde yapıcı ve destekleyici bir rol üstleniyor.' }
    ]
  },
  'MAT.7.1.1': {
    id: 'peer-rubric-mat-7-1-1',
    outcomeId: 'MAT.7.1.1',
    title: 'Akran Değerlendirme Rubriği: Tam Sayılardan Rasyonel Sayılara',
    description:
      'Takım arkadaşınızın doğal sayı, tam sayı ve rasyonel sayı kümelerini yorumlama, sayı doğrusunda temsil, mutlak değer mantığı ve akıllı ev enerji dengesini analiz etme becerilerini dereceli olarak değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Sayı Kümelerini Yorumlama (N ⊂ Z ⊂ Q)',
        category: 'Kavramsal Anlama & Sayı Kümeleri',
        levelDescriptions: {
          1: 'Arkadaşım sayı kümelerini birbirine karıştırıyor; gizli payda kuralını hatırlamakta zorlanıyor.',
          2: 'Pozitif sayıları kümelere ayırabiliyor fakat negatif sayıların da rasyonel olduğunu bazen unutuyor.',
          3: 'Her tam sayının paydası 1 olan bir rasyonel sayı olduğunu ve N ⊂ Z ⊂ Q ilişkisini doğru açıklıyor.',
          4: 'Sayı kümeleri hiyerarşisini Euler şemasıyla arkadaşlarına eksiksiz açıklıyor, tanımsızlık durumlarını gerekçelendiriyor.'
        }
      },
      {
        id: 'c2',
        title: 'Sayı Doğrusunda Temsil ve Dilimleme',
        category: 'Matematiksel Temsil & Sayı Doğrusu',
        levelDescriptions: {
          1: 'Rasyonel sayıların sayı doğrusundaki ardışık iki tam sayısını belirlemekte zorlanıyor.',
          2: 'Pozitif sayıları dilimleyebiliyor fakat negatif sayılarda sola doğru ilerlemeyi bazen karıştırıyor.',
          3: 'Sayı doğrusunda ardışık tam sayıları doğru seçip paydaya göre eşit parçalara bölerek noktayı buluyor.',
          4: 'Farklı paydalı sayıları aynı sayı doğrusunda hassas şekilde dilimleyip karşılaştırabiliyor.'
        }
      },
      {
        id: 'c3',
        title: 'Mutlak Değer ve Uzaklık Anlayışı',
        category: 'Matematiksel Muhakeme & Mutlak Değer',
        levelDescriptions: {
          1: 'Mutlak değerin sıfıra olan uzaklık anlamını kurmakta zorlanıyor.',
          2: 'Tam sayıların mutlak değerini bulabiliyor ancak rasyonel sayıların mutlak değerini modellemekte desteğe ihtiyaç duyuyor.',
          3: 'Pozitif ve negatif rasyonel sayıların mutlak değerinin başlangıç noktasına (0) olan uzaklık olduğunu açıklıyor.',
          4: 'Mutlak değeri enerji dengesi ve sapma analizlerinde bağımsız ve yetkin bir araç olarak kullanıyor.'
        }
      },
      {
        id: 'c4',
        title: 'Takım Çalışması & Finansal Okuryazarlık (D17 / OB3 / OB4)',
        category: 'İş Birliği & Gerçek Yaşam',
        levelDescriptions: {
          1: 'Grup çalışmalarında akıllı ev enerji dengesi yorumlarına katılmakta çekingen kalıyor.',
          2: 'Grup görevlerini yapıyor ancak enerji tasarrufu çıkarımlarında desteğe ihtiyaç duyuyor.',
          3: 'Grup çalışmalarında enerji verilerini rasyonel sayılarla modelleyip takımına yapıcı katkı sağlıyor.',
          4: 'Takım içinde liderlik yapıyor, enerji verimliliği ve tasarruf önerilerini net matematiksel argümanlarla sunuyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Sayı kümeleri (N ⊂ Z ⊂ Q) arasındaki hiyerarşiyi kavradı.' },
      { id: 'chk2', text: 'Bir tam sayıyı paydası 1 olan bir rasyonel sayı olarak yazabiliyor.' },
      { id: 'chk3', text: 'Paydası 0 olan kesirli ifadelerin tanımsız olduğunu biliyor.' },
      { id: 'chk4', text: 'Sayı doğrusunda rasyonel sayıları doğru aralığı dilimleyerek gösteriyor.' },
      { id: 'chk5', text: 'Grup çalışmalarında yapıcı ve destekleyici bir rol üstleniyor.' }
    ]
  },
  'MAT.7.1.1-2': {
    id: 'peer-rubric-mat-7-1-1-2',
    outcomeId: 'MAT.7.1.1-2',
    title: 'Akran Değerlendirme Rubriği: Rasyonel Sayıların Sayı Doğrusunda Derinleşmesi',
    description: 'Grup arkadaşınızın bileşik kesirleri sayı doğrusunda dilimleme, yoğunluk özelliğini açıklama ve mutlak değer modellerini kurma performansını değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Sayı Doğrusunda Konumlandırma ve Dilimleme',
        category: 'Matematiksel Temsil',
        levelDescriptions: {
          1: 'Bileşik kesirleri tam sayılı kesre çevirip sayı doğrusunda göstermekte zorlanıyor.',
          2: 'Pozitif kesirleri gösterebiliyor ancak negatif kesirlerin yönünü ve aralığını belirlemekte desteğe ihtiyaç duyuyor.',
          3: 'Bileşik kesirleri ardışık iki tam sayı arasına doğru adımlarla yerleştirebiliyor.',
          4: 'Kesirleri, tam sayılı ve ondalık halleriyle sayı doğrusunda hatasız ve açıklayıcı biçimde modelledi.'
        }
      },
      {
        id: 'c2',
        title: 'Yoğunluk Özelliği (Sonsuz Nokta) Muhakemesi',
        category: 'Kavramsal Anlama',
        levelDescriptions: {
          1: 'İki kesir arasında başka rasyonel sayıların da bulunabileceğini fark etmekte zorlanıyor.',
          2: 'İki kesir arasında sayı bulabiliyor ancak sonsuz nokta kavramını açıklamakta zorlanıyor.',
          3: 'Genişletme yaparak iki rasyonel sayı arasında yeni sayılar bulabildi ve yoğunluğu kavradı.',
          4: 'Yoğunluk mantığını akranlarına mikroskop ve genişletme yöntemiyle çok başarılı anlattı.'
        }
      },
      {
        id: 'c3',
        title: 'Mutlak Değer ve Mesafe Anlayışı',
        category: 'Matematiksel Muhakeme',
        levelDescriptions: {
          1: 'Mutlak değerin sıfıra olan mesafe anlamını kurmakta zorlanıyor.',
          2: 'Mesafenin yönsüz olduğunu biliyor fakat rasyonel sayılarda uygulamakta güçlük çekiyor.',
          3: 'Sıfıra olan uzaklığı mutlak değerle doğru hesaplayıp sayı doğrusunda gösterdi.',
          4: 'Tolerans ve sapma analizlerinde mutlak değeri bir karar aracı olarak yetkinlikle kullandı.'
        }
      },
      {
        id: 'c4',
        title: 'İş Birliği ve Sürece Katkı',
        category: 'Sosyal-Duygusal Beceriler',
        levelDescriptions: {
          1: 'Grup içi tartışmalara ve laboratuvar etkinliklerine katılımı sınırlı kaldı.',
          2: 'Yalnızca soru sorulduğunda fikir belirtti, akranlarıyla ortak çalışma yapmakta çekingen davrandı.',
          3: 'Grup tartışmalarına aktif katıldı ve akıllı park su deposu çözümlerine katkı sundu.',
          4: 'Grupta yapıcı bir liderlik sergiledi, arkadaşlarına yardımcı oldu ve ortak hedefe ulaşmayı sağladı.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bileşik kesirleri sayı doğrusunda doğru aralığı dilimleyerek gösterdi.' },
      { id: 'chk2', text: 'İki rasyonel sayı arasında sonsuz nokta olduğunu genişleterek kanıtladı.' },
      { id: 'chk3', text: 'Mutlak değerin başlangıç noktasına uzaklık olduğunu arkadaşlarına açıkladı.' },
      { id: 'chk4', text: 'Laboratuvar ve oyun istasyonunda takım çalışmasına uyum sağladı.' },
      { id: 'chk5', text: 'Farklı fikirlere saygı göstererek yapıcı geri bildirimlerde bulundu.' }
    ]
  },
  'MAT.7.1.2': {
    id: 'peer-rubric-mat-7-1-2',
    outcomeId: 'MAT.7.1.2',
    title: 'Akran Değerlendirme Rubriği: Rasyonel Sayıları Karşılaştırma ve Sıralama',
    description: 'Takım arkadaşınızın pay/payda eşitleme, referans noktası kullanımı, negatif rasyonel sıralama ve terazi modellerini kurma performansını değerlendiriniz.',
    criteria: [
      {
        id: 'c1',
        title: 'Pay ve Payda Eşitleme Stratejileri',
        category: 'Kavramsal Anlama & Birim Kesir',
        levelDescriptions: {
          1: 'Pay veya payda eşitleme kurallarını uygulamakta ve uygun yöntemi seçmekte zorlanıyor.',
          2: 'Paydaları eşitleyebiliyor ancak payları eşit olduğunda birim kesir mantığını açıklamakta zorlanıyor.',
          3: 'Verilen kesirlerde pay veya payda eşitleme adımlarını kuralına uygun ve doğru biçimde uyguladı.',
          4: 'En pratik eşitleme yöntemini anında seçerek akranlarına zaman kazandırıcı çözümler gösterdi.'
        }
      },
      {
        id: 'c2',
        title: 'Yarıma (1/2) ve Bütüne Referans Alma',
        category: 'Matematiksel Muhakeme',
        levelDescriptions: {
          1: 'Büyük kesirlerde referans noktası kullanarak zihinsel karşılaştırma yapmakta zorlanıyor.',
          2: '1/2 referansını tanıyor ancak iki kesir arasındaki farkı zihinden kıyaslamakta desteğe ihtiyaç duyuyor.',
          3: 'Yarımdan büyük/küçük olma durumunu ve bütüne olan uzaklıkları başarıyla kullanarak karşılaştırma yaptı.',
          4: 'Zihinsel referans stratejisini akranlarına sayı doğrusu ve lazer cetveli üzerinde mantığıyla anlattı.'
        }
      },
      {
        id: 'c3',
        title: 'Negatif Rasyonel Sayı Sıralaması',
        category: 'Sayı Hissi & Negatif Sıralama',
        levelDescriptions: {
          1: 'Negatif kesirleri sıralarken pozitif sayılarla karıştırıyor, sıfıra yakınlık kuralını unutuyor.',
          2: 'Negatif sayıların yönünü biliyor ancak mutlak değer kıyaslamasında tereddüt yaşıyor.',
          3: 'Negatif kesirlerde sıfıra daha yakın olanın büyük olduğunu kuralına uygun şekilde uyguladı.',
          4: 'Palandöken dondurucu sıcaklık probleminde negatif kesirleri hatasız sıralayıp grubuna rehberlik etti.'
        }
      },
      {
        id: 'c4',
        title: 'Takım Çalışması & Denge Terazisi Modeli',
        category: 'İş Birliği & Modelleme',
        levelDescriptions: {
          1: 'Laboratuvardaki terazi ve sıralama etkinliklerinde pasif kaldı, fikir paylaşımında bulunmadı.',
          2: 'Sorulduğunda katıldı ancak modelleme ve doğrulama süreçlerinde tek başına karar almak istedi.',
          3: 'Denge terazisi simülasyonunu ve çoklu sıralama masasını takımla uyum içinde başarıyla kullandı.',
          4: 'Grup içinde hatalı tahminleri nazikçe düzelten, herkesi sürece katan yapıcı bir iş birliği sergiledi.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Pay ve payda eşitleme stratejilerini doğru uyguladı.' },
      { id: 'chk2', text: '1/2 ve bütüne yakınlık referanslarını kullanarak zihinden karşılaştırma yaptı.' },
      { id: 'chk3', text: 'Negatif rasyonel sayıları sıfıra yakınlık ilkesine göre doğru sıraladı.' },
      { id: 'chk4', text: 'Denge terazisi ve referans metresi laboratuvarında aktif rol aldı.' },
      { id: 'chk5', text: 'Grup arkadaşlarına karşılaştırıcı ve yapıcı geri bildirimlerde bulundu.' }
    ]
  },
};

/**
 * Akran değerlendirmesi için 3. tekil şahıs dilinde (arkadaşını değerlendiren dil) rubrik döner.
 */
export function getPeerRubricForOutcome(
  outcomeId: string,
  outcomeTitle: string,
  outcomeCode: string
): SelfAssessmentRubric {
  if (PEER_OUTCOME_RUBRICS[outcomeId]) {
    return PEER_OUTCOME_RUBRICS[outcomeId];
  }

  // Fallback 3rd person peer rubric generator for any other outcome
  return {
    id: `peer-rubric-${outcomeId}`,
    outcomeId,
    title: `Akran Değerlendirme Rubriği: ${outcomeTitle}`,
    description: `Takım arkadaşınızın "${outcomeCode} - ${outcomeTitle}" kazanımına yönelik kavramsal anlama, araç kullanımı, muhakeme ve grup içi katkısını dereceli olarak değerlendiriniz.`,
    criteria: [
      {
        id: 'c1',
        title: 'Kazanım Temel Kavramlarını Anlama',
        category: 'Kavramsal Anlama',
        levelDescriptions: {
          1: 'Konudaki temel matematiksel kavramları ve tanımları hatırlamakta zorlanıyor.',
          2: 'Temel kavramları kısmen tanıyor ancak aralarındaki ilişkileri açıklamakta zorlanıyor.',
          3: 'Konudaki kavramları ve temel özellikleri doğru şekilde anlıyor ve ifade edebiliyor.',
          4: 'Kavramları derinlemesine kavradı; kavramlar arası bağlantıları ve matematiksel mantığı arkadaşlarına tam açıklayabiliyor.'
        }
      },
      {
        id: 'c2',
        title: 'Matematiksel Araç ve Teknoloji Kullanımı',
        category: 'Araç & Teknoloji Becerisi',
        levelDescriptions: {
          1: 'Ders araçlarını (cetvel, iletki, dijital simülatör) kullanırken rehberliğe ihtiyaç duyuyor.',
          2: 'Araçları temel düzeyde kullanabiliyor ancak karmaşık durumlarda yardım alıyor.',
          3: 'Matematiksel araçları ve dijital laboratuvarı bağımsız ve doğru şekilde kullanıyor.',
          4: 'Tüm matematiksel ve dijital araçları ustalıkla kullanarak ölçüm ve modellemeleri hatasız yapıyor.'
        }
      },
      {
        id: 'c3',
        title: 'Problem Çözme ve Günlük Hayat Modellemesi',
        category: 'Uygulama ve Modelleme',
        levelDescriptions: {
          1: 'Öğrendiği matematiksel bilgileri günlük hayat durumlarında fark etmekte zorlanıyor.',
          2: 'Basit günlük hayat problemlerinde konuyu uygulayabiliyor.',
          3: 'Gerçek yaşam senaryolarını matematiksel olarak modelleyip doğru çözümlere ulaşıyor.',
          4: 'Öğrendiklerini yeni ve alışılmadık durumlara transfer ediyor, özgün model ve örnekler üretebiliyor.'
        }
      },
      {
        id: 'c4',
        title: 'Kavram Yanılgılarını Fark Etme ve Çözümleme',
        category: 'Eleştirel Düşünme & Muhakeme',
        levelDescriptions: {
          1: 'Konuyla ilgili yaygın yanılgılara düşebiliyor, doğru gerekçeyi bulmakta zorlanıyor.',
          2: 'Yanılgıyı fark ettiğinde düzeltiyor ancak nedenini matematiksel olarak açıklamakta zorlanıyor.',
          3: 'Kavram yanılgılarını fark ediyor, kural ve gerekçeleriyle birlikte doğruyu açıklayabiliyor.',
          4: 'Olası yanılgıları önceden tahmin ediyor, grup arkadaşlarına mantıksal ve görsel kanıtlarla doğruyu gösteriyor.'
        }
      },
      {
        id: 'c5',
        title: 'Takım Çalışması ve Grup İçi Katkı (SDB1.2 - SDB1.3)',
        category: 'Süreç Bileşeni & İş Birliği',
        levelDescriptions: {
          1: 'Grup çalışmasında takım içi iletişim ve ortak problem çözümünde desteğe ihtiyaç duyuyor.',
          2: 'Takım çalışmalarına katılıyor ancak fikirlerini açıklamakta bazen çekingen kalıyor.',
          3: 'Grup içinde yapıcı ve iş birlikçi bir tutum sergiliyor, takım arkadaşlarına destek oluyor.',
          4: 'Takım çalışmasında liderlik ve pozitif katkı sağlıyor, matematiksel çıkarımları arkadaşlarına net biçimde aktarıyor.'
        }
      }
    ],
    checklistItems: [
      { id: 'chk1', text: 'Bu kazanıma ait temel kavram ve tanımları anladı.' },
      { id: 'chk2', text: 'Matematiksel ve dijital araçları bağımsız olarak kullanabiliyor.' },
      { id: 'chk3', text: 'Öğrendiği kavramları günlük hayat problemlerine uygulayabiliyor.' },
      { id: 'chk4', text: 'Kavram yanılgılarını fark edip doğru çözümleri gerekçelendirebiliyor.' },
      { id: 'chk5', text: 'Grup çalışmalarında yapıcı ve aktif rol üstleniyor.' }
    ]
  };
}
