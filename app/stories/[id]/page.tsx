'use client';

import { motion } from "motion/react";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { ArrowLeft, Quote, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const DETAILED_STORIES: Record<string, any> = {
  "1": {
    title: "Lời Tỏ Tình Muộn Trong Sương Sớm",
    subtitle: "Chuyện về nhành Lily trắng và 10 năm thầm lặng",
    category: "Lãng Mạn",
    author: "Phúc Linh Team",
    date: "12 Tháng 4, 2024",
    image: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?q=80&w=1200",
    content: [
      "Có những tình yêu giống như nụ hoa, cần rất nhiều thời gian để ấp ủ trước khi bừng nở. Câu chuyện của anh T. là một ví dụ như thế. Gần 10 năm làm bạn, anh đã quá quen với vị trí 'người đứng sau', lặng lẽ quan sát cuộc sống của cô ấy.",
      "Vào một buổi sáng sương mù giăng kín lối, anh đến tiệm hoa của chúng tôi với một yêu cầu: 'Hãy cho tôi một bó hoa mang lại cảm giác bình yên nhưng vẫn đủ kiên định'. Chúng tôi đã chọn Lily trắng làm chủ đạo - biểu tượng của sự thuần khiết và lòng thủy chung son sắt.",
      "Với những nhành Lily vươn cao, được bao bọc bởi lá xanh thẫm, bó hoa mang thông điệp về một tình yêu đã trưởng thành, không còn bốc đồng nhưng lại vô cùng bền bỉ. Khi cô ấy nhận được bó hoa cùng lá thư tay ngắn gọn, đó cũng là lúc nụ hoa 10 năm chính thức nở rộ. Một cái kết ngọt ngào cho sự kiên nhẫn và chân thành."
    ],
    motto: "Tình yêu chân thành luôn xứng đáng được chờ đợi."
  },
  "2": {
    title: "Hạnh Phúc Ngày Vu Quy",
    subtitle: "Khoảnh khắc linh thiêng trong sắc trắng tinh khôi",
    category: "Đám Cưới",
    author: "Mai Phương",
    date: "05 Tháng 5, 2024",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbadad8a?q=80&w=1200",
    content: [
      "Đám cưới của Minh Anh và Tuấn là một trong những dự án hoa cưới để lại nhiều ấn tượng nhất cho Phúc Linh. Cô dâu mong muốn một không gian mang hơi thở châu Âu, sang trọng nhưng không quá cầu kỳ.",
      "Chúng tôi đã tư vấn sử dụng hoa Linh Lan kết hợp cùng Hồng trắng và một chút sắc xanh của lá bạc. Bó hoa cầm tay cô dâu được thiết kế theo dáng rủ nhẹ nhàng, tôn lên vẻ thanh thoát của chiếc váy cưới lụa satin.",
      "Giây phút Minh Anh bước vào lễ đường, bó hoa không chỉ là phụ kiện, nó là người bạn đồng hành, là chứng nhân cho lời thề ước trăm năm. Ánh mắt lấp lánh của họ khi trao nhau nhẫn cưới giữa làn hương thơm dịu nhẹ đã làm lay động tất cả quan khách có mặt hôm ấy."
    ],
    motto: "Khởi đầu tuyệt đẹp cho một hành trình trăm năm hạnh phúc."
  }
};

export default function StoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      // Static fallback
      const staticStory = DETAILED_STORIES[id];
      
      try {
        const docRef = doc(db, "stories", id.startsWith('story-') ? id : `story-${id}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setStory({
            ...docSnap.data(),
            id: id
          });
        } else if (staticStory) {
          setStory(staticStory);
        } else {
          // Final fallback
          setStory(DETAILED_STORIES["1"]);
        }
      } catch (error) {
        console.error("Error fetching story details:", error);
        setStory(staticStory || DETAILED_STORIES["1"]);
      }
    };

    if (id) {
      fetchStoryDetails();
    }
  }, [id]);

  if (!story) return null;

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      <Header />
      <FloatingContact />

      <main className="pt-24 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/stories" 
            className="inline-flex items-center text-xs uppercase font-bold tracking-widest text-gray-400 hover:text-brand-teal transition-colors mb-12"
          >
            <ArrowLeft size={14} className="mr-2" />
            Quay lại danh sách câu chuyện
          </Link>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest mb-6 inline-block">
              {story.category}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-8 tracking-tight text-[#2D2926] leading-tight">
              {story.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-serif italic mb-10">
              {story.subtitle}
            </p>
            
            <div className="flex items-center justify-between py-8 border-y border-gray-100">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Tác giả</p>
                  <p className="font-medium">{story.author}</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Ngày đăng</p>
                  <p className="font-medium">{story.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-brand-teal">
                  <Share2 size={20} />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-pink-500">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="aspect-[16/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl"
          >
            <img 
              src={story.image} 
              className="w-full h-full object-cover" 
              alt={story.title} 
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-serif mb-20">
            {story.content.map((paragraph: string, i: number) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-gray-600 leading-relaxed mb-8 md:text-xl font-light"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Quote Block */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-brand-teal/5 rounded-[40px] p-12 md:p-16 flex flex-col items-center text-center mb-20"
          >
            <Quote size={40} className="text-brand-teal/20 mb-8" />
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-brand-teal mb-4">
              "{story.motto}"
            </h3>
          </motion.div>

          {/* Footer Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between py-12 border-t border-gray-100 gap-8">
            <Link 
              href="/stories"
              className="flex items-center space-x-4 group"
            >
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#2D2926] group-hover:text-white transition-all">
                <ArrowLeft size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Xem tất cả</p>
                <p className="font-medium">Quay lại danh sách</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <p className="text-sm italic text-gray-400">Bạn thấy câu chuyện này thế nào?</p>
              <button className="flex items-center gap-2 px-6 py-3 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-pink-100 transition-colors">
                <Heart size={16} />
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white pt-20 pb-10 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 floral-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">© 2024 Tiệm Hoa Phúc Linh. Crafted with love.</p>
        </div>
      </footer>
    </div>
  );
}
