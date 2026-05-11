"use client";

import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Heart, 
  Filter,
  Grid,
  List as ListIcon,
  ChevronRight,
  Instagram,
  Facebook
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ALL_PRODUCTS, Product } from "@/lib/data";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const CATEGORIES = ["Tất cả", "Mẫu hoa mới", "Bó hoa", "Lẵng Hoa", "Giỏ hoa", "Hoa sinh nhật"];
const SORT_OPTIONS = [
  { label: "Mặc định", value: "default" },
  { label: "Giá: Thấp đến Cao", value: "price-asc" },
  { label: "Giá: Cao đến Thấp", value: "price-desc" },
  { label: "Bán chạy nhất", value: "best-seller" },
];

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), orderBy("id", "asc"));
        const snapshot = await getDocs(q);
        const fetchedProducts = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.data().id || doc.id.replace('prod-', '')
        }));
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : ALL_PRODUCTS);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(ALL_PRODUCTS); // Fallback to static
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (selectedCategory !== "Tất cả") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "best-seller":
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      default:
        // Default sort
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      <Header />
      <FloatingContact />

      <main className="pt-24 lg:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-serif text-5xl mb-4">Bộ sưu tập hoa</h1>
            <p className="text-gray-500 max-w-2xl">
              Khám phá tất cả những thiết kế hoa tuyệt đẹp từ Tiệm Hoa Phúc Linh. Từ những bó hoa tươi thắm đến những lẵng hoa sang trọng.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="sticky top-24 md:top-32 z-40 bg-[#FBF9F6]/80 backdrop-blur-md py-6 border-y border-gray-200 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mẫu hoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-brand-teal transition-colors"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Category Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:border-brand-teal transition-colors">
                    <span>{selectedCategory}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "w-full text-left px-6 py-3 text-sm hover:bg-gray-50 transition-colors",
                          selectedCategory === cat ? "text-brand-teal font-bold bg-brand-teal/5" : "text-gray-600"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:border-brand-teal transition-colors">
                    <Filter size={16} className="mr-1" />
                    <span>Sắp xếp: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={cn(
                          "w-full text-left px-6 py-3 text-sm hover:bg-gray-50 transition-colors",
                          sortBy === opt.value ? "text-brand-teal font-bold bg-brand-teal/5" : "text-gray-600"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((flower, idx) => (
                  <motion.div 
                    layout
                    key={flower.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link href={`/product/${flower.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-3 md:mb-6 bg-gray-100">
                        <img 
                          src={flower.image}
                          alt={flower.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        {flower.salesCount > 200 && (
                          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-orange-500 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            Bán chạy
                          </div>
                        )}
                        <button className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 translate-y-10 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all hidden md:block">
                          <button className="w-full bg-[#2D2926] text-white py-3 text-xs uppercase tracking-widest rounded-lg">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mb-1">{flower.category}</p>
                      <h4 className="font-bold text-sm md:text-lg mb-1 line-clamp-1">{flower.name}</h4>
                      <p className="text-brand-teal font-bold text-xs md:text-base">{flower.price}</p>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="font-serif text-2xl mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-400">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tất cả");
                  setSortBy("default");
                }}
                className="mt-8 text-brand-teal font-medium underline underline-offset-4"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-[#2D2926] mb-6">
                TIỆM HOA <span className="text-gray-400 font-light italic">Phúc</span> LINH
              </h1>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Mang nghệ thuật hoa tươi vào không gian sống của bạn. Mỗi bó hoa là một câu chuyện tình yêu.
              </p>
            </div>
            
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Sản phẩm</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  {CATEGORIES.slice(1).map(cat => (
                    <li key={cat}>
                      <button onClick={() => setSelectedCategory(cat)} className="hover:text-black transition-colors">
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Hỗ trợ</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                  <li><Link href="#" className="hover:text-black transition-colors">Giao hàng</Link></li>
                  <li><Link href="#" className="hover:text-black transition-colors">Đổi trả</Link></li>
                  <li><Link href="#" className="hover:text-black transition-colors">Chính sách bảo mật</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Kết nối</h4>
                <div className="flex space-x-6">
                  <Link href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram size={20} /></Link>
                  <Link href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook size={20} /></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
            © 2024 Tiệm Hoa Phúc Linh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
