"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, ArrowRight, Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Allow legacy admin/admin for bypass or use firebase if it looks like an email
      if (email === "admin" && password === "admin") {
        router.push("/admin");
        onClose();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      setError("Email hoặc mật khẩu không chính xác. " + (err.code === 'auth/invalid-credential' ? "" : err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError("Lỗi đăng nhập Google: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header with Background Decorative Element */}
            <div className="relative h-32 bg-brand-teal flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(circle,white_0%,transparent_70%)]" />
                </div>
              <h2 className="relative font-serif text-3xl text-white italic">
                {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
              </h2>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-8 sm:p-10">
              <form className="space-y-5" onSubmit={handleLogin}>
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {error && (
                    <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#2D2926] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center group mt-4 h-14"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-white px-4 text-gray-400">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <img src="https://www.svgrepo.com/show/475656/google_color.svg" className="w-5 h-5 mr-3" alt="Google" />
                  Tiếp tục với Google
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-500">
                {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                <button 
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="ml-2 text-brand-teal font-bold hover:underline underline-offset-4"
                >
                  {mode === "login" ? "Đăng ký ngay" : "Đăng nhập ngay"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
