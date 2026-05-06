import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stories = [
    {
      title: 'Món quà sinh nhật',
      content: 'Hôm nay là sinh nhật của bé Bi. Mẹ đi làm về mang theo một hộp quà to màu xanh có thắt nơ đỏ. Bi mở quà ra và thấy một món đồ chơi mà mình đã thích từ rất lâu.',
      correctEmotionId: '1', // Vui vẻ
      explanation: 'Khi nhận được món quà mình thích vào ngày sinh nhật, chúng ta thường cảm thấy rất vui vẻ và hạnh phúc.',
    },
    {
      title: 'Đồ chơi bị hỏng',
      content: 'Cún đang chơi xếp hình ngoài sân. Bỗng nhiên, trời đổ mưa to, Cún vội chạy vào nhà nhưng để quên mất hộp đồ chơi ngoài sân. Khi tạnh mưa, đồ chơi của Cún đã bị ướt hết.',
      correctEmotionId: '2', // Buồn bã
      explanation: 'Khi món đồ chơi yêu thích bị hỏng hoặc bị ướt, cảm giác buồn bã là điều rất tự nhiên.',
    },
    {
      title: 'Tiếng sấm bất ngờ',
      content: 'Trời đang tối dần, bé Miu đang ngồi xem phim hoạt hình trong phòng. Đột nhiên, có một tiếng sấm rền vang "Đùng!" rất to khiến cửa kính rung lên.',
      correctEmotionId: '5', // Sợ hãi
      explanation: 'Những tiếng động lớn bất ngờ như sấm sét thường khiến chúng ta cảm thấy sợ hãi hoặc giật mình.',
    },
    {
      title: 'Trò đùa của anh hai',
      content: 'Bo vừa xếp xong một toà tháp lego rất cao và đẹp. Đột nhiên, anh hai chạy ngang qua, vô tình đá chân vào làm toà tháp đổ sập xuống nền nhà thành từng mảnh.',
      correctEmotionId: '3', // Giận dữ
      explanation: 'Khi công sức của mình bị người khác vô tình hoặc cố ý phá hỏng, chúng ta dễ cảm thấy giận dữ.',
    },
    {
      title: 'Người bạn mới đến',
      content: 'Sáng nay cô giáo dắt vào lớp một bạn mới. Bạn ấy có mái tóc màu cam rất lạ và mặc một chiếc áo có hình khủng long biết phát sáng.',
      correctEmotionId: '4', // Ngạc nhiên
      explanation: 'Khi nhìn thấy những điều mới mẻ, lạ lẫm hoặc không ngờ tới, chúng ta sẽ cảm thấy ngạc nhiên.',
    },
    {
      title: 'Món ăn lạ',
      content: 'Trong bữa cơm, mẹ gắp cho Tí một miếng rau có màu rất tối và mùi hơi hăng. Tí cắn thử một miếng, vị của nó đắng ngắt và khó nuốt.',
      correctEmotionId: '6', // Ghê tởm
      explanation: 'Khi phải ăn một món ăn có mùi vị khó chịu hoặc không quen thuộc, chúng ta có thể cảm thấy ghê cổ và không muốn ăn tiếp.',
    },
    {
      title: 'Sau cơn giông',
      content: 'Cơn mưa to vừa dứt, bầu trời trong xanh trở lại. Mi ngồi bên cửa sổ, hít thở không khí mát mẻ và nghe tiếng chim hót ríu rít trên cành cây.',
      correctEmotionId: '7', // Bình tĩnh
      explanation: 'Khung cảnh yên bình và âm thanh nhẹ nhàng của thiên nhiên giúp chúng ta cảm thấy thư giãn và bình tĩnh.',
    }
  ];

  for (const story of stories) {
    await prisma.story.create({
      data: story,
    });
  }

  console.log('✅ Seeded stories successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
