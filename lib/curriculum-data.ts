import { Grade, Outcome } from '@/types';

export const CURRICULUM_DATA: Grade[] = [
  {
    id: 'grade-5',
    level: 5,
    title: '5. Sınıf',
    subtitle: 'Ortaokul Kademesi - Maarif Modeli',
    icon: 'GraduationCap',
    color: 'from-emerald-500 to-teal-700',
    description: 'Temel matematiksel kavramların anlamlandırıldığı ve somuttan soyuta geçişin sağlandığı basamak.',
    subjects: [
      {
        id: 'mat-5',
        gradeId: 'grade-5',
        title: 'Matematik',
        code: 'MAT-5',
        icon: 'Calculator',
        color: 'from-teal-500 to-emerald-600',
        description: 'Sayılar, Geometri, Veri Analizi ve Ölçme alanlarında beceri temelli öğrenme.',
        units: [
          {
            id: 'unit-5-geo',
            subjectId: 'mat-5',
            unitNumber: 3,
            title: '3. Ünite: Geometrik Şekiller ve Ölçme',
            description: 'Temel geometrik kavramlar, açılar, çokgenler ve çevre-alan ilişkileri.',
            icon: 'Shapes',
            themeColor: '#10b396',
            topics: [
              {
                id: 'topic-5-geo-1',
                unitId: 'unit-5-geo',
                title: 'Temel Geometrik Kavramlar ve Çizimler',
                description: 'Nokta, doğru, doğru parçası ve ışın modelleri ve sembolik gösterimleri.',
                outcomes: [
                  {
                    id: 'MAT.5.3.1',
                    code: 'MAT.5.3.1',
                    title: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler ve Sembolik Gösterimler',
                    shortTitle: 'Temel Geometrik Kavramlar ve Çizimler',
                    description: 'Doğru, doğru parçası ve ışını açıklar; modelleri üzerinde gösterir ve sembolle ifade eder.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-1',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Kendi çizimlerini kontrol etme ve hatalarını düzeltme)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Grup çizim etkinliklerinde fikir paylaşımı)',
                        'SDB3.3: Eleştirel ve Geometrik Düşünme (Uzamsal modelleri sembolik dile aktarma)'
                      ],
                      processComponents: [
                        'SB1.1: Günlük Hayat Durumlarını Geometrik Olarak Anlamlandırma',
                        'SB2.1: Nokta, Doğru, Doğru Parçası ve Işın Modellerini Temsil Etme',
                        'SB3.2: Sembolik ve Görsel Temsiller Arasında Geçiş Yapma'
                      ],
                      learningGoals: [
                        'Noktanın boyutu olmadığını ve konum belirttiğini fark eder.',
                        'Doğrunun iki ucu sonsuza giden bir çizgi modeli olduğunu kavrar.',
                        'Doğru parçasının iki ucunun sınırlı olduğunu ve uzunluğunun ölçülebildiğini açıklar.',
                        'Işının bir ucu kapalı, diğer ucu sonsuza giden ışık hüzmesi modeli olduğunu sembolle gösterir ([AB veya AB şeklinde).'
                      ],
                      teacherTips: [
                        'Akıllı tahtada önce lazer pointer / fener yardımıyla ışın modelini somutlaştırın.',
                        'Öğrencilere cetvel ile doğru parçasını ölçtürün, ardından "Neden doğrunun uzunluğu ölçülemez?" sorusu ile tartışma başlatın.',
                        'Köşeli parantez [ sembolünün "o ucun kapalı / durak noktası" olduğunu görsel analojilerle pekiştirin.'
                      ],
                      misconceptions: [
                        'Doğru parçasını cetvelle çizip üzerine ok koyarak doğru ile karıştırma.',
                        'Işının başlangıç noktasının önemsiz olduğunu düşünerek sembolü ters yazma (Örn: Başlangıcı A olan ışına BA yazmak).',
                        'Noktanın bir kalınlığı veya alanı olduğunu zannetme.'
                      ],
                      keyQuestions: [
                        'Sonsuzluğa giden bir tren rayı ile iki istasyon arasındaki ray arasında ne fark vardır?',
                        'Bir fenerden çıkan ışık demeti evrende nereye kadar gider? Onu nasıl modelleriz?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Kutup Yıldızı ve Deniz Feneri Macerası',
                        character: {
                          name: 'Kaptan Bilge & Mimar Defne',
                          role: 'Gezgin Matematikçiler',
                          avatar: '🧭'
                        },
                        scenario: 'Kaptan Bilge, fırtınalı bir gecede gemisini güvenli limana ulaştırmak için sahil fenerinin yaydığı ışık hüzmesini takip ediyor. Mimar Defne ise liman ile fener kulesi arasına sağlam bir köprü kirişi inşa etmeye çalışıyor.',
                        realLifeConnection: 'Fenerin ampulünden çıkıp sonsuz karanlığa doğru uzanan ışık bir IŞIN modelidir. İki iskele arasına döşenen sabit demir köprü bir DOĞRU PARÇASI modelidir. Ufuk çizgisi ise gözümüzün alabildiğine iki yöne uzanan bir DOĞRU modelidir.',
                        reflectionQuestion: 'Sizce fenerden çıkan ışığın uzunluğunu cetvelle ölçebilir miyiz? Peki köprü kirişini ölçebilir miyiz?',
                        keyTakeaway: 'Nokta bir başlangıçtır, doğru iki yöne sonsuzdur, doğru parçası iki uçtan sınırlıdır, ışın ise tek yönde sonsuza akar.',
                        pages: [
                          {
                            id: 'p-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Haritadaki İşaret',
                            conceptTitle: 'Nokta Kavramı',
                            conceptBadge: 'Nokta (•)',
                            symbolicCode: 'A, B, C...',
                            narrativeText: 'Karanlık ve fırtınalı bir gecede Kaptan Bilge, gemisini dev dalgalardan korumak için haritasını açtı. Kaleminin ucuyla haritada sığınılacak limanın tam yerini işaretledi.',
                            characterDialogue: {
                              speaker: 'Kaptan Bilge',
                              text: 'Haritada işaretlediğim bu küçük iz, sadece bir konumu gösterir. Kalınlığı, eni ya da boyu yoktur; burası bizim başlangıç Noktamızdır!'
                            },
                            visualScene: {
                              type: 'point-map',
                              caption: 'Harita üzerindeki A Noktası: Konum belirtir, boyutu yoktur.'
                            },
                            interactiveAction: {
                              prompt: 'Haritadaki liman iskelesine tıklayarak A Noktasını işaretleyin!',
                              actionLabel: 'Haritada Noktayı İşaretle (•)',
                              feedbackRevealed: 'Harika! A Noktası belirlendi. Nokta sadece konum belirtir ve büyük harfle isimlendirilir.'
                            },
                            mathTakeaway: 'Nokta: Boyutu (eni, boyu, derinliği) olmayan, uzayda veya düzlemde tam bir konum belirten geometrik yapıdır.'
                          },
                          {
                            id: 'p-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Karanlığı Yaran Işık',
                            conceptTitle: 'Işın Modeli',
                            conceptBadge: 'Işın [AB',
                            symbolicCode: '[AB veya [AB>',
                            narrativeText: 'Kaptan rotasını belirlerken uzaktaki sahil fenerinin dev ampulü yandı. Fenerin içindeki lambadan çıkan güçlü ışık demeti, gökyüzünde sonsuzluğa doğru kesintisiz ilerledi.',
                            characterDialogue: {
                              speaker: 'Kaptan Bilge',
                              text: 'Bakın! Işığın başladığı yer fener kulesidir (Başlangıç Noktası [A]). Ama ışığın sonu yoktur, uzay boşluğunda sonsuza doğru akar!'
                            },
                            visualScene: {
                              type: 'lighthouse-ray',
                              caption: 'Fener lambasından çıkan ışık hüzmesi bir IŞIN [AB modelidir.'
                            },
                            interactiveAction: {
                              prompt: 'Feneri açarak ışık huzmesini karanlığa doğru fırlatın!',
                              actionLabel: 'Fenerin Işığını Aç 🔦',
                              feedbackRevealed: 'Işın [AB oluşturuldu! Başlangıç noktası kapalı [A], diğer ucu sonsuza doğru giden oktur.'
                            },
                            mathTakeaway: 'Işın: Bir ucu sabit ve kapalı bir başlangıç noktasına sahip, diğer ucu ise bir yönde sınırsızca uzayan çizgi modelidir.'
                          },
                          {
                            id: 'p-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: İki Kıyı Arasındaki Köprü',
                            conceptTitle: 'Doğru Parçası Modeli',
                            conceptBadge: 'Doğru Parçası [AB]',
                            symbolicCode: '[AB] veya [BA]',
                            narrativeText: 'Liman güvenliğe kavuştuğunda Mimar Defne sabahın ilk ışıklarıyla işe koyuldu. Liman iskelesi ile fener kulesi arasına 24 metrelik gergin bir çelik köprü kirişi yerleştirdi.',
                            characterDialogue: {
                              speaker: 'Mimar Defne',
                              text: 'Bu köprü kirişinin başlangıcı da bitişi de sabittir. İki ucu da sınırlandırılmış olduğu için uzunluğu metre ile tam olarak ölçülebilir!'
                            },
                            visualScene: {
                              type: 'bridge-segment',
                              caption: 'İki sütun arasına gerilen çelik kiriş bir DOĞRU PARÇASI [AB] modelidir.'
                            },
                            interactiveAction: {
                              prompt: 'Cetvel ile iki sütun arasındaki köprü kirişini ölçün!',
                              actionLabel: 'Köprüyü Cetvelle Ölç 📏',
                              feedbackRevealed: 'Ölçüm tamamlandı: 24 metre! Her iki ucu da kapalı [A ve B] olduğu için boyu tam hesaplanabilir.'
                            },
                            mathTakeaway: 'Doğru Parçası: İki ucu da sınırlı olan, üzerinde sonsuz nokta barındıran ve uzunluğu kesinlikle ölçülebilen düz çizgidir.'
                          },
                          {
                            id: 'p-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Sonsuz Ufuk Çizgisi',
                            conceptTitle: 'Doğru Modeli',
                            conceptBadge: 'Doğru AB',
                            symbolicCode: 'AB veya d',
                            narrativeText: 'Güneş tamamen doğduğunda deniz ve gökyüzü buluştu. Kaptan Bilge ve Mimar Defne, doğudan batıya iki yönde de sınırsızca uzanan ufuk çizgisine hayranlıkla baktılar.',
                            characterDialogue: {
                              speaker: 'Kaptan & Mimar',
                              text: 'Ufuk çizgisi gibi bir model düşünün; ne başında bir duvar var ne de sonunda. İki yönden de sonsuza dek devam eder!'
                            },
                            visualScene: {
                              type: 'horizon-line',
                              caption: 'İki uca sınırsızca uzanan ufuk çizgisi bir DOĞRU (AB) modelidir.'
                            },
                            interactiveAction: {
                              prompt: 'Ufuk çizgisinin iki ucuna sonsuzluk oklarını ekleyin!',
                              actionLabel: 'İki Yöne Sonsuzluk Okları Çek ↔️',
                              feedbackRevealed: 'AB Doğrusu tamamlandı! İki yönde de ok bulunması sınırsız uzandığını gösterir.'
                            },
                            mathTakeaway: 'Doğru: Her iki yönden de sınırsızca uzayan, kalınlığı olmayan ve uçlarına çift yönlü ok konulan düz çizgidir.'
                          },
                          {
                            id: 'p-5',
                            pageNumber: 5,
                            chapterTitle: '5. Bölüm: Büyük Geometri Özeti',
                            conceptTitle: 'Karşılaştırma & Maarif Değerlendirmesi',
                            conceptBadge: 'Büyük Tablo',
                            symbolicCode: 'Özet Tablo',
                            narrativeText: 'Maceranın sonunda Kaptan Bilge ve Mimar Defne öğrendikleri tüm geometrik kavramları gemi günlüğünde bir araya getirdiler.',
                            characterDialogue: {
                              speaker: 'Gezgin Matematikçiler',
                              text: 'Artık etrafımızdaki her yapının bir geometrik dille konuşulduğunu biliyoruz. Şimdi sıra çizim atölyesinde kendi modellerimizi oluşturmakta!'
                            },
                            visualScene: {
                              type: 'summary-chart',
                              caption: 'Nokta, Işın, Doğru Parçası ve Doğru modellerinin tam tablosu.'
                            },
                            interactiveAction: {
                              prompt: 'Sınıf tartışma sorusunu inceleyin ve çizim atölyesine geçin!',
                              actionLabel: 'Sınıf Tartışmasını Başlat 💬',
                              feedbackRevealed: 'Tebrikler! 1. Aşamayı tamamladınız. Şimdi Çizim Atölyesi ile kendi modellerinizi tasarlayabilirsiniz.'
                            },
                            mathTakeaway: 'Geometri günlük hayatı anlamlandırma sanatıdır: Nokta konumdur, Işın yayılmadır, Doğru Parçası mesafedir, Doğru ise sınırsızlıktır.'
                          }
                        ]
                      },
                      lab: {
                        title: 'İnteraktif Geometri Çizim Laboratuvarı',
                        toolType: 'geometry-canvas',
                        instructions: 'Aşağıdaki etkileşimli tahtayı kullanarak sırasıyla Nokta, Doğru, Doğru Parçası ve Işın oluşturun. Çizimlerin sembolik karşılıklarını ekranda gözlemleyin.',
                        taskGoal: 'En az 1 adet Doğru Parçası [AB], 1 adet Işın [CD ve 1 adet Doğru EF oluşturup özelliklerini inceleyin.',
                        interactiveTips: [
                          'Nokta aracıyla tahtaya tıklayarak isimlendirilmiş noktalar bırakabilirsiniz.',
                          'Doğru parçası aracı ile iki noktayı birleştirip uzunluğunu ölçebilirsiniz.',
                          'Işın aracını seçtiğinizde ilk tıkladığınız nokta başlangıç noktası [ olur.'
                        ],
                        presetObjects: [
                          { id: 'p1', type: 'point', label: 'A', x1: 150, y1: 180, color: '#10b396' },
                          { id: 'p2', type: 'point', label: 'B', x1: 380, y1: 180, color: '#10b396' },
                          { id: 'p3', type: 'point', label: 'C', x1: 520, y1: 260, color: '#3b82f6' }
                        ]
                      },
                      puzzle: {
                        title: 'Kavram ve Sembol Eşleştirme Bulmacası',
                        instructions: 'Geometrik kavramları, görsel modellerini ve sembolik gösterimlerini doğru şekilde eşleştirin.',
                        items: [
                          {
                            id: 'pz-1',
                            concept: 'Doğru Parçası',
                            symbol: '[AB] veya [BA]',
                            definition: 'İki ucu da sınırlı olan, boyu ölçülebilen düz çizgi parçası.',
                            visualType: 'segment'
                          },
                          {
                            id: 'pz-2',
                            concept: 'Işın',
                            symbol: '[AB veya [AB>',
                            definition: 'Başlangıç noktası sabit, diğer ucu sonsuza doğru giden çizgi.',
                            visualType: 'ray'
                          },
                          {
                            id: 'pz-3',
                            concept: 'Doğru',
                            symbol: 'AB veya d',
                            definition: 'Her iki yönden de sınırsızca uzayan düz çizgi.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-4',
                            concept: 'Nokta',
                            symbol: 'A, B, C...',
                            definition: 'Boyutu, eni, boyu veya yüksekliği olmayan, konumu belirten iz.',
                            visualType: 'point'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Kazanım Değerlendirme ve Pekiştirme Testi',
                        instructions: 'Soruları dikkatle okuyunuz. Öğretmen modunda cevapları açabilir, öğrenci modunda anında dönüt alabilirsiniz.',
                        questions: [
                          {
                            id: 'q1',
                            questionText: 'Bir ucunda elektrik direği bulunan, diğer ucu uzay boşluğuna doğru kesintisiz devam eden lazer ışığı demeti hangi geometrik kavram ile modellenir?',
                            context: 'Günlük Hayat Modellemesi',
                            options: [
                              'A) Doğru',
                              'B) Doğru Parçası',
                              'C) Işın',
                              'D) Düzlem'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Elektrik direği sabit bir başlangıç noktasıdır, lazerin sonsuza ilerlemesi ise tek yönde sınırsızlığı ifade eder. Bu model IŞINdır ve [AB şeklinde sembolize edilir.',
                            bloomLevel: 'Kavrama ve Modelleme'
                          },
                          {
                            id: 'q2',
                            questionText: 'Aşağıdaki sembolik gösterimlerden hangisi iki ucu da sınırlı olan ve cetvelle uzunluğu ölçülebilen bir geometrik yapıyı ifade eder?',
                            context: 'Sembolik Gösterim',
                            options: [
                              'A) AB',
                              'B) [AB]',
                              'C) [AB',
                              'D) BA>'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Köşeli parantezlerin her iki tarafta da olması [AB], çizginin A ve B noktalarında sınırlandığını (Doğru Parçası) belirtir.',
                            bloomLevel: 'Bilgi ve Sembolik Gösterim'
                          },
                          {
                            id: 'q3',
                            questionText: 'Mimar Sinan, bir cami kemeri inşa ederken iki sütun arasına 12 metrelik gergin bir çelik halat çekmiştir. Bu halat ile ilgili hangisi KESİNLİKLE doğrudur?',
                            context: 'Beceri Temelli Problem',
                            options: [
                              'A) İki ucu da sonsuza kadar uzatılabilir.',
                              'B) Bir doğru modelidir ve boyu ölçülemez.',
                              'C) Başlangıcı var ama bitişi yoktur.',
                              'D) Bir doğru parçası modelidir ve uzunluğu 12 metredir.'
                            ],
                            correctOptionIndex: 3,
                            explanation: 'İki sütun arasında sınırlandırılmış gergin halat bir doğru parçasıdır. Her iki ucu da sınırlı olduğu için net bir uzunluğa sahiptir.',
                            bloomLevel: 'Analiz ve Çıkarım'
                          }
                        ]
                      }
                    }
                  },
                  {
                    id: 'MAT.5.3.2',
                    code: 'MAT.5.3.2',
                    title: 'İki Noktanın Birbirine Göre Konumu ve Yön Analizi',
                    shortTitle: 'İki Noktanın Konumu',
                    description: 'Bir noktanın diğer bir noktaya göre konumunu yön ve birim kullanarak ifade eder.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-1',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: ['SDB1.1: Kendini Yönlendirme', 'SDB3.1: Mantıksal Akıl Yürütme'],
                      processComponents: ['SB2.2: Kartezyen ve Yönsel Temsil', 'SB3.1: Karşılaştırma'],
                      learningGoals: ['Yukarı/Aşağı, Sağ/Sol yön birimlerini kullanarak bağıl konum açıklar.'],
                      teacherTips: ['Izgara kağıt ve satranç tahtası analojisi kullanın.'],
                      misconceptions: ['Referans noktasını karıştırıp yönü ters söylemek.'],
                      keyQuestions: ['B noktası A noktasının neresinde kalır?']
                    },
                    phases: {
                      story: {
                        title: 'Labirentte Hazine Avı',
                        character: { name: 'Piri Reis Çırağı', role: 'Haritacı', avatar: '🗺️' },
                        scenario: 'Eski bir deniz haritasında gizli adadaki hazineye ulaşmak için adımları yönlere göre tam hesaplamalıyız.',
                        realLifeConnection: 'GPS ve navigasyon sistemleri de noktaların bağıl konumlarına göre rota belirler.',
                        reflectionQuestion: '3 birim sağ, 4 birim yukarı gitmek ile tam tersi aynı yere ulaştırır mı?',
                        keyTakeaway: 'Konum her zaman bir referans noktasına göre belirlenir.'
                      },
                      lab: {
                        title: 'Nokta Konumlandırıcı Izgara',
                        toolType: 'geometry-canvas',
                        instructions: 'Izgarada iki nokta belirleyin ve A noktasından B noktasına yön adımlarını sayın.',
                        taskGoal: 'A noktasının B noktasına göre konumunu bulun.',
                        interactiveTips: ['Izgara üzerindeki birim kareleri sayın.'],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Yön ve Adım Bulmacası',
                        instructions: 'Verilen yön tariflerini doğru hedeflerle eşleştirin.',
                        items: [
                          { id: 'pz-201', concept: '4 birim sağ, 2 birim yukarı', symbol: '->4, ^2', definition: 'Doğu ve Kuzey yönlü ilerleme.', visualType: 'point' }
                        ]
                      },
                      assessment: {
                        title: 'Konum Analizi Mini Test',
                        instructions: 'Soruları yanıtlayınız.',
                        questions: [
                          {
                            id: 'q-loc-1',
                            questionText: 'A(2,3) noktasından 3 birim sağa, 2 birim aşağıya gidilirse hangi konuma ulaşılır?',
                            options: ['A) (5, 1)', 'B) (5, 5)', 'C) (-1, 1)', 'D) (2, 1)'],
                            correctOptionIndex: 0,
                            explanation: 'X ekseninde 3 birim sağ (2+3=5), Y ekseninde 2 birim aşağı (3-2=1).',
                            bloomLevel: 'Uygulama'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              {
                id: 'topic-5-geo-2',
                unitId: 'unit-5-geo',
                title: 'Açılar ve Açı Çeşitleri',
                description: 'Dar, dik, geniş ve doğru açıların modelleri ve ölçümü.',
                outcomes: [
                  {
                    id: 'MAT.5.3.3',
                    code: 'MAT.5.3.3',
                    title: 'Açıları Belirleme, İsimlendirme ve Açıölçer ile Ölçme',
                    shortTitle: 'Açılar ve Açıölçer',
                    description: 'Açıyı iki ışının birleşimi olarak açıklar, açıölçer ile ölçer ve dar/dik/geniş olarak sınıflandırır.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-2',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: ['SDB2.1: İletişim', 'SDB3.2: Sorgulama'],
                      processComponents: ['SB1.1: Anlamlandırma', 'SB2.1: Ölçme Becerisi'],
                      learningGoals: ['Açı çeşitlerini tanır, iletki (açıölçer) kullanır.'],
                      teacherTips: ['Saat akrep ve yelkovanı üzerinden açıları somutlaştırın.'],
                      misconceptions: ['Kolların uzunluğunun açının büyüklüğünü değiştirdiğini sanmak.'],
                      keyQuestions: ['Saat tam 3:00 iken akrep ile yelkovan hangi açıyı oluşturur?']
                    },
                    phases: {
                      story: {
                        title: 'Güneş Saati ve Gölgeler',
                        character: { name: 'Mühendis Ali', role: 'Astronomi Meraklısı', avatar: '☀️' },
                        scenario: 'Güneş gökyüzünde yükseldikçe çubuğun gölgesi ile zemin arasındaki açı değişiyor.',
                        realLifeConnection: 'Güneş panellerinin en yüksek verimle çalışması için güneş ışınlarının geliş açısına göre ayarlanması gerekir.',
                        reflectionQuestion: 'Geniş açı ile dar açı arasındaki sınır nedir?',
                        keyTakeaway: '90 derece dik açıdır; 90dan küçük açılar dar, büyük olanlar geniştir.'
                      },
                      lab: {
                        title: 'Dinamik Açıölçer Laboratuvarı',
                        toolType: 'angle-protractor',
                        instructions: 'Açının kollarını döndürerek dereceyi ayarlayın ve açı türünü gözlemleyin.',
                        taskGoal: '90 derece dik açı ve 135 derece geniş açı oluşturun.',
                        interactiveTips: ['Kolları tutup sürükleyin.'],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Açı Sınıflandırma Bulmacası',
                        instructions: 'Verilen dereceleri doğru açı türleriyle eşleştirin.',
                        items: [
                          { id: 'pz-a1', concept: 'Dik Açı', symbol: '90°', definition: 'Ölçüsü tam olarak 90 derece olan açı.', visualType: 'angle' },
                          { id: 'pz-a2', concept: 'Dar Açı', symbol: '< 90°', definition: 'Ölçüsü 0 ile 90 derece arasında olan açı.', visualType: 'angle' },
                          { id: 'pz-a3', concept: 'Geniş Açı', symbol: '> 90°', definition: 'Ölçüsü 90 ile 180 derece arasında olan açı.', visualType: 'angle' }
                        ]
                      },
                      assessment: {
                        title: 'Açılar Değerlendirme Testi',
                        instructions: 'Soruları çözünüz.',
                        questions: [
                          {
                            id: 'q-ang-1',
                            questionText: 'Ölçüsü 89 derece olan bir açı hangi açı türüne girer?',
                            options: ['A) Dar Açı', 'B) Dik Açı', 'C) Geniş Açı', 'D) Doğru Açı'],
                            correctOptionIndex: 0,
                            explanation: '90 dereceden küçük tüm pozitif açılar Dar Açı olarak adlandırılır.',
                            bloomLevel: 'Kavrama'
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'unit-5-num',
            subjectId: 'mat-5',
            unitNumber: 1,
            title: '1. Ünite: Doğal Sayılar ve İşlemler',
            description: 'Milyonlu sayılar, basamak değerleri, zihinden işlemler ve problem çözme stratejileri.',
            icon: 'Hash',
            themeColor: '#3b82f6',
            topics: [
              {
                id: 'topic-5-num-1',
                unitId: 'unit-5-num',
                title: 'Çok Basamaklı Doğal Sayılar',
                description: '9 basamağa kadar doğal sayıların okunuşu ve basamak analizi.',
                outcomes: [
                  {
                    id: 'MAT.5.1.1',
                    code: 'MAT.5.1.1',
                    title: 'En Çok Dokuz Basamaklı Doğal Sayıların Okunuşu, Yazılışı ve Basamak Değerleri',
                    shortTitle: 'Doğal Sayılar ve Basamak Değeri',
                    description: 'En çok dokuz basamaklı doğal sayıları okur, yazar ve basamak değerlerini çözümler.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-num',
                    topicId: 'topic-5-num-1',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: ['SDB1.2: Öz Değerlendirme', 'SDB3.2: Sayı Hissi ve Çıkarım'],
                      processComponents: ['SB1.2: Çözümleme', 'SB2.1: Bölük Sistemi ile Temsil'],
                      learningGoals: ['Milyonlar bölüğünü kavrar, sayıları basamaklarına ayırır.'],
                      teacherTips: ['Abaküs ve basamak tablosu ile basamak değerlerini fark ettirin.'],
                      misconceptions: ['Sıfır olan basamakları okurken atlamak veya basamak değerini sıfır yazmamak.'],
                      keyQuestions: ['Bir sayının basamak değeri ile sayı değeri arasındaki fark nedir?']
                    },
                    phases: {
                      story: {
                        title: 'Evrenin Derinliklerinde Sayılar',
                        character: { name: 'Astro-Matematikçi Ece', role: 'Uzay Kaşifi', avatar: '🚀' },
                        scenario: 'Dünya ile Güneş arasındaki mesafe yaklaşık 149.600.000 kilometredir. Bu devasa sayıları nasıl okur ve böleriz?',
                        realLifeConnection: 'Nüfus sayımları, devlet bütçeleri ve uzay mesafeleri milyonlu ve milyarlı sayılarla ifade edilir.',
                        reflectionQuestion: 'Birler, binler ve milyonlar bölükleri olmasaydı sayıları okumak nasıl olurdu?',
                        keyTakeaway: 'Her bölük üç basamaktan oluşur ve sayının okunmasını kolaylaştırır.'
                      },
                      lab: {
                        title: 'İnteraktif Basamak ve Abaküs Tahtası',
                        toolType: 'number-line',
                        instructions: 'Basamak değerlerini değiştirmek için kutucuklara tıklayın ve sayının nasıl oluştuğunu görün.',
                        taskGoal: '345.890.120 sayısını basamak tablosunda oluşturun.',
                        interactiveTips: ['Milyonlar, binler ve birler bölüklerini inceleyin.'],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Bölük ve Basamak Eşleştirme',
                        instructions: 'Verilen basamak değerlerini doğru sayılarla eşleştirin.',
                        items: [
                          { id: 'pz-num-1', concept: 'Yüz Milyonlar Basamağı', symbol: '100.000.000', definition: 'Sayının en büyük basamağındaki 9. hane.', visualType: 'point' }
                        ]
                      },
                      assessment: {
                        title: 'Doğal Sayılar Değerlendirme',
                        instructions: 'Soruları cevaplayınız.',
                        questions: [
                          {
                            id: 'q-num-1',
                            questionText: '708.045.002 sayısının okunuşu aşağıdakilerden hangisidir?',
                            options: [
                              'A) Yedi yüz sekiz milyon kırk beş bin iki',
                              'B) Yedi yüz seksen milyon dört yüz elli bin iki',
                              'C) Yetmiş sekiz milyon kırk beş bin iki',
                              'D) Yedi yüz sekiz milyon dört yüz bin iki'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Milyonlar bölüğü: 708 (Yedi yüz sekiz milyon), Binler bölüğü: 045 (kırk beş bin), Birler bölüğü: 002 (iki).',
                            bloomLevel: 'Kavrama'
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sci-5',
        gradeId: 'grade-5',
        title: 'Fen Bilimleri',
        code: 'FEN-5',
        icon: 'Microscope',
        color: 'from-amber-500 to-orange-600',
        description: 'Güneş, Dünya, Ay, Canlılar Dünyası ve Kuvvetin Ölçülmesi.',
        units: [
          {
            id: 'unit-5-sci-1',
            subjectId: 'sci-5',
            unitNumber: 1,
            title: '1. Ünite: Güneş, Dünya ve Ay',
            description: 'Güneşin yapısı, Ayın evreleri ve hareketleri.',
            icon: 'Sun',
            themeColor: '#f59e0b',
            topics: []
          }
        ]
      }
    ]
  },
  {
    id: 'grade-6',
    level: 6,
    title: '6. Sınıf',
    subtitle: 'Ortaokul Kademesi - Maarif Modeli',
    icon: 'Compass',
    color: 'from-blue-500 to-indigo-700',
    description: 'Oran, kesirlerle işlemler, açılar ve cebirsel ifadelere giriş.',
    subjects: [
      {
        id: 'mat-6',
        gradeId: 'grade-6',
        title: 'Matematik',
        code: 'MAT-6',
        icon: 'Calculator',
        color: 'from-blue-500 to-indigo-600',
        description: 'Doğal Sayılar, Kümeler, Tam Sayılar ve Kesirler.',
        units: []
      }
    ]
  },
  {
    id: 'grade-7',
    level: 7,
    title: '7. Sınıf',
    subtitle: 'Ortaokul Kademesi - Maarif Modeli',
    icon: 'Layers',
    color: 'from-violet-500 to-purple-700',
    description: 'Rasyonel sayılar, cebirsel denklemler, oran-orantı ve yüzdeler.',
    subjects: [
      {
        id: 'mat-7',
        gradeId: 'grade-7',
        title: 'Matematik',
        code: 'MAT-7',
        icon: 'Calculator',
        color: 'from-purple-500 to-indigo-600',
        description: 'Tam Sayılarla İşlemler, Rasyonel Sayılar, Eşitlik ve Denklem.',
        units: []
      }
    ]
  },
  {
    id: 'grade-8',
    level: 8,
    title: '8. Sınıf',
    subtitle: 'LGS Hazırlık & Maarif Modeli',
    icon: 'Trophy',
    color: 'from-amber-500 to-red-600',
    description: 'Çarpanlar ve katlar, üslü ifadeler, kareköklü ifadeler ve veri analizi.',
    subjects: [
      {
        id: 'mat-8',
        gradeId: 'grade-8',
        title: 'Matematik',
        code: 'MAT-8',
        icon: 'Calculator',
        color: 'from-rose-500 to-red-600',
        description: 'Çarpanlar ve Katlar, Üslü İfadeler, Kareköklü İfadeler, Olasılık.',
        units: []
      }
    ]
  }
];

export function getAllOutcomes(): Outcome[] {
  const outcomes: Outcome[] = [];
  CURRICULUM_DATA.forEach((grade) => {
    grade.subjects.forEach((subject) => {
      subject.units.forEach((unit) => {
        unit.topics.forEach((topic) => {
          topic.outcomes.forEach((outcome) => {
            outcomes.push(outcome);
          });
        });
      });
    });
  });
  return outcomes;
}

export function getOutcomeById(id: string): Outcome | undefined {
  const all = getAllOutcomes();
  return all.find((o) => o.id.toLowerCase() === id.toLowerCase() || o.code.toLowerCase() === id.toLowerCase());
}

export function getBreadcrumbPath(outcomeId: string) {
  for (const grade of CURRICULUM_DATA) {
    for (const subject of grade.subjects) {
      for (const unit of subject.units) {
        for (const topic of unit.topics) {
          const outcome = topic.outcomes.find(
            (o) => o.id.toLowerCase() === outcomeId.toLowerCase() || o.code.toLowerCase() === outcomeId.toLowerCase()
          );
          if (outcome) {
            return { grade, subject, unit, topic, outcome };
          }
        }
      }
    }
  }
  return null;
}
