"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    // Giả lập delay xóa
    await new Promise(resolve => setTimeout(resolve, 800));
    onConfirm();
    setIsDeleting(false);
    onClose();
    alert("Đã xóa sản phẩm thành công!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-sm text-gray-500 mb-8 px-4">
              Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-gray-900">"{productName}"</span>? Hành động này không thể hoàn tác.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex-[1.5] bg-red-500 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Vâng, Xóa nó"}
              </button>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
