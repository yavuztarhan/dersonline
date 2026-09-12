import { PrismaClient, Role, TeacherStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://maarif_user:maarif_password123@localhost:5432/maarif_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Maarif Akademi PostgreSQL veritabanı tohumlanıyor (Seeding)...');

  // 1. Admin Kullanıcılar
  const adminUsers = [
    { email: 'powerose@gmail.com', firstName: 'Sistem Yöneticisi', lastName: 'Powerose', name: 'Sistem Yöneticisi (Powerose)', avatar: '🛡️' },
    { email: 'maarifakademi.com.tr@gmail.com', firstName: 'Maarif Akademi', lastName: 'Yönetim', name: 'Maarif Akademi Yönetim', avatar: '🛡️' },
    { email: 'viziteci325@gmail.com', firstName: 'Sistem Yöneticisi', lastName: 'Viziteci', name: 'Sistem Yöneticisi', avatar: '🛡️' },
  ];

  for (const admin of adminUsers) {
    const rawPass = admin.email === 'powerose@gmail.com' ? 'Admin1234' : 'admin';
    const hashedPass = bcrypt.hashSync(rawPass, 10);
    const createdAdmin = await prisma.user.upsert({
      where: { email: admin.email },
      update: { 
        role: Role.ADMIN,
        password: hashedPass
      },
      create: {
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        name: admin.name,
        password: hashedPass,
        role: Role.ADMIN,
        avatar: admin.avatar,
      },
    });
    console.log('✅ Admin oluşturuldu/güncellendi:', createdAdmin.email);
  }

  // 2. Onaylı Öğretmen (Edirne Selimiye İHO)
  const teacher1Pass = bcrypt.hashSync('admin', 10);
  const teacher1User = await prisma.user.upsert({
    where: { email: 'ahmet.ogretmen@meb.k12.tr' },
    update: { password: teacher1Pass },
    create: {
      email: 'ahmet.ogretmen@meb.k12.tr',
      firstName: 'Mimar Sinan & Hasan',
      lastName: 'Hoca',
      name: 'Mimar Sinan & Hasan Hoca',
      password: teacher1Pass,
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
        },
      },
    },
    include: { teacherProfile: true },
  });
  console.log('✅ Onaylı Öğretmen oluşturuldu:', teacher1User.email);

  // 4. Rozetler
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
