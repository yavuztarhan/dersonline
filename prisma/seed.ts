import { PrismaClient, Role, TeacherStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maarif_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Maarif Akademi PostgreSQL veritabanı tohumlanıyor (Seeding)...');

  // 1. Admin Kullanıcılar
  const adminUsers = [
    { email: 'admin@maarif.gov.tr', name: 'Maarif Sistem Yöneticisi', avatar: '🛡️' },
    { email: 'powerose@gmail.com', name: 'Sistem Yöneticisi (Powerose)', avatar: '🛡️' },
    { email: 'maarifakademi.com.tr@gmail.com', name: 'Maarif Akademi Yönetim', avatar: '🛡️' },
    { email: 'viziteci325@gmail.com', name: 'Sistem Yöneticisi', avatar: '🛡️' },
  ];

  for (const admin of adminUsers) {
    const createdAdmin = await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: Role.ADMIN },
      create: {
        email: admin.email,
        name: admin.name,
        role: Role.ADMIN,
        avatar: admin.avatar,
      },
    });
    console.log('✅ Admin oluşturuldu/güncellendi:', createdAdmin.email);
  }

  // 2. Onaylı Öğretmen (Edirne Selimiye İHO)
  const teacher1User = await prisma.user.upsert({
    where: { email: 'ahmet.ogretmen@meb.k12.tr' },
    update: {},
    create: {
      email: 'ahmet.ogretmen@meb.k12.tr',
      name: 'Mimar Sinan & Hasan Hoca',
      role: Role.TEACHER,
      avatar: '👨‍🏫',
      teacherProfile: {
        create: {
          phone: '0555 123 45 67',
          city: 'Edirne',
          district: 'Merkez',
          school: 'Edirne Selimiye İmam Hatip Ortaokulu',
          branch: 'Matematik',
          status: TeacherStatus.APPROVED,
          verifiedAt: new Date(),
          approvedAt: new Date(),
          classrooms: {
            create: [
              { name: '5-A', gradeLevel: 5, school: 'Edirne Selimiye İmam Hatip Ortaokulu' },
              { name: '5-B', gradeLevel: 5, school: 'Edirne Selimiye İmam Hatip Ortaokulu' },
            ],
          },
        },
      },
    },
    include: { teacherProfile: true },
  });
  console.log('✅ Onaylı Öğretmen oluşturuldu:', teacher1User.email);

  // 3. Onay Bekleyen Öğretmen (Kadıköy)
  const teacher2User = await prisma.user.upsert({
    where: { email: 'zeynep.kaya@meb.k12.tr' },
    update: {},
    create: {
      email: 'zeynep.kaya@meb.k12.tr',
      name: 'Zeynep Kaya',
      role: Role.TEACHER,
      avatar: '👩‍🏫',
      teacherProfile: {
        create: {
          phone: '0532 987 65 43',
          city: 'İstanbul',
          district: 'Kadıköy',
          school: 'Kadıköy Melahat Şefizade Ortaokulu',
          branch: 'Matematik',
          status: TeacherStatus.PENDING_ADMIN_APPROVAL,
          verifiedAt: new Date(),
        },
      },
    },
  });
  console.log('✅ Onay Bekleyen Öğretmen oluşturuldu:', teacher2User.email);

  // 4. Öğrenciler
  if (teacher1User.teacherProfile) {
    const student1 = await prisma.user.upsert({
      where: { email: 'hasan.ogrenci@meb.k12.tr' },
      update: {},
      create: {
        email: 'hasan.ogrenci@meb.k12.tr',
        name: 'Çırak Hasan',
        role: Role.STUDENT,
        avatar: '🎓',
        studentProfile: {
          create: {
            studentNumber: '104',
            gradeLevel: 5,
            classSection: '5-A',
            city: 'Edirne',
            district: 'Merkez',
            school: 'Edirne Selimiye İmam Hatip Ortaokulu',
            teacherId: teacher1User.teacherProfile.id,
            points: 450,
          },
        },
      },
    });
    console.log('✅ Öğrenci oluşturuldu:', student1.email);
  }

  // 5. Rozetler
  const badges = [
    {
      slug: 'first-step',
      title: 'İlk Adım',
      description: 'İlk interaktif dersi başlattın!',
      icon: 'Sparkles',
      pointsRequired: 50,
    },
    {
      slug: 'geometry-master',
      title: 'Geometri Kaşifi',
      description: 'Doğru, Işın ve Doğru Parçası çizimini tamamladın.',
      icon: 'Shapes',
      pointsRequired: 150,
    },
    {
      slug: 'maarif-genius',
      title: 'Maarif Yıldızı',
      description: 'Ders değerlendirme testini yüksek başarıyla tamamladın.',
      icon: 'Award',
      pointsRequired: 300,
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }
  console.log('✅ Rozetler oluşturuldu.');

  // 6. Öz Değerlendirme Rubrik Formları (SelfAssessmentSubmission)
  const sampleSubmissions = [
    {
      id: 'sub-seed-01',
      studentName: 'Ahmet Yılmaz',
      studentNumber: '101',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.3',
      outcomeCode: 'MAT.5.3.3',
      outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
      totalScore: 20,
      maxScore: 20,
      percentage: 100,
      performanceLevel: 'Mükemmel',
      studentNote: 'İletkiyi 360 derece döndürerek eğik duran açıları tam sıfırlayıp ölçmeyi çok iyi kavradım.',
      teacherFeedback: 'Harika bir performans Ahmet! Radar simülasyonundaki hassas açı ölçümlerin mükemmeldi.',
    },
    {
      id: 'sub-seed-02',
      studentName: 'Zeynep Kaya',
      studentNumber: '204',
      gradeLevel: 6,
      classSection: '6-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.6.1.3',
      outcomeCode: 'MAT.6.1.3',
      outcomeTitle: 'Asal Sayılar ve Asal Çarpanlara Ayırma',
      ratings: { c1: 4, c2: 4, c3: 3, c4: 4, c5: 4 },
      totalScore: 19,
      maxScore: 20,
      percentage: 95,
      performanceLevel: 'Mükemmel',
      studentNote: 'Eratosthenes kalburunda 2,3,5 ve 7 katlarını eleyerek asalların kalmasını çok sevdim.',
      teacherFeedback: 'Çok başarılı Zeynep, asal çarpan ağacındaki adımların çok düzenliydi.',
    },
    {
      id: 'sub-seed-03',
      studentName: 'Beren Kurt',
      studentNumber: '102',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.1',
      outcomeCode: 'MAT.5.3.1',
      outcomeTitle: 'Doğru, Doğru Parçası ve Işın ile İlgili Temel Geometrik Çizimler',
      ratings: { c1: 3, c2: 4, c3: 4, c4: 3, c5: 3 },
      totalScore: 17,
      maxScore: 20,
      percentage: 85,
      performanceLevel: 'Mükemmel',
      studentNote: 'Doğru parçasının iki ucu sınırlı olduğu için uzunluğu ölçülebiliyor.',
      teacherFeedback: 'Kavramsal açıklamaların çok net Beren!',
    }
  ];

  for (const s of sampleSubmissions) {
    await prisma.selfAssessmentSubmission.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log('✅ Öz Değerlendirme Formları oluşturuldu.');

  // 7. Öğrenme Günlükleri (LearningJournal)
  const sampleJournals = [
    {
      id: 'jrn-seed-01',
      studentName: 'Zeynep Kaya',
      studentNumber: '204',
      gradeLevel: 6,
      classSection: '6-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.6.1.3',
      outcomeCode: 'MAT.6.1.3',
      outcomeTitle: 'Asal Sayılar ve Asal Çarpanlara Ayırma',
      prompt: 'Bugün asal sayılar ve çarpan ağacı hakkında öğrendiğim en şaşırtıcı özellik şuydu:',
      studentReflection: 'Eratosthenes kalburunda sadece 2, 3, 5 ve 7 nin katlarını elediğimizde 1-100 arasındaki tüm 25 asal sayının kendiliğinden parladığını gördüm.',
      teacherFeedback: 'Harika bir matematiksel farkındalık Zeynep!',
      teacherLiked: true,
    },
    {
      id: 'jrn-seed-02',
      studentName: 'Ahmet Demir',
      studentNumber: '215',
      gradeLevel: 6,
      classSection: '6-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.6.1.4',
      outcomeCode: 'MAT.6.1.4',
      outcomeTitle: 'İki Doğal Sayının Ortak Bölenleri ve Ortak Katları',
      prompt: 'Ortak bölen ve ortak kat kavramlarını günlük hayatta nerelerde kullanabileceğimizi fark ettiniz mi?',
      studentReflection: 'Eşit paketleme problemlerinde EBOB, ortak nöbet ve sefer sürelerinde EKOK kullanıldığını keşfettim.',
      teacherFeedback: 'Günlük hayat modellemen harika Ahmet!',
      teacherLiked: true,
    },
    {
      id: 'jrn-seed-03',
      studentName: 'Beren Kurt',
      studentNumber: '101',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.3',
      outcomeCode: 'MAT.5.3.3',
      outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      prompt: 'Bugün açılar ve iletki kullanımı ile ilgili keşfettiğim en önemli kural:',
      studentReflection: 'Açının kollarının uzunluğu ne olursa olsun açının derecesi değişmez çünkü açı iki ışın arasındaki açıklıktır.',
      teacherFeedback: 'Kavram yanılgısını mükemmel aşmışsın Beren!',
      teacherLiked: true,
    }
  ];

  for (const j of sampleJournals) {
    await prisma.learningJournal.upsert({
      where: { id: j.id },
      update: j,
      create: j,
    });
  }
  console.log('✅ Öğrenme Günlükleri oluşturuldu.');

  // 8. Akran Değerlendirme Formları (PeerEvaluationSubmission)
  const samplePeerEvaluations = [
    {
      id: 'pe-seed-01',
      evaluatorStudentName: 'Ahmet Yılmaz',
      evaluatorStudentNumber: '101',
      targetStudentName: 'Çırak Hasan',
      targetStudentNumber: '104',
      targetAvatar: '👦',
      groupName: 'Pisagor Kaşifleri',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.3',
      outcomeCode: 'MAT.5.3.3',
      outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
      totalScore: 20,
      maxScore: 20,
      percentage: 100,
      performanceLevel: 'Mükemmel',
      evaluatorNote: 'Hasan iletkiyi ve radarı çok hızlı kullanıyor, grupta dar ve geniş açıları modellerken bize liderlik etti.',
    },
    {
      id: 'pe-seed-02',
      evaluatorStudentName: 'Zeynep Kaya',
      evaluatorStudentNumber: '102',
      targetStudentName: 'Çırak Hasan',
      targetStudentNumber: '104',
      targetAvatar: '👦',
      groupName: 'Pisagor Kaşifleri',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.3',
      outcomeCode: 'MAT.5.3.3',
      outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      ratings: { c1: 4, c2: 4, c3: 4, c4: 3, c5: 4 },
      totalScore: 19,
      maxScore: 20,
      percentage: 95,
      performanceLevel: 'Mükemmel',
      evaluatorNote: 'Işınları döndürüp açı oluşturmada ve derece ölçmede çok başarılı.',
    },
    {
      id: 'pe-seed-03',
      evaluatorStudentName: 'Çırak Hasan',
      evaluatorStudentNumber: '104',
      targetStudentName: 'Ahmet Yılmaz',
      targetStudentNumber: '101',
      targetAvatar: '👦',
      groupName: 'Pisagor Kaşifleri',
      gradeLevel: 5,
      classSection: '5-A',
      school: 'Edirne Selimiye İmam Hatip Ortaokulu',
      outcomeId: 'MAT.5.3.3',
      outcomeCode: 'MAT.5.3.3',
      outcomeTitle: 'Açıları Ölçmek İçin Matematiksel Araç ve Teknolojiden Yararlanabilme',
      ratings: { c1: 4, c2: 4, c3: 4, c4: 4, c5: 4 },
      totalScore: 20,
      maxScore: 20,
      percentage: 100,
      performanceLevel: 'Mükemmel',
      evaluatorNote: 'Ahmet açı çeşitlerini ve derece okumalarını hatasız yaptı.',
    }
  ];

  for (const pe of samplePeerEvaluations) {
    await prisma.peerEvaluationSubmission.upsert({
      where: { id: pe.id },
      update: pe,
      create: pe,
    });
  }
  console.log('✅ Akran Değerlendirme Formları oluşturuldu.');

  console.log('✨ Tohumlama (Seed) işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
