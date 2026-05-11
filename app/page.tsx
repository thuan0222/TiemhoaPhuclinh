"use client";

import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X, ArrowRight, Heart, Instagram, Facebook, Phone, ShoppingCart, Truck, ShieldCheck, Flower2, Flower } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ALL_PRODUCTS, CATEGORIES_DATA } from "@/lib/data";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { fetchProducts } from "@/lib/firestore-utils";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
  "https://res.cloudinary.com/dzprh8cvv/image/upload/v1777704619/hinh-anh-lang-hoa-dep-2_fr8wdn.jpg",
  "https://res.cloudinary.com/dzprh8cvv/image/upload/v1777704691/2017-10-28-18-05-12-960x624_ztpdpw.jpg",
  "https://res.cloudinary.com/dzprh8cvv/image/upload/v1777704845/ad-4nxcwjbnuwlsfdjxwuxmpkmt4p35psb4iaferfxfzyjkd814dp5ujvze020brasx0jc4hzhx6pwfeuz1soznw-u4qpror9vqtjqc8bhozfbqkuauyfdny-nycmimougoplqe2evjoi-hno7dmfasiuz8g38rx-37527768192563335490157_e8wdm0.webp"
];

export default function Home() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(ALL_PRODUCTS);
        }
      } catch (err) {
        setProducts(ALL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const dynamicCategories = useMemo(() => {
    return CATEGORIES_DATA.map(category => ({
      ...category,
      items: products.filter(p => p.category === category.title)
    }));
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <FloatingContact />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:h-[90vh] flex items-center overflow-hidden pt-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="z-10 order-2 lg:order-1"
            >
              <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 md:mb-6 font-semibold">
                Nghệ thuật & Tinh tế
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] md:leading-[0.9] mb-6 md:mb-8 text-[#2D2926]">
                Đánh thức <br />
                <span className="italic font-light text-gray-400">cảm xúc</span> <br />
                từ thiên nhiên
              </h2>
              <p className="text-gray-500 text-base md:text-lg mb-8 md:mb-10 max-w-md leading-relaxed">
                Tiệm Hoa Phúc Linh - Blooms to Brighten Your Day. Chúng tôi tạo ra những tác phẩm nghệ thuật từ hoa tươi, mang vẻ đẹp tinh khiết nhất đến không gian sống của bạn.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="w-full sm:w-auto bg-[#2D2926] text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-black transition-all flex justify-center items-center group">
                  Khám phá ngay <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
            
            <div className="relative aspect-[4/5] lg:aspect-square order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentHeroIndex}
                  src={HERO_IMAGES[currentHeroIndex]}
                  alt="Beautiful floral arrangement"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover rounded-[40px] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                {HERO_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-500",
                      currentHeroIndex === idx ? "bg-white w-8" : "bg-white/40"
                    )}
                  />
                ))}
              </div>
              <div className="absolute -bottom-0 -left-8 bg-white p-6 rounded-2xl shadow-lg hidden sm:block max-w-[300px]">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Như những bông hoa</p>
                <p className="font-serif text-lg leading-tight">Em làm trái tim anh nở rộ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Categories */}
      {dynamicCategories.map((category, catIdx) => (
        <section key={catIdx} className={cn("py-16 md:py-24 relative overflow-hidden", catIdx % 2 === 0 ? "bg-white" : "bg-[#FBF9F6]")}>
          {catIdx % 2 !== 0 && (
            <div className="absolute inset-0 floral-pattern opacity-[0.03] pointer-events-none" />
          )}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 space-y-4 sm:space-y-0">
              <div className="relative">
                <div className="absolute -left-6 -top-2 text-brand-teal/10 rotate-[-15deg]">
                  <Flower2 size={40} />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl mb-2 relative">{category.title}</h3>
                <p className="text-gray-500 text-sm md:text-base">{category.subtitle}</p>
              </div>
              <Link href="/collection" className="text-xs md:text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all font-bold">
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {category.items.map((flower, idx) => (
                <motion.div 
                  key={flower.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/product/${flower.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3 md:mb-6 bg-gray-100">
                      <img 
                        src={flower.image}
                        alt={flower.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3 translate-y-10 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all hidden md:block">
                        <button className="w-full bg-[#2D2926] text-white py-3 text-xs uppercase tracking-widest rounded-lg">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm md:text-lg mb-1 line-clamp-1">{flower.name}</h4>
                    <p className="text-brand-teal font-bold text-xs md:text-base">{flower.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* About Section */}
      <section className="py-16 md:py-24 bg-[#FBF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2D2926] rounded-[32px] md:rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center text-white">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 md:mb-8 font-bold">Về chúng tôi</span>
              <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight">
                Mỗi nhành hoa là một <span className="italic text-gray-300 font-light underline underline-offset-8">câu chuyện</span> riêng biệt
              </h3>
              <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-12 leading-relaxed max-w-lg">
                Tại Tiệm Hoa Phúc Linh, chúng tôi không chỉ bán hoa. Chúng tôi vun đắp yêu thương và sự trân trọng qua từng thiết kế tinh xảo, sử dụng nguồn hoa tươi tuyển chọn từ các trang trại tốt nhất.
              </p>
              <div className="grid grid-cols-2 gap-6 md:gap-8 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-serif mb-1 italic">100%</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Tươi mỗi ngày</p>
                </div>
                <div>
                  <p className="text-3xl font-serif mb-1 italic">2h</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Giao nhanh nội thành</p>
                </div>
              </div>
            </div>
            <div className="relative min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1519219602525-4c004396349c?q=80&w=1000&auto=format&fit=crop"
                alt="Florist working"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 floral-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <h1 className="font-serif text-2xl tracking-tight text-[#2D2926] mb-6">
                TIỆM HOA <span className="text-gray-400 font-light italic">Phúc</span> LINH
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Lan tỏa hương sắc và niềm hạnh phúc qua những mẫu hoa nghệ thuật đặc sắc nhất. Blooms to Brighten Your Day.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-black transition-colors"><Phone size={20} /></a>
              </div>
            </div>
            
            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Mua sắm</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black transition-colors">Tất cả hoa</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hoa sinh nhật</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hoa khai trương</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Quà tặng đặc biệt</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Thông tin</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-black transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Chính sách vận chuyển</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest mb-6">Liên hệ & Bản đồ</h5>
              <p className="text-sm text-gray-500 mb-4">Địa chỉ: 244B Đường Hoàng Mai, TP. Hà Nội</p>
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-sm border border-gray-100 grayscale-[0.3] hover:grayscale-0 transition-all">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1862.6074!2d105.8504!3d20.9930!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac10fc118279%3A0xc3415cf7209ece50!2zMjQ0QiDEkC4gSG_DoG5nIE1haSwgSG_DoG5nIE1haSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1714646845342!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 space-y-4 md:space-y-0">
            <p>© 2024 Tiệm Hoa Phúc Linh. Tất cả quyền được bảo lưu.</p>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-black">Privacy Policy</a>
              <a href="#" className="hover:text-black">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
