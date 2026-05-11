"use client";

import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Mail, MessageSquare, Phone, X, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FloatingContact() {
  const contactButtons = [
    {
      name: "Zalo",
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
          alt="Zalo" 
          className="w-full h-full p-2.5"
        />
      ),
      color: "bg-[#0068ff]",
      href: "https://zalo.me/0377705851", // Replace with real phone
      label: "Zalo",
    },
    {
      name: "Messenger",
      icon: (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" 
          alt="Messenger" 
          className="w-full h-full p-3"
        />
      ),
      color: "bg-white border border-gray-100",
      href: "https://m.me/tiemhoaphucLinh",
      label: "Messenger",
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-center space-y-3 md:space-y-4">
      {/* Contact List (Always Visible) */}
      <div className="flex flex-col items-center space-y-3 md:space-y-4">
        {contactButtons.map((btn) => (
          <motion.a
            key={btn.name}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative group flex items-center"
          >
            <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {btn.label}
            </span>
            <div className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-xl overflow-hidden",
              btn.color
            )}>
              {btn.icon}
            </div>
          </motion.a>
        ))}

        {/* Phone Button with Ripple */}
        <motion.a 
          href="tel:0377705851"
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-teal flex items-center justify-center text-white shadow-2xl z-10"
        >
          {/* Ripple Effect Layers */}
          <div className="absolute inset-0 rounded-full bg-brand-teal animate-ping opacity-25" />
          <div className="absolute inset-0 rounded-full bg-brand-teal animate-ping opacity-15 [animation-delay:0.5s]" />
          <Phone className="relative z-20 w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </motion.a>
      </div>
    </div>
  );
}
