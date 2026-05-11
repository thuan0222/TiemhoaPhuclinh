"use client";

import { motion, AnimatePresence } from "motion/react";
import { Search, Menu, X, Heart, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ALL_PRODUCTS, Product } from "@/lib/data";
import AuthModal from "./AuthModal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = ALL_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-teal border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 lg:h-32 transition-all duration-300">
          <div className="flex-shrink-0 flex items-center h-full">
            <Link href="/" className="flex items-center h-full">
              <img 
                src="https://res.cloudinary.com/dzprh8cvv/image/upload/v1777705851/logo_clean_vtvb0g.png" 
                alt="Tiệm Hoa Phúc Linh Logo" 
                className="h-20 w-auto lg:h-28 object-contain scale-200 lg:scale-250 transform origin-left -ml-2 lg:ml-0"
                referrerPolicy="no-referrer"
              />
            </Link>
            <h1 className="text-logo hidden font-serif text-4xl tracking-tight text-white ml-4">
              TIỆM HOA <span className="text-white/70 font-light italic">Phúc</span> LINH
            </h1>
          </div>
          
          <div className="hidden lg:flex space-x-8 text-sm font-medium tracking-wide uppercase text-white">
            <Link href="/collection" className="hover:opacity-70 transition-opacity">Bộ sưu tập</Link>
            <Link href="#" className="hover:opacity-70 transition-opacity">Dịch vụ</Link>
            <Link href="/stories" className="hover:opacity-70 transition-opacity">Câu chuyện</Link>
            <Link href="#" className="hover:opacity-70 transition-opacity">Liên hệ</Link>
          </div>

          <div className="flex items-center space-x-5">
            {/* Search System */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 focus-within:bg-white focus-within:border-white transition-all group">
                <Search size={18} className="text-white group-focus-within:text-brand-teal" strokeWidth={1.5} />
                <input 
                  type="text"
                  placeholder="Tìm hoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setIsSearchOpen(true)}
                  className="bg-transparent border-none outline-none text-sm text-white focus:text-gray-900 ml-2 w-16 sm:w-40 lg:w-64 transition-all placeholder:text-white/50 focus:placeholder:text-gray-400"
                />
              </div>

              {/* Search Results Modal/Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed sm:absolute top-20 sm:top-auto left-4 right-4 sm:left-auto sm:right-0 sm:mt-4 w-auto sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kết quả tìm kiếm</span>
                      <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-black">
                        <X size={14} />
                      </button>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <Link 
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-sm text-gray-900 group-hover:text-brand-teal transition-colors">{product.name}</p>
                              <p className="text-xs text-brand-teal font-serif mt-1 italic">{product.price}</p>
                              <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-tighter">{product.category}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <p className="text-gray-400 text-sm italic">Không tìm thấy sản phẩm nào</p>
                        </div>
                      )}
                    </div>
                    {searchResults.length > 0 && (
                      <Link 
                        href="/collection" 
                        onClick={() => setIsSearchOpen(false)}
                        className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        Xem tất cả bộ sưu tập
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : setIsAuthModalOpen(true)}
                className="text-white hover:opacity-70 transition-opacity p-2 hover:bg-white/10 rounded-full flex items-center space-x-2"
              >
                {user ? (
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} className="w-8 h-8 rounded-full border border-white/20" alt="Profile" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={18} strokeWidth={1.5} />
                      </div>
                    )}
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest">{user.displayName || user.email?.split('@')[0]}</span>
                  </div>
                ) : (
                  <User size={22} strokeWidth={1.5} />
                )}
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                     <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tài khoản</p>
                        <p className="text-sm font-bold text-gray-900 truncate mt-1">{user.email}</p>
                     </div>
                     <div className="p-2 space-y-1">
                        {user.email === 'tranthuan05021996@gmail.com' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            Quản trị hệ thống
                          </Link>
                        )}
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          Đăng xuất
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-brand-teal z-[70] flex flex-col p-8 pt-32"
          >
            <button className="absolute top-12 right-8 text-white" onClick={() => setIsMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="flex flex-col space-y-8 text-2xl font-serif text-white italic">
              <Link href="/collection" onClick={() => setIsMenuOpen(false)}>Bộ sưu tập</Link>
              <Link href="#" onClick={() => setIsMenuOpen(false)}>Dịch vụ</Link>
              <Link href="/stories" onClick={() => setIsMenuOpen(false)}>Câu chuyện</Link>
              <Link href="#" onClick={() => setIsMenuOpen(false)}>Liên hệ</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
