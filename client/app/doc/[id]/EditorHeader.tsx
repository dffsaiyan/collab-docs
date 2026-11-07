"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/app/logo.png";

import type { Editor } from "@tiptap/react";

interface EditorHeaderProps {
  docId: string;
  editor?: Editor | null;
}

// Ma trận bảng màu chuẩn văn phòng (10 cột x 8 hàng)
const COLOR_PALETTE = [
  // Hàng 1: Thang màu xám
  ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
  // Hàng 2: Các tone màu gốc bão hòa
  ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
  // Hàng 3: Tone rất nhạt
  ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
  // Hàng 4: Tone nhạt
  ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
  // Hàng 5: Tone trung bình
  ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
  // Hàng 6: Tone đậm vừa
  ["#a61c1c", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
  // Hàng 7: Tone đậm
  ["#852020", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"],
  // Hàng 8: Tone rất đậm
  ["#5b0f0f", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"],
];

// Cụm 2 tầng Header và Toolbar điều khiển của trang soạn thảo
export default function EditorHeader({ docId, editor }: EditorHeaderProps) {
  // Trạng thái tiêu đề tài liệu
  const [title, setTitle] = useState("Hệ thống Soạn thảo Cộng tác D18");
  // Trạng thái chế độ xem
  const [activeTab, setActiveTab] = useState<"editor" | "history" | "settings">("editor");
  // Trạng thái cỡ chữ hiện tại (mặc định: 11)
  const [fontSize, setFontSize] = useState(11);
  // Trạng thái giá trị hiển thị trên ô nhập liệu cỡ chữ
  const [inputFontSize, setInputFontSize] = useState("11");
  // Trạng thái kích hoạt vẽ lại giao diện khi tài liệu có thay đổi
  const [, setUpdateTick] = useState(0);
  // Trạng thái đóng/mở menu chọn đề mục
  const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
  // Tham chiếu DOM đến khung menu đề mục
  const headingMenuRef = useRef<HTMLDivElement>(null);

  // Trạng thái mở popup bảng màu ("text" | "highlight" | null)
  const [activeColorPicker, setActiveColorPicker] = useState<"text" | "highlight" | null>(null);
  // Tham chiếu DOM đến popup bảng màu
  const colorPickerRef = useRef<HTMLDivElement>(null);
  // Trạng thái mở menu căn lề
  const [isAlignMenuOpen, setIsAlignMenuOpen] = useState(false);
  // Tham chiếu DOM đến khung menu căn lề
  const alignMenuRef = useRef<HTMLDivElement>(null);

  // Áp dụng cỡ chữ mới vào văn bản đang chọn hoặc con trỏ chuột
  const applyFontSize = (sizeVal: number) => {
    const validSize = Math.max(6, Math.min(96, sizeVal));
    setFontSize(validSize);
    setInputFontSize(String(validSize));
    if (editor) {
      editor.chain().focus().setMark("fontSize", { size: `${validSize}px` }).run();
    }
  };

  // Áp dụng màu chữ hoặc màu highlight vào văn bản
  const handleSelectColor = (color: string | null) => {
    if (!editor) return;
    if (activeColorPicker === "text") {
      if (color) {
        editor.chain().focus().setMark("textColor", { color }).run();
      } else {
        editor.chain().focus().unsetMark("textColor").run();
      }
    } else if (activeColorPicker === "highlight") {
      if (color) {
        editor.chain().focus().setMark("highlightColor", { color }).run();
      } else {
        editor.chain().focus().unsetMark("highlightColor").run();
      }
    }
    setActiveColorPicker(null);
  };

  // Áp dụng căn lề vào đoạn văn hoặc tiêu đề hiện tại
  const handleAlign = (alignment: "left" | "center" | "right" | "justify") => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .updateAttributes("paragraph", { textAlign: alignment })
      .updateAttributes("heading", { textAlign: alignment })
      .run();
  };

  // Kiểm tra trạng thái căn lề hiện tại theo con trỏ chuột
  const isAlignActive = (align: "left" | "center" | "right" | "justify") => {
    if (!editor) return align === "left";
    if (align === "left") {
      return (
        editor.isActive({ textAlign: "left" }) ||
        (!editor.isActive({ textAlign: "center" }) &&
          !editor.isActive({ textAlign: "right" }) &&
          !editor.isActive({ textAlign: "justify" }))
      );
    }
    return editor.isActive({ textAlign: align });
  };

  // Lấy icon căn lề hiện tại theo con trỏ chuột để hiển thị trên nút chính
  const getCurrentAlignIcon = () => {
    if (isAlignActive("center")) return "format_align_center";
    if (isAlignActive("right")) return "format_align_right";
    if (isAlignActive("justify")) return "format_align_justify";
    return "format_align_left";
  };

  // Tự động đóng menu đề mục, bảng màu và menu căn lề khi click chuột ra bất kỳ vị trí nào bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
        setIsHeadingMenuOpen(false);
      }
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setActiveColorPicker(null);
      }
      if (alignMenuRef.current && !alignMenuRef.current.contains(event.target as Node)) {
        setIsAlignMenuOpen(false);
      }
    };

    if (isHeadingMenuOpen || activeColorPicker || isAlignMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHeadingMenuOpen, activeColorPicker, isAlignMenuOpen]);

  // Hàm xác định nhãn hiển thị trên thanh công cụ theo con trỏ chuột
  const getCurrentHeadingLabel = () => {
    if (!editor) return "Normal text";
    if (editor.isActive("heading", { level: 1 })) return "Title";
    if (editor.isActive("heading", { level: 2 })) return "Heading 1";
    if (editor.isActive("heading", { level: 3 })) return "Heading 2";
    if (editor.isActive("heading", { level: 4 })) return "Heading 3";
    return "Normal text";
  };

  // Lắng nghe sự kiện thao tác từ trình soạn thảo để cập nhật trạng thái các nút và cỡ chữ
  useEffect(() => {
    if (!editor) return;

    // Cập nhật lại thanh công cụ mỗi khi người dùng gõ phím hoặc hoàn tác
    const handleTransaction = () => {
      setUpdateTick((prev) => prev + 1);

      // Kiểm tra thuộc tính kích thước chữ tại vị trí con trỏ chuột
      const markAttrs = editor.getAttributes("fontSize");
      if (markAttrs?.size) {
        const parsed = parseInt(markAttrs.size, 10);
        if (!isNaN(parsed)) {
          setFontSize(parsed);
          setInputFontSize(String(parsed));
          return;
        }
      }

      // Tự động nhận diện theo cấp độ tiêu đề nếu không có cỡ chữ riêng
      if (editor.isActive("heading", { level: 1 })) {
        setFontSize(32);
        setInputFontSize("32");
      } else if (editor.isActive("heading", { level: 2 })) {
        setFontSize(24);
        setInputFontSize("24");
      } else if (editor.isActive("heading", { level: 3 })) {
        setFontSize(18);
        setInputFontSize("18");
      } else if (editor.isActive("heading", { level: 4 })) {
        setFontSize(14);
        setInputFontSize("14");
      } else {
        setFontSize(11);
        setInputFontSize("11");
      }
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
        className="h-10 px-6 bg-white/90 border-t border-slate-200/60 flex items-center justify-center gap-1 text-slate-700 relative overflow-visible"
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

        {/* Nhóm chọn kiểu đề mục trực quan 6 cấp độ */}
        <div ref={headingMenuRef} className="relative flex items-center shrink-0">
          {/* Nút bấm mở menu có mũi tên đổi chiều khi mở */}
          <button
            type="button"
            onClick={() => setIsHeadingMenuOpen(!isHeadingMenuOpen)}
            className="h-7 flex items-center justify-between gap-1 px-2.5 rounded hover:bg-slate-100 text-xs font-normal text-slate-700 transition-colors cursor-pointer min-w-[105px]"
            title="Chọn kiểu đề mục"
          >
            <span className="truncate">{getCurrentHeadingLabel()}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-500">
              {isHeadingMenuOpen ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          </button>

          {/* Hộp menu xổ xuống trực quan */}
          {isHeadingMenuOpen && (
            <div className="absolute top-8 left-0 z-50 w-60 bg-white rounded-md shadow-xl border border-slate-200 py-1 select-none">
                
                {/* 1. Văn bản thường (Normal text) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().setParagraph().run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700">
                      {!editor?.isActive("heading") && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </span>
                    <span className="text-xs text-slate-800">Normal text</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

                {/* 2. Tiêu đề chính trang bìa (Title) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level: 1 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700">
                      {editor?.isActive("heading", { level: 1 }) && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </span>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Title</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

                {/* 3. Tiêu đề phụ (Subtitle) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().setParagraph().run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700" />
                    <span className="text-sm font-medium text-slate-500">Subtitle</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

                {/* 4. Đề mục cấp 1 (Heading 1) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level: 2 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700">
                      {editor?.isActive("heading", { level: 2 }) && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </span>
                    <span className="text-base font-bold text-slate-800">Heading 1</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

                {/* 5. Đề mục cấp 2 (Heading 2) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level: 3 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700">
                      {editor?.isActive("heading", { level: 3 }) && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">Heading 2</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

                {/* 6. Đề mục cấp 3 (Heading 3) */}
                <button
                  type="button"
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level: 4 }).run();
                    setIsHeadingMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 flex items-center justify-center text-slate-700">
                      {editor?.isActive("heading", { level: 4 }) && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">Heading 3</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </button>

              </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm tăng giảm cỡ chữ trực quan */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => applyFontSize(fontSize - 1)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer text-slate-700"
            title="Giảm cỡ chữ"
          >
            <span className="material-symbols-outlined text-[15px]">remove</span>
          </button>

          {/* Ô nhập trực tiếp kích thước chữ */}
          <input
            type="text"
            value={inputFontSize}
            onChange={(e) => setInputFontSize(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const num = parseInt(inputFontSize, 10);
                if (!isNaN(num)) {
                  applyFontSize(num);
                } else {
                  setInputFontSize(String(fontSize));
                }
                (e.target as HTMLInputElement).blur();
              }
            }}
            onBlur={() => {
              const num = parseInt(inputFontSize, 10);
              if (!isNaN(num)) {
                applyFontSize(num);
              } else {
                setInputFontSize(String(fontSize));
              }
            }}
            className="w-9 h-7 text-center border border-slate-200 rounded text-xs font-normal text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all cursor-text"
            title="Nhập cỡ chữ và nhấn Enter"
          />

          <button
            type="button"
            onClick={() => applyFontSize(fontSize + 1)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors cursor-pointer text-slate-700"
            title="Tăng cỡ chữ"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm định dạng văn bản: In đậm, In nghiêng, Gạch chân, Màu sắc */}
        <div className="flex items-center gap-0.5 shrink-0 relative">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              editor?.isActive("bold")
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            title="In đậm (Ctrl+B)"
          >
            <span className="material-symbols-outlined text-[17px]">format_bold</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              editor?.isActive("italic")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            title="In nghiêng (Ctrl+I)"
          >
            <span className="material-symbols-outlined text-[17px]">format_italic</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              editor?.isActive("underline")
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Gạch chân (Ctrl+U)"
          >
            <span className="material-symbols-outlined text-[17px]">format_underlined</span>
          </button>

          {/* Nút Màu chữ A */}
          <button
            type="button"
            onClick={() => setActiveColorPicker(activeColorPicker === "text" ? null : "text")}
            className={`w-7 h-7 flex flex-col items-center justify-center rounded transition-colors cursor-pointer ${
              activeColorPicker === "text" ? "bg-slate-200" : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Màu văn bản"
          >
            <span className="material-symbols-outlined text-[17px] leading-none">format_color_text</span>
            <span
              className="w-4 h-[3px] rounded-full mt-0.5"
              style={{ backgroundColor: editor?.getAttributes("textColor")?.color || "#000000" }}
            />
          </button>

          {/* Nút Bút dạ quang Highlight */}
          <button
            type="button"
            onClick={() => setActiveColorPicker(activeColorPicker === "highlight" ? null : "highlight")}
            className={`w-7 h-7 flex flex-col items-center justify-center rounded transition-colors cursor-pointer ${
              activeColorPicker === "highlight" ? "bg-slate-200" : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Màu nền highlight"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">border_color</span>
            <span
              className="w-4 h-[3px] rounded-full mt-0.5"
              style={{ backgroundColor: editor?.getAttributes("highlightColor")?.color || "#ffff00" }}
            />
          </button>

          {/* Popup Bảng màu chuẩn */}
          {activeColorPicker && (
            <div
              ref={colorPickerRef}
              className="absolute top-9 left-20 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 p-3 select-none w-[240px]"
            >
              {/* Nút đặt lại về không màu */}
              <button
                type="button"
                onClick={() => handleSelectColor(null)}
                className="w-full mb-2 py-1 px-2 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center justify-between border border-dashed border-slate-300 transition-colors cursor-pointer"
              >
                <span>Mặc định (Không màu)</span>
                <span className="material-symbols-outlined text-[15px] text-slate-400">format_color_reset</span>
              </button>

              {/* Lưới 10x8 ô tròn màu y hệt mẫu */}
              <div className="flex flex-col gap-1.5">
                {COLOR_PALETTE.map((row, rIdx) => (
                  <div key={rIdx} className={`flex items-center justify-between ${rIdx === 0 ? "pb-1.5 border-b border-slate-100" : ""}`}>
                    {row.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleSelectColor(col)}
                        className="w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer"
                        style={{
                          backgroundColor: col,
                          boxShadow: col === "#ffffff" ? "inset 0 0 0 1px #cbd5e1" : undefined,
                        }}
                        title={col}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm căn lề đoạn văn dạng Dropdown gọn gàng */}
        <div ref={alignMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsAlignMenuOpen(!isAlignMenuOpen)}
            className={`h-7 px-1.5 flex items-center gap-0.5 rounded transition-colors cursor-pointer ${
              isAlignMenuOpen ? "bg-slate-200" : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Căn lề đoạn văn"
          >
            <span className="material-symbols-outlined text-[17px]">
              {getCurrentAlignIcon()}
            </span>
            <span className="material-symbols-outlined text-[14px] text-slate-500">
              {isAlignMenuOpen ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          </button>

          {/* Hộp Dropdown xổ xuống dạng dải ngang 4 nút */}
          {isAlignMenuOpen && (
            <div className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-1 flex items-center gap-1 select-none">
              <button
                type="button"
                onClick={() => {
                  handleAlign("left");
                  setIsAlignMenuOpen(false);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                  isAlignActive("left") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Căn lề trái"
              >
                <span className="material-symbols-outlined text-[17px]">format_align_left</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAlign("center");
                  setIsAlignMenuOpen(false);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                  isAlignActive("center") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Căn giữa"
              >
                <span className="material-symbols-outlined text-[17px]">format_align_center</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAlign("right");
                  setIsAlignMenuOpen(false);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                  isAlignActive("right") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Căn lề phải"
              >
                <span className="material-symbols-outlined text-[17px]">format_align_right</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAlign("justify");
                  setIsAlignMenuOpen(false);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                  isAlignActive("justify") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
                }`}
                title="Căn đều hai bên"
              >
                <span className="material-symbols-outlined text-[17px]">format_align_justify</span>
              </button>
            </div>
          )}
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

