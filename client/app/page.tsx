"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logoImg from "./logo.png";

export default function DashboardPage() {
  // Danh sách các danh mục điều hướng chính
  const tabs = ["Overview", "Documents", "Shared", "Trash", "Settings"];

  // Trạng thái lưu trữ danh mục hiện tại (mặc định: 'Overview')
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* ========================================================= */}
      {/* THANH ĐIỀU HƯỚNG DỌC CỐ ĐỊNH (SIDEBAR - RỘNG 72PX)        */}
      {/* ========================================================= */}
      <aside className="fixed left-0 top-0 h-full w-[72px] bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col items-center justify-between py-4">
        
        {/* 1. KHỐI LOGO VÀ DÃY BIỂU TƯỢNG ĐIỀU HƯỚNG */}
        <div className="flex flex-col items-center gap-6 w-full">
          
          {/* Biểu tượng nhận diện ứng dụng (Logo thương hiệu) */}
          <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform">
            <Image
              src={logoImg}
              alt="CollabDocs Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Dãy nút bấm điều hướng chính */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {/* Nút Dashboard (Đang kích hoạt) */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-secondary-fixed text-primary shadow-sm cursor-pointer"
              title="Dashboard"
            >
              <span className="material-symbols-outlined text-[22px]">dashboard</span>
            </button>

            {/* Nút Danh mục tài liệu */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="All Documents"
            >
              <span className="material-symbols-outlined text-[22px]">folder</span>
            </button>

            {/* Nút Chia sẻ cộng tác */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="Shared Workspace"
            >
              <span className="material-symbols-outlined text-[22px]">group</span>
            </button>

            {/* Nút Tài liệu đánh dấu sao */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="Starred Documents"
            >
              <span className="material-symbols-outlined text-[22px]">star</span>
            </button>

            {/* Nút Cài đặt hệ thống */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="Settings"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>
          </nav>

        </div>

        {/* 2. NÚT KHỞI TẠO TÀI LIỆU NHANH Ở ĐÁY SIDEBAR */}
        <button
          className="w-11 h-11 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-container transition-all active:scale-95 shadow-md cursor-pointer"
          title="Create New Document"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
        </button>

      </aside>

      {/* ========================================================= */}
      {/* KHU VỰC CHÍNH (ĐẨY SANG PHẢI 72PX ĐỂ CHỐNG ĐÈ SIDEBAR)    */}
      {/* ========================================================= */}
      <div className="pl-[72px] flex-1 flex flex-col">
        {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (HEADER) */}
        <header className="h-16 bg-surface-container-lowest border-b border-outline-variant/30 px-8 flex items-center justify-between sticky top-0 z-40">
          
          {/* KHU VỰC ĐIỀU HƯỚNG DANH MỤC (BÊN TRÁI) */}
          <nav className="flex items-center gap-6 h-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative h-full inline-flex items-center text-sm font-medium px-1 transition-colors cursor-pointer ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>{tab}</span>

                  {/* Vạch chỉ báo trạng thái kích hoạt (Áp dụng Framer Motion) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CỤM CÔNG CỤ TÌM KIẾM VÀ TÀI KHOẢN (BÊN PHẢI) */}
          <div className="flex items-center gap-4">
            
            {/* Cụm nút chuyển đổi ngôn ngữ có cờ (Anh 🇬🇧 / Việt Nam 🇻🇳) */}
            <div className="inline-flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/40 text-xs font-semibold select-none shadow-xs">
              
              {/* Nút Tiếng Anh (EN) - Cờ Vương quốc Anh */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-lowest text-primary shadow-xs cursor-pointer font-bold"
              >
                <svg className="w-4 h-2.5 rounded-xs overflow-hidden shrink-0 shadow-xs" viewBox="0 0 60 30">
                  <rect width="60" height="30" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                </svg>
                <span>EN</span>
              </button>

              {/* Nút Tiếng Việt (VI) - Cờ Việt Nam */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <svg className="w-4 h-2.5 rounded-xs overflow-hidden shrink-0 shadow-xs" viewBox="0 0 30 20">
                  <rect width="30" height="20" fill="#da251d"/>
                  <polygon points="15,4 16.5,8.8 21.5,8.8 17.5,11.8 19,16.5 15,13.5 11,16.5 12.5,11.8 8.5,8.8 13.5,8.8" fill="#ffff00"/>
                </svg>
                <span>VI</span>
              </button>

            </div>

            {/* Ô tìm kiếm tài liệu */}
            <div className="flex items-center bg-surface-container-low rounded-full px-3.5 py-1.5 border border-outline-variant/40 text-on-surface-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-[18px] mr-2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search documents or ask AI..."
                className="bg-transparent text-sm focus:outline-none w-52 text-on-surface placeholder:text-outline"
              />
              <kbd className="ml-2 inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium leading-none bg-surface-container-lowest border border-outline-variant/60 rounded text-tertiary shadow-sm tracking-tight">
                Ctrl K
              </kbd>
            </div>

            {/* Nút thông báo hệ thống */}
            <button
              className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>

            {/* Đại diện tài khoản người dùng */}
            <div
              className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs ring-1 ring-outline-variant/40 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
              title="User Profile"
            >
              ND
            </div>

          </div>

        </header>

        {/* Khu vực nội dung chính của Dashboard */}
        <main className="flex-1 p-8 max-w-[1520px] w-full space-y-8">
          
          {/* 1. KHỐI TIÊU ĐỀ TRANG TỔNG QUAN (OVERVIEW TITLE) */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              Overview
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              High-frequency real-time co-authoring workspace overview
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
