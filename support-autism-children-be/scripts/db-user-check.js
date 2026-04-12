const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Kiểm tra kết nối DB và các bảng trong schema public...');
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
    const names = tables.map(t => t.tablename ?? t.table_name);
    console.log('Bảng trong public:', names);

    console.log('\nDanh sách users hiện có (tối đa 10):');
    const usersBefore = await prisma.user.findMany({ take: 10 });
    console.log(usersBefore);

    console.log('\nTạo 1 user mới...');
    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        birthDate: new Date('2017-01-01'),
        avatarUrl: null,
        totalPoints: 0,
        streakDays: 0,
        accuracyRate: 0.0,
        totalPracticeMinutes: 0,
        currentLevel: 1,
      },
    });
    console.log('Đã tạo user:', newUser);

    console.log('\nTìm lại user vừa tạo bằng id:');
    const fetched = await prisma.user.findUnique({ where: { id: newUser.id } });
    console.log(fetched);

    console.log('\nDanh sách users sau khi thêm (tối đa 10):');
    const usersAfter = await prisma.user.findMany({ take: 10 });
    console.log(usersAfter);
  } catch (err) {
    console.error('Lỗi khi thao tác DB:', err.message ?? err);
  } finally {
    await prisma.$disconnect();
  }
})();