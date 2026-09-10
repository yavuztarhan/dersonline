import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed: 'npx ts-node -T prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://maarif_user:maarif_password123@localhost:5432/maarif_db?schema=public',
  },
});
