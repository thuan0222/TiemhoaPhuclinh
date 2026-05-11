
export interface Product {
  id: string | number;
  name: string;
  price: string;
  priceValue: number; // For numerical sorting/filtering
  category: string;
  image: string;
  description: string;
  details?: string[];
  salesCount: number; // For "Bán chạy" sorting
}

export const ALL_PRODUCTS: Product[] = [
  // Mẫu hoa mới
  { 
    id: 101, 
    name: "Vũ điệu Mùa Xuân", 
    price: "950,000₫", 
    priceValue: 950000,
    category: "Mẫu hoa mới",
    image: "https://images.unsplash.com/photo-1591886960571-74d43a9dc416?q=80&w=800&auto=format&fit=crop",
    description: "Một thiết kế đầy sức sống với sự kết hợp của nhiều loại hoa xuân tươi tắn, mang lại cảm giác tươi mới và tràn đầy năng lượng cho không gian của bạn.",
    details: ["Hoa hồng nhập khẩu", "Hoa mẫu đơn", "Lá bạc", "Phụ kiện cao cấp"],
    salesCount: 150
  },
  { 
    id: 102, 
    name: "Hừng Đông", 
    price: "1,100,000₫", 
    priceValue: 1100000,
    category: "Mẫu hoa mới",
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=800&auto=format&fit=crop",
    description: "Lấy cảm hứng từ ánh bình minh, thiết kế này sử dụng tông màu ấm áp như cam, vàng và đỏ nhạt, tượng trưng cho một khởi đầu mới đầy hy vọng.",
    details: ["Hoa hướng dương", "Hoa hồng cam", "Hoa cúc mầm", "Giỏ đan tay"],
    salesCount: 80
  },
  { 
    id: 103, 
    name: "Nắng Sớm", 
    price: "850,000₫", 
    priceValue: 850000,
    category: "Mẫu hoa mới",
    image: "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800&auto=format&fit=crop",
    description: "Nhẹ nhàng và tinh tế như những tia nắng đầu ngày. Sản phẩm phù hợp để làm quà tặng ý nghĩa cho người thân và bạn bè.",
    details: ["Hoa tulip trắng", "Hoa baby", "Giấy gói lụa", "Nơ trang trí"],
    salesCount: 210
  },
  { 
    id: 104, 
    name: "Hương Đêm", 
    price: "1,250,000₫", 
    priceValue: 1250000,
    category: "Mẫu hoa mới",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0fab?q=80&w=800&auto=format&fit=crop",
    description: "Sự kết hợp huyền bí giữa các loài hoa sẫm màu và hương thơm nồng nàn, tạo nên vẻ đẹp quyến rũ và sang trọng.",
    details: ["Hoa hồng đen", "Hoa lan tím", "Lá thông", "Hộp quà cứng cáp"],
    salesCount: 45
  },
  // Bó hoa
  { 
    id: 201, 
    name: "Bó Hồng Ecuador", 
    price: "1,500,000₫", 
    priceValue: 1500000,
    category: "Bó hoa",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
    description: "Loài hoa hồng cao cấp từ Ecuador với cánh hoa to, dày và độ bền tuyệt vời. Biểu tượng của tình yêu nồng cháy và vĩnh cửu.",
    details: ["20 nhành hồng Ecuador", "Lá khuynh diệp", "Giấy gói phong cách Hàn Quốc"],
    salesCount: 300
  },
  { 
    id: 202, 
    name: "Bó Tulip Trắng", 
    price: "950,000₫", 
    priceValue: 950000,
    category: "Bó hoa",
    image: "https://images.unsplash.com/photo-1520323232427-013f301b2a27?q=80&w=800&auto=format&fit=crop",
    description: "Sự tinh khôi và thanh khiết của hoa Tulip trắng mang lời nhắn gửi về một tình yêu thuần khiết và chân thành.",
    details: ["15 nhành Tulip trắng", "Lá bạc", "Giấy gói mỹ thuật"],
    salesCount: 120
  },
  { 
    id: 203, 
    name: "Bó Hướng Dương", 
    price: "650,000₫", 
    priceValue: 650000,
    category: "Bó hoa",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb3bf63a5?q=80&w=800&auto=format&fit=crop",
    description: "Luôn hướng về phía mặt trời, bó hoa hướng dương là lời chúc mừng rạng rỡ và đầy nghị lực dành cho người nhận.",
    details: ["10 bông hướng dương", "Hoa sao tím", "Giấy gói kraft"],
    salesCount: 450
  },
  { 
    id: 204, 
    name: "Bó Cẩm Chướng", 
    price: "750,000₫", 
    priceValue: 750000,
    category: "Bó hoa",
    image: "https://images.unsplash.com/photo-1567606117948-c9ba618153b4?q=80&w=800&auto=format&fit=crop",
    description: "Mềm mại và dịu dàng, bó hoa cẩm chướng là lựa chọn tuyệt vời để bày tỏ lòng biết ơn và sự ngưỡng mộ.",
    details: ["Hoa cẩm chướng hồng", "Hoa phăng", "Giấy gói lụa"],
    salesCount: 85
  },
  // Lẵng hoa
  { 
    id: 301, 
    name: "Lẵng Hoa Khai Trương", 
    price: "2,500,000₫", 
    priceValue: 2500000,
    category: "Lẵng Hoa",
    image: "https://images.unsplash.com/photo-1550983058-ba68da990974?q=80&w=800&auto=format&fit=crop",
    description: "Một thiết kế lộng lẫy và hoành tráng, gửi gắm lời chúc 'Khai trương hồng phát' và thành công rực rỡ.",
    details: ["Hoa kệ 2 tầng", "Hoa ly", "Hoa hồng", "Banner chúc mừng"],
    salesCount: 65
  },
  { 
    id: 302, 
    name: "Lẵng Hoa Cúc Mẫu Đơn", 
    price: "1,800,000₫", 
    priceValue: 1800000,
    category: "Lẵng Hoa",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    description: "Sự kết hợp giữa nét cổ điển của cúc mẫu đơn và phong cách hiện đại trong cách bài trí lẵng hoa.",
    details: ["Cúc mẫu đơn nhập khẩu", "Hoa hồng", "Kệ gỗ cao cấp"],
    salesCount: 30
  },
  // Giỏ hoa
  { 
    id: 401, 
    name: "Giỏ Hoa Sắc Hồng", 
    price: "800,000₫", 
    priceValue: 800000,
    category: "Giỏ hoa",
    image: "https://images.unsplash.com/photo-1523694576729-dc99e9c0f9b6?q=80&w=800&auto=format&fit=crop",
    description: "Ngọt ngào và lãng mạn với những tông màu hồng đa dạng từ nhạt đến đậm trong một chiếc giỏ mây xinh xắn.",
    details: ["Hoa hồng dâu", "Hoa cát tường", "Giỏ mây tre đan"],
    salesCount: 190
  },
  // Hoa sinh nhật
  { 
    id: 501, 
    name: "Hộp Hoa Kẹo Ngọt", 
    price: "900,000₫", 
    priceValue: 900000,
    category: "Hoa sinh nhật",
    image: "https://images.unsplash.com/photo-1519219602525-4c004396349c?q=80&w=800&auto=format&fit=crop",
    description: "Sự kết hợp độc đáo giữa hoa tươi và những viên kẹo ngọt ngào, món quà bất ngờ cho ngày sinh nhật thêm vui.",
    details: ["Hoa hồng", "Bánh macaron", "Hộp quà trang trí"],
    salesCount: 320
  }
];

export const CATEGORIES_DATA = [
  {
    title: "Mẫu hoa mới",
    subtitle: "Khám phá những thiết kế mới nhất vừa ra mắt",
    items: ALL_PRODUCTS.filter(p => p.category === "Mẫu hoa mới")
  },
  {
    title: "Bó hoa",
    subtitle: "Những bó hoa nghệ thuật thay ngàn lời muốn nói",
    items: ALL_PRODUCTS.filter(p => p.category === "Bó hoa")
  },
  {
    title: "Lẵng Hoa",
    subtitle: "Sự sang trọng và đẳng cấp cho không gian sự kiện",
    items: ALL_PRODUCTS.filter(p => p.category === "Lẵng Hoa")
  },
  {
    title: "Giỏ hoa",
    subtitle: "Món quà tinh tế cho những dịp kỷ niệm nhẹ nhàng",
    items: ALL_PRODUCTS.filter(p => p.category === "Giỏ hoa")
  },
  {
    title: "Hoa sinh nhật",
    subtitle: "Gửi trao niềm vui và những lời chúc tốt đẹp nhất",
    items: ALL_PRODUCTS.filter(p => p.category === "Hoa sinh nhật")
  }
];
