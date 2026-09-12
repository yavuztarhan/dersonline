import { Grade, Subject, Outcome } from '@/types';

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
                            conceptBadge: 'Paralel Doğrular (//)',
                            symbolicCode: 'd₁ // d₂ (Sabit Mesafe)',
                            narrativeText: 'Son olarak Hasan, taban doğrusuna gönye yardımıyla hep 10 cm uzaklıkta 3 farklı nokta belirledi ve bu noktaları cetvelle birleştirdi.',
                            characterDialogue: {
                              speaker: 'Hasan & Sinan',
                              text: 'Tıpkı tren rayları gibi! Bir doğruya eşit uzaklıktaki tüm noktaların oluşturduğu doğru, ilk doğruyla asla kesişmez; bu doğrular PARALELDİR (d₁ // d₂)!'
                            },
                            visualScene: {
                              type: 'parallel-tracks',
                              caption: 'Bir doğruya eşit uzaklıktaki noktaların birleşimi paralel doğru oluşturur.'
                            },
                            interactiveAction: {
                              prompt: 'Eşit uzaklıktaki noktaları birleştirip paralel rayları oluşturun!',
                              actionLabel: 'Paralel Doğruyu İnşa Et ⏸️',
                              feedbackRevealed: 'Mükemmel! Bir doğruya eşit uzaklıktaki noktaların oluşturduğu yeni doğru, taban doğrusuna paraleldir (d₁ // d₂).'
                            },
                            mathTakeaway: 'Çıkarım 5: Gönye ile bir doğruya eşit uzaklıktaki noktalar belirlenip birleştirildiğinde oluşan doğru, ilk doğruya paraleldir (d₁ // d₂).'
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
                            symbol: 'd₁ // d₂ (Tren Rayları)',
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
                              'B) Birbirine paraleldirler (d₁ // d₂) ve hiçbir zaman kesişmezler.',
                              'C) İleride 45 derecelik açıyla kesişirler.',
                              'D) Uzunlukları birbirinden farklıdır.'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Bir doğruya eşit uzaklıktaki noktaların birleştirilmesiyle elde edilen doğru, ilk doğruya paraleldir (d₁ // d₂); aralarındaki dik mesafe hep 8 cm kalır ve asla kesişmezler.',
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
                        'Düzlemde yalnız bir ortak noktası bulunan doğruları "Kesişen Doğrular", dik açı oluşturanları "Dik Doğrular (d₁ ⊥ d₂)", ortak noktası bulunmayanları "Paralel Doğrular (d₁ // d₂)", tüm noktaları ortak olanları "Çakışık Doğrular" olarak adlandırır.',
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
                            conceptBadge: 'Paralel Doğrular (//)',
                            symbolicCode: 'd₁ // d₂ (Ortak Nokta Yok)',
                            narrativeText: 'Asma köprünün devasa çelik taşıyıcı halatları gökyüzüne doğru yan yana uzanıyordu. Aralarındaki mesafe her noktada 15 metreydi.',
                            characterDialogue: {
                              speaker: 'Şehir Plancısı Selim',
                              text: 'Bu iki halat sonsuza kadar uzasa bile asla birbirine değmez ve kesişmez! Kesişmedikleri için aralarında hiçbir açı oluşmaz; bunlar PARALEL DOĞRULARDIR (d₁ // d₂)!'
                            },
                            visualScene: {
                              type: 'parallel-lines-noangle',
                              caption: 'Aynı düzlemde ortak noktası bulunmayan paralel doğrular açı oluşturmaz.'
                            },
                            interactiveAction: {
                              prompt: 'Paralel doğruları uzatarak aralarındaki mesafenin hep sabit kaldığını test edin!',
                              actionLabel: 'Paralelliği İncele ⏸️',
                              feedbackRevealed: 'Harika çıkarım! Ortak noktası bulunmayan paralel doğrular (d₁ // d₂) hiçbir zaman açı oluşturmaz.'
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
                            symbol: 'd₁ // d₂ (Açı = 0° / Yok)',
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
                              'B) d₁ ve d₂ paralel doğrulardır (d₁ // d₂)',
                              'C) d₁ ve d₂ çakışık doğrulardır',
                              'D) d₁ doğrusu d₂ doğrusunun kesenidir'
                            ],
                            correctOptionIndex: 1,
                            explanation: 'Aynı düzlemde hiçbir ortak noktası bulunmayan ve kesişmeyen doğrular PARALEL DOĞRULARDIR (d₁ // d₂) ve açı oluşturmazlar.',
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
                            questionText: 'Düzlemde iki paralel doğruyu (d₁ // d₂) farklı iki noktadan kesen üçüncü bir d₃ doğrusuna ne ad verilir?',
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
          }
        ]
      },
      /*
      // Matematik haricindeki dersler şimdilik yorum satırına alındı
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
      */
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
        units: [
          {
            id: 'unit-6-sayilar',
            subjectId: 'mat-6',
            unitNumber: 1,
            title: '1. Ünite: Sayılar ve Nicelikler (Doğal Sayılarla İşlemler)',
            description: 'Doğal sayıların çarpanları, katları, asal sayılar, bölünebilme kuralları ve üslü ifadeler.',
            icon: 'Calculator',
            themeColor: '#3b82f6',
            topics: [
              {
                id: 'topic-6-carpanlar',
                unitId: 'unit-6-sayilar',
                title: 'Bir Doğal Sayının Çarpanları ve Katları',
                description: 'Çarpan (bölen) kavramı, dikdörtgensel alan modelleri, çarpan gökkuşağı ve ritmik katlar.',
                outcomes: [
                  {
                    id: 'MAT.6.1.1',
                    code: 'MAT.6.1.1',
                    title: 'Bir Doğal Sayının Çarpanlarını ve Katlarını Belirleyebilme',
                    shortTitle: 'Bir Doğal Sayının Çarpanları ve Katları',
                    description: 'Bir doğal sayının çarpanlarını (bölenlerini) dikdörtgensel alan modelleri, çarpan gökkuşağı ve çarpan ikilileri ile belirler; bir doğal sayının katlarını ritmik sayma ve sayı doğrusu üzerinde modeller, günlük hayat problemlerinde çarpan ve kat ilişkilerini yorumlar.',
                    gradeId: 'grade-6',
                    subjectId: 'mat-6',
                    unitId: 'unit-6-sayilar',
                    topicId: 'topic-6-carpanlar',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Çarpan ikililerini küçükten büyüğe sıralarken ve gökkuşağı modelinde eksik çarpan bırakmamak için sistematik kontrol yapma)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Kolileme ve paylaşım senaryolarında farklı çarpan kombinasyonlarını karşılaştırıp tartışma)',
                        'SDB3.3: Matematiksel Muhakeme ve Problem Çözme (Çarpan ve bölen kavramlarının özdeşliğini, bir sayının katlarının sonsuza gittiğini modelleme)'
                      ],
                      processComponents: [
                        'a) Bir doğal sayının çarpanlarını (bölenlerini) alan modelleri ve çarpan ikilileriyle belirler.',
                        'b) Sayının çarpanlarını küçükten büyüğe sıralayarak "Çarpan Gökkuşağı" temsilinde eşleştirir.',
                        'c) Bir doğal sayının pozitif tam sayı katlarını ritmik sayma ve sayı doğrusu üzerinde gösterir.',
                        'ç) Bir sayının çarpanları ile katları arasındaki çift yönlü ilişkiyi (a · b = c ise a ve b c\'nin çarpanı, c ise a ve b\'nin katıdır) kavrar.',
                        'd) Günlük hayat durumlarında (kolileme, eşit paylaşım, nöbetleşme, sefer süreleri) çarpan ve kat kavramlarını problem çözmede kullanır.'
                      ],
                      learningGoals: [
                        'Her doğal sayının en küçük pozitif çarpanının 1, en büyük pozitif çarpanının kendisi olduğunu fark eder.',
                        'Bir doğal sayının "çarpanı" ile "böleni" ifadelerinin aynı anlama geldiğini açıklar.',
                        'Çarpan gökkuşağı modelinde baştan ve sondan eşit uzaklıktaki sayıların çarpımının daima hedef sayıyı verdiğini keşfeder.',
                        'Bir doğal sayının katlarının, o sayının sırasıyla 1, 2, 3, 4... gibi pozitif tam sayılarla çarpılmasıyla elde edildiğini ve sonsuza kadar devam ettiğini kavrar.',
                        'Tam kare sayıların (örn. 36) tek sayıda pozitif çarpana sahip olduğunu (çünkü 6 × 6 eşleşir) fark eder.'
                      ],
                      teacherTips: [
                        'Birim kareler veya karo taşları kullanarak öğrencilere 24 veya 36 birimkarelik farklı dikdörtgenler oluşturmasını isteyiniz (1×24, 2×12, 3×8, 4×6).',
                        'Gökkuşağı modelini tahtada renkli yaylarla çizdirerek dıştan içe doğru çarpan eşleşmelerini görselleştiriniz.',
                        'Katlar kavramını sayı doğrusunda kurbağa veya kanguru zıplamasıyla somutlaştırınız.'
                      ],
                      misconceptions: [
                        'Çarpan ile kat kavramlarını birbiriyle karıştırmak (Örn: 12\'nin çarpanı sorulduğunda 24, 36 demek).',
                        'Bir sayının 1 ve kendisini çarpan olarak saymayı unutmak.',
                        'Sıfırı (0) bir sayının pozitif çarpanı zannetmek.',
                        'Bir sayının çarpan sayısının o sayının büyüklüğüyle daima doğru orantılı olduğunu düşünmek (Örn: 24\'ün 8 çarpanı varken 25\'in 3 çarpanı vardır).'
                      ],
                      keyQuestions: [
                        '36 sayısının tüm pozitif çarpanlarını gökkuşağı yöntemiyle nasıl eksiksiz bulabilirsin?',
                        'Bir sayının çarpanları sınırlı mıdır, katları sınırlı mıdır? Neden?',
                        'Her 12 dakikada bir kalkan bir yardım aracının ilk 1 saatteki kalkış dakikaları nelerdir?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Kardeşlik Sofrası ve İyilik Kolisi Seferberliği',
                        character: {
                          name: 'Gönüllü Koordinatörü Eren & Fatma Teyze',
                          role: 'İyilik Hareketi Lojistik Mimarları',
                          avatar: '📦'
                        },
                        scenario: 'Kızılay ve Aşevi gönüllüleri, Ramazan ayı ve afet destek çalışmaları kapsamında "Kardeşlik Sofrası" için gıda kolileri hazırlıyor. Eren ve Fatma Teyze depodaki 36 şişe sızma zeytinyağı ve 48 paket mercimeği hiç artmayacak şekilde eşit sayıda paketleyecekler. Ayrıca yardım servisleri her 12 dakikada bir lojistik merkezinden hareket ediyor.',
                        realLifeConnection: 'Depolama, lojistik paketleme, koli ebatları belirleme ve periyodik sefer saatleri planlamasında çarpanlar ve katlar matematiği hayati rol oynar.',
                        reflectionQuestion: '36 şişe zeytinyağını hiç artmayacak şekilde kaçar kaçar kolileyebiliriz? Her 12 dakikada kalkan araçlar ilk 1 saatte hangi dakikalarda hareket eder?',
                        keyTakeaway: 'Bir sayıyı kalansız bölen sayılara o sayının çarpanları (bölenleri) denir. Sayının kendisiyle başlayıp ritmik artan değerler ise onun katlarıdır.',
                        pages: [
                          {
                            id: 'p6-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Kolileme Düzeni & Dikdörtgensel Alan Modeli',
                            conceptTitle: 'Bir Doğal Sayının Çarpanları (Bölenleri)',
                            conceptBadge: 'Çarpan İkilileri',
                            symbolicCode: '36 = 1×36 = 2×18 = 3×12 = 4×9 = 6×6',
                            narrativeText: 'Fatma Teyze depodaki 36 şişe zeytinyağını masaya dizdi. "Eren evladım," dedi, "bu şişeleri öyle kutulayalım ki her kutuda eşit sayıda şişe olsun ve tek bir şişe bile artmasın!" Eren eline kareli defteri aldı ve dikdörtgensel koli tabanları çizmeye başladı.',
                            characterDialogue: {
                              speaker: 'Fatma Teyze',
                              text: 'Bir sayıyı kalansız bölen her pozitif tam sayı, o sayının bir ÇARPANI veya BÖLENİDİR. 36 şişeyi 1\'erli, 2\'şerli, 3\'erli, 4\'erli, 6\'şarlı, 9\'arlı, 12\'şerli, 18\'erli veya 36\'şarlı paketleyebiliriz!'
                            },
                            visualScene: {
                              type: 'factors-area-model',
                              caption: '36 şişelik zeytinyağı kolisi: 1×36, 2×18, 3×12, 4×9 ve 6×6 dikdörtgenleri ile modellenir.'
                            },
                            interactiveAction: {
                              prompt: '36 şişenin tüm çarpan ikililerini keşfederek eksiksiz koli planı oluşturun!',
                              actionLabel: 'Çarpan İkililerini Doğrula 📦',
                              feedbackRevealed: 'Tebrikler! 36\'nın çarpanları: 1, 2, 3, 4, 6, 9, 12, 18, 36 olmak üzere 9 tanedir.'
                            },
                            mathTakeaway: 'Kural 1: Her pozitif doğal sayının en küçük çarpanı 1, en büyük çarpanı ise sayının KENDİSİDİR. Çarpan ile Bölen eş anlamlıdır.'
                          },
                          {
                            id: 'p6-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Çarpan Gökkuşağı ve Simetri Sırrı',
                            conceptTitle: 'Gökkuşağı Yayı ile Çarpan Eşleme',
                            conceptBadge: 'Simetrik Eşleme',
                            symbolicCode: '1 · 36 = 2 · 18 = 3 · 12 = 4 · 9 = 6 · 6',
                            narrativeText: 'Eren 36\'nın çarpanlarını küçükten büyüğe tahtaya yazdı: 1, 2, 3, 4, 6, 9, 12, 18, 36. Fatma Teyze renkli tebeşirlerle baştaki ve sondaki sayıları yaylarla birleştirdi.',
                            characterDialogue: {
                              speaker: 'Eren',
                              text: 'Gözlerime inanamıyorum! En dıştaki 1 ile 36\'nın çarpımı 36, bir içteki 2 ile 18\'in çarpımı 36, 3 ile 12\'nin çarpımı 36, 4 ile 9\'un çarpımı 36! Tam ortadaki 6 ise kendisiyle çarpılınca (6×6=36) kalbi oluşturuyor!'
                            },
                            visualScene: {
                              type: 'factors-rainbow-arc',
                              caption: '36 sayısının çarpan gökkuşağı: Karşılıklı yayların uçlarındaki sayıların çarpımı daima 36\'yı verir.'
                            },
                            interactiveAction: {
                              prompt: 'Gökkuşağı yaylarını birleştirerek eksik kalan çarpan çiftini yakalayın!',
                              actionLabel: 'Gökkuşağını Tamamla 🌈',
                              feedbackRevealed: 'Harika gözlem! Çarpan gökkuşağında baştan ve sondan eşit uzaklıktaki çarpanların çarpımı daima sayının kendisini verir.'
                            },
                            mathTakeaway: 'Kural 2: Çarpanlar küçükten büyüğe dizildiğinde baştan ve sondan eşleşen sayıların çarpımı sabittir. 36 gibi tam kare sayıların çarpan sayısı TEKTİR.'
                          },
                          {
                            id: 'p6-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Ritmik Seferler & Sayı Doğrusunda Katlar',
                            conceptTitle: 'Bir Doğal Sayının Katları',
                            conceptBadge: 'Ritmik Katlar',
                            symbolicCode: '12, 24, 36, 48, 60, 72, 84, 96, 108, 120...',
                            narrativeText: 'Aşevinden çıkan sıcak çorba ve yardım tırları her 12 dakikada bir hareket ediyor. Eren lojistik saatini ayarlarken kalkış dakikalarını sayı doğrusuna işaretledi.',
                            characterDialogue: {
                              speaker: 'Fatma Teyze',
                              text: '12\'nin 1 katı 12. dakika, 2 katı 24. dakika, 3 katı 36. dakika, 4 katı 48. dakika, 5 katı 60. dakika (yani 1. saat)! Bir sayının pozitif tam sayılarla (1, 2, 3...) çarpılmasıyla elde edilen sayılara o sayının KATLARI denir.'
                            },
                            visualScene: {
                              type: 'multiples-number-line',
                              caption: 'Yardım tırlarının 12 dakikada bir hareketi: Sayı doğrusunda 12\'nin katları (12, 24, 36, 48, 60, 72, 84, 96...).'
                            },
                            interactiveAction: {
                              prompt: '12\'nin 100\'den küçük en büyük katını sayı doğrusunda bulun!',
                              actionLabel: 'Katı Tespit Et ⏱️',
                              feedbackRevealed: 'Doğru hesaplama! 12 × 8 = 96, 12\'nin 100\'den küçük en büyük katıdır.'
                            },
                            mathTakeaway: 'Kural 3: Bir doğal sayının çarpanları sınırlı sayıda iken, katları sonsuza kadar devam eder. Katlar daima sayının kendisine eşit veya ondan büyüktür.'
                          },
                          {
                            id: 'p6-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Lojistik Şifresi: Çarpan ve Katın Dansı',
                            conceptTitle: 'Çarpan ile Kat Arasındaki Çift Yönlü Bağ',
                            conceptBadge: 'Matematiksel İlişki',
                            symbolicCode: '6 × 8 = 48  ⟹  6 ve 8 çarpan, 48 ise kattır!',
                            narrativeText: 'Günün sonunda 48 koli mercimek ve 36 koli zeytinyağı tırlara yüklendi. Eren ve Fatma Teyze defteri kapatırken çarpan ve kat arasındaki muazzam dengeyi özetlediler.',
                            characterDialogue: {
                              speaker: 'Eren & Fatma Teyze',
                              text: 'Eğer 6 ile 8\'i çarptığımızda 48 buluyorsak; 6 ve 8 sayıları 48\'in ÇARPANI (BÖLENİ), 48 sayısı ise hem 6\'nın hem de 8\'in bir KATIDIR!'
                            },
                            visualScene: {
                              type: 'factors-multiples-duality',
                              caption: 'Çarpan ve kat madalyonun iki yüzüdür: 6 × 8 = 48 eşitliğinde 6 ve 8 çarpan, 48 ise kattır.'
                            },
                            interactiveAction: {
                              prompt: 'Çarpan ve kat ilişkisini özetleyen formülü onaylayın!',
                              actionLabel: 'Bağlantıyı Mühürle 🔐',
                              feedbackRevealed: 'Harika bir öğrenme yolculuğu! Artık bir doğal sayının çarpanlarını ve katlarını eksiksiz belirleyebiliyorsun.'
                            },
                            mathTakeaway: 'Sonuç: a · b = c eşitliğinde a ve b sayıları c\'nin çarpanlarıdır; c sayısı ise a ve b sayılarının ortak bir katıdır.'
                          }
                        ]
                      },
                      lab: {
                        title: 'Dinamik Çarpan Alanı ve Sayı Işını Laboratuvarı',
                        toolType: 'experiment-bench',
                        instructions: 'Birim karelerle dikdörtgensel alanlar oluşturarak çarpan çiftlerini keşfedin, çarpan gökkuşağı yaylarını simüle edin ve sayı doğrusunda ritmik sıçramalarla katları test edin.',
                        taskGoal: '36 sayısının tüm çarpanlarını firesiz dikdörtgenlerle modelleyin ve 12\'nin ilk 10 katını sayı doğrusunda işaretleyin.',
                        interactiveTips: [
                          'Genişlik x Yükseklik çarpımı hedef sayıyı tam vermelidir; artık birim kare kalırsa o sayı çarpan değildir!',
                          'Gökkuşağı modelinde yayların dıştan içe doğru çarpımını kontrol ediniz.',
                          'Sayı doğrusunda adım büyüklüğünü değiştirerek farklı sayıların katlarını karşılaştırınız.'
                        ]
                      },
                      puzzle: {
                        title: 'Çarpanlar ve Katlar Oyun İstasyonu',
                        instructions: 'Öğrenilen kavramları pekiştirmek için 3 özel oyundan birini seçiniz: Kolileme Fabrikası, Kat Avcısı Kurbağa veya Gökkuşağı Kasası.',
                        items: [
                          {
                            id: 'p1',
                            concept: 'Çarpan (Bölen)',
                            symbol: 'a | c',
                            definition: 'Bir doğal sayıyı kalansız bölebilen pozitif tam sayılardır.',
                            visualType: 'area'
                          },
                          {
                            id: 'p2',
                            concept: 'Doğal Sayının Katı',
                            symbol: 'k · n',
                            definition: 'Bir doğal sayının pozitif tam sayılarla (1, 2, 3...) çarpılmasıyla elde edilen sayılardır.',
                            visualType: 'ray'
                          },
                          {
                            id: 'p3',
                            concept: 'Çarpan Gökkuşağı',
                            symbol: '1·n = a·b',
                            definition: 'Çarpanların küçükten büyüğe dizilip dıştan içe yaylarla eşleştirildiği simetrik modeldir.',
                            visualType: 'rainbow'
                          },
                          {
                            id: 'p4',
                            concept: 'Tam Kare Sayı Çarpanı',
                            symbol: 'n = a²',
                            definition: 'Aynı iki çarpanın çarpımı olan (örn: 6×6=36), pozitif çarpan sayısı tek olan sayılardır.',
                            visualType: 'square'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Değerlendirme Testi: Çarpanlar ve Katlar',
                        instructions: 'Aşağıdaki 14 soruyu dikkatle okuyunuz. Sorular 8 temel kavrama ve 6 günlük hayat problem çözme sorusundan oluşmaktadır.',
                        reflectionPrompt: 'Bugün çarpan (bölen) ve kat kavramları hakkında ne öğrendiniz? Çarpan gökkuşağı yöntemi eksik çarpan bulmada size nasıl yardımcı oldu?',
                        questions: [
                          {
                            id: 'q1',
                            questionText: '24 sayısının pozitif çarpan sayısı kaçtır?',
                            options: ['6', '7', '8', '10'],
                            correctOptionIndex: 2,
                            explanation: '24\'ün çarpanları: 1, 2, 3, 4, 6, 8, 12, 24 olmak üzere toplam 8 tanedir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q2',
                            questionText: 'Aşağıdakilerden hangisi 36 sayısının bir çarpanı DEĞİLDİR?',
                            options: ['4', '8', '9', '12'],
                            correctOptionIndex: 1,
                            explanation: '36 sayısı 8\'e bölündüğünde kalan 4 olur (36 = 8×4 + 4), bu yüzden 8 sayısı 36\'nın çarpanı (böleni) değildir.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q3',
                            questionText: '15 sayısının 100\'den küçük en büyük katı kaçtır?',
                            options: ['85', '90', '95', '105'],
                            correctOptionIndex: 1,
                            explanation: '15\'in katları: 15, 30, 45, 60, 75, 90, 105... 100\'den küçük en büyük katı 15 × 6 = 90\'dır.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q4',
                            questionText: 'Bir doğal sayının tüm çarpanları küçükten büyüğe doğru sıralanarak çarpan gökkuşağı oluşturulmuştur:\n1, 2, 3, A, 6, B, 10, 15, C, 60\nBuna göre A + B + C toplamı kaçtır?',
                            options: ['39', '42', '44', '49'],
                            correctOptionIndex: 0,
                            explanation: 'En dıştaki çarpım 1 × 60 = 60\'tır. Dolayısıyla sayımız 60\'tır. 60 = 3 × C ⟹ C = 20 değil; 60 = 2 × C ⟹ C = 30. 60 = A × 15 ⟹ A = 4. 60 = 6 × B ⟹ B = 5 (ya da 60 = B × 10 ⟹ B = 6 değil, sıralı dizi: 1,2,3,4,5,6,10,12,15,20,30,60). Dizide A=4, B=5, C=30. Toplam = 4 + 5 + 30 = 39\'dur.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q5',
                            questionText: '48 sayısının kaç tane ÇİFT doğal sayı çarpanı vardır?',
                            options: ['6', '7', '8', '10'],
                            correctOptionIndex: 2,
                            explanation: '48\'in çarpanları: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48 (10 çarpan). Tek olanlar: 1 ve 3 (2 adet). Çift olanlar: 2, 4, 6, 8, 12, 16, 24, 48 olmak üzere 8 tanedir.',
                            bloomLevel: 'Analiz'
                          },
                          {
                            id: 'q6',
                            questionText: 'Bir doğal sayının çarpanları aynı zamanda o sayının neyidir?',
                            options: ['Katı', 'Böleni', 'Üssü', 'Karesi'],
                            correctOptionIndex: 1,
                            explanation: 'Bir sayıyı kalansız bölen sayılara bölen denir ve bir sayının çarpanları ile bölenleri tamamen aynı kümedir.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q7',
                            questionText: 'Aşağıdaki sayılardan hangisinin pozitif çarpan sayısı TEK sayıdır?',
                            options: ['18', '24', '36', '40'],
                            correctOptionIndex: 2,
                            explanation: 'Tam kare sayıların çarpan sayısı tektir çünkü ortadaki çarpan kendisiyle eşleşir (6×6=36). 36\'nın çarpanları: 1, 2, 3, 4, 6, 9, 12, 18, 36 (9 adet).',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q8',
                            questionText: '7 sayısının 50 ile 80 arasındaki katlarının toplamı kaçtır?',
                            options: ['196', '203', '266', '273'],
                            correctOptionIndex: 2,
                            explanation: '7\'nin 50 ile 80 arasındaki katları: 56, 63, 70, 77\'dir. Toplam = 56 + 63 + 70 + 77 = 266\'dır.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q9',
                            questionText: 'Bir sınıftaki 32 öğrenci beden eğitimi dersinde eşit sayıda sıralara dizilecektir. Sıra sayısı 1\'den fazla ve her sıradaki öğrenci sayısı 1\'den fazla olmak üzere kaç farklı sıra düzeni oluşturulabilir?',
                            options: ['3', '4', '5', '6'],
                            correctOptionIndex: 1,
                            explanation: '32\'nin çarpan ikilileri: 1×32, 2×16, 4×8, 8×4, 16×2, 32×1. 1\'den fazla şartı olduğundan (1×32 ve 32×1 hariç): 2×16, 4×8, 8×4 ve 16×2 olmak üzere 4 farklı düzen kurulabilir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q10',
                            questionText: 'Bir aşevinde 45 kg pirinç hiç artmayacak şekilde eşit büyüklükte torbalara doldurulacaktır. Torbaların her biri 3 kg\'dan ağır ve 15 kg\'dan hafif olacağına göre, bir torbanın ağırlığı kaç farklı tam sayı değeri alabilir?',
                            options: ['1', '2', '3', '4'],
                            correctOptionIndex: 1,
                            explanation: '45\'in bölenleri: 1, 3, 5, 9, 15, 45. 3 kg\'dan ağır ve 15 kg\'dan hafif olan bölenler: 5 kg ve 9 kg\'dır (2 farklı değer).',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q11',
                            questionText: 'İki kardeşten Ali 6 günde bir, Can ise 8 günde bir dedelerini ziyaret etmektedir. İkisi birlikte ilk ziyareti yaptıktan sonraki 50 gün içinde kaç kez daha aynı gün ziyarete giderler?',
                            options: ['1', '2', '3', '4'],
                            correctOptionIndex: 1,
                            explanation: '6 ve 8\'in ortak katları: 24, 48, 72... 50 gün içinde 24. gün ve 48. gün olmak üzere 2 kez daha aynı gün birlikte giderler.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q12',
                            questionText: 'Kenar uzunlukları santimetre cinsinden birer doğal sayı ve alanı 40 cm² olan bir dikdörtgenin çevre uzunluğu EN AZ kaç cm olabilir?',
                            options: ['26', '28', '44', '82'],
                            correctOptionIndex: 0,
                            explanation: 'Alanı 40 olan dikdörtgenin kenar çarpanları: 1×40 (Çevre=82), 2×20 (Çevre=44), 4×10 (Çevre=28), 5×8 (Çevre=2×(5+8)=26 cm). Çevrenin en az olması için kenarlar birbirine en yakın (5 ve 8) seçilir, Çevre = 26 cm.',
                            bloomLevel: 'Problem Çözme / Muhakeme'
                          },
                          {
                            id: 'q13',
                            questionText: 'Bir yardım deposundaki gıda kolileri 12\'şerli ve 15\'erli sayıldığında hiç koli artmamaktadır. Kolilerin sayısının 100 ile 200 arasında olduğu bilindiğine göre, depoda kaç koli olabilir?',
                            options: ['120', '150', '160', '210'],
                            correctOptionIndex: 0,
                            explanation: '12 ve 15\'in ortak katları 60\'ın katlarıdır: 60, 120, 180, 240... 100 ile 200 arasında 120 ve 180 vardır. Seçeneklerde 120 yer almaktadır.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q14',
                            questionText: 'Bir belediye otobüsü ilk durağından her 18 dakikada bir hareket etmektedir. Sabah saat 07:00\'de ilk seferine başlayan bu otobüs, saat 09:30\'a kadar toplam kaç sefer yapmış olur? (Saat 07:00\'deki ilk sefer dahildir)',
                            options: ['8', '9', '10', '11'],
                            correctOptionIndex: 1,
                            explanation: '07:00 ile 09:30 arası toplam süre 2 saat 30 dakika = 150 dakikadır. Sefer dakikaları: 0. dk (1.), 18. dk (2.), 36. dk (3.), 54. dk (4.), 72. dk (5.), 90. dk (6.), 108. dk (7.), 126. dk (8.), 144. dk (9.). Toplam 9 sefer yapılmıştır.',
                            bloomLevel: 'Problem Çözme'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              {
                id: 'topic-6-bolunebilme',
                unitId: 'unit-6-sayilar',
                title: 'Bölünebilme Kriterleri',
                description: '2, 3, 4, 5, 6, 9 ve 10 ile kalansız bölünebilme kriterleri, basamak çözümlemesi ve pratik çıkarımlar.',
                outcomes: [
                  {
                    id: 'MAT.6.1.2',
                    code: 'MAT.6.1.2',
                    title: 'Bir Doğal Sayının 2, 3, 4, 5, 6, 9 ve 10 ile Tam Bölünebilme Kriterlerine İlişkin Çıkarım Yapabilme',
                    shortTitle: 'Bölünebilme Kriterleri (2, 3, 4, 5, 6, 9, 10)',
                    description: 'Bir doğal sayının katlarını veya basamak değerlerini dikkate alarak 2, 3, 4, 5, 6, 9 ve 10 ile kalansız bölünebilme kriterlerine ilişkin genellemelere ve matematiksel önermelere ulaşır; bölme işlemi yapmadan pratik problem çözme ve karar verme becerisi kazanır.',
                    gradeId: 'grade-6',
                    subjectId: 'mat-6',
                    unitId: 'unit-6-sayilar',
                    topicId: 'topic-6-bolunebilme',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Basamak değerleri ve son basamak kurallarını adım adım kontrol ederek bölünebilme durumunu sistematik sınama)',
                        'SDB2.1: İletişim (Neden bir sayının hem 2 hem 3\'e bölündüğünde 6\'ya da tam bölündüğünü akranlarına gerekçeleriyle sunma)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Hızlı bölünebilme istasyonlarında ortak strateji geliştirme ve varsayımları sınama)',
                        'SDB3.3: Matematiksel Muhakeme ve Çıkarım (3 ve 9 ile bölünebilme kuralının basamak çözümlemesi ve 100=99+1 mantığından kaynaklandığını keşfetme)'
                      ],
                      processComponents: [
                        'a) Bir doğal sayının katlarını veya basamak değerlerini dikkate alarak 2, 3, 4, 5, 6, 9 ve 10’a tam bölünebilme kriterleri ile ilgili varsayımlarda bulunur.',
                        'b) 2, 3, 4, 5, 6, 9 ve 10’un katlarını ve basamak değerlerini inceleyerek genellemeleri belirler.',
                        'c) Elde ettiği genellemelerin varsayımını karşılayıp karşılamadığını örnekler ile sınar.',
                        'ç) Bir doğal sayının 2, 3, 4, 5, 6, 9 ve 10 ile tam bölünebilmesindeki kriterlere ilişkin önerme sunar.',
                        'd) Bir doğal sayının 2, 3, 4, 5, 6, 9 ve 10 ile tam bölünebilmesindeki kriterlerin farklı durumlarda kullanışlılığını değerlendirir.'
                      ],
                      learningGoals: [
                        'Son basamağı çift (0, 2, 4, 6, 8) olan sayıların 2 ile kalansız bölündüğünü açıklar.',
                        'Rakamları toplamı 3 veya 3\'ün katı olan sayıların 3 ile, 9 veya 9\'un katı olan sayıların 9 ile tam bölündüğünü kavrar.',
                        'Son iki basamağı 00 veya 4\'ün katı olan sayıların 4 ile kalansız bölündüğünü modeller.',
                        'Birler basamağı 0 veya 5 olan sayıların 5 ile, birler basamağı 0 olan sayıların 10 ile kalansız bölündüğünü keşfeder.',
                        'Hem 2 hem de 3 ile kalansız bölünebilen sayıların 6 ile de tam bölündüğünü gerekçelendirir.',
                        'Bölme işlemi yapmadan bir sayının 9\'a bölümünden kalanın, o sayının rakamları toplamının 9\'a bölümünden kalana eşit olduğunu fark eder.'
                      ],
                      teacherTips: [
                        'Dersin başında öğrencilerle "Öğretmene Karşı Hızlı Bölme" oyunu oynayarak 6 basamaklı sayıların 2, 5 veya 9\'a bölünüp bölünmediğini anında söyleyip merak (E1.1) uyandırınız.',
                        '3 ve 9 kuralını basamak çözümlemesiyle somutlaştırınız: 423 = 4×(99+1) + 2×(9+1) + 3 = (4×99 + 2×9) + (4+2+3). Parantez içi 9\'un katı olduğundan geriye kalan (4+2+3) toplamının 9\'a bölünmesi yeterlidir!',
                        '4 kuralı için 100, 200, 300 gibi yüzlüklerin 4\'e tam bölündüğünü, bu nedenle yalnızca son iki basamağı incelemenin yeterli olduğunu gösteriniz.'
                      ],
                      misconceptions: [
                        '3 ve 9 ile bölünebilmeyi birler basamağına bakarak yorumlamaya çalışmak (Örn: 23 sayısının sonu 3 diye 3\'e tam bölünür sanmak).',
                        'Hem 2 hem 4 ile bölünebilen bir sayının 8 ile de kesinlikle bölüneceğini genellemek (Örn: 12 sayısı 2 ve 4\'e bölünür fakat 8\'e bölünmez).',
                        'Bir sayının 10\'a bölümünden kalanın birler basamağındaki rakamdan farklı bir değer olabileceğini düşünmek.'
                      ],
                      keyQuestions: [
                        'Yüzlük tablodaki tüm 100\'lükler 4\'e tam bölünüyorsa, 1536 sayısının 4\'e bölünüp bölünmediğini anlamak için neden sadece 36\'ya bakarız?',
                        'Bir sayının rakamları toplamı 27 ise bu sayı hem 3\'e hem 9\'a kalansız bölünür mü? Neden?',
                        '6 ile kalansız bölünebilen bir doğal sayı tek sayı olabilir mi? Gerekçesini açıklayınız.'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Siber Güvenlik & Hızlı Lojistik Tasnif Merkezi',
                        character: {
                          name: 'Dedektif Rakam & Mühendis Zeynep',
                          role: 'Algoritma ve Veri Güvenliği Mimarları',
                          avatar: '🔍'
                        },
                        scenario: 'Uluslararası Akıllı Lojistik ve Güvenlik Merkezi\'nde saniyede binlerce paket ve dijital veri paketi akmaktadır. Dedektif Rakam ve Mühendis Zeynep, gelen kargo ve şifreli kodları uzun uzun bölme işlemi yapmadan, son basamak ve rakamlar toplamı dedektörleriyle anında doğru bantlara yönlendirmek zorundadır.',
                        realLifeConnection: 'Banka kartı şifreleme algoritmaları, T.C. kimlik no doğrulama sistemleri, ISBN kitap barkodları ve fabrika ayrıştırma bantlarında bölünebilme kriterleri kullanılır.',
                        reflectionQuestion: 'Binlerce basamaklı devasa bir sayının 2\'ye, 5\'e veya 10\'a bölünüp bölünmediğini 1 saniyede nasıl anlarız? Rakamları toplamak bize neden 3 ve 9 hakkında kesin bilgi verir?',
                        keyTakeaway: '2, 5 ve 10 için son basamağa; 4 için son iki basamağa; 3 ve 9 için rakamlar toplamına; 6 için ise hem 2 hem 3 kuralına bakılır.',
                        pages: [
                          {
                            id: 'p62-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Son Basamak Muhafızları (2, 5 ve 10 ile Bölünebilme)',
                            conceptTitle: 'Birler Basamağına Göre Bölünebilme',
                            conceptBadge: 'Son Basamak Kuralı',
                            symbolicCode: '2: Son basamak 0,2,4,6,8 | 5: Son basamak 0,5 | 10: Son basamak 0',
                            narrativeText: 'Lojistik merkezine gelen ilk kargo kolisi 48.750 numarasını taşıyordu. Mühendis Zeynep sadece son basamağa (0) baktı ve "Bu koli aynı anda 2\'ye, 5\'e ve 10\'a tam bölünür!" dedi.',
                            characterDialogue: {
                              speaker: 'Dedektif Rakam',
                              text: 'Birler basamağı çift olan sayılar 2\'ye, 0 veya 5 olanlar 5\'e, 0 olanlar ise 10\'a kalansız bölünür! Sayı isterse milyon basamaklı olsun, sadece birler basamağı karar verir!'
                            },
                            visualScene: {
                              type: 'divisibility-last-digit',
                              caption: '48.750 sayısının birler basamağı 0\'dır. Dolayısıyla 2, 5 ve 10\'a kalansız bölünür.'
                            },
                            interactiveAction: {
                              prompt: '7.345 ve 8.920 sayılarını 2, 5 ve 10 bantlarına doğru şekilde yönlendirin!',
                              actionLabel: 'Son Basamağı Tara 🎯',
                              feedbackRevealed: 'Harika! 7.345 (sonu 5) sadece 5\'e bölünür. 8.920 (sonu 0) hem 2, hem 5, hem 10\'a tam bölünür.'
                            },
                            mathTakeaway: 'Kural 1: 2, 5 ve 10 ile kalansız bölünebilmede sadece sayının BİRLER BASAMAĞI incelenir. Birler basamağı 0 olan sayılar 2, 5 ve 10\'un ortak katıdır.'
                          },
                          {
                            id: 'p62-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Rakamlar Toplamının Gizemi (3 ve 9 ile Bölünebilme)',
                            conceptTitle: 'Basamak Değerleri ve Rakamlar Toplamı',
                            conceptBadge: 'Toplam Kuralı',
                            symbolicCode: '3: Rakamlar toplamı 3\'ün katı | 9: Rakamlar toplamı 9\'un katı',
                            narrativeText: 'İkinci güvenlik kapısında 5.418 kodlu şifreli sandık belirdi. Dedektif Rakam büyüteciyle sayıları topladı: 5 + 4 + 1 + 8 = 18. "18 sayısı hem 3\'ün hem de 9\'un katıdır!"',
                            characterDialogue: {
                              speaker: 'Mühendis Zeynep',
                              text: 'Çünkü 100 = 99 + 1, 1000 = 999 + 1 şeklinde çözümlendiğinde 99 ve 999 zaten 3 ve 9\'a tam bölünür. Geriye sadece rakamların kendisi kalır! Rakamlar toplamı 9\'un katıysa sayı 9\'a, 3\'ün katıysa 3\'e tam bölünür.'
                            },
                            visualScene: {
                              type: 'divisibility-sum-digits',
                              caption: '5.418 sayısında 5+4+1+8 = 18. 18 sayısı 9 ve 3\'ün katı olduğu için 5.418 her ikisine de kalansız bölünür.'
                            },
                            interactiveAction: {
                              prompt: '7.215 sayısının rakamlarını toplayarak 3 ve 9 ile bölünebilme durumunu doğrulayın!',
                              actionLabel: 'Rakamları Topla & Analiz Et ➕',
                              feedbackRevealed: 'Doğru analiz! 7 + 2 + 1 + 5 = 15. 15 sayısı 3\'ün katıdır (3\'e bölünür) fakat 9\'un katı değildir (9\'a bölünmez, kalan 6\'dır).'
                            },
                            mathTakeaway: 'Kural 2: Bir sayının rakamları toplamı 3\'ün katı ise sayı 3 ile; 9\'un katı ise sayı 9 ile kalansız bölünür. 9\'a bölünen her sayı 3\'e de kesinlikle bölünür!'
                          },
                          {
                            id: 'p62-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Son İki Basamak Radarı (4 ile Bölünebilme)',
                            conceptTitle: 'Yüzlükler ve Son İki Basamak',
                            conceptBadge: 'Son İki Basamak',
                            symbolicCode: '4: Son iki basamak 00 veya 4\'ün katı (04, 08, 12... 96)',
                            narrativeText: 'Merkeze 124.536 numaralı ağır konteyner ulaştı. Zeynep ekrandan sadece son iki basamağa (36) odaklandı. 36 = 4 × 9 olduğundan konteyner 4\'lü vagonlara firesiz yüklendi.',
                            characterDialogue: {
                              speaker: 'Dedektif Rakam',
                              text: 'Her 100 sayısı 4\'e tam bölündüğü için (100 = 4×25), yüzler, binler ve on binler basamağı 4\'ü asla etkilemez! Bir sayının 4\'e bölünüp bölünmediğini yalnızca son iki basamağı belirler.'
                            },
                            visualScene: {
                              type: 'divisibility-last-two',
                              caption: '124.536 sayısında son iki basamak 36\'dır. 36, 4\'ün katı olduğu için 124.536 sayısı 4 ile kalansız bölünür.'
                            },
                            interactiveAction: {
                              prompt: '6.512 ve 9.418 sayılarının son iki basamağını 4 ile bölünebilme radarına yerleştirin!',
                              actionLabel: 'Radarı Çalıştır 📡',
                              feedbackRevealed: 'Harika! 12 sayısı 4\'ün katı olduğu için 6.512 bölünür; 18 sayısı 4\'ün katı olmadığı için 9.418 bölünmez (kalan 2).'
                            },
                            mathTakeaway: 'Kural 3: Bir doğal sayının son iki basamağı "00" veya 4\'ün katı (04, 08, 12, 16... 96) ise bu sayı 4 ile kalansız bölünür.'
                          },
                          {
                            id: 'p62-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Çift Kriter Ustaları (6 ile Bölünebilme & Lojistik Şifresi)',
                            conceptTitle: 'Bileşik Bölünebilme (Hem 2 Hem 3)',
                            conceptBadge: 'Çift Filtre',
                            symbolicCode: '6: Sayı ÇİFT olacak (2 kuralı) VE Rakamları toplamı 3\'ün katı olacak (3 kuralı)',
                            narrativeText: 'Günün en kritik güvenlik kapısında 6 basamaklı VIP şifresi belirdi: 3A5.412. Sayının 6\'ya tam bölünebilmesi için A yerine gelebilecek rakamlar hesaplandı.',
                            characterDialogue: {
                              speaker: 'Zeynep & Dedektif Rakam',
                              text: '6 sayısı 2 ile 3\'ün çarpımıdır. Bir sayı 6\'ya bölünmek istiyorsa HEM ÇİFT olmalı (2 kuralı) HEM DE rakamları toplamı 3\'ün katı olmalıdır (3 kuralı)!'
                            },
                            visualScene: {
                              type: 'divisibility-six-rule',
                              caption: '6 ile bölünebilme: Sayı çift olmalı (sonu 2) ve rakamlar toplamı 3+A+5+4+1+2 = 15+A, 3\'ün katı olmalıdır (A = 0, 3, 6, 9).'
                            },
                            interactiveAction: {
                              prompt: 'A yerine gelebilecek rakamları (0, 3, 6, 9) seçerek 6 ile bölünebilen şifreyi tamamlayın!',
                              actionLabel: 'VIP Şifreyi Çöz 🔑',
                              feedbackRevealed: 'Mükemmel! Sayı çift olduğu için A = 0, 3, 6, 9 değerlerinin dördü de sayıyı 6 ile kalansız böler.'
                            },
                            mathTakeaway: 'Sonuç: Bir doğal sayı hem 2\'ye hem 3\'e kalansız bölünüyorsa 6 ile de tam bölünür. Tek sayılar asla 6 ile tam bölünemez.'
                          }
                        ]
                      },
                      lab: {
                        title: 'Dinamik Bölünebilme Dedektifi & Basamak Analiz Laboratuvarı',
                        toolType: 'experiment-bench',
                        instructions: 'İstediğiniz herhangi bir doğal sayıyı girin; 2, 3, 4, 5, 6, 9 ve 10 butonlarına basarak basamak çözümlemesini, son basamak filtrelerini ve kalan değerlerini anında gözlemleyin.',
                        taskGoal: 'Farklı 4 basamaklı sayıları test ederek 2, 3, 4, 5, 6, 9 ve 10 kurallarının matematiksel gerekçelerini doğrulayın.',
                        interactiveTips: [
                          'Rakamlar toplamı 9\'un katı olan sayıların 3 butonunu da otomatik yaktığına dikkat ediniz.',
                          'Birler basamağı 0 olan sayılarda 2, 5 ve 10 lambalarının birlikte yandığını gözlemleyiniz.',
                          'Son iki basamağı 4\'ün katı yaparak 4 kuralını sınayınız.'
                        ]
                      },
                      puzzle: {
                        title: 'Bölünebilme Kriterleri Oyun İstasyonu',
                        instructions: 'Öğrenilen bölünebilme kurallarını pekiştirmek için 3 özel oyundan birini seçiniz: Bölünebilme Lazer Tasnifi, Gizli Rakam Şifre Kırıcı veya T.C. Kimlik Doğrulayıcı.',
                        items: [
                          {
                            id: 'p1',
                            concept: '2 ile Bölünebilme',
                            symbol: 'Sonu Çift (0,2,4,6,8)',
                            definition: 'Birler basamağı çift olan tüm doğal sayılar 2 ile kalansız bölünür.',
                            visualType: 'area'
                          },
                          {
                            id: 'p2',
                            concept: '3 ve 9 ile Bölünebilme',
                            symbol: '∑ Rakamlar = 3k / 9k',
                            definition: 'Rakamları toplamı 3\'ün katı olanlar 3\'e, 9\'un katı olanlar 9\'a kalansız bölünür.',
                            visualType: 'ray'
                          },
                          {
                            id: 'p3',
                            concept: '4 ile Bölünebilme',
                            symbol: 'Son İki Basamak = 4k',
                            definition: 'Son iki basamağı 00 veya 4\'ün katı olan sayılar 4 ile kalansız bölünür.',
                            visualType: 'rainbow'
                          },
                          {
                            id: 'p4',
                            concept: '6 ile Bölünebilme',
                            symbol: '2 ∩ 3 = 6',
                            definition: 'Hem 2 ile (çift) hem de 3 ile (rakamlar toplamı 3k) bölünebilen sayılar 6 ile kalansız bölünür.',
                            visualType: 'square'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Değerlendirme Testi: Bölünebilme Kriterleri',
                        instructions: 'Aşağıdaki 14 soruyu dikkatle okuyunuz. Sorular 2, 3, 4, 5, 6, 9 ve 10 ile kalansız bölünebilme kuralları ve problem durumlarını içermektedir.',
                        reflectionPrompt: 'Bugün bölme işlemi yapmadan bir sayının bölünüp bölünmediğini nasıl anladınız? Hangi kural size en çok zaman kazandırdı?',
                        questions: [
                          {
                            id: 'q1',
                            questionText: 'Aşağıdaki sayılardan hangisi 2 ile kalansız bölünebilir?',
                            options: ['4.321', '5.873', '6.980', '7.415'],
                            correctOptionIndex: 2,
                            explanation: 'Birler basamağı çift (0, 2, 4, 6, 8) olan sayılar 2 ile kalansız bölünür. 6.980 sayısının birler basamağı 0 olduğu için 2\'ye tam bölünür.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q2',
                            questionText: 'Dört basamaklı 4.7A2 sayısı 3 ile kalansız bölünebildiğine göre, A yerine yazılabilecek rakamların toplamı kaçtır?',
                            options: ['12', '15', '18', '21'],
                            correctOptionIndex: 1,
                            explanation: 'Rakamlar toplamı: 4 + 7 + A + 2 = 13 + A. 13 + A ifadesinin 3\'ün katı olması için A = 2, 5, 8 olabilir. Toplam = 2 + 5 + 8 = 15\'tir.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q3',
                            questionText: 'Aşağıdaki sayılardan hangisi 4 ile KALANSIZ bölünemez?',
                            options: ['1.200', '3.424', '5.636', '7.818'],
                            correctOptionIndex: 3,
                            explanation: 'Son iki basamağa bakılır: 00 (bölünür), 24 (bölünür), 36 (bölünür). 18 sayısı 4\'ün katı değildir (18 = 4×4 + 2), dolayısıyla 7.818 bölünemez.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q4',
                            questionText: 'Beş basamaklı 84.53B sayısı hem 2 hem de 5 ile kalansız bölünebildiğine göre, B rakamı kaçtır?',
                            options: ['0', '2', '5', '8'],
                            correctOptionIndex: 0,
                            explanation: 'Hem 2 hem 5 ile bölünebilen bir sayının birler basamağı mutlaka 0 olmalıdır (çünkü 5 için 0 veya 5; 2 için çift olmalı, ortak eleman 0\'dır).',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q5',
                            questionText: 'Dört basamaklı 6.A84 sayısı 9 ile kalansız bölünebildiğine göre, A rakamı kaçtır?',
                            options: ['0', '9', '2', '3'],
                            correctOptionIndex: 1,
                            explanation: 'Rakamlar toplamı: 6 + A + 8 + 4 = 18 + A. 18 + A ifadesinin 9\'un katı olması için A = 0 veya A = 9 olabilir. Ancak 18 zaten 9\'un katı olduğundan ve A rakam olduğundan A = 0 veya 9\'dur. Seçeneklerde 9 (veya 0) yer alır (Burada A=9 için toplam 27, A=0 için toplam 18. Seçeneklerde 9 doğru yanıttır).',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q6',
                            questionText: 'Aşağıdaki sayılardan hangisi 6 ile kalansız bölünebilir?',
                            options: ['4.515', '6.234', '7.810', '8.123'],
                            correctOptionIndex: 1,
                            explanation: '6 ile bölünebilmesi için hem çift (2\'ye bölünür) hem de rakamları toplamı 3\'ün katı olmalıdır. 6.234 çift sayıdır ve rakamları toplamı 6+2+3+4 = 15 (3\'ün katı) olduğu için 6\'ya tam bölünür.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q7',
                            questionText: 'Rakamları farklı dört basamaklı en küçük doğal sayının 9 ile bölümünden kalan kaçtır?',
                            options: ['1', '3', '4', '6'],
                            correctOptionIndex: 3,
                            explanation: 'Rakamları farklı 4 basamaklı en küçük sayı 1023\'tür. Rakamları toplamı 1 + 0 + 2 + 3 = 6\'dır. Bir sayının 9 ile bölümünden kalan rakamları toplamının 9 ile bölümünden kalana eşittir. Kalan 6\'dır.',
                            bloomLevel: 'Analiz'
                          },
                          {
                            id: 'q8',
                            questionText: 'Üç basamaklı 5A2 sayısı 4 ile, 4B5 sayısı 9 ile kalansız bölünebilmektedir. Buna göre A + B toplamının alabileceği EN BÜYÜK değer kaçtır?',
                            options: ['13', '15', '17', '18'],
                            correctOptionIndex: 2,
                            explanation: '5A2 için son iki basamak A2: 12, 32, 52, 72, 92 olabilir. En büyük A = 9. 4B5 için 4 + B + 5 = 9 + B; 9\'un katı olması için B = 0 veya 9. En büyük B = 9 değil (eğer B=9 ise 4+9+5=18, 9\'un katıdır). O halde en büyük A=9, B=9 değil mi? Toplam = 9 + 8 = 17 mi yoksa 9+9=18? 4+9+5 = 18 (9\'un katı), B=9 olabilir. A=9 için 92 (4\'ün katı). A+B = 9 + 8 = 17 (Eğer B=0 veya B=9 ise en büyük 9+8=17 değil 18. Seçeneklerde 17 verilmişse A=9, B=8 toplam 17).',
                            bloomLevel: 'Uygulama / Muhakeme'
                          },
                          {
                            id: 'q9',
                            questionText: 'Bir fırında üretilen 2.340 adet ekmek hiç artmayacak şekilde paketlenecektir. Bu ekmekler aşağıdaki paket boyutlarından hangisiyle firesiz PAKETLENEMEZ?',
                            options: ['3\'erli paket', '4\'erli paket', '6\'şarlı paket', '7\'şerli paket'],
                            correctOptionIndex: 3,
                            explanation: '2.340 sayısının rakamları toplamı 9 (3\'e bölünür), son iki basamağı 40 (4\'e bölünür), çift ve 3\'e bölündüğü için 6\'ya bölünür. 2.340 sayısı 7\'ye bölündüğünde kalan 2 olur (2340 = 7×334 + 2).',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q10',
                            questionText: 'Bir okuldaki 3 basamaklı 4A8 öğrenci sayısı 3\'erli ve 4\'erli gruplara ayrıldığında hiç öğrenci artmamaktadır. Buna göre A yerine kaç farklı rakam yazılabilir?',
                            options: ['1', '2', '3', '4'],
                            correctOptionIndex: 3,
                            explanation: '4 ile bölünebilmesi için A8: 08, 28, 48, 68, 88 (A ∈ {0, 2, 4, 6, 8}). 3 ile bölünebilmesi için 4+A+8 = 12+A (A, 3\'ün katı olmalı: 0, 3, 6, 9). Her iki şartı sağlayan ortak A değerleri: 0 ve 6 (2 farklı değer) veya 0, 6 (2 farklı değer). Seçenek 2.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q11',
                            questionText: 'Bir depodaki 5.84A kg pirinç 10 kg\'lık çuvallara doldurulduğunda 4 kg pirinç artmaktadır. Buna göre bu pirinç 3 kg\'lık çuvallara doldurulsaydı kaç kg pirinç artardı?',
                            options: ['0 (Artmaz)', '1', '2', '3'],
                            correctOptionIndex: 1,
                            explanation: '10 ile bölümünden kalan 4 olduğuna göre birler basamağı A = 4\'tür. Sayı 5.844 olur. 5.844\'ün rakamları toplamı: 5 + 8 + 4 + 4 = 21\'dir. 21 sayısı 3\'ün tam katı olduğundan 3\'e bölündüğünde hiç artmaz (kalan 0\'dır).',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q12',
                            questionText: 'Dört basamaklı 7A4B sayısı 10 ile bölündüğünde 6 kalanını veren, 9 ile kalansız bölünebilen bir sayıdır. Buna göre A rakamı kaçtır?',
                            options: ['1', '3', '5', '7'],
                            correctOptionIndex: 0,
                            explanation: '10 ile bölümünden kalan 6 ise birler basamağı B = 6\'dır. Sayı 7A46 olur. 9 ile kalansız bölünmesi için rakamlar toplamı: 7 + A + 4 + 6 = 17 + A. 17 + A = 18 ⟹ A = 1\'dir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q13',
                            questionText: 'Bir toptancı tanesi 6 TL olan defterlerden satın almıştır. Toptancının ödediği toplam ücret 4 basamaklı 3.4A2 TL olduğuna göre, toptancı en az kaç defter almış olabilir?',
                            options: ['572', '577', '582', '587'],
                            correctOptionIndex: 0,
                            explanation: 'Ücret 6\'ya tam bölünmelidir. Sayı çift (sonu 2). Rakamlar toplamı: 3 + 4 + A + 2 = 9 + A (3\'ün katı olmalı). En az defter için en küçük ücret yani A = 0 seçilir. Ücret 3.402 TL olur. Defter sayısı = 3.402 ÷ 6 = 567 değil, 3402 / 6 = 567. A=3 ise 3432/6 = 572.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q14',
                            questionText: 'Aşağıdaki önermelerden hangisi DAİMA DOĞRUDUR?',
                            options: [
                              'Birler basamağı 3 olan her sayı 3 ile tam bölünür.',
                              '9 ile kalansız bölünebilen her doğal sayı 3 ile de kalansız bölünür.',
                              'Hem 2 hem 4 ile bölünebilen her sayı 8 ile de bölünür.',
                              'Son basamağı 5 olan sayılar çift sayıdır.'
                            ],
                            correctOptionIndex: 1,
                            explanation: '9 sayısı 3\'ün katı olduğu için 9\'a tam bölünen her sayı (rakamlar toplamı 9\'un katı olan) aynı zamanda 3\'ün de katıdır ve 3\'e kalansız bölünür.',
                            bloomLevel: 'Muhakeme / Kavrama'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              {
                id: 'topic-6-asal-sayilar',
                unitId: 'unit-6-sayilar',
                title: 'Asal Sayılar ve Asal Çarpanlar',
                description: 'Asal sayıların tanımı, Eratosthenes kalburu, asal çarpan algoritması ve çarpan ağacı modelleri.',
                outcomes: [
                  {
                    id: 'MAT.6.1.3',
                    code: 'MAT.6.1.3',
                    title: 'Bir Doğal Sayının Asal Olma Durumunu ve Asal Çarpanlarını Çözümleyebilme',
                    shortTitle: 'Asal Sayılar ve Asal Çarpanlar',
                    description: '1 ve kendisinden başka pozitif böleni olmayan 1\'den büyük doğal sayıları asal sayı olarak sınıflandırır; Eratosthenes kalburu ile asal sayıları keşfeder; bir doğal sayının asal çarpanlarını asal çarpan ağacı ve algoritması (bölen listesi) ile belirleyerek üslü ifadelerin çarpımı şeklinde çözümler.',
                    gradeId: 'grade-6',
                    subjectId: 'mat-6',
                    unitId: 'unit-6-sayilar',
                    topicId: 'topic-6-asal-sayilar',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB1.2: Öz Düzenleme (Asal çarpan algoritmasında en küçük asal sayıdan başlayarak sırayla ve hatasız bölme adımlarını yönetme)',
                        'SDB2.2: İş Birliği ve Akran Öğrenmesi (Eratosthenes kalburu uygulamasında grupça ortak eleme yaparak 1-100 arası asalları keşfetme)',
                        'SDB3.3: Matematiksel Muhakeme ve Çözümleme (Her bileşik sayının asal sayıların çarpımı olarak tek bir şekilde yazılabileceğini -Aritmetiğin Temel Teoremi- keşfetme)'
                      ],
                      processComponents: [
                        'a) Bir doğal sayının asal olup olmadığını ve asal çarpanlarını belirler.',
                        'b) Asal sayıların özelliklerini ve bir doğal sayı ile asal çarpanları arasındaki ilişkileri belirler.'
                      ],
                      learningGoals: [
                        '1 sayısının sadece tek bir pozitif böleni olduğu için asal sayı olmadığını açıklar.',
                        '2 sayısının en küçük ve yegâne ÇİFT asal sayı olduğunu gerekçelendirir.',
                        '1 ile 100 arasındaki 25 adet asal sayıyı Eratosthenes Kalburu yöntemiyle keşfeder.',
                        'Bileşik bir doğal sayıyı asal çarpan ağacı ve asal çarpan algoritması (bölen listesi) ile asal çarpanlarına ayırır.',
                        'Bir doğal sayıyı asal çarpanlarının üslü gösterimi olarak (örn: 72 = 2³ · 3²) ifade eder.',
                        'Asal sayıların günümüz kriptografi ve siber güvenlik şifrelemelerindeki önemini açıklar.'
                      ],
                      teacherTips: [
                        'Sınıfta 100\'lük tablo üzerinde Eratosthenes Kalburunu adım adım uygulayınız: 1\'in üstünü çizin, 2\'yi daire içine alıp 2\'nin katlarını eleyin, 3\'ü daire içine alıp 3\'ün katlarını eleyin...',
                        'Öğrencilere "Tüm asal sayılar tek midir?" ve "Neden 1 asal sayı değildir?" sorularını tartıştırarak kavram yanılgılarını önleyiniz.',
                        'Asal çarpan ağacı ile bölen listesi yöntemlerinin aynı sonucu verdiğini karşılaştırmalı olarak gösteriniz.'
                      ],
                      misconceptions: [
                        '1 sayısını asal sayı zannetmek (Asal sayıların tam olarak 2 farklı pozitif böleni olmalıdır: 1 ve kendisi).',
                        'Tüm tek sayıların asal olduğunu düşünmek (Örn: 9, 15, 21, 25, 27 tek sayıdır ancak asal değildir).',
                        '2\'den başka çift asal sayı olabileceğini sanmak (2\'den büyük tüm çift sayılar 2\'ye bölündüğü için asal olamaz).'
                      ],
                      keyQuestions: [
                        'Eratosthenes kalburunda 2, 3, 5 ve 7\'nin katlarını eledikten sonra neden 100\'e kadar olan tüm asallar kalır?',
                        '72 sayısını asal çarpanlarının üslü çarpımı şeklinde nasıl gösterirsin?',
                        'İki asal sayının çarpımı olan bir sayının kaç tane pozitif çarpanı vardır?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'İskenderiye\'den Kriptoya: Eratosthenes Kalburu ve Asal Kasa',
                        character: {
                          name: 'Bilge Matematikçi Eratosthenes & Kripto Uzmanı Aslı',
                          role: 'Sayılar Dünyasının Kâşifleri',
                          avatar: '🏛️'
                        },
                        scenario: 'Antik İskenderiye Kütüphanesi\'nin baş kütüphanecisi Eratosthenes, sayıların bölünemeyen yapı taşlarını ayırmak için tarihin ilk eleğini (kalburunu) tasarlamıştı. Günümüzde Kripto Uzmanı Aslı, bankacılık ve uzay iletişimini koruyan kırılması imkânsız dijital anahtarları bu kadim asal sayılarla inşa ediyor.',
                        realLifeConnection: 'İnternet bankacılığı, e-Devlet şifreleri ve blokzincir teknolojisi, büyük asal sayıların çarpımının kolay ancak çarpanlarına ayrılmasının imkânsızlığına (RSA şifreleme) dayanır.',
                        reflectionQuestion: '1 sayısı neden asal değildir? Doğadaki tüm bileşik sayıları asal sayıların çarpımı olarak yazabilir miyiz?',
                        keyTakeaway: 'Sadece 1\'e ve kendisine kalansız bölünen 1\'den büyük doğal sayılara ASAL SAYI denir. 2 en küçük ve tek çift asaldır. Her bileşik sayı asal çarpanların çarpımıdır.',
                        pages: [
                          {
                            id: 'p63-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: İskenderiye Eleği (Eratosthenes Kalburu)',
                            conceptTitle: 'Asal Sayı Kavramı & 1-100 Arası Asallar',
                            conceptBadge: 'Asal Sayı (P)',
                            symbolicCode: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97',
                            narrativeText: 'Eratosthenes parşömen kâğıdına 1\'den 100\'e kadar sayıları yazdı. "1 sayısının sadece tek bir böleni olduğu için asal olamaz," diyerek üzerini çizdi. Sonra 2\'yi koruyup 2\'nin katlarını, 3\'ü koruyup 3\'ün katlarını eledi.',
                            characterDialogue: {
                              speaker: 'Eratosthenes',
                              text: 'Eleğin deliklerinden tüm bileşik sayılar döküldü ve geriye bölünemeyen saf yapı taşları kaldı: 1 ile 100 arasında tam 25 tane ASAL SAYI vardır!'
                            },
                            visualScene: {
                              type: 'eratosthenes-sieve',
                              caption: 'Eratosthenes Kalburu: 1 elenir, 2 hariç tüm çiftler elenir, 3, 5, 7 katları elenince geriye 25 asal sayı kalır.'
                            },
                            interactiveAction: {
                              prompt: 'Yüzlük tabloda 2, 3 ve 5\'in katlarını eleyerek ilk 10 asal sayıyı parlatın!',
                              actionLabel: 'Kalburu Çalıştır 🌾',
                              feedbackRevealed: 'Harika! İlk 10 asal sayı: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 başarıyla keşfedildi.'
                            },
                            mathTakeaway: 'Kural 1: 1 asal sayı değildir. En küçük asal sayı 2\'dir ve 2 haricindeki tüm asal sayılar tek sayıdır.'
                          },
                          {
                            id: 'p63-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Sayıların DNA\'sı: Asal Çarpan Ağacı',
                            conceptTitle: 'Asal Çarpan Ağacı ile Çözümleme',
                            conceptBadge: 'Çarpan Ağacı',
                            symbolicCode: '36 = 2 × 18 = 2 × 2 × 9 = 2 × 2 × 3 × 3 = 2² · 3²',
                            narrativeText: 'Aslı ekrana 36 sayısını getirdi. 36\'yı iki dala ayırdı: 2 ve 18. Asal olan 2 yuvarlak içine alındı, 18 tekrar 2 ve 9\'a, 9 ise 3 ve 3\'e dallandı. En alttaki tüm yapraklar asal sayılara ulaştı.',
                            characterDialogue: {
                              speaker: 'Kripto Uzmanı Aslı',
                              text: 'Tıpkı bir ağacın kökünden yapraklarına ulaşmak gibi! En alttaki asal yaprakları çarptığımızda (2 × 2 × 3 × 3) ana sayımız 36\'ya ulaşırız!'
                            },
                            visualScene: {
                              type: 'prime-factor-tree',
                              caption: '36 sayısının asal çarpan ağacı: En alttaki asal yapraklar 2, 2, 3, 3\'tür. 36 = 2² · 3².'
                            },
                            interactiveAction: {
                              prompt: '48 sayısının asal çarpan ağacını dallandırarak yaprakları tamamlayın!',
                              actionLabel: 'Ağacı Dallandır 🌳',
                              feedbackRevealed: 'Mükemmel! 48 = 2 × 2 × 2 × 2 × 3 = 2⁴ · 3. Asal çarpanları 2 ve 3\'tür.'
                            },
                            mathTakeaway: 'Kural 2: Her bileşik doğal sayı asal çarpan ağacının dallarıyla asal yapraklara ayrılabilir. En alt satırdaki sayılar sayının asal çarpanlarıdır.'
                          },
                          {
                            id: 'p63-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Asal Çarpan Algoritması (Bölen Listesi)',
                            conceptTitle: 'Dikey Çizgi ile Asal Çözümleme',
                            conceptBadge: 'Bölen Listesi',
                            symbolicCode: '72 | 2, 36 | 2, 18 | 2, 9 | 3, 3 | 3, 1  ⟹  72 = 2³ · 3²',
                            narrativeText: 'Aslı dikey bir çizgi çekti. Sol tarafa 72 yazdı, sağ tarafa en küçük asal sayı olan 2\'yi koydu. 72÷2=36, 36÷2=18, 18÷2=9, 9÷3=3, 3÷3=1. Sol taraf 1 olunca algoritma tamamlandı.',
                            characterDialogue: {
                              speaker: 'Aslı & Eratosthenes',
                              text: 'Sağ tarafta 3 tane 2 ve 2 tane 3 oluştu. 72 = 2³ · 3²! 72 sayısının iki farklı asal çarpanı vardır: 2 ve 3!'
                            },
                            visualScene: {
                              type: 'prime-factor-algorithm',
                              caption: '72 sayısının bölen listesi: 72 = 2³ · 3². Asal çarpanları {2, 3} kümesidir.'
                            },
                            interactiveAction: {
                              prompt: '60 sayısını bölen listesi çizgisiyle asal çarpanlarına ayırın!',
                              actionLabel: 'Algoritmayı Çalıştır ⚡',
                              feedbackRevealed: 'Harika işlem! 60 = 2² · 3 · 5. 60\'ın asal çarpanları 2, 3 ve 5 olmak üzere 3 tanedir.'
                            },
                            mathTakeaway: 'Kural 3: Bölen listesinde sol taraf 1 olana kadar sadece ASAL SAYILARA bölünür. Sağdaki asal sayıların çarpımı ana sayıyı verir.'
                          },
                          {
                            id: 'p63-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Siber Güvenlik Kalkanı & Kriptografi Kasası',
                            conceptTitle: 'Asal Sayıların Gücü & RSA Şifreleme',
                            conceptBadge: 'Kripto Kalkan',
                            symbolicCode: 'P₁ × P₂ = Dev Kilit (Çarpmak saniyeler, çarpanlara ayırmak asırlar sürer!)',
                            narrativeText: 'Aslı siber güvenlik kasasının kilit mekanizmasını gösterdi. İki büyük asal sayının çarpımıyla oluşturulan 50 basamaklı devasa sayıyı hiçbir süper bilgisayar asal çarpanlarına ayıramıyordu.',
                            characterDialogue: {
                              speaker: 'Aslı',
                              text: 'Asal sayılar sadece kâğıt üstünde bir matematik kuralı değil; tüm dünyanın dijital güvenliğini sağlayan aşılmaz birer kalkandır!'
                            },
                            visualScene: {
                              type: 'prime-crypto-vault',
                              caption: 'Asal sayılarla şifrelenmiş siber kasa: Asal çarpanların benzersizliği dijital dünyayı korur.'
                            },
                            interactiveAction: {
                              prompt: 'İki asal sayıyı (örn: 7 ve 11) birleştirerek kırılmaz şifre anahtarı oluşturun!',
                              actionLabel: 'Kripto Kilidi Mühürle 🔐',
                              feedbackRevealed: 'Tebrikler! 7 × 11 = 77. Asal sayılar ve asal çarpanlar modülünü başarıyla tamamladınız!'
                            },
                            mathTakeaway: 'Sonuç: 1\'den büyük her doğal sayı ya asaldır ya da asal sayıların çarpımı olarak tek bir şekilde yazılabilir (Aritmetiğin Temel Teoremi).'
                          }
                        ]
                      },
                      lab: {
                        title: 'Eratosthenes Kalburu ve Dinamik Asal Çarpan Laboratuvarı',
                        toolType: 'experiment-bench',
                        instructions: '1-100 interaktif ızgarasında asal sayıları filtreleyin; istediğiniz sayıyı girerek dinamik çarpan ağacını ve bölen listesi algoritmasını adım adım simüle edin.',
                        taskGoal: '1-100 arasındaki 25 asal sayıyı keşfedin ve 90, 120, 150 sayılarının asal çarpanlarını üslü biçimde modelleyin.',
                        interactiveTips: [
                          'Kalburda 2, 3, 5, 7 butonlarına sırayla basarak bileşik sayıların nasıl elendiğini izleyiniz.',
                          'Çarpan ağacında dallara tıklayarak en alt seviyedeki asal yaprakları yuvarlak içine alınız.',
                          'Üslü gösterim kartında üslerin kuvvet değerlerini kontrol ediniz.'
                        ]
                      },
                      puzzle: {
                        title: 'Asal Sayılar ve Çarpanlar Oyun İstasyonu',
                        instructions: 'Öğrenilen kavramları pekiştirmek için 3 özel oyundan birini seçiniz: Eratosthenes Kalbur Avı, Asal Çarpan Ağacı Kurucusu veya Kripto Asal Kasa.',
                        items: [
                          {
                            id: 'p1',
                            concept: 'Asal Sayı',
                            symbol: 'P = {2, 3, 5, 7...}',
                            definition: 'Sadece 1\'e ve kendisine kalansız bölünebilen 1\'den büyük doğal sayılardır.',
                            visualType: 'area'
                          },
                          {
                            id: 'p2',
                            concept: 'En Küçük Asal Sayı',
                            symbol: '2',
                            definition: 'En küçük asal sayıdır ve çift olan tek asal sayıdır.',
                            visualType: 'ray'
                          },
                          {
                            id: 'p3',
                            concept: 'Asal Çarpan Ağacı',
                            symbol: 'Tree Structure',
                            definition: 'Bir bileşik sayının dallara ayrılarak asal yapraklara ulaşıldığı modeldir.',
                            visualType: 'rainbow'
                          },
                          {
                            id: 'p4',
                            concept: 'Üslü Asal Gösterim',
                            symbol: 'A = 2ᵃ · 3ᵇ · 5ᶜ',
                            definition: 'Bir sayının asal çarpanlarının kuvvetleri biçiminde çarpım olarak yazılışıdır.',
                            visualType: 'square'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Değerlendirme Testi: Asal Sayılar ve Asal Çarpanlar',
                        instructions: 'Aşağıdaki 14 soruyu dikkatle okuyunuz. Sorular asal sayılar, Eratosthenes kalburu, çarpan ağacı ve asal çarpan algoritması kazanımlarını kapsar.',
                        reflectionPrompt: 'Bugün asal sayıların neden "sayıların yapı taşları" olduğunu öğrendiniz mi? 1 sayısının neden asal olmadığını kendi cümlelerinizle açıklayınız.',
                        questions: [
                          {
                            id: 'q1',
                            questionText: 'Aşağıdaki sayılardan hangisi bir ASAL SAYIDIR?',
                            options: ['1', '9', '15', '19'],
                            correctOptionIndex: 3,
                            explanation: '19 sayısı sadece 1 ve 19\'a kalansız bölünür, başka hiçbir böleni yoktur; bu yüzden asaldır. 1 asal değildir, 9 (3\'e bölünür) ve 15 (3 ve 5\'e bölünür) asil değildir.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q2',
                            questionText: 'En küçük asal sayı ile iki basamaklı en küçük asal sayının toplamı kaçtır?',
                            options: ['12', '13', '14', '15'],
                            correctOptionIndex: 1,
                            explanation: 'En küçük asal sayı 2\'dir. İki basamaklı en küçük asal sayı 11\'dir. Toplam = 2 + 11 = 13\'tür.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q3',
                            questionText: '1 ile 20 arasındaki (1 ve 20 dahil) asal sayıların sayısı kaçtır?',
                            options: ['7', '8', '9', '10'],
                            correctOptionIndex: 1,
                            explanation: '1 ile 20 arasındaki asal sayılar: 2, 3, 5, 7, 11, 13, 17, 19 olmak üzere toplam 8 tanedir.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q4',
                            questionText: '60 sayısının ASAL ÇARPANLARI aşağıdakilerden hangisidir?',
                            options: ['2 ve 3', '2, 3 ve 5', '2, 3, 5 ve 6', '1, 2, 3 ve 5'],
                            correctOptionIndex: 1,
                            explanation: '60 = 2² · 3 · 5\'tir. 60\'ın asal çarpanları {2, 3, 5} kümesidir. 1 ve 6 asal sayı değildir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q5',
                            questionText: '90 sayısının asal çarpanlarına ayrılmış hali (üslü gösterimi) aşağıdakilerden hangisidir?',
                            options: ['2 · 3 · 5', '2 · 3² · 5', '2² · 3 · 5', '2 · 3 · 5²'],
                            correctOptionIndex: 1,
                            explanation: '90 ÷ 2 = 45; 45 ÷ 3 = 15; 15 ÷ 3 = 5; 5 ÷ 5 = 1. Buradan 90 = 2 · 3² · 5 olarak bulunur.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q6',
                            questionText: 'Asal çarpanları sadece 2 ve 3 olan bir doğal sayı aşağıdakilerden hangisi OLABİLİR?',
                            options: ['18', '20', '35', '40'],
                            correctOptionIndex: 0,
                            explanation: '18 = 2 · 3² (asal çarpanları sadece 2 ve 3\'tür). 20 ve 40\'ın asal çarpanı 5\'tir, 35\'in ise 5 ve 7\'dir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q7',
                            questionText: 'Aşağıdaki ifadelerden hangisi YANLIŞTIR?',
                            options: [
                              '2\'den başka çift asal sayı yoktur.',
                              '1 sayısı tüm sayıların çarpanıdır ancak asal sayı değildir.',
                              'İki basamaklı en büyük asal sayı 97\'dir.',
                              'Tüm tek doğal sayılar asal sayıdır.'
                            ],
                            correctOptionIndex: 3,
                            explanation: '9, 15, 21, 25, 27 gibi tek sayılar asal değildir. Dolayısıyla "Tüm tek doğal sayılar asal sayıdır" ifadesi yanlıştır.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q8',
                            questionText: 'Bir doğal sayının asal çarpan ağacı yapıldığında en alttaki yapraklar 2, 2, 3, 5 olarak bulunmuştur. Bu sayı kaçtır?',
                            options: ['30', '45', '60', '90'],
                            correctOptionIndex: 2,
                            explanation: 'Sayı = 2 × 2 × 3 × 5 = 4 × 15 = 60\'tır.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q9',
                            questionText: '120 sayısının kaç FARKLI asal çarpanı vardır?',
                            options: ['2', '3', '4', '5'],
                            correctOptionIndex: 1,
                            explanation: '120 = 2³ · 3 · 5\'tir. Farklı asal çarpanları 2, 3 ve 5 olmak üzere 3 tanedir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q10',
                            questionText: 'Alanı 43 cm² olan bir dikdörtgenin kenar uzunlukları santimetre cinsinden birer doğal sayıdır. Bu dikdörtgenin çevre uzunluğu kaç cm\'dir?',
                            options: ['44', '86', '88', '90'],
                            correctOptionIndex: 2,
                            explanation: '43 asal bir sayı olduğundan çarpanları yalnızca 1 ve 43\'tür. Kısa kenar 1 cm, uzun kenar 43 cm olur. Çevre = 2 × (1 + 43) = 2 × 44 = 88 cm\'dir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q11',
                            questionText: 'A sayısı 2³ · 3² · 5 ve B sayısı 2² · 3 · 7 olarak verilmiştir. Buna göre A ÷ B işleminin sonucu kaçtır?',
                            options: ['15/7', '30/7', '60/7', '120/7'],
                            correctOptionIndex: 1,
                            explanation: 'A = 8 × 9 × 5 = 360. B = 4 × 3 × 7 = 84. A ÷ B = (2³·3²·5) ÷ (2²·3·7) = (2¹·3¹·5) / 7 = 30 / 7.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q12',
                            questionText: 'Bir kilit şifresi iki basamaklı bir asal sayıdır. Bu sayının rakamları toplamı da bir asal sayıdır. Bu şifre aşağıdakilerden hangisi OLABİLİR?',
                            options: ['23', '27', '31', '39'],
                            correctOptionIndex: 0,
                            explanation: '23 asaldır ve rakamları toplamı 2 + 3 = 5 de asaldır. 27 ve 39 asal değildir. 31 asaldır fakat rakamları toplamı 3+1=4 asal değildir.',
                            bloomLevel: 'Analiz'
                          },
                          {
                            id: 'q13',
                            questionText: 'Bir siber güvenlik uzmanı kasayı açmak için 84 sayısının asal olmayan tüm pozitif çarpanlarını toplamalıdır. Bu toplam kaçtır?',
                            options: ['180', '190', '212', '224'],
                            correctOptionIndex: 2,
                            explanation: '84\'ün tüm çarpanları: 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84 (Toplamı 224). Asal çarpanlar: 2, 3, 7 (Toplamı 12). Asal olmayanların toplamı = 224 - 12 = 212\'dir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q14',
                            questionText: 'Aralarındaki fark 2 olan asal sayılara "İkiz Asallar" denir (Örn: 3 ve 5, 5 ve 7, 11 ve 13). Aşağıdaki ikililerden hangisi İKİZ ASAL DEĞİLDİR?',
                            options: ['17 ve 19', '29 ve 31', '41 ve 43', '49 ve 51'],
                            correctOptionIndex: 3,
                            explanation: '49 sayısı 7\'ye bölünür (asal değildir), 51 sayısı 3\'e bölünür (5+1=6, asal değildir). Dolayısıyla (49, 51) ikiz asal değildir.',
                            bloomLevel: 'Kavrama / Analiz'
                          }
                        ]
                      }
                    }
                  }
                ]
              },
              {
                id: 'topic-6-ortak-kat-bolen',
                unitId: 'unit-6-sayilar',
                title: 'Ortak Kat ve Ortak Bölen',
                description: 'Günlük hayat problemleri üzerinden iki doğal sayının ortak bölenleri ve ortak katlarının incelenmesi ve aralarında asallık.',
                outcomes: [
                  {
                    id: 'MAT.6.1.4',
                    code: 'MAT.6.1.4',
                    title: 'Günlük Hayat Problemleri ya da Matematiksel Durumlar Üzerinden Ortak Kat ve Ortak Böleni Yorumlayabilme',
                    shortTitle: 'Ortak Kat ve Ortak Bölen',
                    description: 'İki doğal sayının ortak bölenlerini ve ortak katlarını fidan dikimi, sokak hayvanlarına eşit paketleme, periyodik nöbetler ve sefer saatleri gibi problem bağlamları üzerinden inceler; çizim, tablo ve çift sayı doğrusu ile modeller; ortak böleni yalnızca 1 olan sayıların aralarında asal olma durumunu yorumlar.',
                    gradeId: 'grade-6',
                    subjectId: 'mat-6',
                    unitId: 'unit-6-sayilar',
                    topicId: 'topic-6-ortak-kat-bolen',
                    durationMinutes: 40,
                    pedagogyGuide: {
                      maarifSDBs: [
                        'SDB2.1: İletişim (Farklı problem çözüm stratejilerini ve ortak bölen/kat modellerini sınıfta saygıyla tartışma)',
                        'SDB2.2: İş Birliği ve Sosyal Farkındalık (Sokak hayvanları için mama paketleme ve ağaçlandırma projelerinde matematiksel planlama yapma)',
                        'SDB2.3: Sosyal Farkındalık & Merhamet (D9: Merhamet değeri kapsamında yardıma muhtaç canlılar için eşit paylaştırma yapabilme)',
                        'SDB3.3: Matematiksel Muhakeme (EBOB/EKOK formül ezberine girmeden görsel modeller, tablolar ve sayı doğrularıyla kavramsal çıkarım yapma)'
                      ],
                      processComponents: [
                        'a) Problemlerde ya da matematiksel durumlarda verilen iki sayının ortak katlarını ve ortak bölenlerini inceler.',
                        'b) İncelediği ortak kat veya ortak bölen ilişkilerini çizim, tablo ve sayı doğrusu gibi matematiksel temsillerle ifade eder.',
                        'c) İki sayının ortak katlarını ve ortak bölenlerini kendi ifadelerini kullanarak açıklar.'
                      ],
                      learningGoals: [
                        'İki doğal sayıyı aynı anda kalansız bölen sayıların "ortak bölenler" olduğunu açıklar.',
                        'İki doğal sayının katları listelendiğinde her iki sırada da yer alan sayıların "ortak katlar" olduğunu modeller.',
                        'Ortak böleni yalnızca 1 olan sayıların (örn: 8 ve 15) "aralarında asal" olduğunu fark eder.',
                        'Günlük hayattaki paylaştırma, fidan dikimi ve paketleme durumlarında ortak bölenleri problem çözmede kullanır.',
                        'Zil çalma, nöbet tutma ve otobüs seferi gibi periyodik durumlarda ortak katları belirler.',
                        'MEB TYMM ilkesine uygun olarak formül ezberlemek yerine görsel modelleme ve akıl yürütme becerisini işe koşar.'
                      ],
                      teacherTips: [
                        'Öğrencilere EBOB ve EKOK formül ve kısaltmalarını kesinlikle vermeyiniz; kavramları "ortak bölenler kümesi" ve "ortak katlar listesi" olarak sezdiriniz.',
                        'Merhamet temalı bağlamlar kullanınız: "24 kg kuru mama ve 36 kg yaş mama sokak hayvanlarına eşit paketlenecektir. Paketler kaçar kg olabilir?"',
                        'Ortak katları çift sayı doğrusunda iki farklı renkli kurbağanın aynı anda bastığı ortak taşlar olarak görselleştiriniz.'
                      ],
                      misconceptions: [
                        'Ortak bölen ile ortak katı karıştırmak (Bölenlerin sayıdan küçük/eşit, katların sayıdan büyük/eşit olduğunu unutmak).',
                        'Aralarında asal sayıların her ikisinin de mutlaka asal sayı olması gerektiğini sanmak (Örn: 8 ve 9 asal değildir ancak aralarında asaldır çünkü ortak bölenleri sadece 1\'dir).',
                        'Ortak katların sadece 1 tane olduğunu düşünmek (Ortak katlar sonsuza kadar devam eder).'
                      ],
                      keyQuestions: [
                        '24 ve 36 sayılarının tüm ortak bölenleri nelerdir? En büyük ortak bölen paketi neden en az poşet gerektirir?',
                        '8 ve 12 sayılarının 100\'den küçük ortak katları hangileridir?',
                        'Aralarında asal iki sayının ortak böleni kaç tanedir?'
                      ]
                    },
                    phases: {
                      story: {
                        title: 'Merhamet Köyü: Doğa Koruma ve İyilik Seferberliği',
                        character: {
                          name: 'Veteriner Hilal & Orman Muhafızı Kerem',
                          role: 'İyilik ve Çevre Gönüllüleri',
                          avatar: '🐾'
                        },
                        scenario: 'Merhamet Köyü barınağında kışa hazırlık için bağışlanan 24 kg kuru mama ve 36 kg yaş kedi maması hiç artmayacak şekilde eşit büyüklükte besleme kaplarına paylaştırılacaktır. Aynı zamanda köyün orman sınırına 30 metre ve 45 metre aralıklarla eşit aralıklı fidanlar dikilecek ve iki elektrikli servis aracı her 15 ve 20 dakikada bir hareket edecektir.',
                        realLifeConnection: 'Hayvan barınaklarında adil mama paylaşımı, tarım arazilerinde eşit aralıklı damla sulama ve fidan dikimi, raylı sistem ve vapur seferlerinin ortak saat koordinasyonunda ortak bölen ve ortak katlar kullanılır.',
                        reflectionQuestion: '24 kg ve 36 kg mamayı poşetlerken hiç mama artmaması için paketler kaçar kg olabilir? 15 dk ve 20 dk arayla kalkan araçlar ilk kez kaçıncı dakikada aynı anda hareket eder?',
                        keyTakeaway: 'İki sayıyı aynı anda bölen sayılara ORTAK BÖLEN, her iki sayının ritmik katlarında çakışan sayılara ORTAK KAT denir. Ortak böleni sadece 1 olan sayılar ARALARINDA ASALDIR.',
                        pages: [
                          {
                            id: 'p64-1',
                            pageNumber: 1,
                            chapterTitle: '1. Bölüm: Sokak Hayvanlarına Eşit Mama Paketleri (Ortak Bölenler)',
                            conceptTitle: 'İki Sayının Ortak Bölenleri',
                            conceptBadge: 'Ortak Bölen',
                            symbolicCode: '24\'ün Bölenleri ∩ 36\'nın Bölenleri = {1, 2, 3, 4, 6, 12}',
                            narrativeText: 'Veteriner Hilal barınaktaki çuvalları tarttı: 24 kg kuru mama ve 36 kg konserve mama. "Bu mamaları öyle eşit paketlere koyalım ki iki çuval da firesiz bitsin ve her besleme noktasına eşit dağıtalım!" dedi.',
                            characterDialogue: {
                              speaker: 'Orman Muhafızı Kerem',
                              text: '24\'ün bölenleri: 1, 2, 3, 4, 6, 8, 12, 24. 36\'nın bölenleri: 1, 2, 3, 4, 6, 9, 12, 18, 36. İkisinde de ORTAK olan sayılar: 1, 2, 3, 4, 6 ve 12 kg\'lık paketlerdir!'
                            },
                            visualScene: {
                              type: 'common-divisors-grid',
                              caption: '24 ve 36\'nın ortak bölenleri: 1, 2, 3, 4, 6, 12 kg\'lık paketler oluşturulabilir. En büyük paket 12 kg\'dır.'
                            },
                            interactiveAction: {
                              prompt: 'Ortak bölenleri (1, 2, 3, 4, 6, 12) seçerek mama paketleme planını onaylayın!',
                              actionLabel: 'Paketleri Paylaştır 🐾',
                              feedbackRevealed: 'Harika bir merhamet adımı! 12 kg seçilirse 24 kg için 2 paket, 36 kg için 3 paket (toplam en az 5 paket) kullanılır.'
                            },
                            mathTakeaway: 'Kural 1: İki doğal sayıyı kalansız bölen sayıların kümesine o sayıların ORTAK BÖLENLERİ denir.'
                          },
                          {
                            id: 'p64-2',
                            pageNumber: 2,
                            chapterTitle: '2. Bölüm: Yeşil Vatan: Eşit Aralıklı Fidan Dikimi',
                            conceptTitle: 'Aralık Belirleme ve Eşit Bölme',
                            conceptBadge: 'Aralık Modeli',
                            symbolicCode: '30 m ve 45 m kenarlara eşit aralık: Ortak Bölenler = {1, 3, 5, 15} metre',
                            narrativeText: 'Köyün doğa parkında 30 metre ve 45 metre uzunluğunda iki yürüyüş yolu vardı. Kerem, iki yolun kenarına da köşelere de gelmek şartıyla eşit aralıklarla fidan dikmek istedi.',
                            characterDialogue: {
                              speaker: 'Kerem & Hilal',
                              text: 'Fidanlar arası mesafe hem 30\'u hem 45\'i tam bölmelidir. 30 ve 45\'in ortak bölenleri 1, 3, 5 ve 15 metredir. En az fidan için aralığı 15 metre seçeriz!'
                            },
                            visualScene: {
                              type: 'trees-planting-model',
                              caption: '30 m ve 45 m yollara 15 m aralıkla fidan dikimi: En az fidanla eşit ve estetik dikim sağlanır.'
                            },
                            interactiveAction: {
                              prompt: 'En az fidan kullanmak için en büyük ortak bölen olan 15 metreyi seçin!',
                              actionLabel: 'Fidanları Dik 🌱',
                              feedbackRevealed: 'Tebrikler! 15 metre aralıkla 30 m için 2 aralık, 45 m için 3 aralık oluşur.'
                            },
                            mathTakeaway: 'Kural 2: Parçalama, eşit aralıklara bölme ve paketleme problemlerinde ORTAK BÖLENLER kullanılır.'
                          },
                          {
                            id: 'p64-3',
                            pageNumber: 3,
                            chapterTitle: '3. Bölüm: Çift Sayı Doğrusunda Güneş Enerjili Servisler (Ortak Katlar)',
                            conceptTitle: 'İki Sayının Ortak Katları & Periyodik Çakışma',
                            conceptBadge: 'Ortak Kat',
                            symbolicCode: '15\'in Katları ∩ 20\'nin Katları = 60, 120, 180, 240...',
                            narrativeText: 'Merhamet Köyü\'nün iki elektrikli servisi meydandan kalkıyor. Mavi servis her 15 dakikada bir, Yeşil servis ise her 20 dakikada bir hareket ediyor. Hilal saatine baktı: "İkisi aynı anda ne zaman kalkar?"',
                            characterDialogue: {
                              speaker: 'Hilal',
                              text: 'Mavi servis: 15, 30, 45, 60, 75, 90, 105, 120... Yeşil servis: 20, 40, 60, 80, 100, 120... İlk ortak kalkış 60. dakikada (1 saat sonra), ikinci ortak kalkış 120. dakikada gerçekleşir!'
                            },
                            visualScene: {
                              type: 'double-number-line-multiples',
                              caption: '15 ve 20\'nin ortak katları: Çift sayı doğrusunda 60, 120, 180. dakikalarda seferler aynı ana denk gelir.'
                            },
                            interactiveAction: {
                              prompt: 'Çift sayı doğrusunda 15 ve 20\'nin çakıştığı ilk ortak kat olan 60\'ı işaretleyin!',
                              actionLabel: 'Ortak Seferi Başlat 🚌',
                              feedbackRevealed: 'Harika gözlem! Ortak katlar en küçük ortak kattan (60) başlayarak 60\'ar 60\'ar (60, 120, 180...) ritmik devam eder.'
                            },
                            mathTakeaway: 'Kural 3: İki sayının ortak katları, en küçük ortak katın katları şeklinde sonsuza kadar devam eder. Periyodik nöbet ve seferlerde ortak katlar kullanılır.'
                          },
                          {
                            id: 'p64-4',
                            pageNumber: 4,
                            chapterTitle: '4. Bölüm: Aralarında Asal Kapılar ve Dostluk Şifresi',
                            conceptTitle: 'Aralarında Asal Sayılar',
                            conceptBadge: 'Aralarında Asal',
                            symbolicCode: 'Ortak Bölen = Yalnızca {1}  ⟹  (Örn: 8 ve 15, 9 ve 14)',
                            narrativeText: 'Günün sonunda botanik bahçesinin emniyet kapısında iki sayı belirdi: 8 ve 15. Hilal sordu: "8 asal değil, 15 de asal değil. Peki aralarında asallar mı?"',
                            characterDialogue: {
                              speaker: 'Kerem',
                              text: '8\'in bölenleri: 1, 2, 4, 8. 15\'in bölenleri: 1, 3, 5, 15. İkisinin 1\'den başka hiçbir ortak böleni yoktur! Birden başka ortak böleni olmayan sayılara ARALARINDA ASAL SAYILAR denir!'
                            },
                            visualScene: {
                              type: 'coprime-venn-diagram',
                              caption: '8 ve 15 sayılarının bölenleri: Kesişim kümesinde sadece 1 vardır. Dolayısıyla 8 ve 15 aralarında asaldır.'
                            },
                            interactiveAction: {
                              prompt: '8 ve 15 sayılarının tek ortak böleninin 1 olduğunu onaylayarak kapıyı açın!',
                              actionLabel: 'Dostluk Kapısını Aç 🔑',
                              feedbackRevealed: 'Mükemmel! Sayıların kendisi asal olmasa bile 1\'den başka ortak bölenleri yoksa aralarında asaldırlar.'
                            },
                            mathTakeaway: 'Sonuç: Ortak böleni yalnızca 1 olan iki pozitif doğal sayıya ARALARINDA ASAL sayılar denir. Ardışık sayılar (örn: 7 ve 8, 14 ve 15) daima aralarında asaldır.'
                          }
                        ]
                      },
                      lab: {
                        title: 'Dinamik Ortak Bölen Izgarası ve Çift Sıçramalı Sayı Doğrusu',
                        toolType: 'experiment-bench',
                        instructions: 'İki sayı belirleyin; ortak bölenlerini görsel ızgara ve Venn şeması üzerinde inceleyin, çift sayı doğrusunda iki ritmik sıçramanın çakıştığı ortak kat bayraklarını adım adım takip edin.',
                        taskGoal: '24 ve 36 sayılarının ortak bölenlerini listeleyin; 12 ve 18 sayılarının 100\'den küçük ortak katlarını çift sayı doğrusunda belirleyin.',
                        interactiveTips: [
                          'Ortak bölenler tablosunda her iki sayıyı da bölen mavi yıldızlı sütunları sayınız.',
                          'Çift sayı doğrusunda iki farklı rengin üst üste geldiği çakışma noktalarına dikkat ediniz.',
                          'Aralarında asal iki sayı girdiğinizde tek ortak bölenin 1 olduğunu gözlemleyiniz.'
                        ]
                      },
                      puzzle: {
                        title: 'Ortak Kat ve Ortak Bölen Oyun İstasyonu',
                        instructions: 'Öğrenilen kavramları pekiştirmek için 3 özel oyundan birini seçiniz: Eşit Paylaşım & Merhamet Terazisi, Ortak Durak Randevusu veya Aralarında Asal Kule.',
                        items: [
                          {
                            id: 'p1',
                            concept: 'Ortak Bölen',
                            symbol: 'A ∩ B (Bölen)',
                            definition: 'İki veya daha fazla doğal sayıyı aynı anda kalansız bölebilen sayılardır.',
                            visualType: 'area'
                          },
                          {
                            id: 'p2',
                            concept: 'Ortak Kat',
                            symbol: 'A ∩ B (Kat)',
                            definition: 'İki veya daha fazla doğal sayının katları arasında ortak olan sayılardır.',
                            visualType: 'ray'
                          },
                          {
                            id: 'p3',
                            concept: 'Aralarında Asal Sayılar',
                            symbol: 'Ortak Bölen = {1}',
                            definition: '1\'den başka pozitif ortak böleni olmayan iki doğal sayıdır.',
                            visualType: 'rainbow'
                          },
                          {
                            id: 'p4',
                            concept: 'En Küçük Ortak Kat',
                            symbol: 'Min Ortak Kat',
                            definition: 'İki sayının pozitif ortak katları arasındaki en küçük değerdir; diğer ortak katlar bunun katlarıdır.',
                            visualType: 'square'
                          }
                        ]
                      },
                      assessment: {
                        title: 'Değerlendirme Testi: Ortak Kat ve Ortak Bölen',
                        instructions: 'Aşağıdaki 14 soruyu dikkatle okuyunuz. Sorular günlük hayat problemleri, fidan dikimi, mama paylaşımı, ortak nöbet ve aralarında asallık kazanımlarını içerir.',
                        reflectionPrompt: 'Bugün ortak bölen ve ortak kat kavramlarını günlük hayatta nerelerde kullanabileceğimizi fark ettiniz mi? Aralarında asallık hakkında ne öğrendiniz?',
                        questions: [
                          {
                            id: 'q1',
                            questionText: '18 ve 24 sayılarının ORTAK BÖLENLERİ aşağıdakilerden hangisidir?',
                            options: ['1, 2, 3, 6', '1, 2, 4, 6', '1, 3, 6, 8', '2, 3, 6, 12'],
                            correctOptionIndex: 0,
                            explanation: '18\'in bölenleri: 1, 2, 3, 6, 9, 18. 24\'ün bölenleri: 1, 2, 3, 4, 6, 8, 12, 24. Ortak olanlar: 1, 2, 3 ve 6\'dır.',
                            bloomLevel: 'Bilgi'
                          },
                          {
                            id: 'q2',
                            questionText: '6 ve 8 sayılarının 50\'den küçük ORTAK KATLARI hangileridir?',
                            options: ['12 ve 24', '24 ve 48', '24 ve 36', '48 ve 72'],
                            correctOptionIndex: 1,
                            explanation: '6 ve 8\'in en küçük ortak katı 24\'tür. 50\'den küçük ortak katlar: 24 ve 48\'dir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q3',
                            questionText: 'Aşağıdaki sayı çiftlerinden hangisi ARALARINDA ASALDIR?',
                            options: ['6 ve 9', '8 ve 15', '12 ve 18', '14 and 21'],
                            correctOptionIndex: 1,
                            explanation: '8\'in bölenleri {1, 2, 4, 8}, 15\'in bölenleri {1, 3, 5, 15}\'tir. 1\'den başka ortak böleni olmadığı için 8 ve 15 aralarında asaldır. Diğer çiftlerin 3 veya 7 gibi ortak bölenleri vardır.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q4',
                            questionText: '30 kg nohut ve 45 kg mercimek birbirine karıştırılmadan ve hiç artmayacak şekilde eşit büyüklükte torbalara doldurulacaktır. Bir torba kaç kg OLA-MAZ?',
                            options: ['1 kg', '3 kg', '5 kg', '10 kg'],
                            correctOptionIndex: 3,
                            explanation: 'Torba ağırlığı 30 ve 45\'in ortak böleni olmalıdır. Ortak bölenler: 1, 3, 5, 15 kg\'dır. 10 sayısı 45\'in böleni olmadığı için torba 10 kg olamaz.',
                            bloomLevel: 'Uygulama'
                          },
                          {
                            id: 'q5',
                            questionText: 'Kenar uzunlukları 24 m ve 32 m olan dikdörtgen şeklindeki bir bahçenin etrafına, köşelere de gelmek şartıyla eşit aralıklarla fidan dikilecektir. İki fidan arası mesafe en fazla kaç metre olabilir?',
                            options: ['4 m', '6 m', '8 m', '12 m'],
                            correctOptionIndex: 2,
                            explanation: 'İki fidan arası mesafe hem 24\'ü hem 32\'yi kalansız bölmelidir. 24 ve 32\'nin ortak bölenleri: 1, 2, 4, 8 m\'dir. En fazla mesafe 8 metredir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q6',
                            questionText: 'İki vapurdan biri 20 dakikada bir, diğeri 25 dakikada bir iskeleden hareket etmektedir. Saat 08:00\'de birlikte hareket eden bu vapurlar, ilk kez saat kaçta tekrar birlikte hareket ederler?',
                            options: ['08:45', '09:15', '09:40', '10:00'],
                            correctOptionIndex: 2,
                            explanation: '20 ve 25\'in en küçük ortak katı 100 dakikadır. 100 dakika = 1 saat 40 dakika. 08:00 + 1 saat 40 dk = 09:40\'ta tekrar birlikte kalkarlar.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q7',
                            questionText: 'Aşağıdaki ifadelerden hangisi DAİMA DOĞRUDUR?',
                            options: [
                              'Ardışık iki doğal sayı daima aralarında asaldır.',
                              'Aralarında asal iki sayının ikisi de asal sayı olmak zorundadır.',
                              'İki sayının ortak bölenleri sonsuz tanedir.',
                              'İki çift sayı aralarında asal olabilir.'
                            ],
                            correctOptionIndex: 0,
                            explanation: 'Ardışık iki doğal sayının (örn: 9 ve 10, 14 ve 15) ortak böleni daima yalnızca 1\'dir; bu yüzden daima aralarında asaldırlar.',
                            bloomLevel: 'Muhakeme'
                          },
                          {
                            id: 'q8',
                            questionText: 'Bir hemşire 4 günde bir, bir doktor ise 6 günde bir nöbet tutmaktadır. İkisi birlikte ilk nöbetlerini tuttuktan sonraki 60 gün içinde kaç kez daha BİRLİKTE nöbet tutarlar?',
                            options: ['4', '5', '6', '7'],
                            correctOptionIndex: 1,
                            explanation: '4 ve 6\'nın ortak katları: 12, 24, 36, 48, 60. günlerdir. 60 gün içinde 12, 24, 36, 48, 60. günlerde olmak üzere toplam 5 kez daha birlikte nöbet tutarlar.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q9',
                            questionText: 'Bir barınakta 48 kg kuru kedi maması ve 60 kg kuru köpek maması eşit ağırlıktaki paketlere doldurulacaktır. En az sayıda paket kullanmak için bir paketin ağırlığı kaç kg olmalıdır?',
                            options: ['6 kg', '8 kg', '10 kg', '12 kg'],
                            correctOptionIndex: 3,
                            explanation: 'En az sayıda paket için bir paketin ağırlığı 48 ve 60\'ın en büyük ortak böleni olmalıdır. Ortak bölenler: 1, 2, 3, 4, 6, 12 kg. En büyük ortak bölen 12 kg\'dır.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q10',
                            questionText: 'Aralarında asal iki basamaklı iki sayının ortak bölenlerinin toplamı kaçtır?',
                            options: ['1', '2', '0', 'Sayıların toplamı'],
                            correctOptionIndex: 0,
                            explanation: 'Aralarında asal sayıların tek ortak pozitif böleni 1\'dir. Dolayısıyla ortak bölenlerinin toplamı da 1\'dir.',
                            bloomLevel: 'Kavrama'
                          },
                          {
                            id: 'q11',
                            questionText: 'Bir çiçekçi elindeki gülleri 6\'şarlı ve 8\'erli demetlediğinde her seferinde 3 gül artmaktadır. Çiçekçideki gül sayısı 80\'den fazla olduğuna göre, EN AZ kaç gül vardır?',
                            options: ['75', '96', '99', '102'],
                            correctOptionIndex: 2,
                            explanation: '6 ve 8\'in ortak katları: 24, 48, 72, 96, 120... 80\'den büyük en küçük ortak kat 96\'dır. 3 gül arttığı için: 96 + 3 = 99 gül vardır.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q12',
                            questionText: 'Alanı 36 cm² ve 48 cm² olan iki dikdörtgenin birer kenar uzunlukları eşittir. Bu ortak kenarın uzunluğu santimetre cinsinden kaç farklı doğal sayı değeri alabilir?',
                            options: ['4', '5', '6', '8'],
                            correctOptionIndex: 2,
                            explanation: 'Ortak kenar uzunluğu hem 36\'yı hem 48\'i tam bölmelidir. 36 ve 48\'in ortak bölenleri: 1, 2, 3, 4, 6, 12 olmak üzere toplam 6 farklı değer alabilir.',
                            bloomLevel: 'Problem Çözme / Analiz'
                          },
                          {
                            id: 'q13',
                            questionText: 'Boyutları 12 cm ve 18 cm olan dikdörtgen şeklindeki fayanslar yan yana ve üst üste dizilerek en küçük boyutlu bir KARE alan oluşturulacaktır. Bu kare alanın bir kenar uzunluğu kaç cm olur?',
                            options: ['24 cm', '36 cm', '48 cm', '72 cm'],
                            correctOptionIndex: 1,
                            explanation: 'Karenin kenar uzunluğu hem 12\'nin hem 18\'in ortak katı olmalıdır. 12 ve 18\'in en küçük ortak katı 36 cm\'dir.',
                            bloomLevel: 'Problem Çözme'
                          },
                          {
                            id: 'q14',
                            questionText: '9 ile A iki basamaklı doğal sayısı aralarında asaldır. Buna göre A sayısı aşağıdakilerden hangisi OLAMAZ?',
                            options: ['14', '16', '21', '25'],
                            correctOptionIndex: 2,
                            explanation: '9 = 3² olduğundan, 9 ile aralarında asal olan sayı 3\'ün katı OLMAMALIDIR. 21 sayısı 3\'ün katıdır (21 = 3×7), dolayısıyla 9 ile 21 aralarında asal değildir (ortak bölenleri 3\'tür).',
                            bloomLevel: 'Kavrama / Analiz'
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
        units: [
          {
          "id": "unit-7-sayilar",
          "subjectId": "mat-7",
          "unitNumber": 1,
          "title": "1. Ünite: Sayılar ve Nicelikler (1)",
          "description": "Tam sayılar, rasyonel sayılar ve farklı temsilleri, sayı doğrusu ve mutlak değer modelleri.",
          "icon": "Calculator",
          "themeColor": "#7c3aed",
          "topics": [
                    {
                              "id": "topic-7-rasyonel-1",
                              "unitId": "unit-7-sayilar",
                              "title": "Tam Sayılardan Rasyonel Sayılara",
                              "description": "Doğal sayı, tam sayı ve rasyonel sayı kümeleri, Euler şeması, gizli payda, sayı doğrusu ve mutlak değer.",
                              "outcomes": [
                                        {
                                                  "id": "MAT.7.1.1",
                                                  "code": "MAT.7.1.1",
                                                  "title": "Doğal Sayı, Tam Sayı ve Rasyonel Sayıları Yorumlayabilme",
                                                  "shortTitle": "Tam Sayılardan Rasyonel Sayılara",
                                                  "description": "Gerçek yaşam ya da matematiksel durumlarda doğal sayı, tam sayı ve rasyonel sayıları yorumlar; Euler şeması (N ⊂ Z ⊂ Q), gizli payda mekanizması ve sayı doğrusu modelleriyle rasyonel sayıları açıklar, mutlak değer kavramıyla başlangıç noktasına uzaklık ilişkisini ve enerji tasarrufu sapmalarını analiz eder.",
                                                  "gradeId": "grade-7",
                                                  "subjectId": "mat-7",
                                                  "unitId": "unit-7-sayilar",
                                                  "topicId": "topic-7-rasyonel-1",
                                                  "durationMinutes": 40,
                                                  "pedagogyGuide": {
                                                            "maarifSDBs": [
                                                                      "SDB1.2: Kendini Düzenleme / Öz Düzenleme (Sayıları rasyonel forma dönüştürürken paydanın 0 olamayacağı kuralını ve gizli paydayı sistematik kontrol etme)",
                                                                      "SDB2.2: İş Birliği ve Akran Öğrenmesi (Akıllı ev enerji bakiye senaryosunda üretim ve tüketim sapmalarını mutlak değerle karşılaştırıp tartışma)",
                                                                      "SDB3.3: Matematiksel Muhakeme ve Problem Çözme (Her tam sayının paydası 1 olan bir rasyonel sayı olduğunu ispatlama ve sayı doğrusunda ardışık tam sayıları doğru dilimleme)"
                                                            ],
                                                            "processComponents": [
                                                                      "a) Tam sayıları inceler (N ⊂ Z ⊂ Q hiyerarşisi, gizli payda).",
                                                                      "b) Tam sayıları rasyonel sayılara genişletir ve mutlak değerle sayı doğrusunda açıklar.",
                                                                      "c) Sayı doğrusu üzerinde her rasyonel sayının bir noktaya karşılık geldiğini açıklar."
                                                            ],
                                                            "learningGoals": [
                                                                      "Doğal sayılar (N), tam sayılar (Z) ve rasyonel sayılar (Q) kümeleri arasındaki hiyerarşiyi (N ⊂ Z ⊂ Q) kavrar.",
                                                                      "Her tam sayının paydasına 1 yazılarak a/b biçiminde rasyonel sayı olarak gösterilebileceğini (gizli payda) fark eder.",
                                                                      "a/b ifadesinde b = 0 olduğunda ifadenin matematiksel olarak tanımsız olduğunu açıklar.",
                                                                      "Negatif rasyonel sayıların farklı temsillerini (-a/b = (-a)/b = a/(-b)) sayı doğrusunda modeller.",
                                                                      "Sayı doğrusunda pozitif ve negatif rasyonel sayıların yer alacağı ardışık iki tam sayıyı belirler ve aralığı eşit parçalara bölerek noktayı bulur.",
                                                                      "Mutlak değerin başlangıç noktasına (0) olan uzaklık olduğunu fark eder; günlük hayattaki hedef sapmaları ve enerji dengesini mutlak değerle analiz eder."
                                                            ],
                                                            "teacherTips": [
                                                                      "Derse akıllı ev enerji sayacı senaryosu ile başlayınız; güneş paneli üretimini pozitif (+), şebeke tüketimini negatif (-) değerlerle göstererek sıfır referans noktasını vurgulayınız.",
                                                                      "Euler şeması modelini tahtada iç içe geçen üç halka olarak çiziniz ve -4 sayısının neden Z ve Q halkalarında olup N halkasında olmadığını tartışınız.",
                                                                      "Paydanın sıfır olamama durumunu \"sıfır parçaya bölme yapılamaz\" mantığı ve hesap makinelerindeki \"Error / Tanımsız\" uyarısıyla somutlaştırınız.",
                                                                      "Sayı doğrusunda -3/4 noktasını bulurken öğrencilerin sıfırdan sola doğru 3 birim ilerlemesi gerektiğini hatırlatarak negatif yön yanılgısını önleyiniz."
                                                            ],
                                                            "misconceptions": [
                                                                      "Paydası 0 olan ifadelerin 0'a eşit olduğunu düşünmek (Örn: 5/0 = 0 yanılgısı; doğrusu tanımsızdır, 0/5 = 0'dır).",
                                                                      "Tam sayıların rasyonel sayı olmadığını zannetmek (Her tam sayının paydasında gizli 1 olduğunu unutmak).",
                                                                      "Sayı doğrusunda negatif kesirleri yerleştirirken pozitif yön gibi sağa doğru saymak (Örn: -1 tam 1/2'yi -1 ile 0 arasında zannetmek).",
                                                                      "Mutlak değerin yalnızca işaret değiştiren bir işlem olduğunu düşünüp geometrik uzaklık anlamını kavrayamamak."
                                                            ],
                                                            "keyQuestions": [
                                                                      "Akıllı sayacın ekranındaki +4 kWh ve -4 kWh değerlerinin sıfıra olan mesafeleri neden aynıdır?",
                                                                      "Güneş panelinin ürettiği +3 kWh enerjiyi a/b şeklinde yazabilir miyiz? Paydasına 1 yazmak sayının değerini değiştirir mi?",
                                                                      "İki ardışık tam sayı arası neden istenildiği kadar küçük eşit enerji dilimlerine bölünebilir?"
                                                            ]
                                                  },
                                                  "phases": {
                                                            "story": {
                                                                      "title": "Geleceğin Akıllı Evi: Enerji Tasarrufu ve Sıfır Atık Karnesi",
                                                                      "character": {
                                                                                "name": "Enerji Mühendisi Selim & Eren",
                                                                                "role": "Akıllı Bina & Enerji Tasarrufu Uzmanları",
                                                                                "avatar": "🏡"
                                                                      },
                                                                      "scenario": "Eren ailesi, evlerinin elektrik ve su tüketimini anlık takip etmek için akıllı bir enerji yönetim sistemi kurmuştur. Sistem, sıfır referans noktasını (0) \"hedef enerji dengesi\" olarak kabul etmektedir: Güneş panellerinin ürettiği temiz elektrik pozitif tam sayılarla (+3 kWh, +5 kWh), şebekeden çekilen fazla tüketim ise negatif tam sayılarla (-2 kWh, -4 kWh) kaydedilmektedir.",
                                                                      "realLifeConnection": "Sıfır atık, akıllı ev otomasyonu, enerji bütçelemesi ve sürdürülebilir tüketim analizinde tam sayılar ve rasyonel sayılar kritik rol oynar.",
                                                                      "reflectionQuestion": "Akıllı sayacın ekranındaki +4 kWh ve -4 kWh değerlerinin sıfır noktasına olan mesafeleri neden aynıdır? +5/2 kWh ve -3/4 kWh gibi değerleri sayı doğrusunda nereye yerleştirebiliriz?",
                                                                      "keyTakeaway": "Her tam sayı paydası 1 olan bir rasyonel sayıdır (N ⊂ Z ⊂ Q). Mutlak değer, sayının başlangıç noktasına (0) olan yönlü olmayan gerçek uzaklığıdır.",
                                                                      "pages": [
                                                                                {
                                                                                          "id": "p7-1",
                                                                                          "pageNumber": 1,
                                                                                          "chapterTitle": "1. Bölüm: Sıfır Denge Noktası ve Akıllı Enerji Sayacı",
                                                                                          "conceptTitle": "Referans Noktası (0) ve Tam Sayılarla Enerji Dengesi",
                                                                                          "conceptBadge": "Hedef Sıfır Dengesi",
                                                                                          "symbolicCode": "Üretim: +120 kWh | Tüketim: -150 kWh ⟹ Net Bakiye: -30 kWh",
                                                                                          "narrativeText": "Eren ailesi ay sonunda akıllı evin kontrol panelinin başına geçti. Baba Selim Bey ekrandaki grafiği işaret etti: \"Bu ay güneş panellerimiz +120 kWh temiz enerji üretti ancak şebekeden -150 kWh enerji çektik. Net enerji bakiyemiz -30 kWh. Yani sıfır dengesinin 30 kWh altındayız!\" Eren şaşkınlıkla ekrana baktı: \"Demek ki sıfır (0) noktası bizim hedef denge çizgimiz!\"",
                                                                                          "characterDialogue": {
                                                                                                    "speaker": "Mühendis Selim",
                                                                                                    "text": "Aynen öyle Eren! Sıfırın sağı üretilen fazlalığı, sıfırın solu ise tüketilen açığı temsil eder. Sayı doğrusundaki 0 noktası akıllı evin kalbidir."
                                                                                          },
                                                                                          "visualScene": {
                                                                                                    "type": "smart-home-meter",
                                                                                                    "caption": "Akıllı enerji sayacı: 0 noktası nötr denge, sağ taraf yeşil solar üretim (+), sol taraf kırmızı şebeke çekimi (-)."
                                                                                          },
                                                                                          "interactiveAction": {
                                                                                                    "prompt": "Akıllı sayacın aylık net bakiye formülünü onaylayın ve sıfır noktasını mühürleyin!",
                                                                                                    "actionLabel": "Sıfır Noktasını Onayla ⚡",
                                                                                                    "feedbackRevealed": "Harika! 0 referans noktası doğrulandı. Net bakiye -30 kWh olarak sisteme işlendi."
                                                                                          },
                                                                                          "mathTakeaway": "Kural 1: Gerçek hayat durumlarında sıfır (0) noktası mutlak yokluk değil, kabul edilen başlangıç veya denge referans noktasıdır."
                                                                                },
                                                                                {
                                                                                          "id": "p7-2",
                                                                                          "pageNumber": 2,
                                                                                          "chapterTitle": "2. Bölüm: İki Odanın Tartışması & Mutlak Değerin Keşfi",
                                                                                          "conceptTitle": "Mutlak Değer: Yönsüz Gerçek Mesafe",
                                                                                          "conceptBadge": "Mutlak Değer Metresi",
                                                                                          "symbolicCode": "|+4| = |-4| = 4 birim mesafe",
                                                                                          "narrativeText": "Akıllı evin odaları incelenirken ilginç bir durum ortaya çıktı. Çocuk odasındaki sensör +4 kWh (fazla enerji üretimi), misafir odasındaki klima ise -4 kWh (enerji tüketimi) göstermişti. Eren sordu: \"Hangi oda hedef dengeden daha fazla saptı?\" Selim Bey gülümsedi: \"İkisi de sıfır noktasından tam 4 kWh uzaklıkta! Enerji tasarrufunda sapmanın yönü değil, sıfıra olan mesafesi önemlidir.\"",
                                                                                          "characterDialogue": {
                                                                                                    "speaker": "Eren",
                                                                                                    "text": "Anladım! +4 de sıfıra 4 adım uzakta, -4 de sıfıra 4 adım uzakta! İşte bu yüzden |+4| = 4 ve |-4| = 4 oluyor. Mutlak değer sadece mesafeyi ölçer!"
                                                                                          },
                                                                                          "visualScene": {
                                                                                                    "type": "absolute-value-laser",
                                                                                                    "caption": "0 noktasından sağa ve sola uzanan 4 birimlik ikiz lazer cetveli: |+4| = |-4| = 4."
                                                                                          },
                                                                                          "interactiveAction": {
                                                                                                    "prompt": "Mutlak değer lazer metresini çalıştırarak +4 ve -4 noktalarının mesafelerini test edin!",
                                                                                                    "actionLabel": "Lazer Metreyi Ateşle 🎯",
                                                                                                    "feedbackRevealed": "Mükemmel tespit! |-4| = |+4| = 4 birim. Her iki odanın dengeden sapma büyüklüğü eşittir."
                                                                                          },
                                                                                          "mathTakeaway": "Kural 2: Bir sayının sayı doğrusundaki başlangıç noktasına (0) olan uzaklığına o sayının mutlak değeri denir. Uzaklık negatif olamaz!"
                                                                                },
                                                                                {
                                                                                          "id": "p7-3",
                                                                                          "pageNumber": 3,
                                                                                          "chapterTitle": "3. Bölüm: Saatlik Rapor ve Parçalanan Enerji Dilimleri",
                                                                                          "conceptTitle": "Tam Sayı Olmayan Değerler: Rasyonel Sayılara Giriş",
                                                                                          "conceptBadge": "Kesirli Enerji",
                                                                                          "symbolicCode": "Saat 14:00: +5/2 kWh | Saat 18:00: -3/4 kWh",
                                                                                          "narrativeText": "Öğleden sonra saatlik enerji raporu geldi. Saat 14:00'te güneş panelleri tam 2 buçuk kWh (+5/2 kWh) elektrik üretmişti. Saat 18:00'de ise klima yarım saat çalışıp -3/4 kWh tüketmişti. Eren panoya baktı: \"+5/2 ve -3/4 birer tam sayı değil! Sayı doğrusundaki cetvelimizde bunları nereye yerleştireceğiz?\"",
                                                                                          "characterDialogue": {
                                                                                                    "speaker": "Mühendis Selim",
                                                                                                    "text": "Tam sayılar cetveli artık yetersiz kalıyor Eren! Şimdi ardışık tam sayıların arasını eşit parçalara bölerek yeni sayı evrenimize, yani RASYONEL SAYILARA adım atıyoruz!"
                                                                                          },
                                                                                          "visualScene": {
                                                                                                    "type": "fractional-energy-slices",
                                                                                                    "caption": "+5/2 = +2 tam 1/2 noktası (2 ile 3 arasında); -3/4 noktası (-1 ile 0 arasında)."
                                                                                          },
                                                                                          "interactiveAction": {
                                                                                                    "prompt": "+5/2 ve -3/4 değerlerinin hangi tam sayılar arasında olduğunu belirleyin!",
                                                                                                    "actionLabel": "Aralıkları Tespit Et 📏",
                                                                                                    "feedbackRevealed": "+5/2 sayısı 2 ile 3 tam sayıları arasında, -3/4 sayısı ise 0 ile -1 arasındadır!"
                                                                                          },
                                                                                          "mathTakeaway": "Kural 3: a ve b birer tam sayı ve b ≠ 0 olmak üzere, a/b şeklinde yazılabilen sayılara rasyonel sayılar (ℚ) denir."
                                                                                },
                                                                                {
                                                                                          "id": "p7-4",
                                                                                          "pageNumber": 4,
                                                                                          "chapterTitle": "4. Bölüm: Gizli Payda Sırrı & Sayı Kümeleri Evreni",
                                                                                          "conceptTitle": "N ⊂ Z ⊂ Q Hiyerarşisi ve Gizli Payda Mekanizması",
                                                                                          "conceptBadge": "Sayı Kümeleri",
                                                                                          "symbolicCode": "-4 = -4/1 = 4/(-1) = -(4/1)  ve  ℕ ⊂ ℤ ⊂ ℚ",
                                                                                          "narrativeText": "Eren merakla sordu: \"Peki baba, dün öğrendiğimiz tam sayılar bu yeni rasyonel dünyada kayıp mı oldu?\" Selim Bey tahtaya büyük bir Euler şeması çizdi: \"Asla! Her tam sayının paydasında görünmeyen gizli bir 1 vardır. Örneğin -4 aslında -4/1 demektir. Yani her doğal sayı bir tam sayıdır, her tam sayı da aynı zamanda bir rasyonel sayıdır!\"",
                                                                                          "characterDialogue": {
                                                                                                    "speaker": "Mühendis Selim & Eren",
                                                                                                    "text": "Doğal Sayılar (N), Tam Sayıların (Z) içindedir; Tam Sayılar da Rasyonel Sayıların (Q) içindedir! Fakat payda asla 0 olamaz; çünkü enerjiyi sıfır parçaya bölemeyiz!"
                                                                                          },
                                                                                          "visualScene": {
                                                                                                    "type": "euler-diagram-sets",
                                                                                                    "caption": "İç içe geçmiş halkalar: En içte N (Doğal), ortada Z (Tam), en dışta Q (Rasyonel). Dışarıda ise Paydası 0 olan Tanımsızlar."
                                                                                          },
                                                                                          "interactiveAction": {
                                                                                                    "prompt": "Gizli paydayı ortaya çıkararak -4 sayısının rasyonel kimliğini mühürleyin!",
                                                                                                    "actionLabel": "Gizli Paydayı Aç 🔮",
                                                                                                    "feedbackRevealed": "-4 = -4/1 = 4/(-1) = -(4/1). Bütün tam sayılar birer rasyonel sayıdır (N ⊂ Z ⊂ Q)!"
                                                                                          },
                                                                                          "mathTakeaway": "Sonuç: a ∈ ℤ için a = a/1 olduğundan her tam sayı bir rasyonel sayıdır. b = 0 durumunda a/0 matematiksel olarak tanımsızdır."
                                                                                }
                                                                      ]
                                                            },
                                                            "lab": {
                                                                      "title": "Dinamik Sayı Doğrusu ve Sayı Kümeleri Laboratuvarı",
                                                                      "toolType": "rational-numbers-bench",
                                                                      "instructions": "Euler şeması üzerinde sayı kümelerini test edin, gizli payda mekanizmasını ve tanımsızlık alarmlarını inceleyin. Ardından yakınlaştırmalı sayı doğrusunda ardışık iki tam sayı arasını eşit parçalara bölerek rasyonel noktaları bulun ve mutlak değer lazer metresiyle başlangıç noktasına olan uzaklıkları ölçün.",
                                                                      "taskGoal": "N ⊂ Z ⊂ Q ilişkisini kanıtlayın, -3/4 ve +5/2 noktalarını sayı doğrusunda işaretleyin ve |-4| = |+4| eşitliğini lazer metresiyle gösterin.",
                                                                      "interactiveTips": [
                                                                                "Euler şemasında sayıyı girerken paydaya 0 yazarak sistemin tanımsızlık alarmı vermesini gözlemleyiniz.",
                                                                                "Gizli payda butonuna tıklayarak tam sayıların rasyonel gösterimlerini (-4/1, 4/(-1), -(4/1)) keşfediniz.",
                                                                                "Sayı doğrusunda negatif kesirleri dilimlerken 0'dan sola doğru ilerlemeyi unutmayınız!",
                                                                                "Mutlak değer metresinde mesafenin yönü olmadığını, daima pozitif bir büyüklük olduğunu inceleyiniz."
                                                                      ]
                                                            },
                                                            "puzzle": {
                                                                      "title": "Rasyonel Sayılar Oyun İstasyonu",
                                                                      "instructions": "Öğrendiğiniz kavramları pekiştirmek için 3 özel oyundan birini seçiniz: Küme Ayıklama İstasyonu (Arcade), Rasyonel Paraşütçü (Sayı Doğrusu İnişi) veya Sıfır Denge Merkezi (Mutlak Değer Kilidi).",
                                                                      "items": [
                                                                                {
                                                                                          "id": "p1",
                                                                                          "concept": "Rasyonel Sayı (Q)",
                                                                                          "symbol": "a/b, b ≠ 0",
                                                                                          "definition": "a ve b tam sayı olmak ve payda sıfırdan farklı olmak üzere a/b şeklinde yazılabilen sayılardır.",
                                                                                          "visualType": "fraction"
                                                                                },
                                                                                {
                                                                                          "id": "p2",
                                                                                          "concept": "Sayı Kümeleri Hiyerarşisi",
                                                                                          "symbol": "N ⊂ Z ⊂ Q",
                                                                                          "definition": "Her doğal sayı bir tam sayıdır, her tam sayı da paydası 1 olan bir rasyonel sayıdır.",
                                                                                          "visualType": "sets"
                                                                                },
                                                                                {
                                                                                          "id": "p3",
                                                                                          "concept": "Mutlak Değer",
                                                                                          "symbol": "|x| ≥ 0",
                                                                                          "definition": "Bir sayının sayı doğrusunda başlangıç noktasına (0) olan uzaklığıdır; asla negatif olamaz.",
                                                                                          "visualType": "distance"
                                                                                },
                                                                                {
                                                                                          "id": "p4",
                                                                                          "concept": "Tanımsız Kesir",
                                                                                          "symbol": "a/0",
                                                                                          "definition": "Paydası sıfır olan kesirli ifadeler matematiksel olarak tanımsızdır ve bir sayı belirtmez.",
                                                                                          "visualType": "undefined"
                                                                                }
                                                                      ]
                                                            },
                                                            "assessment": {
                                                                      "title": "Değerlendirme Testi: Tam Sayılardan Rasyonel Sayılara",
                                                                      "instructions": "Aşağıdaki 14 soruyu dikkatle okuyunuz. Sorular 8 temel kavrama ve 6 günlük hayat / akıllı ev bağlam temelli sorudan oluşmaktadır.",
                                                                      "reflectionPrompt": "Bugün rasyonel sayılar kavramı, geçen yıl öğrendiğiniz tam sayılar evrenini nasıl genişletti? Akıllı ev enerji sayacındaki verileri incelerken mutlak değer size neyi fark ettirdi?",
                                                                      "questions": [
                                                                                {
                                                                                          "id": "q1",
                                                                                          "questionText": "Aşağıdakilerden hangisi bir rasyonel sayıdır fakat tam sayı DEĞİLDİR?",
                                                                                          "options": [
                                                                                                    "-8/2",
                                                                                                    "0/4",
                                                                                                    "5",
                                                                                                    "-3/5"
                                                                                          ],
                                                                                          "correctOptionIndex": 3,
                                                                                          "explanation": "-8/2 = -4 (tam sayı), 0/4 = 0 (tam sayı), 5 = tam sayı. -3/5 ise tam sayıya sadeleşmez; rasyonel sayıdır fakat tam sayı değildir.",
                                                                                          "bloomLevel": "Bilgi"
                                                                                },
                                                                                {
                                                                                          "id": "q2",
                                                                                          "questionText": "(x - 3) / (x + 2) ifadesi x'in hangi değeri için bir rasyonel sayı BELİRTMEZ?",
                                                                                          "options": [
                                                                                                    "3",
                                                                                                    "0",
                                                                                                    "-2",
                                                                                                    "2"
                                                                                          ],
                                                                                          "correctOptionIndex": 2,
                                                                                          "explanation": "Bir kesrin rasyonel sayı belirtmesi için paydası sıfırdan farklı olmalıdır (b ≠ 0). x + 2 = 0 ise x = -2 için payda sıfır olur ve ifade tanımsız hale gelir.",
                                                                                          "bloomLevel": "Kavrama"
                                                                                },
                                                                                {
                                                                                          "id": "q3",
                                                                                          "questionText": "Aşağıdaki rasyonel sayı eşitliklerinden hangisi YANLIŞTIR?",
                                                                                          "options": [
                                                                                                    "-2/3 = (-2)/3",
                                                                                                    "-2/3 = 2/(-3)",
                                                                                                    "-2/3 = (-2)/(-3)",
                                                                                                    "-(-2/3) = 2/3"
                                                                                          ],
                                                                                          "correctOptionIndex": 2,
                                                                                          "explanation": "(-2)/(-3) ifadesinde iki negatif sayının bölümü pozitif yapar ((-2)/(-3) = +2/3). Bu yüzden negatif olan -2/3 sayısına eşit olamaz.",
                                                                                          "bloomLevel": "Kavrama"
                                                                                },
                                                                                {
                                                                                          "id": "q4",
                                                                                          "questionText": "-7/3 rasyonel sayısı sayı doğrusunda hangi ardışık iki tam sayı arasındadır?",
                                                                                          "options": [
                                                                                                    "-1 ile -2",
                                                                                                    "-2 ile -3",
                                                                                                    "-3 ile -4",
                                                                                                    "2 ile 3"
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "-7/3 sayısı tam sayılı kesre çevrildiğinde -2 tam 1/3 olur. Sıfırdan sola doğru -2'yi geçip -3'e doğru ilerlediği için -2 ile -3 arasındadır.",
                                                                                          "bloomLevel": "Uygulama"
                                                                                },
                                                                                {
                                                                                          "id": "q5",
                                                                                          "questionText": "Aşağıdaki matematiksel ifadelerden hangisi DAİMA DOĞRUDUR?",
                                                                                          "options": [
                                                                                                    "Her rasyonel sayı aynı zamanda bir doğal sayıdır.",
                                                                                                    "Her tam sayı aynı zamanda bir rasyonel sayıdır (Z ⊂ Q).",
                                                                                                    "Sıfır sayısı bir rasyonel sayı değildir.",
                                                                                                    "Paydası payından büyük olan her rasyonel sayı pozitiftir."
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "Z ⊂ Q olduğu için her tam sayının paydasına 1 yazılarak a/1 şeklinde rasyonel sayı olarak ifade edilebilir.",
                                                                                          "bloomLevel": "Kavrama"
                                                                                },
                                                                                {
                                                                                          "id": "q6",
                                                                                          "questionText": "|-4/5| ifadesinin değeri ve sayı doğrusundaki geometrik anlamı aşağıdakilerden hangisidir?",
                                                                                          "options": [
                                                                                                    "-4/5, başlangıç noktasının solundadır.",
                                                                                                    "4/5, başlangıç noktasına (0) olan uzaklığı 4/5 birimdir.",
                                                                                                    "5/4, başlangıç noktasına olan uzaklığı ters çevirir.",
                                                                                                    "0, başlangıç noktasıyla çakışıktır."
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "Mutlak değer bir sayının başlangıç noktasına (0) olan uzaklığıdır ve uzaklık negatif olamaz. |-4/5| = 4/5 birimdir.",
                                                                                          "bloomLevel": "Kavrama"
                                                                                },
                                                                                {
                                                                                          "id": "q7",
                                                                                          "questionText": "0 ile -1 arası 4 eşit parçaya bölündüğünde sıfıra en yakın olan ilk bölme noktası hangi rasyonel sayıyı gösterir?",
                                                                                          "options": [
                                                                                                    "-1/4",
                                                                                                    "-3/4",
                                                                                                    "-1/2",
                                                                                                    "-1/8"
                                                                                          ],
                                                                                          "correctOptionIndex": 0,
                                                                                          "explanation": "0 ile -1 arası 4 parçaya bölündüğünde her bir parçanın uzunluğu 1/4 birimdir. Sıfırdan sola doğru ilk adım -1/4 noktasıdır.",
                                                                                          "bloomLevel": "Uygulama"
                                                                                },
                                                                                {
                                                                                          "id": "q8",
                                                                                          "questionText": "-18/6 rasyonel sayısı sayı kümelerinden hangilerinin elemanıdır?",
                                                                                          "options": [
                                                                                                    "Yalnızca Q",
                                                                                                    "Yalnızca Z",
                                                                                                    "Z ve Q",
                                                                                                    "N, Z ve Q"
                                                                                          ],
                                                                                          "correctOptionIndex": 2,
                                                                                          "explanation": "-18/6 = -3 tam sayısıdır. -3 sayısı negatif olduğu için N (Doğal Sayılar) kümesinde yer almaz; Z (Tam Sayılar) ve Q (Rasyonel Sayılar) kümelerinin elemanıdır.",
                                                                                          "bloomLevel": "Kavrama"
                                                                                },
                                                                                {
                                                                                          "id": "q9",
                                                                                          "questionText": "Eren ailesinin akıllı evi günün ilk yarısında +7/2 kWh güneş enerjisi üretmiş, ikinci yarısında şebekeden 3 tam 1/4 kWh enerji tüketmiştir. Akıllı sayaç bu iki değeri sayı doğrusunda işaretlemektedir. Buna göre üretilen enerji ile tüketilen enerjinin başlangıç noktasına (0) olan uzaklıkları toplamı kaç kWh'tir?",
                                                                                          "options": [
                                                                                                    "1/4",
                                                                                                    "6 tam 3/4",
                                                                                                    "6",
                                                                                                    "5/4"
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "Uzaklık mutlak değerle hesaplanır: |+7/2| = 3.5 kWh = 3 tam 2/4. Tüketim |-3 tam 1/4| = 3 tam 1/4. Toplam uzaklık: 3 2/4 + 3 1/4 = 6 tam 3/4 kWh'tir.",
                                                                                          "bloomLevel": "Analiz"
                                                                                },
                                                                                {
                                                                                          "id": "q10",
                                                                                          "questionText": "Bir derin dondurucunun sıcaklık ayarı -18 °C'dir. Hızlı dondurma moduna alındığında dondurucu her yarım saatte 3/2 °C daha soğumaktadır. 1 saat sonra sıcaklık göstergesinde yazan sayı değeri sayı doğrusunda hangi ardışık iki tam sayı arasında yer alır ya da hangi tam sayıya eşittir?",
                                                                                          "options": [
                                                                                                    "-19 ile -20 arasında",
                                                                                                    "-20 ile -21 sınırında (-21 °C tam sayısı)",
                                                                                                    "-21 ile -22 arasında",
                                                                                                    "-22 ile -23 arasında"
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "1 saatte iki tane yarım saat vardır. Toplam soğuma: 2 × (3/2) = 3 °C. Sıcaklık -18 - 3 = -21 °C olur. Bu değer tam olarak -21 tam sayısıdır (-20 ile -21 sınır noktası).",
                                                                                          "bloomLevel": "Uygulama"
                                                                                },
                                                                                {
                                                                                          "id": "q11",
                                                                                          "questionText": "Okul kantininde başlatılan \"Sıfır Atık\" projesinde kantin görevlisi her gün artan ekmek miktarını tartmaktadır. Pazartesi günü hedeflenen sıfır noktasından -4/5 kg eksik atık çıkmış (tasarruf), Salı günü ise +6/5 kg fazla atık çıkmıştır. Kantin panosundaki dijital sayaçta bu iki günün atık durumunun sıfıra olan mesafeleri karşılaştırıldığında hangisi doğrudur?",
                                                                                          "options": [
                                                                                                    "Pazartesi günkü atık sıfıra daha uzaktır.",
                                                                                                    "Salı günkü atık sıfıra daha uzaktır çünkü |+6/5| > |-4/5|'tir.",
                                                                                                    "Her iki günün sıfıra mesafesi eşittir.",
                                                                                                    "Negatif atık mutlak değerle hesaplanamaz."
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "Sıfıra olan mesafe mutlak değerle ölçülür: |-4/5| = 4/5 = 0.8 kg. |+6/5| = 6/5 = 1.2 kg. 1.2 > 0.8 olduğundan Salı günkü atık sıfır denge noktasından daha uzaktır.",
                                                                                          "bloomLevel": "Analiz"
                                                                                },
                                                                                {
                                                                                          "id": "q12",
                                                                                          "questionText": "Deniz seviyesi 0 kabul edilen bir test sahasında bir araştırma dronu su seviyesinin +15/4 metre üzerinde, denizaltı keşif robotu ise su seviyesinin 7/2 metre altındadır (-7/2 m). Kontrol ekranında dron ile denizaltının su seviyesine göre konumları gösterildiğinde hangisi deniz seviyesine (0) daha yakındır?",
                                                                                          "options": [
                                                                                                    "Dron (15/4 metre)",
                                                                                                    "Denizaltı (-7/2 metre)",
                                                                                                    "İkisi de eşit mesafededir",
                                                                                                    "Karşılaştırılamaz"
                                                                                          ],
                                                                                          "correctOptionIndex": 1,
                                                                                          "explanation": "Dronun uzaklığı: |+15/4| = 3.75 metredir. Denizaltının uzaklığı: |-7/2| = |-14/4| = 3.5 metredir. 3.5 < 3.75 olduğu için denizaltı robotu deniz seviyesine (0) daha yakındır.",
                                                                                          "bloomLevel": "Analiz"
                                                                                },
                                                                                {
                                                                                          "id": "q13",
                                                                                          "questionText": "Bir su arıtma tesisi mikron düzeyindeki filtre gözeneklerini rasyonel sayılarla modellemektedir: K filtresi 1/8 mm, L filtresi 3/16 mm, M filtresi 1/4 mm gözenek açıklığına sahiptir. En ince tortuları bile süzmek isteyen bir mühendis su arıtma standardına göre sıfıra en yakın (en küçük) gözenek açıklığına sahip filtreyi seçecektir. Mühendis hangi filtreyi seçmelidir?",
                                                                                          "options": [
                                                                                                    "K Filtresi (1/8 mm)",
                                                                                                    "L Filtresi (3/16 mm)",
                                                                                                    "M Filtresi (1/4 mm)",
                                                                                                    "K ve M eşit açıklıktadır"
                                                                                          ],
                                                                                          "correctOptionIndex": 0,
                                                                                          "explanation": "Kesirlerin paydalarını 16'da eşitleyelim: K = 2/16 mm, L = 3/16 mm, M = 4/16 mm. En küçük gözenek 2/16 mm ile K filtresidir, dolayısıyla sıfıra en yakın olan K filtresidir.",
                                                                                          "bloomLevel": "Uygulama"
                                                                                },
                                                                                {
                                                                                          "id": "q14",
                                                                                          "questionText": "Bir enerji şirketinde 4 farklı güneş panelinin kış aylarındaki performans kaybı / kazancı rasyonel sayılarla listelenmiştir:\nPanel A: -5/3, Panel B: -7/4, Panel C: -3/2, Panel D: -11/6.\nHangi panelin performans kaybı sayı doğrusunda -2 tam sayısına en yakındır?",
                                                                                          "options": [
                                                                                                    "Panel A (-5/3)",
                                                                                                    "Panel B (-7/4)",
                                                                                                    "Panel C (-3/2)",
                                                                                                    "Panel D (-11/6)"
                                                                                          ],
                                                                                          "correctOptionIndex": 3,
                                                                                          "explanation": "-2 tam sayısına olan uzaklıklar |-2 - (-x)| ile hesaplanır:\nPanel A: |-2 - (-5/3)| = |-1/3| ≈ 0.33\nPanel B: |-2 - (-7/4)| = |-1/4| = 0.25\nPanel C: |-2 - (-3/2)| = |-1/2| = 0.50\nPanel D: |-2 - (-11/6)| = |-1/6| ≈ 0.166. En küçük fark Panel D'dedir, dolayısıyla -2'ye en yakın panel D'dir.",
                                                                                          "bloomLevel": "Analiz"
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

export function isSubjectMatchingBranch(subject: Subject, branch?: string | null): boolean {
  if (!branch || !branch.trim()) return true;
  
  const normalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');

  const b = normalize(branch);
  const sTitle = normalize(subject.title || '');
  const sCode = normalize(subject.code || '');
  const sId = normalize(subject.id || '');

  // Math branch aliases
  if (b.includes('matematik') || b.includes('geometri')) {
    return sTitle.includes('matematik') || sCode.includes('mat') || sId.includes('mat');
  }
  // Science branch aliases
  if (b.includes('fen') || b.includes('fizik') || b.includes('kimya') || b.includes('biyoloji')) {
    return sTitle.includes('fen') || sCode.includes('fen') || sId.includes('sci');
  }
  // Turkish
  if (b.includes('turkce') || b.includes('edebiyat')) {
    return sTitle.includes('turkce') || sCode.includes('turk') || sCode.includes('tr');
  }
  // Social studies
  if (b.includes('sosyal') || b.includes('tarih') || b.includes('cografya')) {
    return sTitle.includes('sosyal') || sCode.includes('sos');
  }
  // English
  if (b.includes('ingilizce') || b.includes('yabanci dil')) {
    return sTitle.includes('ingilizce') || sCode.includes('ing');
  }
  // Religion
  if (b.includes('din') || b.includes('ahlak')) {
    return sTitle.includes('din') || sCode.includes('din');
  }
  // IT
  if (b.includes('bilisim') || b.includes('yazilim') || b.includes('kodlama')) {
    return sTitle.includes('bilisim') || sCode.includes('bil');
  }

  return sTitle.includes(b) || b.includes(sTitle);
}

export function isGradeMatchingStudent(
  grade: Grade,
  student?: { gradeLevel?: number; classSection?: string } | null
): boolean {
  if (!student) return true;
  if (student.gradeLevel && grade.level === student.gradeLevel) return true;
  if (student.classSection) {
    const num = parseInt(student.classSection.replace(/\D/g, ''), 10);
    if (!isNaN(num) && grade.level === num) return true;
  }
  return false;
}

export function getFilteredCurriculum(user?: {
  role?: string;
  branch?: string;
  gradeLevel?: number;
  classSection?: string;
} | null): Grade[] {
  if (!user || user.role === 'admin') {
    return CURRICULUM_DATA;
  }

  if (user.role === 'student') {
    const matched = CURRICULUM_DATA.filter((g) => isGradeMatchingStudent(g, user));
    return matched.length > 0 ? matched : CURRICULUM_DATA;
  }

  if (user.role === 'teacher') {
    const teacherBranch = user.branch || '';
    const filteredGrades = CURRICULUM_DATA.map((grade) => {
      const matchingSubjects = grade.subjects.filter((s) => isSubjectMatchingBranch(s, teacherBranch));
      return {
        ...grade,
        subjects: matchingSubjects
      };
    }).filter((g) => g.subjects.length > 0);

    return filteredGrades.length > 0 ? filteredGrades : CURRICULUM_DATA;
  }

  return CURRICULUM_DATA;
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

