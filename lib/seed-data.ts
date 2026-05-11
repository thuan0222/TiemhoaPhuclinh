import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ALL_PRODUCTS } from './data';
import { OperationType, handleFirestoreError } from './firestore-utils';

const STORIES_TO_SEED = [
  {
    id: 1,
    title: "Lời Tỏ Tình Muộn Trong Sương Sớm",
    subtitle: "Chuyện về nhành Lily trắng và 10 năm thầm lặng",
    excerpt: "Gần 10 năm đơn phương, cuối cùng anh ấy cũng đủ dũng cảm để trao gửi tâm tình qua những nhành Lily trắng tinh khôi.",
    category: "Lãng Mạn",
    author: "Phúc Linh Team",
    date: "12 Tháng 4, 2024",
    image: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?q=80&w=1200",
    content: [
      "Có những tình yêu giống như nụ hoa, cần rất nhiều thời gian để ấp ủ trước khi bừng nở. Câu chuyện của anh T. là một ví dụ như thế. Gần 10 năm làm bạn, anh đã quá quen với vị trí 'người đứng sau', lặng lẽ quan sát cuộc sống của cô ấy.",
      "Vào một buổi sáng sương mù giăng kín lối, anh đến tiệm hoa của chúng tôi với một yêu cầu: 'Hãy cho tôi một bó hoa mang lại cảm giác bình yên nhưng vẫn đủ kiên định'. Chúng tôi đã chọn Lily trắng làm chủ đạo - biểu tượng của sự thuần khiết và lòng thủy chung son sắt.",
      "Với những nhành Lily vươn cao, được bao bọc bởi lá xanh thẫm, bó hoa mang thông điệp về một tình yêu đã trưởng thành, không còn bốc đồng nhưng lại vô cùng bền bỉ. Khi cô ấy nhận được bó hoa cùng lá thư tay ngắn gọn, đó cũng là lúc nụ hoa 10 năm chính thức nở rộ. Một cái kết ngọt ngào cho sự kiên nhẫn và chân thành."
    ],
    motto: "Tình yêu chân thành luôn xứng đáng được chờ đợi.",
    color: "bg-blue-50"
  },
  {
    id: 2,
    title: "Hạnh Phúc Ngày Vu Quy",
    subtitle: "Khoảnh khắc linh thiêng trong sắc trắng tinh khôi",
    category: "Đám Cưới",
    author: "Mai Phương",
    date: "05 Tháng 5, 2024",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbadad8a?q=80&w=1200",
    excerpt: "Câu chuyện về lễ cưới lãng mạn của Minh Anh và Tuấn, nơi những chùm hoa Linh Lan thanh khiết làm chứng nhân cho tình yêu.",
    content: [
      "Đám cưới của Minh Anh và Tuấn là một trong những dự án hoa cưới để lại nhiều ấn tượng nhất cho Phúc Linh. Cô dâu mong muốn một không gian mang hơi thở châu Âu, sang trọng nhưng không quá cầu kỳ.",
      "Chúng tôi đã tư vấn sử dụng hoa Linh Lan kết hợp cùng Hồng trắng và một chút sắc xanh của lá bạc. Bó hoa cầm tay cô dâu được thiết kế theo dáng rủ nhẹ nhàng, tôn lên vẻ thanh thoát của chiếc váy cưới lụa satin.",
      "Giây phút Minh Anh bước vào lễ đường, bó hoa không chỉ là phụ kiện, nó là người bạn đồng hành, là chứng nhân cho lời thề ước trăm năm. Ánh mắt lấp lánh của họ khi trao nhau nhẫn cưới giữa làn hương thơm dịu nhẹ đã làm lay động tất cả quan khách có mặt hôm ấy."
    ],
    motto: "Khởi đầu tuyệt đẹp cho một hành trình trăm năm hạnh phúc.",
    color: "bg-pink-50"
  }
];

export async function seedDatabase() {
  console.log('--- STARTING SEED PROCESS ---');
  
  if (!ALL_PRODUCTS || ALL_PRODUCTS.length === 0) {
    console.error('ALL_PRODUCTS is empty or undefined!');
  } else {
    console.log(`Ready to seed ${ALL_PRODUCTS.length} products.`);
  }

  // Seed Products
  for (const product of ALL_PRODUCTS) {
    const docId = `prod-${product.id}`;
    console.log(`Seeding product [${docId}]: ${product.name}...`);
    try {
      await setDoc(doc(db, 'products', docId), {
        ...product,
        updatedAt: serverTimestamp()
      });
      console.log(`SUCCESS: Seeded product ${product.name}`);
    } catch (error) {
      console.error(`FAILED: Product ${product.name}`, error);
      handleFirestoreError(error, OperationType.WRITE, `products/${docId}`);
    }
  }

  console.log(`Ready to seed ${STORIES_TO_SEED.length} stories.`);
  // Seed Stories
  for (const story of STORIES_TO_SEED) {
    const docId = `story-${story.id}`;
    console.log(`Seeding story [${docId}]: ${story.title}...`);
    try {
      await setDoc(doc(db, 'stories', docId), {
        ...story,
        updatedAt: serverTimestamp()
      });
      console.log(`SUCCESS: Seeded story ${story.title}`);
    } catch (error) {
      console.error(`FAILED: Story ${story.title}`, error);
      handleFirestoreError(error, OperationType.WRITE, `stories/${docId}`);
    }
  }

  console.log('--- SEEDING COMPLETE! ---');
}
