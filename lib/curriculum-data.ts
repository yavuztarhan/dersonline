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
            title: 'Geometrik Şekiller ve Ölçme',
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
                        instructions: 'Soruları dikkatle okuyunuz. Soruları tek tek çözerek gerçek hayat modellerini analiz ediniz.',
                        questions: [
                          {
                            id: 'q1',
                            questionText: 'Fırtınalı bir gecede sahil fenerinin kulesindeki lambadan çıkıp gökyüzüne ve denize doğru kesintisiz ilerleyen sarı ışık demeti hangi geometrik kavram ile modellenir?',
                            context: 'Deniz Feneri & Optik',
                            options: [
                              'A) Doğru',
                              'B) Doğru Parçası',
                              'C) Işın',
                              'D) Düzlem'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Fener lambası sabit kapalı bir başlangıç noktasıdır [A], uzaya doğru kesintisiz ilerleyen ışık ise tek yönde sınırsızlığı ifade eder. Bu model IŞINdır ve [AB şeklinde gösterilir.',
                            bloomLevel: 'Kavrama & Modelleme'
                          },
                          {
                            id: 'q2',
                            questionText: 'Mimar Defne, iki taş kule arasına 24 metre uzunluğunda gergin bir çelik köprü kirişi yerleştirmiştir. Bu köprü kirişi için aşağıdakilerden hangisi KESİNLİKLE doğrudur?',
                            context: 'Köprü Mühendisliği',
                            options: [
                              'A) İki ucu da sınırsızca uzar.',
                              'B) Bir ucu kapalı, diğer ucu oklu bir ışındır.',
                              'C) İki ucu da sınırlı bir Doğru Parçasıdır ve boyu ölçülebilir.',
                              'D) Bir doğru modelidir ve uzunluğu hesaplanamaz.'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'İki kule arasında sabit sınırları bulunan ve 24 metre olarak cetvelle/metreyle ölçülebilen çizgi modeli bir DOĞRU PARÇASI ([AB]) modelidir.',
                            bloomLevel: 'Analiz & Akıl Yürütme'
                          },
                          {
                            id: 'q3',
                            questionText: 'Açık denizde gemiden baktığımızda gökyüzü ile denizin birleştiği ve gözümüzün görebildiği her iki yöne doğru sınırsızca devam eden Ufuk Çizgisi hangi geometrik kavrama en yakın modeldir?',
                            context: 'Coğrafi Gözlem & Doğa',
                            options: [
                              'A) Doğru',
                              'B) Işın',
                              'C) Doğru Parçası',
                              'D) Nokta'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Ufuk çizgisi her iki uca doğru da kesintisiz ve sınırsız devam ettiği için çift yönlü uzayan DOĞRU (AB) kavramı ile modellenir.',
                            bloomLevel: 'Kavrama & İlişkilendirme'
                          },
                          {
                            id: 'q4',
                            questionText: 'Kaptan Bilge harita üzerinde gizli limanın yerini belirlemek için kalemin sivri ucuyla küçük bir iz bırakmış ve yanına "A" yazmıştır. Bu iz geometride neyi temsil eder?',
                            context: 'Haritacılık & Navigasyon',
                            options: [
                              'A) Kalınlığı 2 cm olan bir doğru parçasıdır.',
                              'B) Sadece konum belirten, boyutu (eni-boyu) olmayan bir Noktadır.',
                              'C) Bir ucu sonsuza giden ışıltılı bir ışındır.',
                              'D) Bir yüzey alanına sahip geometrik şekildir.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Noktanın boyutu (eni, boyu, derinliği) yoktur; sadece uzayda veya düzlemde kesin bir konumu belirtir ve büyük harfle isimlendirilir.',
                            bloomLevel: 'Temel Bilgi & Tanım'
                          },
                          {
                            id: 'q5',
                            questionText: 'Karayolları mühendisi, A şehri ile B şehri arasına 45 kilometrelik dümdüz bir otoban şeridi inşa etmiştir. Bu otoban şeridinin sembolik matematiksel gösterimi hangisidir?',
                            context: 'Ulaşım & Altyapı',
                            options: [
                              'A) AB veya d',
                              'B) [AB]',
                              'C) [AB',
                              'D) (AB>'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'A şehri başlangıç, B şehri ise bitiş sınırıdır. İki ucu da kapalı ve uzunluğu 45 km olan bu yol [AB] Doğru Parçası sembolü ile gösterilir.',
                            bloomLevel: 'Sembolik Gösterim & Uygulama'
                          },
                          {
                            id: 'q6',
                            questionText: 'Güneşten yayılarak Dünya\'mıza ulaşan güneş ışıkları ile ilgili yapılan aşağıdaki yorumlardan hangisi matematiksel olarak DOĞRUDUR?',
                            context: 'Astronomi & Güneş Sistemi',
                            options: [
                              'A) Güneş sabit başlangıç noktası olduğu için bir IŞIN modelidir.',
                              'B) İki ucu da sonsuza gittiği için bir DOĞRU modelidir.',
                              'C) Uzunluğu metreyle tam olarak ölçülebilen bir DOĞRU PARÇASI modelidir.',
                              'D) Kalınlığı ve yüzeyi olan bir DÜZLEM modelidir.'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Güneş küresi ışığın çıktığı sabit başlangıç noktasıdır [G], uzaya yayılan ışık ise tek yönde sonsuza gider. Bu nedenle bir IŞIN modelidir.',
                            bloomLevel: 'Akıl Yürütme & Çıkarım'
                          },
                          {
                            id: 'q7',
                            questionText: 'Aşağıda verilen geometrik kavramlardan hangisinin uzunluğu cetvel veya şerit metre kullanılarak HESAPLANABİLİR?',
                            context: 'Ölçme & Değerlendirme',
                            options: [
                              'A) d Doğrusu',
                              'B) [KL Işını',
                              'C) [MN] Doğru Parçası',
                              'D) AB Doğrusu'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Doğru ve Işın en az bir yönde sonsuza uzadığı için uzunlukları ölçülemez. Yalnızca her iki ucu da sınırlı olan [MN] Doğru Parçasının boyu ölçülebilir.',
                            bloomLevel: 'Kritik Düşünme & Analiz'
                          },
                          {
                            id: 'q8',
                            questionText: 'Bir sınıfta öğretmen tahtaya iki ucu oklu düz bir çizgi çizmiş ve üzerine K ve L noktalarını işaretlemiştir. Öğrencilerden bu çizimi sembolle ifade etmelerini istemiştir. Hangi öğrencinin cevabı DOĞRUDUR?',
                            context: 'Sınıf İçi Akıllı Tahta Uygulaması',
                            options: [
                              'A) Ali: "[KL]"',
                              'B) Ayşe: "[KL"',
                              'C) Can: "KL veya d"',
                              'D) Zeynep: "|KL|"'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'İki ucunda da ok olan ve sınırsız uzanan çizgi bir doğrudur. Sembolik olarak KL veya küçük harfle d doğrusu olarak gösterilir.',
                            bloomLevel: 'Kavramsal Değerlendirme'
                          }
                        ]
                      }
                    }
                  },
                  {
                    id: 'MAT.5.3.2',
                    code: 'MAT.5.3.2',
                    title: 'Temel Geometrik Çizimlere Dayalı Deneyimlerini Yansıtabilme',
                    shortTitle: 'Geometrinin İzinde: Çıkarım ve Keşif',
                    description: 'Temel geometrik çizimlerin özelliklerine yönelik mantıksal çıkarımlar yapar, deneyimlerini yansıtır ve çıkarımlarını farklı örnekler üzerinden değerlendirir.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-1',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.1: Öz Farkındalık',
                        'SDB1.2: Öz Düzenleme',
                        'SDB1.3: Öz Yansıtma',
                        'SDB2.2: İş Birliği',
                        'SDB2.3: Sosyal Farkındalık'
                      ],
                      processComponents: [
                        'a) Temel geometrik çizimlere dayalı deneyimlerini gözden geçirir.',
                        'b) Temel geometrik çizimlerin özelliklerine yönelik çıkarım yapar.',
                        'c) Çıkarımını farklı örnekler üzerinden değerlendirir.'
                      ],
                      learningGoals: [
                        'Doğru, doğru parçası ve ışının ayırt edici özelliklerini mantıksal olarak karşılaştırır.',
                        'Doğru parçasının neden ölçülebilir, doğru ve ışının neden ölçülemez olduğunu gerekçelendirir.',
                        'Başlangıç noktası ortak iki ışının açı oluşturduğunu keşfeder.',
                        'Aynı doğruya indirilen iki dikmenin birbirine paralel olduğunu deneyimler.'
                      ],
                      teacherTips: [
                        'Öğrencilere doğrudan kural vermek yerine deney masasında cetvel ile sonsuzluk (∞) ve ölçülebilirlik hipotezini test ettiriniz.',
                        'Edirne Selimiye Camii planı üzerinden milli ve estetik değerlerimizi (D7, D19) hissettiriniz.'
                      ],
                      misconceptions: [
                        'Işın ve doğrunun kağıda çizilen boyutu kadar olduğunu düşünüp ölçülebileceğini sanmak.',
                        'Aynı doğruya dik olan doğruların kesişeceğini düşünmek.'
                      ],
                      keyQuestions: [
                        'Neden güneş ışınları sonsuza giderken, minare merdiveninin basamağı iki uçtan sınırlıdır?',
                        'Bir doğruya çizilen iki dikme sonsuza kadar uzatılsa birbiriyle karşılaşır mı?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Tarihi Haritanın Şifresi: Mimar Sinan’ın Notları',
                        character: {
                          name: 'Çırak Hasan & Mimar Sinan',
                          role: 'Tarihi Geometri Dedektifleri',
                          avatar: '🏛️'
                        },
                        scenario: 'Çırak Hasan, Mimar Sinan’ın Edirne Selimiye Camii planları üzerindeki gizemli geometrik notları inceliyor. Çizimler var ancak mimari tanımlar zamanla silinmiş. Hasan, çizimlerin özelliklerini çıkararak haritanın şifresini çözmek zorunda!',
                        realLifeConnection: 'Mimaride kullanılan her çizgi bir amaca hizmet eder: Minare basamakları sınırlı mesafelerdir ([AB]), kubbeden yayılan ışık hüzmeleri ise sınırsız ışınlardır ([CD).',
                        reflectionQuestion: 'Neden güneş ışınları sonsuza giderken minare merdiveninin basamağı iki uçtan sınırlıdır? Hangisini cetvelle ölçebiliriz?',
                        keyTakeaway: 'Geometrik modeller soyut kurallar değil; evrenin, mimarinin ve ışığın mantıksal çıkarım dilidir.',
                        pages: [
                          {
                            id: 'p2-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Selimiye Camii Planındaki Gizem',
                            conceptTitle: 'Silinmiş Geometrik Notlar',
                            conceptBadge: 'Çıkarım Başlangıcı',
                            symbolicCode: 'Selimiye Planı',
                            narrativeText: 'Çırak Hasan, Selimiye Camii’nin kubbe planını açtığında Mimar Sinan’ın düştüğü gizemli geometrik çizgilerle karşılaştı. Çizimlerin yanındaki tanımlar silinmişti.',
                            characterDialogue: {
                              speaker: 'Çırak Hasan',
                              text: 'Ustam bu çizimleri öylesine yapmamış! Her çizginin başlangıcı, bitişi ve doğrultusu büyük bir mimari sır taşıyor.'
                            },
                            visualScene: {
                              type: 'selimiye-plan',
                              caption: 'Selimiye Camii planı üzerindeki gizemli geometrik doğrular ve ışınlar.'
                            },
                            interactiveAction: {
                              prompt: 'Plandaki kubbe merkezine tıklayarak başlangıç referans noktasını belirleyin!',
                              actionLabel: 'Kubbe Merkezini Belirle (•)',
                              feedbackRevealed: 'Referans noktası belirlendi! Mimaride tüm ölçümler ve ışınlar bu merkez noktadan başlar.'
                            },
                            mathTakeaway: 'Tüm geometrik inşalar ve açılar sabit bir referans noktasıyla başlar.'
                          },
                          {
                            id: 'p2-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Işık ve Taşın Karşılaştırılması',
                            conceptTitle: 'Işın ve Doğru Parçası Farkı',
                            conceptBadge: 'Işın vs Doğru Parçası',
                            symbolicCode: '[AB vs [CD]',
                            narrativeText: 'Kubbe pencerelerinden süzülen güneş ışığı sonsuzluğa uzanırken, minareye tırmanan taş basamakların iki yanı sağlam duvarlarla sınırlandırılmıştı.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Evlat, ışık bir kaynaktan çıkar ve sınırsızca yayılır ([AB). Merdiven basamağı ise iki uçtan sınırlı kalmalıdır ([CD]), yoksa üzerinde yürüyemezsin!'
                            },
                            visualScene: {
                              type: 'ray-angle',
                              caption: 'Pencerelerden yayılan ışıklar ile taş basamakların geometrik karşılaştırması.'
                            },
                            interactiveAction: {
                              prompt: 'Işık ile merdiven basamağını karşılaştırın!',
                              actionLabel: 'Özellikleri Karşılaştır ⚖️',
                              feedbackRevealed: 'Çıkarım yapıldı: Işının bir ucu sonsuzdur [AB, doğru parçasının her iki ucu sınırlıdır [CD].'
                            },
                            mathTakeaway: 'Doğru parçası iki uçtan sınırlandığı için güvenli bir mesafe oluşturur; ışın ise tek yönde sonsuz bir doğrultu tanımlar.'
                          },
                          {
                            id: 'p2-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Cetvelin Sırrı: Ölçülebilirlik',
                            conceptTitle: 'Neden Doğru Parçası Ölçülebilir?',
                            conceptBadge: 'Ölçülebilirlik Hipotezi',
                            symbolicCode: '|AB| = 8 cm',
                            narrativeText: 'Hasan eline tahta cetveli aldı. Doğru ve ışının üzerine cetveli koyduğunda bir türlü sonuna ulaşamadı. Ancak doğru parçasını bir saniyede ölçebildi.',
                            characterDialogue: {
                              speaker: 'Çırak Hasan',
                              text: 'Buldum! İki ucu da kapalı olduğu için yalnızca doğru parçasının kesin bir boyu vardır. Doğru ve ışın sonsuz olduğu için ölçülemez!'
                            },
                            visualScene: {
                              type: 'bridge-segment',
                              caption: 'Cetvelle yapılan ölçüm hipotezi: Yalnızca sınırlandırılmış parçalar ölçülebilir.'
                            },
                            interactiveAction: {
                              prompt: 'Cetvel ile doğru parçasının uzunluğunu test edin!',
                              actionLabel: 'Cetvel Hipotezini Test Et 📏',
                              feedbackRevealed: 'Hipotez Doğrulandı! Doğru ve ışında cetvel sonsuz (∞) verir; doğru parçası net 8 cm çıkar.'
                            },
                            mathTakeaway: 'Sınırlılık ölçülebilirliğin tek şartıdır. İki ucu kapalı olmayan hiçbir çizginin uzunluğu sayısal olarak hesaplanamaz.'
                          },
                          {
                            id: 'p2-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Göğe Yükselen Çifte Minareler',
                            conceptTitle: 'Diklik ve Paralellik Çıkarımı',
                            conceptBadge: 'Diklik ⊥ ve Paralellik ∥',
                            symbolicCode: 'd1 ∥ d2, d ⊥ taban',
                            narrativeText: 'Selimiye’nin heybetli minareleri zemine tam 90 derecelik dik açıyla yükseliyordu. Hasan fark etti ki, aynı zemine dik olan minareler göğe kadar uzansa bile asla birbirine değmiyordu.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan & Hasan',
                              text: 'Aynı düzleme dik indirilen iki doğru, birbirine daima paraleldir! Asla kesişmezler ve aralarındaki mesafe hep aynı kalır.'
                            },
                            visualScene: {
                              type: 'perpendicular-parallel',
                              caption: 'Aynı taban doğrusuna dik olan minare doğruları birbirine paraleldir.'
                            },
                            interactiveAction: {
                              prompt: 'Minarelerin zeminle yaptığı 90 derecelik dik açıları test edin!',
                              actionLabel: 'Çifte Dikmeyi İncele 📐',
                              feedbackRevealed: 'Harika! Zeminle 90° açı yapan iki dikme birbirine paralel (d1 ∥ d2) olur ve asla kesişmez.'
                            },
                            mathTakeaway: 'Aynı doğruya dik olan iki farklı doğru birbiriyle hiçbir zaman kesişmez; bu doğrular birbirine paraleldir.'
                          },
                          {
                            id: 'p2-5',
                            pageNumber: 5,
                            chapterTitle: '5. Bölüm: Çırak Hasan’ın Çıkarım Defteri',
                            conceptTitle: 'Büyük Çıkarım Tablosu',
                            conceptBadge: 'Maarif Özeti',
                            symbolicCode: 'Çıkarım Notu',
                            narrativeText: 'Çırak Hasan tüm bu mantıksal çıkarımları Mimar Sinan’ın defterine temize çekti. Artık geometri onun için ezber değil, mantıksal bir keşif dünyasıydı!',
                            characterDialogue: {
                              speaker: 'Tarihi Dedektifler',
                              text: 'Tebrikler! Tarihi haritanın tüm geometrik şifrelerini çözdünüz. Şimdi laboratuvarda kendi hipotezlerinizi test etme zamanı!'
                            },
                            visualScene: {
                              type: 'summary-chart',
                              caption: 'Ölçülebilirlik, Açı Oluşumu ve Paralellik çıkarımlarının tam özeti.'
                            },
                            interactiveAction: {
                              prompt: 'Çıkarım defterini onaylayıp Deney Laboratuvarına geçin!',
                              actionLabel: 'Deney Masasına Geç 🧪',
                              feedbackRevealed: '1. Aşama tamamlandı! Şimdi 3 kritik geometri deneyini canlı olarak test edeceksiniz.'
                            },
                            mathTakeaway: 'Deneyim + Mantıksal Çıkarım = Kalıcı Matematiksel Düşünme Becerisi.'
                          }
                        ]
                      },
                      lab: {
                        title: 'Özellik Karşılaştırma & Hipotez Testi Masası',
                        toolType: 'experiment-bench',
                        instructions: 'Aşağıdaki 3 kritik geometri deneyini sırayla uygulayarak özellik çıkarımlarını canlı olarak test ediniz.',
                        taskGoal: '3 deneyi de tamamlayıp çıkarım kartlarını açınız.',
                        interactiveTips: [
                          '1. Deney: Cetveli şekillerin üzerine getirip hangisinin ölçülebildiğini keşfedin.',
                          '2. Deney: İki ışının başlangıç noktasını çakıştırıp açıyı büyütüp küçültün.',
                          '3. Deney: Taban doğrusuna iki dikme indirip paralellik durumunu sürükleyerek inceleyin.'
                        ],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Kavram Dedektifi ve Çıkarım Terazisi',
                        instructions: 'Geometrik çıkarımları ve inşaları eğlenceli oyunlarla pekiştirin.',
                        items: [
                          {
                            id: 'pz-2-1',
                            concept: 'Ölçülebilirlik İlkesi',
                            symbol: '|AB|',
                            definition: 'İki ucu da sınırlı olduğu için cetvelle boyu tam olarak hesaplanabilir.',
                            visualType: 'segment'
                          },
                          {
                            id: 'pz-2-2',
                            concept: 'Açı İnşası',
                            symbol: '∠AOB veya [OA ∪ [OB',
                            definition: 'Başlangıç noktaları ortak iki ışının birleşmesiyle oluşan açıklık.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-2-3',
                            concept: 'Çifte Dikme ve Paralellik',
                            symbol: 'd1 ∥ d2',
                            definition: 'Aynı doğruya 90° dik olan iki doğru birbirini asla kesmez.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-2-4',
                            concept: 'Tek Yönlü Sınırsızlık',
                            symbol: '[AB',
                            definition: 'Başlangıcı sabit bir kaynaktır ancak ucu sonsuza dek uzar.',
                            visualType: 'ray'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Çıkarım ve Yansıtma Değerlendirmesi',
                        instructions: 'Soruları tek tek yanıtlayınız ve ders sonunda dijital öğrenme günlüğünüze çıkarımınızı yazınız.',
                        reflectionPrompt: 'Bugün öğrendiğim en şaşırtıcı geometrik çıkarım şuydu:',
                        questions: [
                          {
                            id: 'q2-1',
                            questionText: 'Bir Doğru Parçasını [AB], bir Doğrudan (AB) ve Işından ([AB) ayıran EN TEMEL özellik aşağıdakilerden hangisidir?',
                            context: 'Ölçülebilirlik & Sınırlılık',
                            options: [
                              'A) İki ucunun da sınırlı olması ve uzunluğunun kesinlikle ölçülebilmesi',
                              'B) Sadece tek yönde sonsuza uzaması',
                              'C) Kalınlığının ve alanının hesaplanabilmesi',
                              'D) Başlangıç noktasının olmaması'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Doğru ve Işın sonsuza uzandığı için ölçülemez; yalnız iki ucu da kapalı olan Doğru Parçası [AB] net bir uzunluğa sahiptir.',
                            bloomLevel: 'Kavramsal Çıkarım'
                          },
                          {
                            id: 'q2-2',
                            questionText: 'Geometride bir AÇI inşa edebilmek için başlangıç noktaları ortak olan en az kaç adet IŞINA ihtiyaç vardır?',
                            context: 'Açı ve Doğrultu İnşası',
                            options: [
                              'A) 1 adet',
                              'B) 2 adet',
                              'C) 3 adet',
                              'D) 4 adet'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Başlangıç noktaları ortak iki ışının ([OA ve [OB) birleşimi bir açı (∠AOB) meydana getirir.',
                            bloomLevel: 'Uygulama & Modelleme'
                          },
                          {
                            id: 'q2-3',
                            questionText: 'Bir d doğrusuna indirilen bir dikme ile d doğrusu arasındaki açı kaç derecedir?',
                            context: 'Diklik ve Gönye Analizi',
                            options: [
                              'A) 45°',
                              'B) 60°',
                              'C) 90°',
                              'D) 180°'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Bir doğruya indirilen dikme (⊥), o doğruyla tam 90 derecelik dik açı oluşturur.',
                            bloomLevel: 'Temel Bilgi & Tanım'
                          },
                          {
                            id: 'q2-4',
                            questionText: 'Aynı taban doğrusuna 90° dik açı ile çizilen iki farklı dikme doğru (d1 ve d2) uzayda sonsuza kadar uzatılırsa ne olur?',
                            context: 'Paralellik ve Kesişmeme İlkesi',
                            options: [
                              'A) İleride bir noktada mutlaka kesişirler.',
                              'B) Birbirine paraleldirler ve hiçbir zaman kesişmezler.',
                              'C) Aralarındaki açı zamanla daralır.',
                              'D) Birbirine dik hale gelirler.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Aynı doğruya dik olan iki doğru birbirine paraleldir (d1 ∥ d2) ve aralarındaki mesafe daima sabit kalır; asla kesişmezler.',
                            bloomLevel: 'Mantıksal Çıkarım'
                          },
                          {
                            id: 'q2-5',
                            questionText: 'Selimiye Camii planını inceleyen Çırak Hasan, minare basamağı ile pencerelerden giren ışığı karşılaştırıyor. Hasan’ın yapacağı hangisi DOĞRU bir çıkarımdır?',
                            context: 'Selimiye Camii & Mimari Çıkarım',
                            options: [
                              'A) İkisinin de uzunluğu cetvelle tam olarak ölçülebilir.',
                              'B) Minare basamağı bir doğru parçasıdır; ışık ise başlangıcı olan bir ışındır.',
                              'C) Işık bir doğrudur ve iki yönde de sınırsızdır.',
                              'D) Minare basamağının bir ucu sonsuza kadar uzar.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Basamak iki duvar arasında sınırlandırılmış bir doğru parçasıdır ([AB]); pencereden çıkan ışık ise başlangıcı sabit bir ışındır ([CD).',
                            bloomLevel: 'Karşılaştırma & Analiz'
                          },
                          {
                            id: 'q2-6',
                            questionText: 'Öğretmen tahtada bir Doğrunun üzerine cetvel koyduğunda cetvelin sağında ve solunda oklar olduğunu göstermiştir. Bu durum neyi ispatlar?',
                            context: 'Bilimsel Hipotez ve İspat',
                            options: [
                              'A) Doğrunun boyunun sonlu olduğunu',
                              'B) Doğrunun her iki yönden de sınırsız uzadığı için ölçülemeyeceğini',
                              'C) Doğrunun bir başlangıç noktası olduğunu',
                              'D) Cetvelin yetersiz olduğunu'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Çift yönlü oklar sınırsızlığı temsil eder; sınırsız uzayan bir yapının uzunluğu cetvelle hesaplanamaz.',
                            bloomLevel: 'Kritik Düşünme & Değerlendirme'
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
