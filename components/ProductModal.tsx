"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Loader2, DollarSign, Tag, Info, Package, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, initialData }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [availableCategories, setAvailableCategories] = useState(["Bó hoa", "Lẵng hoa", "Giỏ hoa", "Hoa cưới", "Hoa sinh nhật", "Mẫu hoa mới"]);
  const [newCatInput, setNewCatInput] = useState("");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    categories: Array.isArray(initialData?.category) ? initialData.category : (initialData?.category ? [initialData.category] : []),
    price: initialData?.price || "",
    description: initialData?.description || "",
    image: initialData?.image || ""
  });

  // Cập nhật categories nếu initialData có danh mục lạ
  useState(() => {
    if (initialData) {
      const initialCats = Array.isArray(initialData.category) ? initialData.category : [initialData.category];
      setAvailableCategories(prev => {
        const combined = Array.from(new Set([...prev, ...initialCats]));
        return combined.filter(Boolean);
      });
      
      setFormData({
        name: initialData.name,
        categories: initialCats,
        price: initialData.price,
        description: initialData.description,
        image: initialData.image
      });
      setImagePreview(initialData.image);
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNewCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    
    if (availableCategories.includes(trimmed)) {
      alert("Danh mục này đã tồn tại!");
      return;
    }

    setAvailableCategories(prev => [...prev, trimmed]);
    handleCategoryToggle(trimmed);
    setNewCatInput("");
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(cat);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter((c: string) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "my-project-md3");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dzprh8cvv/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Tải ảnh thất bại");

      const imageUrl = result.secure_url;

      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      alert("Tải ảnh lên thành công!");

    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Đã có lỗi xảy ra khi tải ảnh: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra không được để trống
    if (!formData.name.trim()) return alert("Vui lòng nhập tên sản phẩm");
    if (formData.categories.length === 0) return alert("Vui lòng chọn ít nhất một danh mục");
    if (!formData.price.trim()) return alert("Vui lòng nhập giá sản phẩm");
    if (!formData.description.trim()) return alert("Vui lòng nhập mô tả sản phẩm");
    if (!formData.image) return alert("Vui lòng tải lên hình ảnh sản phẩm");

    setIsSubmitting(true);
    
    try {
      // Calculate priceValue (remove non-digits and parse to number)
      const priceValue = parseInt(formData.price.replace(/[^\d]/g, '')) || 0;

      onSave({
        ...formData,
        id: initialData?.id || Math.floor(Math.random() * 10000),
        category: formData.categories.join(", "), // Standard category string for listing
        priceValue: priceValue,
        salesCount: initialData?.salesCount || 0
      });
      
      alert(initialData ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
      onClose();
      
      if (!initialData) {
        setFormData({ name: "", categories: [], price: "", description: "", image: "" });
        setImagePreview(null);
      }
    } catch (error) {
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-serif text-2xl italic text-gray-900">
                {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h2>
              <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 disabled:opacity-50">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Hình ảnh sản phẩm</label>
                  <div 
                    onClick={() => !isLoading && !isSubmitting && fileInputRef.current?.click()}
                    className={cn(
                      "aspect-square rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-teal transition-colors overflow-hidden group relative bg-gray-50",
                      imagePreview && "border-solid border-white shadow-inner",
                      (isLoading || isSubmitting) && "cursor-wait opacity-80"
                    )}
                  >
                    {imagePreview ? (
                      <div className="w-full h-full relative flex items-center justify-center p-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain rounded-xl shadow-lg" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">
                          Thay đổi ảnh
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        {isLoading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-10 h-10 text-brand-teal animate-spin mb-4" />
                            <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest animate-pulse">Đang tải...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-300 group-hover:text-brand-teal transition-colors mx-auto mb-4" />
                            <p className="text-sm font-medium text-gray-500">Kéo thả hoặc nhấn để tải lên</p>
                            <p className="text-[10px] text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP (Max 5MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                    disabled={isLoading || isSubmitting}
                  />
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tên sản phẩm</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        disabled={isSubmitting}
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="VD: Bó Hoa Hồng Juliet"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm font-medium disabled:opacity-50 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Danh mục (Chọn nhiều)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategoryToggle(cat)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all border text-left",
                                    formData.categories.includes(cat) 
                                        ? "bg-brand-teal text-white border-brand-teal" 
                                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    {/* Add New Category Input */}
                    <div className="flex items-center space-x-2 mt-2">
                        <input 
                            type="text"
                            value={newCatInput}
                            onChange={(e) => setNewCatInput(e.target.value)}
                            placeholder="Thêm danh mục mới..."
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none focus:bg-white focus:border-brand-teal transition-all"
                        />
                        <button 
                            type="button"
                            onClick={handleAddNewCategory}
                            disabled={!newCatInput.trim()}
                            className="p-2 bg-gray-100 text-gray-400 hover:bg-brand-teal hover:text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Giá tiền (VNĐ)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        disabled={isSubmitting}
                        type="text" 
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="VD: 450,000₫"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm font-medium disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mô tả sản phẩm</label>
                <div className="relative">
                  <Info className="absolute left-4 top-4 text-gray-400" size={18} />
                  <textarea 
                    disabled={isSubmitting}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả về loại hoa, thông điệp, ý nghĩa..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-brand-teal outline-none transition-all text-sm font-medium resize-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={!formData.name || !formData.image || isSubmitting || isLoading}
                  className="flex-[2] bg-brand-teal text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-brand-teal/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 h-14 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Lưu sản phẩm"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
