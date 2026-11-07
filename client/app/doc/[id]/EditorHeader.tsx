"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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

  // Trạng thái mở menu danh sách chấm
  const [isBulletMenuOpen, setIsBulletMenuOpen] = useState(false);
  // Tham chiếu DOM đến khung menu danh sách chấm
  const bulletMenuRef = useRef<HTMLDivElement>(null);
  // Trạng thái mở menu danh sách số
  const [isOrderedMenuOpen, setIsOrderedMenuOpen] = useState(false);
  // Tham chiếu DOM đến khung menu danh sách số
  const orderedMenuRef = useRef<HTMLDivElement>(null);

  // Trạng thái hiển thị popup chèn liên kết
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
  // Giá trị văn bản hiển thị của link
  const [linkText, setLinkText] = useState("");
  // Giá trị đường dẫn URL của link
  const [linkUrl, setLinkUrl] = useState("");
  // Tham chiếu DOM đến khung popup chèn link
  const linkPopupRef = useRef<HTMLDivElement>(null);

  // Trạng thái mở menu chọn nguồn ảnh
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  // Trạng thái mở modal nhập link ảnh URL
  const [isImageUrlModalOpen, setIsImageUrlModalOpen] = useState(false);
  // Giá trị đường link ảnh nhập vào
  const [imageUrlInput, setImageUrlInput] = useState("");
  // Tham chiếu DOM đến khung menu chọn ảnh
  const imageMenuRef = useRef<HTMLDivElement>(null);
  // Tham chiếu DOM đến thẻ input file ẩn dùng để tải ảnh từ máy tính
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Áp dụng kiểu danh sách chấm tròn
  const applyBulletStyle = (style: string) => {
    if (!editor) return;
    if (!editor.isActive("bulletList")) {
      editor.chain().focus().toggleBulletList().run();
    }
    editor.chain().focus().updateAttributes("bulletList", { listStyle: style }).run();
    setIsBulletMenuOpen(false);
  };

  // Áp dụng kiểu danh sách đánh số
  const applyOrderedStyle = (style: string) => {
    if (!editor) return;
    if (!editor.isActive("orderedList")) {
      editor.chain().focus().toggleOrderedList().run();
    }
    editor.chain().focus().updateAttributes("orderedList", { listStyle: style }).run();
    setIsOrderedMenuOpen(false);
  };

  // Mở popup chèn link và tự động trích xuất chữ đang bôi đen hoặc link hiện tại
  const handleOpenLinkPopup = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    const existingUrl = editor.getAttributes("link").href || "";
    setLinkText(selectedText);
    setLinkUrl(existingUrl);
    setIsLinkPopupOpen(true);
    setIsImageMenuOpen(false);
    setIsBulletMenuOpen(false);
    setIsOrderedMenuOpen(false);
    setIsAlignMenuOpen(false);
    setActiveColorPicker(null);
    setIsHeadingMenuOpen(false);
  };

  // Áp dụng chèn hoặc cập nhật đường dẫn liên kết
  const handleApplyLink = () => {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsLinkPopupOpen(false);
      return;
    }

    // Tự động chuẩn hóa tiền tố https:// nếu người dùng chưa nhập
    let finalUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (linkText && linkText !== selectedText) {
      editor.chain().focus().insertContent(`<a href="${finalUrl}">${linkText}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    }

    setIsLinkPopupOpen(false);
  };

  // Gỡ bỏ liên kết đang chọn
  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkPopupOpen(false);
  };

  // Xử lý chọn tệp hình ảnh từ máy tính và chèn vào văn bản
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        editor.chain().focus().setImage({ src: base64Url }).run();
      };
      reader.readAsDataURL(file);
    }
    setIsImageMenuOpen(false);
    if (e.target) e.target.value = "";
  };

  // Xử lý chèn hình ảnh từ đường link internet
  const handleInsertImageUrl = () => {
    if (imageUrlInput.trim() && editor) {
      editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
      setImageUrlInput("");
      setIsImageUrlModalOpen(false);
    }
  };

  // Tự động đóng các menu xổ xuống khi click chuột ra bất kỳ vị trí nào bên ngoài
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
      if (bulletMenuRef.current && !bulletMenuRef.current.contains(event.target as Node)) {
        setIsBulletMenuOpen(false);
      }
      if (orderedMenuRef.current && !orderedMenuRef.current.contains(event.target as Node)) {
        setIsOrderedMenuOpen(false);
      }
      if (linkPopupRef.current && !linkPopupRef.current.contains(event.target as Node)) {
        setIsLinkPopupOpen(false);
      }
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target as Node)) {
        setIsImageMenuOpen(false);
      }
    };

    if (
      isHeadingMenuOpen ||
      activeColorPicker ||
      isAlignMenuOpen ||
      isBulletMenuOpen ||
      isOrderedMenuOpen ||
      isLinkPopupOpen ||
      isImageMenuOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    isHeadingMenuOpen,
    activeColorPicker,
    isAlignMenuOpen,
    isBulletMenuOpen,
    isOrderedMenuOpen,
    isLinkPopupOpen,
    isImageMenuOpen,
  ]);

  // Lắng nghe phím tắt Ctrl + K để mở nhanh popup chèn liên kết
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleOpenLinkPopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

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
          {/* Nút danh sách chấm tròn kèm Dropdown 6 mẫu */}
          <div ref={bulletMenuRef} className="flex items-center shrink-0 relative">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`h-7 px-1 flex items-center justify-center rounded-l transition-colors cursor-pointer ${
                editor?.isActive("bulletList") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Danh sách gạch đầu dòng (Ctrl+Shift+8)"
            >
              <span className="material-symbols-outlined text-[17px]">format_list_bulleted</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBulletMenuOpen(!isBulletMenuOpen);
                setIsOrderedMenuOpen(false);
              }}
              className={`h-7 px-0.5 flex items-center justify-center rounded-r transition-colors cursor-pointer ${
                isBulletMenuOpen ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Chọn kiểu gạch đầu dòng"
            >
              <span className="material-symbols-outlined text-[13px]">
                {isBulletMenuOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </button>

            {/* Popup 6 mẫu danh sách chấm (Lưới 3x2) */}
            {isBulletMenuOpen && (
              <div className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 p-2.5 grid grid-cols-3 gap-2 w-[280px] select-none">
                {/* Mẫu 1: Tròn đặc / Tròn rỗng / Vuông */}
                <button type="button" onClick={() => applyBulletStyle("default")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Mặc định">
                  <div className="flex items-center gap-1.5"><span className="text-xs">●</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-xs">○</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px]">■</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-xs">●</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 2: Kim cương ❖ / Mũi tên ➤ */}
                <button type="button" onClick={() => applyBulletStyle("diamond")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Hình thoi & Mũi tên">
                  <div className="flex items-center gap-1.5"><span className="text-[10px]">❖</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px]">➤</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px]">■</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px]">❖</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 3: Hộp vuông rỗng ❑ */}
                <button type="button" onClick={() => applyBulletStyle("box")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Hộp vuông rỗng">
                  <div className="flex items-center gap-1.5"><span className="text-xs">❑</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-xs">❒</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-xs">❏</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-xs">❑</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 4: Mũi tên ➜ / Thoi đặc ◆ */}
                <button type="button" onClick={() => applyBulletStyle("arrow")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Mũi tên & Kim cương">
                  <div className="flex items-center gap-1.5"><span className="text-xs">➜</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px]">◆</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-xs">●</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-xs">➜</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 5: Ngôi sao ★ */}
                <button type="button" onClick={() => applyBulletStyle("star")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Ngôi sao">
                  <div className="flex items-center gap-1.5"><span className="text-xs">★</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-xs">○</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px]">■</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-xs">★</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 6: Mũi tên phi ➢ */}
                <button type="button" onClick={() => applyBulletStyle("pointer")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Mũi tên phi">
                  <div className="flex items-center gap-1.5"><span className="text-xs">➢</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-xs">○</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px]">■</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-xs">➢</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>
              </div>
            )}
          </div>

          {/* Nút danh sách đánh số kèm Dropdown 6 mẫu */}
          <div ref={orderedMenuRef} className="flex items-center shrink-0 relative">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`h-7 px-1 flex items-center justify-center rounded-l transition-colors cursor-pointer ${
                editor?.isActive("orderedList") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Danh sách đánh số (Ctrl+Shift+7)"
            >
              <span className="material-symbols-outlined text-[17px]">format_list_numbered</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOrderedMenuOpen(!isOrderedMenuOpen);
                setIsBulletMenuOpen(false);
              }}
              className={`h-7 px-0.5 flex items-center justify-center rounded-r transition-colors cursor-pointer ${
                isOrderedMenuOpen ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Chọn kiểu đánh số"
            >
              <span className="material-symbols-outlined text-[13px]">
                {isOrderedMenuOpen ? "arrow_drop_up" : "arrow_drop_down"}
              </span>
            </button>

            {/* Popup 6 mẫu danh sách đánh số (Lưới 3x2) */}
            {isOrderedMenuOpen && (
              <div className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 p-2.5 grid grid-cols-3 gap-2 w-[280px] select-none">
                {/* Mẫu 1: 1. a. i. */}
                <button type="button" onClick={() => applyOrderedStyle("decimal-alpha")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Số và chữ cái">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">1.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px] font-mono">a.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px] font-mono">i.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">2.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 2: 1) a) i) */}
                <button type="button" onClick={() => applyOrderedStyle("parenthesis")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Dấu ngoặc đơn">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">1)</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px] font-mono">a)</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px] font-mono">i)</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">2)</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 3: 1. 1.1. */}
                <button type="button" onClick={() => applyOrderedStyle("legal")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Phân cấp tài liệu">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">1.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[9px] font-mono">1.1.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-3.5"><span className="text-[8px] font-mono">1.2.1.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">2.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 4: A. a. i. */}
                <button type="button" onClick={() => applyOrderedStyle("upper-alpha")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Chữ in hoa">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">A.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px] font-mono">a.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px] font-mono">i.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">B.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 5: I. A. 1. */}
                <button type="button" onClick={() => applyOrderedStyle("roman")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Số La Mã">
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">I.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px] font-mono">A.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px] font-mono">1.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono">II.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>

                {/* Mẫu 6: 01. a. i. */}
                <button type="button" onClick={() => applyOrderedStyle("padded")} className="h-[76px] p-2 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all flex flex-col justify-between cursor-pointer text-left" title="Số có số 0 dẫn đầu">
                  <div className="flex items-center gap-1.5"><span className="text-[9px] font-mono">01.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-2.5"><span className="text-[10px] font-mono">a.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5 pl-4"><span className="text-[10px] font-mono">i.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                  <div className="flex items-center gap-1.5"><span className="text-[9px] font-mono">02.</span><div className="h-1 bg-slate-300 rounded flex-1" /></div>
                </button>
              </div>
            )}
          </div>
          {/* Nút danh sách công việc có ô tích checkbox */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              editor?.isActive("taskList") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Danh sách việc cần làm (Checklist)"
          >
            <span className="material-symbols-outlined text-[17px]">check_box</span>
          </button>

          {/* Nút định dạng khối trích dẫn */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              editor?.isActive("blockquote") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Khối trích dẫn (Ctrl+Shift+B)"
          >
            <span className="material-symbols-outlined text-[17px]">format_quote</span>
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 shrink-0" />

        {/* Nhóm chèn liên kết và khối nội dung */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Nút chèn liên kết kèm Popup (hỗ trợ phím tắt Ctrl+K) */}
          <div ref={linkPopupRef} className="relative">
            <button
              type="button"
              onClick={handleOpenLinkPopup}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                editor?.isActive("link") ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Chèn liên kết (Ctrl+K)"
            >
              <span className="material-symbols-outlined text-[17px]">link</span>
            </button>

            {/* Popup thiết lập liên kết */}
            {isLinkPopupOpen && (
              <div className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 p-3 w-[300px] flex flex-col gap-2.5">
                <div className="text-xs font-semibold text-slate-700">Chèn đường dẫn liên kết</div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-500 font-medium">Văn bản hiển thị</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Văn bản muốn hiển thị..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-500 font-medium">Đường dẫn liên kết (URL)</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  {editor?.isActive("link") ? (
                    <button
                      type="button"
                      onClick={handleRemoveLink}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-1 cursor-pointer"
                    >
                      Xóa liên kết
                    </button>
                  ) : <div />}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsLinkPopupOpen(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyLink}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded cursor-pointer transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nút chèn hình ảnh kèm Menu tùy chọn */}
          <div ref={imageMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsImageMenuOpen(!isImageMenuOpen)}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
                isImageMenuOpen ? "bg-slate-200 text-slate-800" : "text-slate-700 hover:bg-slate-100"
              }`}
              title="Chèn hình ảnh"
            >
              <span className="material-symbols-outlined text-[17px]">image</span>
            </button>

            {/* Menu xổ xuống chọn phương thức chèn ảnh */}
            {isImageMenuOpen && (
              <div className="absolute top-8 left-0 z-50 bg-white rounded-lg shadow-2xl border border-slate-200 py-1 w-[200px] flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setIsImageMenuOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-500">upload_file</span>
                  Tải lên từ máy tính
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsImageMenuOpen(false);
                    setIsImageUrlModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-slate-500">link</span>
                  Dán đường dẫn ảnh (URL)
                </button>
              </div>
            )}

            {/* Thẻ input chọn file ẩn */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Modal nhập đường link ảnh được gắn ra ngoài body để căn giữa tuyệt đối */}
          {isImageUrlModalOpen && typeof document !== "undefined" && createPortal(
            <div
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setIsImageUrlModalOpen(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl border border-slate-200 p-5 w-full max-w-sm flex flex-col gap-3.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">image</span>
                    Chèn hình ảnh từ đường dẫn
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsImageUrlModalOpen(false);
                      setImageUrlInput("");
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-500 font-medium">Đường dẫn hình ảnh (URL)</label>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/hinh-anh.jpg"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInsertImageUrl();
                      if (e.key === "Escape") setIsImageUrlModalOpen(false);
                    }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImageUrlModalOpen(false);
                      setImageUrlInput("");
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertImageUrl}
                    className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors shadow-sm"
                  >
                    Chèn ảnh
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
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

