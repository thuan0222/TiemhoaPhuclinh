"use client";

import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  Plus, 
  Menu,
  X,
  Search, 
  MoreVertical,
  Trash2,
  Edit,
  ArrowUpRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Database,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ALL_PRODUCTS, Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductModal from "@/components/ProductModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDoc,
  serverTimestamp,
  doc, 
  getDocFromServer 
} from "firebase/firestore";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { seedDatabase } from "@/lib/seed-data";
import { handleFirestoreError, OperationType } from "@/lib/firestore-utils";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [dbStatus, setDbStatus] = useState<'testing' | 'online' | 'offline' | 'error'>('testing');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch real products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("id", "desc"));
      const snapshot = await getDocs(q);
      const fetchedProducts = snapshot.docs.map((doc: any) => ({
        ...doc.data(),
        // Ensure id is present
        id: doc.data().id || doc.id.replace('prod-', '')
      }));
      setProducts(fetchedProducts.length > 0 ? fetchedProducts : ALL_PRODUCTS);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(ALL_PRODUCTS); // Fallback to static data if error or empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'system', 'connection_test'));
        setDbStatus('online');
      } catch (error: any) {
        if (error.code === 'permission-denied' || error.message.includes('insufficient permissions')) {
          setDbStatus('online');
        } else {
          setDbStatus('offline');
        }
      }
    }
    testConnection();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      alert("Lỗi đăng nhập: " + err.message);
    }
  };

  const handleSeed = async () => {
    console.log('--- Action: handleSeed Triggered ---');
    if (authLoading) {
      console.log('Auth is still loading, ignoring click');
      return;
    }

    if (!currentUser) {
      console.log('User not logged in, prompting for Google login');
      if (confirm("Vui lòng đăng nhập Google (tranthuan05021996@gmail.com) để tải dữ liệu. Đăng nhập ngay?")) {
        handleGoogleLogin();
      }
      return;
    }
    
    console.log('Auth check passed:', currentUser.email);
    if (currentUser.email !== 'tranthuan05021996@gmail.com') {
      console.log('Access Denied: Not the admin email');
      alert(`Lỗi: Email ${currentUser.email} không có quyền ghi dữ liệu.`);
      return;
    }
    
    setIsSeeding(true);
    try {
      console.log('START: Calling seedDatabase()');
      await seedDatabase();
      console.log('END: seedDatabase() finished successfully');
      alert('Đã tải dữ liệu mẫu thành công lên Firebase!');
      fetchProducts(); // Refresh list after seed
    } catch (error: any) {
      console.error('CRITICAL ERROR in seed:', error);
      alert('Lỗi: ' + (error.message || 'Không rõ lỗi'));
    } finally {
      setIsSeeding(false);
    }
  };

  const router = useRouter();

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue: any = a[sortConfig.key!];
        let bValue: any = b[sortConfig.key!];

        // Xử lý giá tiền (remove VNĐ symbols and convert to number)
        if (sortConfig.key === 'price') {
          aValue = parseInt(aValue.toString().replace(/[^\d]/g, '')) || 0;
          bValue = parseInt(bValue.toString().replace(/[^\d]/g, '')) || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchQuery, sortConfig]);

  // Paginate filtered products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const stats = [
    { label: "Tổng sản phẩm", value: products.length, icon: <Package size={20} />, color: "bg-blue-50 text-blue-600" },
    { label: "Doanh thu tháng", value: "45.2M", icon: <BarChart3 size={20} />, color: "bg-green-50 text-green-600" },
    { label: "Khách hàng mới", value: "+12", icon: <Users size={20} />, color: "bg-purple-50 text-purple-600" },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  const handleSaveProduct = async (updatedProduct: any) => {
    if (!currentUser || currentUser.email !== 'tranthuan05021996@gmail.com') {
      alert("Bạn không có quyền thực hiện thao tác này.");
      return;
    }

    const docId = `prod-${updatedProduct.id}`;
    
    try {
      await setDoc(doc(db, "products", docId), {
        ...updatedProduct,
        updatedAt: serverTimestamp()
      });
      
      if (editingProduct) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        setProducts([updatedProduct, ...products]);
      }
      alert("Đã lưu thành công!");
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm: " + error.message);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      if (!currentUser || currentUser.email !== 'tranthuan05021996@gmail.com') {
        alert("Bạn không có quyền thực hiện thao tác này.");
        return;
      }

      const docId = `prod-${productToDelete.id}`;
      
      try {
        await deleteDoc(doc(db, "products", docId));
        setProducts(products.filter(p => p.id !== productToDelete.id));
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        alert("Đã xóa sản phẩm thành công!");
      } catch (error: any) {
        console.error("Error deleting product:", error);
        alert("Lỗi khi xóa sản phẩm: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#2D2926] text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <h1 className="font-serif text-xl tracking-tighter">PHÚC LINH</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-[#2D2926] text-white flex flex-col p-6 fixed h-full z-[80] transition-transform duration-300 transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-12 pt-4 hidden lg:block">
          <h1 className="font-serif text-2xl tracking-tighter">PHÚC LINH <span className="text-gray-500 text-sm block">ADMIN DASHBOARD</span></h1>
        </div>

        <nav className="flex-1 space-y-4 pt-12 lg:pt-0">
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl text-white">
            <Package size={20} />
            <span className="text-sm font-medium">Sản phẩm</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 p-3 text-gray-400 hover:text-white transition-colors w-full text-left">
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Thống kê</span>
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 p-3 text-gray-400 hover:text-white transition-colors w-full text-left">
            <Users size={20} />
            <span className="text-sm font-medium">Khách hàng</span>
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-4 p-3 text-gray-400 hover:text-white transition-colors w-full text-left">
            <Settings size={20} />
            <span className="text-sm font-medium">Cài đặt</span>
          </button>
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 px-3">Hệ thống</p>
            <div className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs",
              dbStatus === 'online' ? "text-green-400 bg-green-400/5" : 
              dbStatus === 'testing' ? "text-amber-400 bg-amber-400/5" : "text-red-400 bg-red-400/5"
            )}>
              {dbStatus === 'online' ? <CheckCircle2 size={14} /> : 
               dbStatus === 'testing' ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              <span>Firebase: {dbStatus === 'online' ? 'Trực tuyến' : dbStatus === 'testing' ? 'Đang kiểm tra...' : 'Ngoại tuyến'}</span>
            </div>
            
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="flex items-center space-x-4 p-3 text-brand-teal hover:text-teal-300 transition-colors w-full text-left mt-2 disabled:opacity-50"
            >
              {isSeeding ? <Loader2 size={20} className="animate-spin" /> : <Database size={20} />}
              <span className="text-sm font-medium">{isSeeding ? 'Đang tải...' : 'Seed Data'}</span>
            </button>
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-4 p-3 text-red-400 hover:text-red-300 transition-colors mt-auto border-t border-white/10 pt-8"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
            <p className="text-gray-500 text-sm mt-1">Cập nhật và quản lý kho hoa của bạn</p>
          </div>
          <button 
            onClick={openAddModal}
            className="w-full sm:w-auto bg-brand-teal text-white px-6 py-3 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-brand-teal/20"
          >
            <Plus size={18} className="mr-2" />
            Thêm sản phẩm
          </button>
        </header>

        <ProductModal 
          key={editingProduct ? `edit-${editingProduct.id}` : 'add-new'}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          productName={productToDelete?.name || ""}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[24px] shadow-sm flex items-center">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between bg-white sticky top-0 z-10 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder="Tìm sản phẩm..."
                className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white border border-transparent focus:border-gray-100 transition-all w-full md:w-64"
              />
            </div>
          </div>
          
          {/* Table view for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th 
                    className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-brand-teal transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Sản phẩm
                      <span className="ml-2">
                        {sortConfig.key === 'name' ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-brand-teal transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      Danh mục
                      <span className="ml-2">
                        {sortConfig.key === 'category' ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-brand-teal transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Giá
                      <span className="ml-2">
                        {sortConfig.key === 'price' ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-brand-teal transition-colors"
                    onClick={() => handleSort('salesCount')}
                  >
                    <div className="flex items-center">
                      Số lượng bán
                      <span className="ml-2">
                        {sortConfig.key === 'salesCount' ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mr-4">
                          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-serif italic text-gray-600">
                      {product.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        {product.salesCount}
                        <ArrowUpRight size={14} className="ml-1 text-green-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-gray-400 hover:text-brand-teal transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for Mobile */}
          <div className="md:hidden divide-y divide-gray-50">
            {currentProducts.map((product) => (
              <div key={product.id} className="p-4 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mr-4">
                      <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">ID: #{product.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-gray-400 hover:text-brand-teal transition-colors rounded-lg bg-gray-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg bg-gray-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Danh mục</span>
                    <span className="text-[10px] font-bold text-gray-700 truncate">{product.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Giá</span>
                    <span className="text-[10px] font-bold text-brand-teal">{product.price}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Đã bán</span>
                    <span className="text-[10px] font-bold text-gray-700">{product.salesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 md:p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between bg-white space-y-4 sm:space-y-0">
              <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-widest">
                Hiển thị <span className="text-gray-900 font-bold">{Math.min(filteredProducts.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> - <span className="text-gray-900 font-bold">{Math.min(filteredProducts.length, currentPage * ITEMS_PER_PAGE)}</span> trên tổng số <span className="text-gray-900 font-bold">{filteredProducts.length}</span>
              </p>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-brand-teal transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex items-center">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // Show only first, last, and pages around current page
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                            currentPage === pageNum 
                              ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                              : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 || 
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="px-2 text-gray-300">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-brand-teal transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
