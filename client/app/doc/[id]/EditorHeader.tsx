"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/app/logo.png";

import type { Editor } from "@tiptap/react";

interface EditorHeaderProps {
  docId: string;
  editor?: Editor | null;
}

// Cụm 2 tầng Header và Toolbar điều khiển của trang soạn thảo
export default function EditorHeader({ docId, editor }: EditorHeaderProps) {
  // Trạng thái tiêu đề tài liệu
  const [title, setTitle] = useState("Hệ thống Soạn thảo Cộng tác D18");
  // Trạng thái chế độ xem
  const [activeTab, setActiveTab] = useState<"editor" | "history" | "settings">("editor");
  // Trạng thái cỡ chữ hiện tại (mặc định: 11)
  const [fontSize, setFontSize] = useState(11);
  // Trạng thái kích hoạt vẽ lại giao diện khi tài liệu có thay đổi
  const [, setUpdateTick] = useState(0);

  // Lắng nghe sự kiện thao tác từ trình soạn thảo để cập nhật trạng thái sáng mờ của nút
  useEffect(() => {
    if (!editor) return;

    // Cập nhật lại thanh công cụ mỗi khi người dùng gõ phím hoặc hoàn tác
    const handleTransaction = () => {
      setUpdateTick((prev) => prev + 1);
    };

    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      
      {/* TẦNG 1: THANH HEADER TRÊN CÙNG (CAO 56PX) */}
      <div className="h-14 px-6 flex items-center justify-between gap-4">
        
        {/* Khối bên trái: Nút về Dashboard + Tên tài liệu + Trạng thái lưu */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Biểu tượng nhận diện ứng dụng bấm để quay lại Dashboard */}
          <Link
            href="/"
            className="flex items-center justify-center w-11 h-11 rounded-lg overflow-hidden shrink-0 hover:opacity-85 transition-opacity"
            title="Quay lại Dashboard"
          >
            <Image
              src={logoImg}
              alt="CollabDocs Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </Link>

          {/* Ô chỉnh sửa tiêu đề trực tiếp */}
          <div className="flex items-center gap-1 min-w-0 group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-semibold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/40 px-2 py-0.5 rounded-lg transition-all truncate max-w-[280px] sm:max-w-md cursor-text"
              title="Click để đổi tên tài liệu"
            />
            <span className="material-symbols-outlined text-[16px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              edit
            </span>
          </div>

          {/* Biểu tượng ngôi sao đồng bộ màu đen thanh mảnh */}
          <button
            type="button"
            className="flex items-center justify-center p-1 rounded-md text-black hover:bg-slate-100 transition-colors"
            title="Đánh dấu sao tài liệu"
          >
            <span 
              className="material-symbols-outlined text-[18px] text-black"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              star
            </span>
          </button>

          {/* Trạng thái lưu trữ đám mây màu đen chuẩn, nét thanh mảnh */}
          <div className="hidden sm:flex items-center gap-1.5 text-black text-xs font-light shrink-0 select-none">
            {/* Biểu tượng đám mây đen với độ dày nét vẽ mảnh 300 */}
            <span 
              className="material-symbols-outlined text-[16px] text-black"
              style={{ fontVariationSettings: "'wght' 300" }}
            >
              cloud_done
            </span>
            {/* Nhãn văn bản màu đen với độ dày nét chữ mảnh */}
            <span>Saved to Cloud</span>
          </div>
        </div>

        {/* Khối bên phải: Avatar online + Nút Share + Menu */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Cụm avatar người dùng đang online */}
          <div className="flex items-center -space-x-2 pl-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 border-2 border-white flex items-center justify-center text-xs font-bold" title="Nguyễn Đức Dương (Bạn)">
              ND
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 border-2 border-white flex items-center justify-center text-xs font-bold" title="Trần Lan (Đang soạn)">
              TL
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 border-2 border-white flex items-center justify-center text-xs font-bold" title="Hoàng Nam (Đang xem)">
              HN
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 border-2 border-white flex items-center justify-center text-[10px] font-bold">
              +2
            </div>
          </div>

          {/* Nút Share liên kết phòng */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-container text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span>Share</span>
          </button>

          {/* Nút tùy chọn thêm */}
          <button
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tùy chọn khác"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {/* Avatar cá nhân */}
          <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer">
            ND
          </div>

        </div>

      </div>

      {/* TẦNG 2: THANH TOOLBAR ĐỊNH DẠNG (CĂN GIỮA, NÉT MẢNH WGHT 300) */}
      <div 
        className="h-10 px-6 bg-white/90 border-t border-slate-200/60 flex items-center justify-center gap-1 text-slate-700 relative overflow-x-auto"
        style={{ fontVariationSettings: "'wght' 300" }}
      >
        
        {/* Nhóm lịch sử và in ấn: Hoàn tác, Làm lại, In tài liệu */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Nút Hoàn tác - Tự động mờ khi không có thao tác để lùi */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              editor?.can().undo()
                ? "hover:bg-slate-100 text-slate-700 cursor-pointer"
                : "opacity-35 text-slate-400 cursor-not-allowed"
            }`}
            title="Hoàn tác (Ctrl+Z)"
          >
            <span className="material-symbols-outlined text-[17px]">undo</span>
          </button>

          {/* Nút Làm lại - Tự động mờ khi không có thao tác để tiến */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              editor?.can().redo()
                ? "hover:bg-slate-100 text-slate-700 cursor-pointer"
                : "opacity-35 text-slate-400 cursor-not-allowed"
            }`}
            title="Làm lại (Ctrl+Y)"
          >
            <span className="material-symbols-outlined text-[17px]">redo</span>
          </button>

          {/* Nút In ấn tài liệu */}
          <button
            type="button"
            onClick={() => typeof window !== "undefined" && window.print()}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="In tài liệu (Ctrl+P)"
          >
            <span className="material-symbols-outlined text-[17px]">print</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm chọn kiểu đề mục */}
        <div className="flex items-center shrink-0">
          <button type="button" className="h-7 flex items-center gap-1 px-2 rounded hover:bg-slate-100 text-xs font-normal cursor-pointer" title="Chọn kiểu đề mục">
            <span>Heading 1</span>
            <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm tăng giảm cỡ chữ trực quan */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.max(8, prev - 1))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Giảm cỡ chữ"
          >
            <span className="material-symbols-outlined text-[15px]">remove</span>
          </button>
          <div className="w-8 h-7 flex items-center justify-center border border-slate-200 rounded text-xs font-normal text-slate-800 bg-white select-none">
            {fontSize}
          </div>
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.min(72, prev + 1))}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tăng cỡ chữ"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm định dạng văn bản */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 text-primary transition-colors cursor-pointer" title="In đậm (Ctrl+B)">
            <span className="material-symbols-outlined text-[17px]">format_bold</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="In nghiêng (Ctrl+I)">
            <span className="material-symbols-outlined text-[17px]">format_italic</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Gạch chân (Ctrl+U)">
            <span className="material-symbols-outlined text-[17px]">format_underlined</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Gạch ngang">
            <span className="material-symbols-outlined text-[17px]">format_strikethrough</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Code dòng">
            <span className="material-symbols-outlined text-[17px]">code</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Màu chữ">
            <span className="material-symbols-outlined text-[17px]">format_color_text</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Màu nền highlight">
            <span className="material-symbols-outlined text-[17px]">border_color</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm căn lề đoạn văn */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded bg-slate-100 text-slate-900 transition-colors cursor-pointer" title="Căn lề trái">
            <span className="material-symbols-outlined text-[17px]">format_align_left</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Căn giữa">
            <span className="material-symbols-outlined text-[17px]">format_align_center</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Căn lề phải">
            <span className="material-symbols-outlined text-[17px]">format_align_right</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Căn đều hai bên">
            <span className="material-symbols-outlined text-[17px]">format_align_justify</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm danh sách và trích dẫn */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Danh sách chấm">
            <span className="material-symbols-outlined text-[17px]">format_list_bulleted</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Danh sách số">
            <span className="material-symbols-outlined text-[17px]">format_list_numbered</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Checklist">
            <span className="material-symbols-outlined text-[17px]">check_box</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Trích dẫn">
            <span className="material-symbols-outlined text-[17px]">format_quote</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm chèn liên kết và khối nội dung */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Chèn liên kết">
            <span className="material-symbols-outlined text-[17px]">link</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Chèn ảnh">
            <span className="material-symbols-outlined text-[17px]">image</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Khối mã code">
            <span className="material-symbols-outlined text-[17px]">integration_instructions</span>
          </button>
          <button type="button" className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer" title="Đường kẻ ngang">
            <span className="material-symbols-outlined text-[17px]">horizontal_rule</span>
          </button>
        </div>

        {/* Nhóm tab chế độ xem cố định ở góc phải */}
        <div className="absolute right-6 hidden md:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "editor" ? "text-primary font-medium bg-slate-100" : "hover:text-slate-900"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "history" ? "text-primary font-medium bg-slate-100" : "hover:text-slate-900"
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "settings" ? "text-primary font-medium bg-slate-100" : "hover:text-slate-900"
            }`}
          >
            Settings
          </button>
        </div>

      </div>

    </header>
  );
}

