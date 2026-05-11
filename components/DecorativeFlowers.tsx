'use client'

import { motion } from 'motion/react';
import { Flower2, Flower, Sprout, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

type ElementType = 'flower1' | 'flower2' | 'sprout' | 'leaf';

export default function DecorativeFlowers() {
  const [elements, setElements] = useState<{ 
    id: number; 
    left: string; 
    top: string; 
    size: number; 
    duration: number; 
    delay: number; 
    type: ElementType;
    color: string;
  }[]>([]);

  useEffect(() => {
    const types: ElementType[] = ['flower1', 'flower2', 'sprout', 'leaf'];
    const colors = ['text-brand-teal/40', 'text-pink-300/40', 'text-amber-200/40', 'text-teal-200/40'];
    
    // Generate random positions for decorative flowers
    const newElements = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 30 + 20,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setElements(newElements);
  }, []);

  const renderIcon = (type: ElementType, size: number) => {
    switch (type) {
      case 'flower1': return <Flower2 size={size} />;
      case 'flower2': return <Flower size={size} />;
      case 'sprout': return <Sprout size={size} />;
      case 'leaf': return <Leaf size={size} />;
      default: return <Flower size={size} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[20]">
      {/* Abstract Background Accents */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-teal/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-100/30 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-100/20 rounded-full blur-[60px]" />
      
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${el.color}`}
          style={{
            left: el.left,
            top: el.top,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0.7, 1.2, 0.7],
            rotate: [0, 180, 360],
            y: [-40, 40, -40],
            x: [-20, 20, -20]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut"
          }}
        >
          {renderIcon(el.type, el.size)}
        </motion.div>
      ))}
    </div>
  );
}
