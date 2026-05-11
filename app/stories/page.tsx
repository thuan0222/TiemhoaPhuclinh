'use client';

import { motion } from "motion/react";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { ArrowRight, MessageCircle, Heart, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchStories } from "@/lib/firestore-utils";

const STATIC_STORIES = [
  {
    id: 1,
    title: "Lời Tỏ Tình Muộn Trong Sương Sớm",
    excerpt: "Gần 10 năm đơn phương, cuối cùng anh ấy cũng đủ dũng cảm để trao gửi tâm tình qua những nhành Lily trắng tinh khôi.",
    category: "Lãng Mạn",
    author: "Phúc Linh Team",
    date: "12 Tháng 4, 2024",
    image: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?q=80&w=800",
    color: "bg-blue-50"
  },
  {
    id: 2,
    title: "Hạnh Phúc Ngày Vu Quy",
    excerpt: "Bó hoa cầm tay với tông trắng xanh thanh lịch đã đồng hành cùng cô dâu Minh Anh trong ngày lễ trọng đại nhất cuộc đời.",
    category: "Đám Cưới",
    author: "Mai Phương",
    date: "05 Tháng 5, 2024",
    image: "https://images.unsplash.com/photo-1546032996-6dfacbadad8a?q=80&w=800",
    color: "bg-pink-50"
  },
  {
    id: 3,
    title: "Vẻ Đẹp Của Sự Chờ Đợi",
    excerpt: "Câu chuyện về một chàng trai ở xa đặt hoa tặng bạn gái mỗi tháng, duy trì tình yêu vượt qua hàng ngàn cây số.",
    category: "Chuyện Tình",
    author: "Anh Tuấn",
    date: "20 Tháng 4, 2024",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800",
    color: "bg-teal-50"
  },
  {
    id: 4,
    title: "Lời Cảm Ơn Chưa Sát Nghĩa",
    excerpt: "Đôi khi ngôn từ trở nên bất lực, và đó là lúc những bông Hồng Juliet lên tiếng để thay lời tri ân gửi đến người mẹ kính yêu.",
    category: "Tri Ân",
    author: "Phúc Linh Team",
    date: "15 Tháng 3, 2024",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800",
    color: "bg-amber-50"
  }
];

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchStories();
        if (data && data.length > 0) {
          setStories(data);
        } else {
          setStories(STATIC_STORIES);
        }
      } catch (err) {
        setStories(STATIC_STORIES);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      <Header />
      <FloatingContact />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center overflow-hidden mb-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1490750967868-88aa348ad51e?q=80&w=2000" 
              alt="Stories Backdrop" 
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F6]/50 to-[#FBF9F6]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight text-[#2D2926]">
                Câu Chuyện <span className="text-brand-teal italic font-light">Những</span> Loài Hoa
              </h1>
              <p className="max-w-2xl mx-auto text-gray-500 md:text-lg leading-relaxed">
                Mỗi đóa hoa tại Phúc Linh đều mang trong mình một tâm tình, một sứ mệnh kết nối những trái tim và lưu giữ những khoảnh khắc quý giá.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 py-20 flex justify-center">
                <Loader2 className="animate-spin text-brand-teal" size={48} />
              </div>
            ) : (
              stories.map((story, index) => (
                <motion.article 
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/stories/${story.id}`}>
                    <div className={cn("relative overflow-hidden rounded-3xl mb-8 aspect-[4/3]", story.color)}>
                      <motion.img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#2D2926]">
                          {story.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="px-2">
                    <div className="flex items-center space-x-4 mb-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {story.date}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>Bởi {story.author}</span>
                    </div>
                    
                    <Link href={`/stories/${story.id}`}>
                      <h2 className="font-serif text-3xl md:text-4xl mb-4 group-hover:text-brand-teal transition-colors">
                        {story.title}
                      </h2>
                    </Link>
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2 md:text-lg">
                      {story.excerpt}
                    </p>
                    
                    <Link 
                      href={`/stories/${story.id}`}
                      className="inline-flex items-center text-xs uppercase font-bold tracking-widest border-b-2 border-brand-teal pb-1 hover:text-brand-teal transition-all"
                    >
                      Đọc toàn bộ câu chuyện
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          {/* Testimonial Section */}
          <section className="mt-32 bg-brand-teal rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 floral-pattern" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Heart className="mx-auto mb-8 text-white/50" size={48} strokeWidth={1} />
              <h2 className="font-serif text-3xl md:text-5xl mb-8 max-w-3xl mx-auto italic leading-tight">
                "Hoa không chỉ là vật trang trí, hoa là ngôn ngữ của tâm hồn khi lời nói trở nên quá giản đơn."
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-[1px] bg-white/30" />
                <p className="uppercase tracking-[0.3em] text-[10px] font-bold">Founder of Phúc Linh</p>
                <div className="w-12 h-[1px] bg-white/30" />
              </div>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="mt-32 text-center">
            <h3 className="font-serif text-4xl mb-8">Bạn cũng có một câu chuyện muốn kể?</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">Hãy để chúng tôi giúp bạn truyền tải những thông điệp yêu thương qua những bó hoa được thiết kế riêng.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/collection" 
                className="bg-[#2D2926] text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-teal transition-colors w-full sm:w-auto"
              >
                Khám phá bộ sưu tập
              </Link>
              <button className="border border-[#2D2926] text-[#2D2926] px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Tư vấn cho tôi
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Copy (Simple version or reuse if possible) */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 floral-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">© 2024 Tiệm Hoa Phúc Linh. Crafted with love.</p>
        </div>
      </footer>
    </div>
  );
}
