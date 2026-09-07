import { PrismaClient, Role, TeacherStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Maarif Akademi PostgreSQL veritabanı tohumlanıyor (Seeding)...');

  // 1. Admin Kullanıcı
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maarif.gov.tr' },
    update: {},
    create: {
      email: 'admin@maarif.gov.tr',
      name: 'Maarif Sistem Yöneticisi',
      role: Role.ADMIN,
      avatar: '🛡️',
    },
  });
  console.log('✅ Admin oluşturuldu:', adminUser.email);

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
