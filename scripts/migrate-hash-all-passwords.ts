import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://maarif_user:maarif_password123@localhost:5432/maarif_db?schema=public';

async function migrateAllPasswords() {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    console.log('🔒 Veritabanındaki tüm kullanıcı şifreleri taranıyor...');
    const res = await client.query('SELECT id, email, name, password, role FROM users');
    console.log(`Toplam ${res.rows.length} kullanıcı bulundu.`);

    for (const user of res.rows) {
      let plain = user.password;
      if (!plain || plain.trim() === '') {
        // Assign default demo/role password if null
        plain = user.email === 'powerose@gmail.com' ? 'Admin1234' : 'admin';
      }

      if (plain.startsWith('$2a$') || plain.startsWith('$2b$') || plain.startsWith('$2y$')) {
        console.log(`✓ Zaten bcrypt hash'li: ${user.email || user.id}`);
        continue;
      }

      const hashed = await bcrypt.hash(plain, 10);
      await client.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
      console.log(`🔐 Hash'lendi ve güncellendi: ${user.email || user.id} -> ${hashed.substring(0, 15)}...`);
    }

    console.log('✅ Tüm kullanıcı şifreleri başarıyla bcryptjs.hash(..., 10) ile güncellendi!');
  } catch (err) {
    console.error('❌ Hata oluştu:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateAllPasswords();
