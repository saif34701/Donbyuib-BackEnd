import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@bank.local' },
    update: {},
    create: {
      email: 'admin@bank.local',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
