"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Tạo 12 cánh hoa ngẫu nhiên
    const newPetals = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Vị trí ngang (0-100vw)
      delay: Math.random() * 20, // Thời gian trễ
      duration: 10 + Math.random() * 15, // Tốc độ rơi
      size: 10 + Math.random() * 15, // Kích thước
      rotation: Math.random() * 360, // Góc xoay ban đầu
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[21] overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ 
            top: "-10%", 
            left: `${petal.x}%`, 
            rotate: petal.rotation,
            opacity: 0 
          }}
          animate={{ 
            top: "110%",
            left: `${petal.x + (Math.random() * 10 - 5)}%`, // Đung đưa nhẹ
            rotate: petal.rotation + 720,
            opacity: [0, 1, 1, 0] // Hiện ra rồi mờ dần khi gần chạm đất
          }}
          transition={{ 
            duration: petal.duration, 
            repeat: Infinity, 
            delay: petal.delay,
            ease: "linear"
          }}
          style={{
            width: petal.size,
            height: petal.size,
            backgroundColor: "#FFB7C5", // Màu hồng hoa đào
            borderRadius: "100% 10% 100% 100%", // Hình dáng cánh hoa
            boxShadow: "0 0 10px rgba(255, 183, 197, 0.5)",
            position: "absolute"
          }}
        />
      ))}
    </div>
  );
}
