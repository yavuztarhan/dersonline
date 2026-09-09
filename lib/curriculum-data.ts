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
                    title: 'Temel Geometrik Çizimlerin Özelliklerine Yönelik Çıkarımda Bulunabilme',
                    shortTitle: 'Geometrik İnşa ve Çıkarım: Cetvel, Pergel, Gönye',
                    description: 'Ölçüsüz cetvel, pergel ve gönye kullanarak temel geometrik çizimlerin (iki noktadan tek doğru, çember yarıçapları, ışın/açı kollarından eşit parça kesme, dış noktadan tek dikme, paralel doğrular) özelliklerine dair çıkarımda bulunur ve inşa çalışmaları yapar.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-1',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Pergel açıklığını bozmadan eşit parça kesme ve gönye dikliğini kontrol etme)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Paralel doğru inşalarında eşit uzaklık noktalarını paylaşma)',
                        'SDB3.3: Mantıksal Çıkarım ve Geometrik Düşünme (Ölçüsüz cetvel, pergel ve gönye ile aksiyomatik çıkarım yapma)'
                      ],
                      processComponents: [
                        'a) Temel geometrik çizimlere (doğru, doğru parçası, ışın, açı, çember, dikme) dayalı deneyimlerini gözden geçirir.',
                        'b) Ölçüsüz cetvel, gönye ve pergeli kullanarak temel geometrik çizimlerin özelliklerine dair çıkarım yapar (İki noktadan tek doğru, çember yarıçap eşitliği, dış noktadan tek dikme, paralel doğrular).',
                        'c) Pergel ve ölçüsüz cetvelle ışın ve açı kollarından eşit parça kesme inşalarını yapar, çıkarımlarını farklı örneklerle (tren rayları vb.) değerlendirir (OB2).'
                      ],
                      learningGoals: [
                        'İki noktadan yalnız bir doğru çizilebildiğini ölçüsüz cetvelle deneyimleyerek çıkarır.',
                        'Çemberin merkezinden üzerindeki tüm noktalara çizilen doğru parçalarının (yarıçap) eşit uzunlukta olduğunu ve yarıçapları eşit çemberler çizilebildiğini pergel ile keşfeder.',
                        'Pergel ve ölçüsüz cetvel yardımıyla bir ışının başlangıç noktasından itibaren yan yana eşit uzunlukta doğru parçaları keser.',
                        'Bir açının kollarından pergel yardımıyla eşit uzunlukta doğru parçaları kesme inşa çalışmasını gerçekleştirir.',
                        'Bir doğruya dışındaki bir noktadan yalnız bir dikme çizilebildiğini; dışındaki farklı noktalardan eşit veya farklı uzunlukta dikmeler çizilebildiğini gönye ile çıkarır.',
                        'Gönye yardımıyla bir doğruya eşit uzaklıktaki noktaları belirleyip birleştirerek paralel doğrular inşa eder; günlük hayat modelleriyle (tren rayları) ilişkilendirir.'
                      ],
                      teacherTips: [
                        'Öğrencilere cetveli doğrudan sayı okumak için değil, "Ölçüsüz Cetvel (Düztahta)" mantığıyla iki noktayı birleştiren tek çizgi çekme aracı olarak kullandırınız.',
                        'Pergeli hem çember çizme hem de "açıklığı sabit tutarak eşit mesafe kopyalama / kesme" aracı olarak deneyimletiniz.',
                        'Dinamik geometri yazılımı (OB2) desteğiyle noktaları sürükleterek paralel doğrular arasındaki dik mesafenin hep sabit kaldığını görselleştiriniz.'
                      ],
                      misconceptions: [
                        'İki noktadan birden fazla düz doğru geçirilebileceğini düşünmek.',
                        'Çemberin merkezinden üzerindeki farklı noktalara çizilen doğru parçalarının uzunluklarının farklı olabileceğini sanmak.',
                        'Bir doğruya dışındaki sabit tek bir noktadan birden fazla farklı dikme çizilebileceğini zannetmek.',
                        'Paralel doğruların ileride bir yerde çok az da olsa birbirine yaklaşacağını düşünmek.'
                      ],
                      keyQuestions: [
                        'Neden iki noktayı birleştiren cetvel ile sadece tek bir düz doğru çizebiliriz?',
                        'Pergelin ayağını hiç değiştirmeden bir ışın üzerine art arda batırırsak ne elde ederiz?',
                        'Tren raylarının iki demiri neden uzayda nereye kadar uzarsa uzasın asla birbirine değmez?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Mimarın Geometri Çantası: Cetvel, Pergel ve Gönyenin Sırrı',
                        character: {
                          name: 'Mimar Sinan & Çırak Hasan',
                          role: 'Usta Geometrik Mimarlar',
                          avatar: '🏛️'
                        },
                        scenario: 'Mimar Sinan, büyük mimari yapılar ve köprü projelerinde çırağı Hasan’a geometri çantasını açıyor. Çantada sayısız cetvel, pergel ve gönye var. Sinan Usta soruyor: "Bu aletler sadece çizim için değil, evrenin değişmez geometrik kurallarını inşa etmek içindir!"',
                        realLifeConnection: 'Tarihi köprü ayakları iki noktadan geçen tek doğruyla hizalanır, kubbe ve kemerler pergelin eşit yarıçapıyla yükselir, tren rayları ise gönyenin eşit dikmeleriyle paralel kılınır.',
                        reflectionQuestion: 'Bir doğruya dışındaki tek bir noktadan kaç tane dikme çizebiliriz? Peki bu doğruya paralel bir doğru inşa etmek için noktaların uzaklığı nasıl olmalıdır?',
                        keyTakeaway: 'Ölçüsüz cetvel doğruluğu, pergel eşit mesafeyi, gönye ise diklik ve paralelliği inşa etmenin değişmez anahtarıdır.',
                        pages: [
                          {
                            id: 'p2-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: İki Nokta Arasındaki Tek Yol',
                            conceptTitle: 'Ölçüsüz Cetvel ve İki Noktadan Geçen Doğru',
                            conceptBadge: 'A ve B Noktaları',
                            symbolicCode: 'AB Doğrusu (Tek Doğru)',
                            narrativeText: 'Mimar Sinan çizim masasına iki çivi çaktı (A ve B noktaları). Çırak Hasan’a ölçüsüz düz bir tahta cetvel uzattı.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Evlat, bu iki noktadan geçecek düz bir çizgi çek. İkinci bir farklı düz doğru çizebilir misin? Dene bakalım!'
                            },
                            visualScene: {
                              type: 'straightedge-twopoints',
                              caption: 'İki farklı noktadan yalnız ve yalnız tek bir doğru geçer.'
                            },
                            interactiveAction: {
                              prompt: 'Ölçüsüz cetveli A ve B noktalarına oturtarak tek doğruyu çizin!',
                              actionLabel: 'İki Noktadan Doğru Çek 📏',
                              feedbackRevealed: 'Harika çıkarım! Düzlemdeki herhangi iki farklı noktadan yalnız 1 doğru çizilebilir.'
                            },
                            mathTakeaway: 'Çıkarım 1: İki farklı noktadan geçen yalnız ve yalnız bir doğru çizilebilir.'
                          },
                          {
                            id: 'p2-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Pergelin Adımları ve Çemberin Yarıçapı',
                            conceptTitle: 'Merkezden Eşit Uzaklık & Işında Parça Kesme',
                            conceptBadge: 'Pergel & Yarıçap (r)',
                            symbolicCode: '|OA| = |OB| = r, [AB] = [BC]',
                            narrativeText: 'Sinan Usta pergelin sivri ucunu masaya sabitledi ve kurşun kalemli ucuyla tam bir tur döndü. Ardından aynı pergel açıklığını bir ışının başlangıç noktasına koydu.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Pergelin ayağını bozmadıkça merkezden çember üzerindeki her noktaya mesafe aynıdır! Işın üzerine art arda batırdığında ise yan yana eşit doğru parçaları kesersin.'
                            },
                            visualScene: {
                              type: 'compass-circle-ray',
                              caption: 'Çemberin tüm yarıçapları eşittir; pergel ışın üzerinde eşit parçalar keser.'
                            },
                            interactiveAction: {
                              prompt: 'Pergel ile çemberi çizin ve ışın üzerinde eşit doğru parçaları adımlayın!',
                              actionLabel: 'Pergel ile Eşit Parçalar Kes 🧭',
                              feedbackRevealed: 'Kusursuz! Çemberin tüm yarıçapları eşittir (|OA|=|OB|=r). Işın üzerinde [AB]=[BC]=[CD] eşit parçaları inşa edildi.'
                            },
                            mathTakeaway: 'Çıkarım 2: Çember merkezinden üzerindeki tüm noktalara çizilen doğru parçaları eşit uzunluktadır. Pergel eşit uzunlukta doğru parçaları kesmek için kullanılır.'
                          },
                          {
                            id: 'p2-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Açının Kollarını Eşitleme',
                            conceptTitle: 'Açının Kollarından Eşit Parça Kesme İnşası',
                            conceptBadge: 'Açı Kolu İnşası',
                            symbolicCode: '|OA| = |OB| (Eşit Kollar)',
                            narrativeText: 'Çırak Hasan bir açı çizdi. Sinan Usta pergelin sivri ucunu açının köşe noktasına (O) batırıp açının her iki kolunu kesen bir yay çizdi.',
                            characterDialogue: {
                              speaker: 'Çırak Hasan',
                              text: 'Ustam! Pergelin açıklığını hiç değiştirmeden iki kolu da kestiğimiz için [OA] ve [OB] parçalarının uzunluğu birbirine tıpatıp eşit oldu!'
                            },
                            visualScene: {
                              type: 'angle-compass-cut',
                              caption: 'Açının köşesine batırılan pergel, kollarından eşit uzunlukta parçalar keser.'
                            },
                            interactiveAction: {
                              prompt: 'Pergeli açının köşesine batırıp iki koldan da eşit parçaları işaretleyin!',
                              actionLabel: 'Açının Kollarını Kes 📐',
                              feedbackRevealed: 'İnşa tamamlandı! Açının kollarından pergel yarıçapı kadar eşit uzunlukta doğru parçaları (|OA|=|OB|) kesildi.'
                            },
                            mathTakeaway: 'Çıkarım 3: Pergel yardımıyla bir açının kollarından köşe noktasından itibaren eşit uzunlukta doğru parçaları kesilebilir.'
                          },
                          {
                            id: 'p2-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Gönyenin Dikliği ve Dış Noktalar',
                            conceptTitle: 'Bir Doğruya Dış Noktadan Tek Dikme',
                            conceptBadge: 'Dikme (⊥)',
                            symbolicCode: 'P ⊥ d (Tek Dikme)',
                            narrativeText: 'Sinan Usta bir zemin doğrusu çizdi ve doğrunun dışına bir P noktası koydu. Hasan eline gönyeyi alarak P noktasından taban doğrusuna dikme indirdi.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Gönyenin dik köşesini tabana yasla. Dışarıdaki bu sabit P noktasından tabana ikinci bir farklı dikme çizebilir misin? Hayır, yalnız tek bir dikme geçer!'
                            },
                            visualScene: {
                              type: 'setsquare-perpendicular',
                              caption: 'Bir doğruya dışındaki sabit bir noktadan yalnız bir dikme çizilebilir.'
                            },
                            interactiveAction: {
                              prompt: 'Gönyeyi P noktasına hizalayarak taban doğrusuna 90° dikme indirin!',
                              actionLabel: 'Gönyeyle Dikme İndir 📐',
                              feedbackRevealed: 'Harika çıkarım! Dışındaki sabit bir noktadan doğruya yalnız 1 adet dikme çizilebilir.'
                            },
                            mathTakeaway: 'Çıkarım 4: Bir doğruya dışındaki bir noktadan yalnız bir dikme çizilebilir. Dışındaki farklı noktalardan ise eşit veya farklı uzunlukta dikmeler çizilebilir.'
                          },
                          {
                            id: 'p2-5',
                            pageNumber: 5,
                            chapterTitle: '5. Bölüm: Eşit Uzaklıktaki Noktalar ve Tren Rayları',
                            conceptTitle: 'Paralel Doğru İnşası ve Çıkarım Özeti',
                            conceptBadge: 'Paralel Doğrular (∥)',
                            symbolicCode: 'd₁ ∥ d₂ (Sabit Mesafe)',
                            narrativeText: 'Son olarak Hasan, taban doğrusuna gönye yardımıyla hep 10 cm uzaklıkta 3 farklı nokta belirledi ve bu noktaları cetvelle birleştirdi.',
                            characterDialogue: {
                              speaker: 'Hasan & Sinan',
                              text: 'Tıpkı tren rayları gibi! Bir doğruya eşit uzaklıktaki tüm noktaların oluşturduğu doğru, ilk doğruyla asla kesişmez; bu doğrular PARALELDİR (d₁ ∥ d₂)!'
                            },
                            visualScene: {
                              type: 'parallel-tracks',
                              caption: 'Bir doğruya eşit uzaklıktaki noktaların birleşimi paralel doğru oluşturur.'
                            },
                            interactiveAction: {
                              prompt: 'Eşit uzaklıktaki noktaları birleştirip paralel rayları oluşturun!',
                              actionLabel: 'Paralel Doğruyu İnşa Et ⏸️',
                              feedbackRevealed: 'Mükemmel! Bir doğruya eşit uzaklıktaki noktaların oluşturduğu yeni doğru, taban doğrusuna paraleldir (d₁ ∥ d₂).'
                            },
                            mathTakeaway: 'Çıkarım 5: Gönye ile bir doğruya eşit uzaklıktaki noktalar belirlenip birleştirildiğinde oluşan doğru, ilk doğruya paraleldir (d₁ ∥ d₂).'
                          }
                        ]
                      },
                      lab: {
                        title: 'İnteraktif Geometrik İnşa ve Çıkarım Masası',
                        toolType: 'experiment-bench',
                        instructions: 'Ölçüsüz cetvel, pergel ve gönye ile 3 kritik geometrik inşayı gerçekleştirin; nokta sürükleme ve uzaklık ölçme ile çıkarımlarınızı doğrulayınız.',
                        taskGoal: '3 inşa deneyini de tamamlayıp geometrik çıkarım kartlarını açınız.',
                        interactiveTips: [
                          '1. Deney (Ölçüsüz Cetvel): İki noktayı sürükleyin; aralarından sadece 1 düz doğru geçebildiğini test edin.',
                          '2. Deney (Pergel İnşası): Pergel ile çember yarıçapını ölçün; ışın ve açı kollarından eşit parçalar kesin.',
                          '3. Deney (Gönye & Paralellik): Taban doğrusuna eşit uzaklıkta dikmeler indirip paralel doğruyu sürükleyerek inceleyin (OB2).'
                        ],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Kavram Dedektifi ve Çıkarım Terazisi',
                        instructions: 'Ölçüsüz cetvel, pergel ve gönye çıkarımlarını eğlenceli oyunlarla pekiştirin.',
                        items: [
                          {
                            id: 'pz-2-1',
                            concept: 'İki Nokta — Tek Doğru',
                            symbol: 'A •—————• B',
                            definition: 'Ölçüsüz cetvelle iki farklı noktadan yalnız ve yalnız tek bir doğru çizilebilir.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-2-2',
                            concept: 'Çember Yarıçap Eşitliği',
                            symbol: '|OA| = |OB| = r',
                            definition: 'Pergel ile çizilen çemberin merkezinden üzerindeki tüm noktalara uzaklık eşittir.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-2-3',
                            concept: 'Pergel ile Eşit Parça Kesme',
                            symbol: '[AB] = [BC] = [CD]',
                            definition: 'Pergel açıklığı bozulmadan bir ışın veya açı kolu üzerinde eşit mesafeler kopyalanır.',
                            visualType: 'segment'
                          },
                          {
                            id: 'pz-2-4',
                            concept: 'Dış Noktadan Tek Dikme',
                            symbol: 'P ⊥ d (Tek Dikme)',
                            definition: 'Gönye ile bir doğruya dışındaki sabit bir noktadan yalnız bir adet dikme indirilebilir.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-2-5',
                            concept: 'Paralel Doğrular',
                            symbol: 'd₁ ∥ d₂ (Tren Rayları)',
                            definition: 'Bir doğruya eşit uzaklıktaki noktaların birleşmesiyle oluşan ve asla kesişmeyen doğrular.',
                            visualType: 'line'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Temel Çizimler ve Geometrik Çıkarım Değerlendirmesi',
                        instructions: 'Soruları dikkatle okuyunuz; ölçüsüz cetvel, pergel ve gönye çıkarımlarınızı test ediniz.',
                        reflectionPrompt: 'Bugün geometrik aletlerle yaptığım en önemli çıkarım şuydu:',
                        questions: [
                          {
                            id: 'q2-1',
                            questionText: 'Düzlemde işaretlenen farklı iki noktadan (A ve B) ölçüsüz bir cetvel yardımıyla kaç tane FARKLI düz doğru çizilebilir?',
                            context: 'Ölçüsüz Cetvel ve Aksiyom',
                            options: [
                              'A) Yalnız 1 adet',
                              'B) 2 adet',
                              'C) 3 adet',
                              'D) Sonsuz çoklukta'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Temel geometri aksiyomuna göre iki farklı noktadan yalnız ve yalnız bir doğru geçer.',
                            bloomLevel: 'Kavramsal Çıkarım'
                          },
                          {
                            id: 'q2-2',
                            questionText: 'Bir öğrenci pergelin ucunu O noktasına sabitleyip 6 cm yarıçaplı bir çember çizmiştir. Çember üzerindeki K ve L noktaları için aşağıdakilerden hangisi KESİNLİKLE doğrudur?',
                            context: 'Pergel ve Çember Yarıçapı',
                            options: [
                              'A) |OK| ve |OL| uzunlukları birbirine eşittir ve 6 cm’dir.',
                              'B) |OK| uzunluğu |OL| uzunluğundan büyüktür.',
                              'C) K ve L noktalarından geçen doğru merkezden geçer.',
                              'D) Çemberin merkezinden geçen her çizgi 12 cm’dir.'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Çemberin tanımı gereği merkezden çember üzerindeki tüm noktalara çizilen doğru parçaları (yarıçaplar) birbirine eşittir (|OK|=|OL|=r=6 cm).',
                            bloomLevel: 'Mantıksal Çıkarım & Analiz'
                          },
                          {
                            id: 'q2-3',
                            questionText: 'Bir ışının başlangıç noktasından itibaren pergel açıklığını hiç bozmadan yan yana adımlayarak işaretleme yapan bir öğrenci ne elde eder?',
                            context: 'Pergel ile Geometrik İnşa',
                            options: [
                              'A) Uzunlukları birbirinden farklı doğru parçaları',
                              'B) Yan yana birbirine eşit uzunlukta doğru parçaları ([AB] = [BC] = [CD])',
                              'C) Dik açılar',
                              'D) Paralel doğrular'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Pergel açıklığı sabit kaldığı için her adımda eşit yarıçap uzunluğunda doğru parçaları kesilmiş olur.',
                            bloomLevel: 'Uygulama ve İnşa'
                          },
                          {
                            id: 'q2-4',
                            questionText: 'Bir d doğrusunun dışındaki sabit bir P noktasından bu doğruya gönye yardımıyla kaç tane DİKME çizilebilir?',
                            context: 'Gönye ve Dikme Çıkarımı',
                            options: [
                              'A) Yalnız 1 tane',
                              'B) 2 tane',
                              'C) 4 tane',
                              'D) Sonsuz tane'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Bir doğruya dışındaki sabit tek bir noktadan yalnız ve yalnız 1 adet dikme (90° dik çizgi) çizilebilir.',
                            bloomLevel: 'Kavramsal Çıkarım'
                          },
                          {
                            id: 'q2-5',
                            questionText: 'Bir d₁ doğrusuna gönye ile aynı yönde 8 cm uzaklıkta 3 farklı nokta belirlenmiş ve bu noktalar cetvelle birleştirilerek d₂ doğrusu çizilmiştir. d₁ ve d₂ doğruları için hangisi doğrudur?',
                            context: 'Paralel Doğru İnşası (Tren Rayı Modeli)',
                            options: [
                              'A) Birbirine diktirler (d₁ ⊥ d₂).',
                              'B) Birbirine paraleldirler (d₁ ∥ d₂) ve hiçbir zaman kesişmezler.',
                              'C) İleride 45 derecelik açıyla kesişirler.',
                              'D) Uzunlukları birbirinden farklıdır.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Bir doğruya eşit uzaklıktaki noktaların birleştirilmesiyle elde edilen doğru, ilk doğruya paraleldir (d₁ ∥ d₂); aralarındaki dik mesafe hep 8 cm kalır ve asla kesişmezler.',
                            bloomLevel: 'Modelleme ve Çıkarım'
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
                title: 'Açı Ölçme ve Açı Çeşitleri',
                description: 'Açıölçer (İletki) ve gönye ile açıları ölçme, derece cinsinden ifade etme ve dar, dik, geniş, doğru açı olarak sınıflandırma.',
                outcomes: [
                  {
                    id: 'MAT.5.3.3',
                    code: 'MAT.5.3.3',
                    title: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
                    shortTitle: 'Açı Ölçme ve İletki (Açıölçer) Kullanımı',
                    description: 'Açıyı aynı başlangıç noktasına sahip iki ışının birleşimi olarak açıklar; iletki (açıölçer) ve gönye kullanarak açıları derece (°) cinsinden ölçer, oluşturur ve dar, dik, geniş, doğru açı olarak sınıflandırır.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-2',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (İletkinin merkezini köşe noktasına tam oturtma sabrı ve ölçüm kontrolü)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Farklı nesnelerin açılarını ölçüp sonuçları karşılaştırma)',
                        'SDB3.2: Sorgulama ve Çıkarım (Açının kollarının uzunluğunun açı derecesini değiştirmediğini keşfetme)'
                      ],
                      processComponents: [
                        'SB1.1: Açı ölçmek için gerekli araç ve teknolojiyi (İletki/Açıölçer, Gönye, İletkili Dijital Cetvel) tanır.',
                        'SB2.1: Açı ölçmek için uygun aracı ve ölçüm yöntemini belirler.',
                        'SB3.1: İletkiyi doğru hizalayarak dar, dik, geniş ve doğru açıları derece cinsinden ölçer ve modeller.'
                      ],
                      learningGoals: [
                        'Açının, başlangıç noktaları ortak iki ışının oluşturduğu geometrik açıklık olduğunu açıklar.',
                        'Açı ölçme standart biriminin Derece (°) olduğunu ve sembolünü kavrar.',
                        'İletkinin merkez noktasını açının köşesine, taban çizgisini ise bir koluna hizalayarak doğru okuma yapar.',
                        'Ölçüsü 90°den küçük olan açıları Dar Açı, tam 90° olanları Dik Açı, 90° ile 180° arasındakileri Geniş Açı, tam 180° olanı Doğru Açı olarak adlandırır.'
                      ],
                      teacherTips: [
                        'Sınıf kapısını açıp kapatarak veya saatin akrep-yelkovanı üzerinden açı derecelerini kinestetik olarak canlandırın.',
                        'Öğrencilere iletkideki çift skala (iç ve dış dereceler) sistemini anlatırken "Açının baktığı yöndeki sıfırdan başlayarak sayma" kuralını öğretin.',
                        'Kolların uzunluğunun açıyı büyütmediğini göstermek için aynı 60°lik açıyı hem küçük hem devasa çizip iletkiyle ölçtürün.'
                      ],
                      misconceptions: [
                        'Kolların (ışınların) uzunluğu arttıkça açının derecesinin de büyüyeceğini sanmak.',
                        'İletkinin merkez noktasını açının köşesine değil, cetvelin en alt plastik kenarına oturtmak.',
                        'Çift taraflı ölçekte dar açıyı okurken ters taraftaki geniş açı değerini (örn: 60° yerine 120°) okumak.'
                      ],
                      keyQuestions: [
                        'Güneş panellerinin elektrik üretimi ile güneş ışınlarının geliş açısı arasında nasıl bir ilişki vardır?',
                        'Bir makasın kollarını daha uzun yaparsak, aynı aralıkta açtığımızda açının derecesi değişir mi?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Gözlemevi Mimarları ve Güneş Saati Gizemi',
                        character: {
                          name: 'Mimar Sinan & Astronom Ali Kuşçu',
                          role: 'Tarihi Bilim Rehberleri',
                          avatar: '🔭'
                        },
                        scenario: 'Ali Kuşçu ve Mimar Sinan, tarihi rasathanenin dev teleskobunun yıldızları tam odaklayabilmesi ve avludaki güneş saatinin zamanı kusursuz gösterebilmesi için ışınların geliş açılarını İletki (Açıölçer) ile derece derece ölçüyorlar.',
                        realLifeConnection: 'Güneş panellerinin maksimum elektrik üretmesi, uçakların güvenli iniş eğimi ve çatıların kar tutmaması için eğim açıları iletki ve hassas açı sensörleri ile belirlenir.',
                        reflectionQuestion: 'Bir açının kollarını sonsuza kadar uzatırsak açının derecesi büyür mü, yoksa aynı mı kalır?',
                        keyTakeaway: 'Açı iki ışının açıklığıdır; kolların boyu değişse bile açıölçerle ölçülen derece asla değişmez!',
                        pages: [
                          {
                            id: 'p-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Açının Doğuşu',
                            conceptTitle: 'Açı Kavramı ve Köşe/Kollar',
                            conceptBadge: 'Açı ∠AOB',
                            symbolicCode: '[OA ∪ [OB',
                            narrativeText: 'Ali Kuşçu gökyüzünü gözlemlerken masasına iki parlak ışık çubuğu koydu. Çubukların başlangıç noktalarını (O) birleştirdiğinde aralarında muhteşem bir açıklık meydana geldi.',
                            characterDialogue: {
                              speaker: 'Astronom Ali Kuşçu',
                              text: 'Bakın! Başlangıç noktası ortak olan iki ışın birleştiğinde bir AÇI doğar. Ortak nokta açının KÖŞESİ (O), ışınlar ise açının KOLLARIDIR ([OA ve [OB)!'
                            },
                            visualScene: {
                              type: 'ray-angle',
                              caption: 'Ortak başlangıç noktası O olan iki ışının oluşturduğu ∠AOB Açısı.'
                            },
                            interactiveAction: {
                              prompt: 'İki ışını birleştirerek açının köşesini (O) sabitleyin!',
                              actionLabel: 'Açının Köşesini Kilitle 📍',
                              feedbackRevealed: 'Açı ∠AOB oluşturuldu! Ortak köşe O noktasıdır, kollar [OA ve [OB ışınlarıdır.'
                            },
                            mathTakeaway: 'Açı: Başlangıç noktaları ortak olan iki ışının birleşim kümesidir. Köşedeki harf ortaya gelecek şekilde ∠AOB veya O açısı olarak gösterilir.'
                          },
                          {
                            id: 'p-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: İletki (Açıölçer) ile Tanışma',
                            conceptTitle: 'Açı Ölçme Aracı ve Derece (°)',
                            conceptBadge: 'İletki 180°',
                            symbolicCode: 's(∠AOB) = ...°',
                            narrativeText: 'Mimar Sinan heybesinden pirinçten yapılmış yarım daire şeklinde bir cetvel çıkardı. Üzerinde 0dan 180e kadar eşit aralıklarla dizilmiş çizgiler vardı.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Bu aletin adı İLETKİ (AÇIÖLÇER)dir. Çemberi 360 eşit parçaya böleriz; bu yarım daire 180 derecedir. Her küçük aralık 1 Derece (1°)lik açıyı temsil eder.'
                            },
                            visualScene: {
                              type: 'protractor-tool',
                              caption: 'İletki (Açıölçer): Açının derecesini ölçmek için kullanılan 180°lik cetvel.'
                            },
                            interactiveAction: {
                              prompt: 'İletkinin merkezini açının köşesine tam hizalayın!',
                              actionLabel: 'İletkiyi Köşeye Hizala 📐',
                              feedbackRevealed: 'Hizalama kusursuz! İletkinin merkez noktası tam O köşesine, taban çizgisi ise taban koluna oturdu.'
                            },
                            mathTakeaway: 'İletki (Açıölçer): Açıları derece (°) cinsinden ölçmeye ve çizmeye yarayan araçtır. Tam bir daire 360°, doğru açı 180°dir.'
                          },
                          {
                            id: 'p-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Dik Açının Sağlamlığı',
                            conceptTitle: 'Dik Açı Modeli (90°)',
                            conceptBadge: 'Dik Açı 90°',
                            symbolicCode: 's(∠A) = 90° [⊥]',
                            narrativeText: 'Rasathanenin ana sütunlarını inşa ederken Mimar Sinan gönyesini çıkardı. Duvarın taban ile yaptığı açıklık tam olarak 90 dereceyi gösteriyordu.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Tam 90 derece olan açıya DİK AÇI deriz. Köşesine küçük bir kare ve nokta sembolü koyarız. Dik açı binaların yıkılmadan dimdik ayakta durmasını sağlar!'
                            },
                            visualScene: {
                              type: 'perpendicular-parallel',
                              caption: '90 Derecelik Dik Açı: Köşesine diklik sembolü (kare ve nokta) konur.'
                            },
                            interactiveAction: {
                              prompt: 'Gönye ile sütunun 90° dik açısını test edin!',
                              actionLabel: 'Gönye ile Dikliği Test Et 📐',
                              feedbackRevealed: 'Kusursuz 90°! Tam 90 derece olan açılara Dik Açı adı verilir.'
                            },
                            mathTakeaway: 'Dik Açı: Ölçüsü tam olarak 90° olan açıdır. İki kol birbirine diktir (⊥ sembolü ile gösterilir).'
                          },
                          {
                            id: 'p-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Dar ve Geniş Açıların Dünyası',
                            conceptTitle: 'Açı Çeşitlerinin Sınıflandırılması',
                            conceptBadge: 'Dar, Dik, Geniş, Doğru',
                            symbolicCode: '0° < Dar < 90° < Geniş < 180°',
                            narrativeText: 'Güneş gökyüzünde yükseldikçe gölge çubuğu ile zemin arasındaki açı önce 35° (dar), öğleyin 90° (dik), ikindi vakti ise 140° (geniş) oldu.',
                            characterDialogue: {
                              speaker: 'Ali Kuşçu & Sinan',
                              text: '90 dereceden küçük açılara DAR AÇI, 90 ile 180 derece arasındakilere GENİŞ AÇI, dümdüz bir çizgi oluşturan 180 derecelik açıya ise DOĞRU AÇI deriz!'
                            },
                            visualScene: {
                              type: 'angle-classification',
                              caption: 'Açı Sınıfları: Dar Açı (<90°), Dik Açı (90°), Geniş Açı (>90°), Doğru Açı (180°).'
                            },
                            interactiveAction: {
                              prompt: 'Açı sürgüsünü hareket ettirerek açı türlerini keşfedin!',
                              actionLabel: 'Açıları Sınıflandır 🔄',
                              feedbackRevealed: 'Harika! 45° Dar Açı, 90° Dik Açı, 135° Geniş Açı ve 180° Doğru Açı başarıyla sınıflandırıldı.'
                            },
                            mathTakeaway: 'Ölçüsü 0°-90° arası olanlar Dar Açı, 90° olanlar Dik Açı, 90°-180° arası olanlar Geniş Açı, 180° olanlar Doğru Açıdır.'
                          },
                          {
                            id: 'p-5',
                            pageNumber: 5,
                            chapterTitle: '5. Bölüm: Büyük Rasathane Özeti',
                            conceptTitle: 'Açı Ölçme ve Maarif İlkeleri',
                            conceptBadge: 'Özet Tablo',
                            symbolicCode: 'Açı Bilim Rehberi',
                            narrativeText: 'Gözlemevinin kubbesi tamamlandığında Ali Kuşçu ve Mimar Sinan tüm ölçüm kayıtlarını rasathane defterine işlediler.',
                            characterDialogue: {
                              speaker: 'Bilim Rehberleri',
                              text: 'Artık biliyoruz ki: Açıların kollarını ne kadar uzatırsak uzatalım, açıklık ve derece değişmez. Şimdi iletki laboratuvarında kendi açılarımızı ölçelim!'
                            },
                            visualScene: {
                              type: 'summary-chart',
                              caption: 'Açı çeşitleri, iletki kullanımı ve ölçüm kuralları özet tablosu.'
                            },
                            interactiveAction: {
                              prompt: 'Açı Laboratuvarına geçmek için onaylayın!',
                              actionLabel: 'Açı Laboratuvarını Aç 🧪',
                              feedbackRevealed: 'Tebrikler! 1. Aşamayı tamamladınız. Şimdi İnteraktif İletki Laboratuvarında çizim ve ölçüm yapabilirsiniz.'
                            },
                            mathTakeaway: 'Açı ölçümü hassasiyet ve sabır gerektirir. İletkinin merkezi köşeye, tabanı kola oturtulur ve doğru skaladan derece okunur.'
                          }
                        ]
                      },
                      lab: {
                        title: 'İnteraktif İletki (Açıölçer) ve Açı Laboratuvarı',
                        toolType: 'geometry-canvas',
                        instructions: 'Aşağıdaki etkileşimli iletkiyi kullanarak açıları döndürün, dereceyi ölçün ve dar, dik, geniş veya doğru açı modelleri inşa ediniz.',
                        taskGoal: 'En az 1 adet 90° Dik Açı, 1 adet 45° Dar Açı ve 1 adet 135° Geniş Açı oluşturup açıölçerle doğrulayınız.',
                        interactiveTips: [
                          'Açının kollarını fare veya dokunmatik ekranla döndürerek dereceyi ayarlayabilirsiniz.',
                          'İletki butonuna basarak sanal iletkiyi açının üzerine yerleştirebilirsiniz.',
                          'Deney masası sekmesine geçerek iletki ile farklı açıları doğrudan test edebilirsiniz.'
                        ],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Açı Çeşitleri ve İletki Kavram Eşleştirme',
                        instructions: 'Sol taraftaki açı tanımlarını ve derecelerini sağ taraftaki doğru kavram kartlarıyla eşleştiriniz.',
                        items: [
                          { id: 'pz-ang-1', concept: 'Dar Açı', symbol: '0° < s(A) < 90°', definition: 'Ölçüsü 0 derece ile 90 derece arasında olan açılardır (Örn: 45°, 75°, 89°).', visualType: 'angle' },
                          { id: 'pz-ang-2', concept: 'Dik Açı', symbol: 's(A) = 90° [⊥]', definition: 'Ölçüsü tam olarak 90 derece olan açıdır; kolları birbirine diktir.', visualType: 'angle' },
                          { id: 'pz-ang-3', concept: 'Geniş Açı', symbol: '90° < s(A) < 180°', definition: 'Ölçüsü 90 derece ile 180 derece arasında olan açılardır (Örn: 95°, 120°, 179°).', visualType: 'angle' },
                          { id: 'pz-ang-4', concept: 'Doğru Açı', symbol: 's(A) = 180°', definition: 'Ölçüsü tam olarak 180 derece olan, kolları zıt yönlü bir doğru oluşturan açıdır.', visualType: 'angle' },
                          { id: 'pz-ang-5', concept: 'İletki (Açıölçer)', symbol: '📐 0°-180°', definition: 'Açıları derece cinsinden ölçmek ve çizmek için kullanılan yarım daire şeklindeki matematiksel araçtır.', visualType: 'angle' },
                          { id: 'pz-ang-6', concept: 'Açının Köşesi', symbol: 'O Noktası', definition: 'Açıyı oluşturan iki ışının ortak başlangıç noktasıdır.', visualType: 'point' },
                          { id: 'pz-ang-7', concept: 'Açının Kolları', symbol: '[OA ve [OB', definition: 'Köşe noktasından çıkarak açıyı sınırlandıran iki ışındır.', visualType: 'ray' },
                          { id: 'pz-ang-8', concept: 'Derece (°)', symbol: '1° = 1/360', definition: 'Bir tam çemberin 360ta birine karşılık gelen standart açı ölçme birimidir.', visualType: 'angle' }
                        ]
                      },
                      assessment: {
                        title: 'Açı Ölçme ve Sınıflandırma Değerlendirme Testi',
                        instructions: 'Aşağıdaki senaryolu soruları dikkatle okuyunuz, doğru seçeneği işaretleyip açıklamaları inceleyiniz.',
                        questions: [
                          {
                            id: 'q-ang-1',
                            questionText: 'Ölçüsü 89° olan bir açı ile ölçüsü 91° olan bir açı sırasıyla hangi açı türlerine aittir?',
                            options: [
                              'A) Dar Açı — Geniş Açı',
                              'B) Dik Açı — Geniş Açı',
                              'C) Dar Açı — Dik Açı',
                              'D) Geniş Açı — Doğru Açı'
                            ],
                            correctOptionIndex: 0,
                            explanation: '90 dereceden küçük pozitif açılar (89°) Dar Açı, 90 ile 180 derece arasındaki açılar (91°) Geniş Açı olarak adlandırılır.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q-ang-2',
                            questionText: 'Saat tam 15:00 (3:00) iken saatin akrep ve yelkovanı arasındaki açı kaç derecedir ve türü nedir?',
                            options: [
                              'A) 60° (Dar Açı)',
                              'B) 90° (Dik Açı)',
                              'C) 120° (Geniş Açı)',
                              'D) 180° (Doğru Açı)'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Saat kadranı 12 eşit dilime bölünmüştür (360° / 12 = 30° her saat). Saat 3:00 iken yelkovan 12de, akrep 3tedir. Aralarındaki fark 3 saattir: 3 × 30° = 90° (Dik Açı).',
                            bloomLevel: 'Uygulama & Gerçek Yaşam'
                          },
                          {
                            id: 'q-ang-3',
                            questionText: 'Bir öğrenci çizdiği dar açının kollarını cetvelle iki kat daha uzatıyor. Açının derecesi hakkında ne söylenebilir?',
                            options: [
                              'A) Açının derecesi iki katına çıkar.',
                              'B) Açının derecesi yarıya düşer.',
                              'C) Açının derecesi kesinlikle değişmez, aynı kalır.',
                              'D) Dar açı geniş açıya dönüşür.'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Açı, iki ışın arasındaki dönme açıklığıdır. Işınların (kolların) boyu uzatılsa bile aralarındaki açıklık ve açıölçerle ölçülen derece değişmez.',
                            bloomLevel: 'Kritik Düşünme & Kavram Yanılgısı Analizi'
                          },
                          {
                            id: 'q-ang-4',
                            questionText: 'İletki (açıölçer) ile bir açı ölçülürken aşağıdaki adımlardan hangisi kesinlikle DOĞRU yapılmalıdır?',
                            options: [
                              'A) İletkinin merkez noktası açının köşe noktasına tam oturtulmalıdır.',
                              'B) İletkinin en alt plastik kenarı açının köşesine konmalıdır.',
                              'C) Açının her iki kolu da iletkinin dışına taşmamalıdır.',
                              'D) İletki sadece dik açılarda kullanılabilir.'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Doğru açı ölçümü için iletkinin tam orta merkez noktası açının köşesine, taban çizgisi ise açının bir koluna tam çakıştırılmalıdır.',
                            bloomLevel: 'Kavrama & Ölçme Becerisi'
                          },
                          {
                            id: 'q-ang-5',
                            questionText: 'En büyük dar açı ile en küçük geniş açının tam sayı dereceleri toplamı kaçtır?',
                            options: [
                              'A) 180° (89° + 91° = 180°)',
                              'B) 179° (89° + 90° = 179°)',
                              'C) 181° (90° + 91° = 181°)',
                              'D) 182° (91° + 91° = 182°)'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'En büyük tam sayı dar açı 89°dir. En küçük tam sayı geniş açı 91°dir. Toplamları: 89° + 91° = 180° (Doğru Açı büyüklüğü) yapar.',
                            bloomLevel: 'Analiz & Matematiksel Muhakeme'
                          },
                          {
                            id: 'q-ang-6',
                            questionText: 'Bir çatının eğim açısı 135° olarak ölçülmüştür. Bu açı türü aşağıdakilerden hangisidir?',
                            options: [
                              'A) Dar Açı',
                              'B) Dik Açı',
                              'C) Geniş Açı',
                              'D) Doğru Açı'
                            ],
                            correctOptionIndex: 2,
                            explanation: '90°den büyük ve 180°den küçük olduğu için 135°lik açı bir Geniş Açıdır.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q-ang-7',
                            questionText: 'Saat 18:00 (6:00) olduğunda akrep ile yelkovanın oluşturduğu dümdüz çizgi şeklindeki açı kaç derecedir?',
                            options: [
                              'A) 90°',
                              'B) 120°',
                              'C) 180°',
                              'D) 360°'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Saat 6:00da yelkovan 12de, akrep 6dadır. Zıt yönlü iki ışın bir doğru oluşturur ve bu açının ölçüsü tam 180° (Doğru Açı)dir.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q-ang-8',
                            questionText: 'Güneş paneli ustası Hasan Bey, kış aylarında güneş ışınlarının geliş açısını iletkiyle 40° olarak ölçüyor. Bu açının dik açıya (90°) ulaşması için kaç derece daha büyümesi gerekir?',
                            options: [
                              'A) 40°',
                              'B) 50°',
                              'C) 60°',
                              'D) 90°'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Dik açı 90° olduğuna göre: 90° - 40° = 50° daha büyümesi gerekir.',
                            bloomLevel: 'Problem Çözme & Çıkarım'
                          }
                        ]
                      }
                    }
                  },
                  {
                    id: 'MAT.5.3.4',
                    code: 'MAT.5.3.4',
                    title: 'Düzlemde İki veya Üç Doğrunun Birbirine Göre Durumuna Bağlı Olarak Oluşabilecek Açılara Dair Çıkarım Yapabilme',
                    shortTitle: 'Doğruların Durumları ve Açı Çıkarımları: Ters, Komşu, Tümler, Bütünler',
                    description: 'Düzlemde iki veya üç doğrunun birbirine göre durumlarını (kesişen, dik, paralel, çakışık ve kesen doğrular) inceler; oluşan açıları (ters, komşu, tümler, bütünler, komşu tümler, komşu bütünler) açıölçer ve dinamik geometri yazılımı (OB2) ile ölçüp tablo temsili (MAB3) üzerinde listeleyerek aksiyomatik çıkarımlarda bulunur.',
                    gradeId: 'grade-5',
                    subjectId: 'mat-5',
                    unitId: 'unit-5-geo',
                    topicId: 'topic-5-geo-2',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Açıölçer ile ölçüm yaparken zıt yönlü açıları ve komşu bütünler açı toplamını sabırla kontrol etme)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (İki ve üç doğrunun kesişim durumlarını eşleştirip tablo temsili üzerinde doğrulama)',
                        'SDB3.3: Mantıksal Çıkarım ve Geometrik Varsayım Doğrulama (İki doğrunun kesişiminde ters açı eşitliğini ve toplamın 180° olduğunu aksiyomlaştırma)'
                      ],
                      processComponents: [
                        'a) Düzlemde iki veya üç doğrunun birbirine göre durumuna bağlı olarak oluşabilecek açılara dair varsayımlarda bulunur.',
                        'b) Açıölçer / dinamik geometri (OB2) yardımıyla ölçme yaparak doğruların oluşturduğu açıları çeşitlerine ve ilişkilerine göre tablo temsili (MAB3) üzerinde listeler.',
                        'c) Doğruların oluşturduğu açılara yönelik varsayımlarını ölçme sonuçlarıyla karşılaştırır.',
                        'ç) Doğruladığı varsayımlara yönelik önermeler (2 dar-2 geniş veya 4 dik açı, ters açı eşitliği, paralel doğruların açı oluşturmaması vb.) sunar.',
                        'd) Sunduğu önermelerin, üçten fazla doğrunun birbirine göre durumuna bağlı oluşabilecek açıların incelenmesine katkısına dair gerekçe sunar.'
                      ],
                      learningGoals: [
                        'Düzlemde yalnız bir ortak noktası bulunan doğruları "Kesişen Doğrular", dik açı oluşturanları "Dik Doğrular (d₁ ⊥ d₂)", ortak noktası bulunmayanları "Paralel Doğrular (d₁ ∥ d₂)", tüm noktaları ortak olanları "Çakışık Doğrular" olarak adlandırır.',
                        'İki doğruyu farklı birer noktada kesen üçüncü bir doğruyu "Kesen Doğru" olarak tanımlar.',
                        'İki doğrunun kesişiminde karşılıklı duran açıların "Ters Açılar" olduğunu ve ölçülerinin daima birbirine eşit olduğunu (a = c, b = d) keşfeder.',
                        'Ortak bir kolu ve ortak köşesi olan açıları "Komşu Açılar", ölçüleri toplamı 90° olanları "Tümler Açılar", ölçüleri toplamı 180° olanları "Bütünler Açılar" olarak tanımlar.',
                        'Bir doğru üzerindeki komşu iki açının "Komşu Bütünler Açılar" olduğunu ve toplamlarının daima 180° ettiğini çıkarır.',
                        'Paralel doğruların hiçbir noktada kesişmediği için açı oluşturmadığını ifade eder.',
                        'Üç doğrunun tek noktada kesişiminde (2 geniş-4 dar açı, 2 dik-4 dar açı veya 6 dar açı) açı ilişkilerini modeller.'
                      ],
                      teacherTips: [
                        'Sınıfta makas veya açılır-kapanır cetveller kullanarak iki doğrunun kesişimini somutlaştırınız; makasın ağzı açıldıkça arkadaki ters açının da aynı oranda büyüdüğünü fark ettiriniz.',
                        'Dinamik geometri yazılımında (OB2) doğruların eğimini değiştirerek ters açıların eşitliğinin ve komşu bütünler açı toplamının (180°) hiç bozulmadığını tablo üzerinde listeletiniz (MAB3).',
                        'Tren rayları veya köprü halatları örneğiyle paralel doğruların neden açı oluşturmadığını vurgulayınız.'
                      ],
                      misconceptions: [
                        'Ters açıların sadece dik kesişen doğrularda eşit olacağını düşünmek (Eğik kesişimlerde de ters açılar daima eşittir).',
                        'Tümler açı (90°) ile Bütünler açıyı (180°) birbiriyle karıştırmak.',
                        'Komşu açıların iç bölgelerinin kesişebileceğini sanmak (Komşu açıların iç bölgeleri daima ayrıktır).',
                        'Paralel doğruların uzatıldığında ileride bir yerde açı oluşturabileceğini zannetmek.'
                      ],
                      keyQuestions: [
                        'Bir kavşakta kesişen iki yoldan birindeki açı 70° ise, tam karşısındaki ters açı kaç derecedir? Yanındaki komşu açı kaç derecedir?',
                        'Neden paralel iki doğru arasında hiçbir zaman açı ölçülemez?',
                        'Üç doğru aynı noktada kesiştiğinde en fazla kaç farklı açı meydana gelir?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Boğaziçi Köprüleri ve Şehir Planlama: Doğruların Gizli Açıları',
                        character: {
                          name: 'Şehir Plancısı Selim & Mimar Sinan',
                          role: 'Şehir ve Geometri Mimarları',
                          avatar: '🌉'
                        },
                        scenario: 'Mimar Sinan ve Genç Şehir Plancısı Selim, büyük bir metropolün köprü halatlarını, kesişen ana arter kavşaklarını ve viyadük ayaklarını planlıyorlar. Sinan Usta masaya parşömenleri seriyor: "Doğruların kesiştiği her kavşakta ters açılar, komşu bütünler açılar ve paralel köprü kirişleri saklıdır. Bu açıları doğru çözen mimar, şehrin dengesini kurar!"',
                        realLifeConnection: 'Asma köprülerin taşıyıcı çelik halatları paralel doğrular oluştururken; viyadük makaslarındaki kesişen çelik kirişler ters açılarla yükü eşit dağıtır. Trafik kavşaklarındaki dönüş açıları komşu bütünler açılarla hesaplanır.',
                        reflectionQuestion: 'Kesişen iki caddenin oluşturduğu açılardan biri 50° ise, karşı taraftaki ters açı ve bitişiğindeki komşu bütünler açı kaçar derecedir?',
                        keyTakeaway: 'Kesişen doğruların oluşturduğu zıt yönlü ters açılar daima eşittir; bir doğru üzerindeki komşu bütünler açıların toplamı ise daima 180° eder!',
                        pages: [
                          {
                            id: 'p4-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Kavşaktaki Karşılaşma',
                            conceptTitle: 'Kesişen Doğrular ve Ters Açılar',
                            conceptBadge: 'Ters Açılar (Eşit)',
                            symbolicCode: 'a = c  ve  b = d',
                            narrativeText: 'Selim harita üzerinde iki ana caddenin (d₁ ve d₂ doğruları) tek bir O noktasında kesiştiğini gördü. Sinan Usta açıölçeri masaya koydu.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Evlat, kesişen iki doğru 4 farklı açı oluşturur. Karşılıklı duran bu zıt açılara TERS AÇILAR deriz. Açıölçerle ölç bakalım: Karşılıklı açıların ölçüleri birbirine daima eşittir (a = c ve b = d)!'
                            },
                            visualScene: {
                              type: 'intersecting-lines',
                              caption: 'Kesişen d₁ ve d₂ doğrularında karşılıklı duran ters açılar birbirine eşittir.'
                            },
                            interactiveAction: {
                              prompt: 'Doğruları döndürerek ters açıların (a ve c) eşit kaldığını test edin!',
                              actionLabel: 'Ters Açıları Ölç & Doğrula 📐',
                              feedbackRevealed: 'Harika çıkarım! İki doğrunun kesişiminde oluşan karşılıklı ters açıların ölçüleri daima eşittir (a = c).'
                            },
                            mathTakeaway: 'Çıkarım 1: Kesişen iki doğrunun oluşturduğu zıt yönlü açılara ters açılar denir ve ters açıların ölçüleri birbirine eşittir (a = c, b = d).'
                          },
                          {
                            id: 'p4-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Yan Yana Duran Açılar',
                            conceptTitle: 'Komşu Açılar ve Komşu Bütünler Açılar',
                            conceptBadge: 'Bütünler Açılar (180°)',
                            symbolicCode: 'a + b = 180°',
                            narrativeText: 'Sinan Usta doğru boyunca yan yana duran a ve b açılarını işaret etti. Bu iki açının birer kolu ve köşesi ortaktı.',
                            characterDialogue: {
                              speaker: 'Şehir Plancısı Selim',
                              text: 'Ustam, bu iki açının köşesi ve ortadaki kolu ortak; iç bölgeleri ise tamamen ayrı! Üstelik ikisi birleştiğinde dümdüz 180°lik bir doğru oluşturuyor!'
                            },
                            visualScene: {
                              type: 'supplementary-angles',
                              caption: 'Bir doğru üzerinde yan yana duran komşu bütünler açıların toplamı 180°dir.'
                            },
                            interactiveAction: {
                              prompt: 'Komşu açıları inceleyin ve toplamlarının 180° olduğunu doğrulayın!',
                              actionLabel: 'Bütünler Açıyı Hesapla ➕',
                              feedbackRevealed: 'Mükemmel! Bir doğru üzerinde komşu olan açıların toplamı daima 180° eder (Komşu Bütünler Açılar).'
                            },
                            mathTakeaway: 'Çıkarım 2: Ortak bir kolu ve köşesi olan açılara komşu açılar; ölçüleri toplamı 180° olan açılara ise bütünler açılar denir.'
                          },
                          {
                            id: 'p4-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Diklik ve Köşe Sırrı',
                            conceptTitle: 'Dik Kesişen Doğrular ve Tümler Açılar',
                            conceptBadge: 'Dik Doğrular (⊥) & Tümler (90°)',
                            symbolicCode: 'd₁ ⊥ d₂ (x + y = 90°)',
                            narrativeText: 'Köprü ayaklarının temele tam 90° dik inmesi gerekiyordu. İki doğru dik kesiştiğinde etrafındaki tüm açılar 90° oluyordu.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan',
                              text: 'Birbirini 90° ile kesen doğrulara DİK DOĞRULAR (d₁ ⊥ d₂) denir. Dik açıyı ikiye böldüğümüzde ise toplamı 90° eden TÜMLER AÇILAR (x + y = 90°) doğar!'
                            },
                            visualScene: {
                              type: 'perpendicular-complementary',
                              caption: 'Dik kesişen doğrular 4 adet 90°lik dik açı oluşturur; toplamı 90° olan açılar tümlerdir.'
                            },
                            interactiveAction: {
                              prompt: '90°lik dik açıyı iki parçaya bölerek tümler açıları keşfedin!',
                              actionLabel: 'Tümler Açıyı Böl 📐',
                              feedbackRevealed: 'Doğrulandı! Ölçüleri toplamı 90° olan iki açıya tümler açılar denir (x + y = 90°).'
                            },
                            mathTakeaway: 'Çıkarım 3: Dik kesişen doğrular 4 adet dik açı oluşturur. Ölçüleri toplamı 90° olan iki açı tümler açıdır.'
                          },
                          {
                            id: 'p4-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Asla Kesişmeyen Köprü Halatları',
                            conceptTitle: 'Paralel Doğrular ve Açı Oluşmama İlkesi',
                            conceptBadge: 'Paralel Doğrular (∥)',
                            symbolicCode: 'd₁ ∥ d₂ (Ortak Nokta Yok)',
                            narrativeText: 'Asma köprünün devasa çelik taşıyıcı halatları gökyüzüne doğru yan yana uzanıyordu. Aralarındaki mesafe her noktada 15 metreydi.',
                            characterDialogue: {
                              speaker: 'Şehir Plancısı Selim',
                              text: 'Bu iki halat sonsuza kadar uzasa bile asla birbirine değmez ve kesişmez! Kesişmedikleri için aralarında hiçbir açı oluşmaz; bunlar PARALEL DOĞRULARDIR (d₁ ∥ d₂)!'
                            },
                            visualScene: {
                              type: 'parallel-lines-noangle',
                              caption: 'Aynı düzlemde ortak noktası bulunmayan paralel doğrular açı oluşturmaz.'
                            },
                            interactiveAction: {
                              prompt: 'Paralel doğruları uzatarak aralarındaki mesafenin hep sabit kaldığını test edin!',
                              actionLabel: 'Paralelliği İncele ⏸️',
                              feedbackRevealed: 'Harika çıkarım! Ortak noktası bulunmayan paralel doğrular (d₁ ∥ d₂) hiçbir zaman açı oluşturmaz.'
                            },
                            mathTakeaway: 'Çıkarım 4: Düzlemde ortak noktası bulunmayan doğrular paralel doğrulardır ve aralarında açı oluşmaz.'
                          },
                          {
                            id: 'p4-5',
                            pageNumber: 5,
                            chapterTitle: '5. Bölüm: İki Paraleli Kesen Üçüncü Doğru',
                            conceptTitle: 'Kesen Doğru ve Üç Doğrunun Kesişimi',
                            conceptBadge: 'Kesen Doğru',
                            symbolicCode: 'd₃ Keseni (8 Açı Modeli)',
                            narrativeText: 'Son olarak Selim, paralel iki demiryolu hattını verev kesen üçüncü bir bağlantı yolu (d₃ keseni) çizdi.',
                            characterDialogue: {
                              speaker: 'Mimar Sinan & Selim',
                              text: 'İki doğruyu farklı noktalarda kesen bu üçüncü doğruya KESEN denir! Kesen doğru paralel hatlar üzerinde 8 farklı açı oluşturur ve yöndeş/ters açılar birebir eşleşir!'
                            },
                            visualScene: {
                              type: 'transversal-angles',
                              caption: 'İki paralel doğruyu kesen üçüncü bir doğru (kesen) 8 açı oluşturur.'
                            },
                            interactiveAction: {
                              prompt: 'Kesen doğruyu hareket ettirerek oluşan 8 açının özelliklerini inceleyin!',
                              actionLabel: 'Kesen Doğruyu İncele 🌐',
                              feedbackRevealed: 'Mükemmel! Kesen doğru sayesinde paralel hatlar üzerinde eş ve bütünler açı grupları meydana gelir.'
                            },
                            mathTakeaway: 'Çıkarım 5: İki doğruyu farklı noktalarda kesen üçüncü doğruya kesen denir; kesen doğru paralel doğrular üzerinde yöndeş, ters ve bütünler açı ilişkileri kurar.'
                          }
                        ]
                      },
                      lab: {
                        title: 'Dinamik Doğru ve Açı İnşa Masası (OB2 & MAB3 Tablo Temsili)',
                        toolType: 'experiment-bench',
                        instructions: 'Açıölçer ve dinamik doğru sürükleme araçları ile iki ve üç doğrunun durumlarını inceleyin; açı ölçüm tablosunu (MAB3) doldurarak çıkarımlarınızı doğrulayınız.',
                        taskGoal: 'Kesişen doğrular, dik doğrular ve paralel-kesen doğru deneylerini tamamlayıp açı çıkarım kartlarını açınız.',
                        interactiveTips: [
                          '1. Deney (Kesişen İki Doğru): Doğruları döndürün; karşılıklı ters açıların daima eşit kaldığını ve komşu açıların toplamının 180° olduğunu tabloda inceleyin.',
                          '2. Deney (Dik Doğrular & Tümler Açılar): Doğruları 90° dik konuma getirin; 4 dik açıyı ve toplamı 90° olan komşu tümler açıları gözlemleyin.',
                          '3. Deney (İki Paralel ve Bir Kesen): Kesen doğrunun açısını değiştirerek paralel doğrular üzerinde oluşan 8 açıyı karşılaştırın (OB2).'
                        ],
                        presetObjects: []
                      },
                      puzzle: {
                        title: 'Açı İlişkileri ve Çıkarım Bulmacaları',
                        instructions: 'Ters, komşu, tümler, bütünler açıları ve doğruların birbirine göre durumlarını eşleştirme, kelime avı ve hızlı test ile pekiştirin.',
                        items: [
                          {
                            id: 'pz-4-1',
                            concept: 'Ters Açılar',
                            symbol: 'a = c  ve  b = d',
                            definition: 'Kesişen iki doğrunun oluşturduğu, karşılıklı ve zıt yönlü, ölçüleri daima eşit olan açılardır.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-4-2',
                            concept: 'Komşu Bütünler Açılar',
                            symbol: 'a + b = 180°',
                            definition: 'Bir doğru üzerinde yan yana duran, ortak köşesi ve ortak bir kolu olan, toplamı 180° eden açılardır.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-4-3',
                            concept: 'Tümler Açılar',
                            symbol: 'x + y = 90°',
                            definition: 'Ölçüleri toplamı 90° (dik açı) olan iki açıdır.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-4-4',
                            concept: 'Bütünler Açılar',
                            symbol: 'k + m = 180°',
                            definition: 'Ölçüleri toplamı 180° (doğru açı) olan iki açıdır.',
                            visualType: 'angle'
                          },
                          {
                            id: 'pz-4-5',
                            concept: 'Dik Doğrular',
                            symbol: 'd₁ ⊥ d₂ (90°)',
                            definition: 'Birbirini 90°lik dik açı oluşturacak şekilde kesen doğrulardır.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-4-6',
                            concept: 'Paralel Doğrular',
                            symbol: 'd₁ ∥ d₂ (Açı = 0° / Yok)',
                            definition: 'Aynı düzlemde bulunan, hiçbir ortak noktası olmayan ve bu nedenle açı oluşturmayan doğrulardır.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-4-7',
                            concept: 'Kesen Doğru',
                            symbol: 'd₃ (Kesen)',
                            definition: 'Düzlemdeki iki veya daha fazla doğruyu farklı noktalardan kesen üçüncü doğrudur.',
                            visualType: 'line'
                          },
                          {
                            id: 'pz-4-8',
                            concept: 'Çakışık Doğrular',
                            symbol: 'd₁ ≡ d₂ (Tüm Noktalar Ortak)',
                            definition: 'Düzlemde tüm noktaları ortak olan ve üst üste gelen tek bir doğru gibi görünen doğrulardır.',
                            visualType: 'line'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Doğruların Durumları ve Açı Çıkarımları Süreç Değerlendirmesi',
                        instructions: 'İki ve üç doğrunun durumlarına, ters, komşu, tümler ve bütünler açılara yönelik 8 soruyu dikkatle yanıtlayınız.',
                        reflectionPrompt: 'Bugün iki ve üç doğrunun kesişiminde öğrendiğim en önemli açı kuralı (ters açı eşitliği, komşu bütünler açı toplamı vb.) şuydu:',
                        questions: [
                          {
                            id: 'q-4-1',
                            questionText: 'Düzlemde kesişen iki doğrunun oluşturduğu açılardan birinin ölçüsü 65° olarak verilmiştir. Bu açının TERS AÇISI olan açının ölçüsü kaç derecedir?',
                            options: [
                              'A) 25°',
                              'B) 65°',
                              'C) 115°',
                              'D) 180°'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Kesişen iki doğrunun oluşturduğu ters açıların ölçüleri daima birbirine eşittir. Bu nedenle 65°lik açının ters açısı da 65°dir.',
                            bloomLevel: 'Kavrama & Çıkarım',
                            context: 'Kesişen İki Yol Kavşağı'
                          },
                          {
                            id: 'q-4-2',
                            questionText: 'Bir doğru üzerinde yan yana duran iki KOMŞU BÜTÜNLER açıdan birinin ölçüsü 110°dir. Diğer komşu açının ölçüsü kaç derecedir?',
                            options: [
                              'A) 70°',
                              'B) 80°',
                              'C) 90°',
                              'D) 110°'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Komşu bütünler açıların ölçüleri toplamı daima 180° (doğru açı) eder. Buradan: 180° - 110° = 70° bulunur.',
                            bloomLevel: 'Uygulama',
                            context: 'Doğrusal Viyadük Açıklığı'
                          },
                          {
                            id: 'q-4-3',
                            questionText: 'Ölçüsü 35° olan bir açının TÜMLERİ olan açı kaç derecedir?',
                            options: [
                              'A) 45°',
                              'B) 55°',
                              'C) 65°',
                              'D) 145°'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Tümler iki açının ölçüleri toplamı 90°dir. 90° - 35° = 55° olarak hesaplanır.',
                            bloomLevel: 'Bilgi & Hesaplama',
                            context: 'Gönye ve Diklik Çizimi'
                          },
                          {
                            id: 'q-4-4',
                            questionText: 'Düzlemdeki d₁ ve d₂ doğruları hakkında "Aralarında hiçbir ortak nokta yoktur ve hiçbir açı oluşturmazlar" bilgisi veriliyor. Bu iki doğru için aşağıdakilerden hangisi söylenebilir?',
                            options: [
                              'A) d₁ ve d₂ dik doğrulardır (d₁ ⊥ d₂)',
                              'B) d₁ ve d₂ paralel doğrulardır (d₁ ∥ d₂)',
                              'C) d₁ ve d₂ çakışık doğrulardır',
                              'D) d₁ doğrusu d₂ doğrusunun kesenidir'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Aynı düzlemde hiçbir ortak noktası bulunmayan ve kesişmeyen doğrular PARALEL DOĞRULARDIR (d₁ ∥ d₂) ve açı oluşturmazlar.',
                            bloomLevel: 'Analiz & Akıl Yürütme',
                            context: 'Tren Rayları Modeli'
                          },
                          {
                            id: 'q-4-5',
                            questionText: 'İki doğru birbirini DİK olarak (d₁ ⊥ d₂) kestiğinde kesişim noktasında oluşan 4 açının özellikleri hakkında hangisi DOĞRUDUR?',
                            options: [
                              'A) İki dar açı ve iki geniş açı oluşur.',
                              'B) 4 açının tamamı 90°lik dik açıdır.',
                              'C) Karşılıklı açılar eşit değildir.',
                              'D) Açılardan biri 45°, diğeri 135°dir.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Dik kesişen doğruların oluşturduğu 4 açının her biri tam olarak 90°lik dik açıdır ve hepsi birbirine eştir.',
                            bloomLevel: 'Kavrama',
                            context: 'Şehir Izgara Planı'
                          },
                          {
                            id: 'q-4-6',
                            questionText: 'Düzlemde iki paralel doğruyu (d₁ ∥ d₂) farklı iki noktadan kesen üçüncü bir d₃ doğrusuna ne ad verilir?',
                            options: [
                              'A) Kesen Doğru',
                              'B) Dikme',
                              'C) Işın',
                              'D) Çakışık doğru'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'İki doğruyu farklı birer noktada kesen üçüncü doğruya bu iki doğrunun "KESENİ" adı verilir.',
                            bloomLevel: 'Bilgi & Tanım',
                            context: 'Köprü Bağlantı Kirişi'
                          },
                          {
                            id: 'q-4-7',
                            questionText: 'Aşağıdaki önermelerden hangisi her zaman YANLIŞTIR?',
                            options: [
                              'A) Kesişen iki doğrunun oluşturduğu ters açılar birbirine eştir.',
                              'B) Komşu bütünler iki açının ölçüleri toplamı 180°dir.',
                              'C) Paralel iki doğru uzatıldıkça aralarındaki açı 90° olur.',
                              'D) Tümler iki açının toplamı dik açıya (90°) eşittir.'
                            ],
                            correctOptionIndex: 2,
                            explanation: 'Paralel doğrular nereye kadar uzatılırsa uzatılsın asla kesişmez ve aralarında açı oluşmaz. C şıkkı kesinlikle yanlıştır.',
                            bloomLevel: 'Değerlendirme & Mantıksal Çıkarım',
                            context: 'Aksiyom ve Teorem Testi'
                          },
                          {
                            id: 'q-4-8',
                            questionText: 'Üç doğrunun tek bir O noktasında kesiştiği bir durumda etrafta toplam 6 açı meydana gelmektedir. Bu açılardan karşılıklı olan 3 çift için hangisi kesinlikle doğrudur?',
                            options: [
                              'A) Karşılıklı açılar (ters açılar) çiftler halinde birbirine eşittir.',
                              'B) 6 açının tamamı mutlaka dik açıdır.',
                              'C) 6 açının toplamı 180° eder.',
                              'D) Karşılıklı açıların toplamı 90° eder.'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Üç doğru tek noktada kesiştiğinde oluşan 6 açıdan karşılıklı duran 3 çiftin her biri ters açıdır ve karşılıklı açıların ölçüleri çiftler halinde birbirine eşittir (toplamları 360°dir).',
                            bloomLevel: 'Sentez & Üst Düzey Çıkarım',
                            context: 'Yıldız Kavşak Geometrisi'
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
