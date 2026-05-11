"use client";

import { motion } from "motion/react";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowLeft, 
  Heart, 
  Instagram, 
  Facebook, 
  Phone, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  ShieldCheck,
  Star
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ALL_PRODUCTS, Product } from "@/lib/data";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { fetchStories } from "@/lib/firestore-utils";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // First check static data as fallback or for faster initial load if needed
      const foundProduct = ALL_PRODUCTS.find(p => p.id.toString() === id || `prod-${p.id}` === id);
      
      try {
        const docRef = doc(db, "products", id.startsWith('prod-') ? id : `prod-${id}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Product;
          setProduct({
            ...data,
            id: data.id || id
          });
          
          // Find related products (still using static for now, or could fetch more from Firestore)
          const related = ALL_PRODUCTS
            .filter(p => p.category === data.category && p.id.toString() !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else if (foundProduct) {
          setProduct(foundProduct);
          const related = ALL_PRODUCTS
            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        if (foundProduct) setProduct(foundProduct);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Sản phẩm không tìm thấy</h2>
          <Link href="/" className="text-brand-teal underline underline-offset-4">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      <Header />
      <FloatingContact />

      <main className="pt-24 lg:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs & Back */}
          <div className="mb-12 flex items-center justify-between">
            <Link href="/" className="group flex items-center text-sm text-gray-500 hover:text-black transition-colors">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Quay lại cửa hàng
            </Link>
            <div className="text-xs uppercase tracking-widest text-gray-400">
              Trang chủ / {product.category} / {product.name}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl bg-white"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-8 right-8 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg hover:bg-white transition-all text-red-500">
                <Heart size={20} />
              </button>
            </motion.div>

            {/* Product Info */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center text-yellow-500 space-x-1">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <span className="text-gray-400 text-xs ml-1">(24 nhận xét)</span>
                  </div>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl text-[#2D2926] mb-6 leading-tight">
                  {product.name}
                </h1>
                
                <p className="font-serif text-3xl text-gray-600 italic mb-8 border-b border-gray-100 pb-8">
                  {product.price}
                </p>

                <p className="text-gray-500 leading-relaxed text-lg mb-10">
                  {product.description}
                </p>

                {product.details && (
                  <div className="mb-10">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-4">Chi tiết sản phẩm:</h3>
                    <ul className="grid grid-cols-2 gap-y-3">
                      {product.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mr-3" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase Controls */}
                <div className="flex flex-wrap gap-4 mb-12">
                  <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 font-medium text-lg min-w-[60px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button className="flex-1 bg-[#2D2926] text-white px-8 py-5 rounded-xl uppercase tracking-widest text-sm font-bold hover:bg-black transition-all flex items-center justify-center group shadow-xl shadow-black/5">
                    <ShoppingCart size={18} className="mr-3" />
                    Thêm vào giỏ
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Giao hỏa tốc</p>
                      <p className="text-xs text-gray-400">Trong vòng 2h</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Bảo hành tươi</p>
                      <p className="text-xs text-gray-400">Cam kết 3 ngày</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-40 border-t border-gray-100 pt-24">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h3 className="font-serif text-4xl mb-2">Sản phẩm tương tự</h3>
                  <p className="text-gray-500">Khám phá thêm những thiết kế cùng phong cách</p>
                </div>
                <Link href="/collection" className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all">
                  Xem tất cả
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <Link href={`/product/${item.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-gray-100">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <button className="w-full bg-[#2D2926] text-white py-3 text-xs uppercase tracking-widest rounded-lg">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-lg mb-1">{item.name}</h4>
                      <p className="text-gray-600 italic font-serif">{item.price}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-2xl tracking-tight text-[#2D2926] mb-6">
            TIỆM HOA <span className="text-gray-400 font-light italic">Phúc</span> LINH
          </h1>
          <p className="text-gray-400 text-xs">© 2024 Tiệm Hoa Phúc Linh. Lan tỏa hương sắc và niềm hạnh phúc.</p>
        </div>
      </footer>
    </div>
  );
}
