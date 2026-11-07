"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorHeader from "./EditorHeader";

// Kiểu dữ liệu thuộc tính truyền vào component
interface EditorCanvasProps {
  docId: string;
}

export default function EditorCanvas({ docId }: EditorCanvasProps) {
  // Khởi tạo trình soạn thảo Tiptap với cấu hình cơ bản
  const editor = useEditor({
    extensions: [StarterKit],
    // Để trang giấy trắng hoàn toàn khi khởi tạo
    content: "",
    // Tắt chế độ render tức thì trên server để tránh xung đột Hydration trong Next.js
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Tự động phủ kín chiều cao trang giấy và tắt viền xanh mặc định khi click chuột
        class: "focus:outline-none min-h-[900px] text-slate-800 text-base leading-relaxed",
      },
    },
  });

  return (
    <>
      {/* Cụm 2 tầng Header và Toolbar điều khiển */}
      <EditorHeader docId={docId} editor={editor} />

      {/* Vùng chứa bên ngoài căn giữa trang giấy và cách mép trên 112px */}
      <main className="pt-28 pb-16 flex-1 flex justify-center px-4">
        {/* Khung tờ giấy chuẩn kích thước A4 phẳng, góc vuông, viền xám mỏng */}
        <div id="collab-print-area" className="w-full max-w-[816px] min-h-[1056px] bg-white rounded-none border border-[#dadce0] px-16 py-14 cursor-text">
          <EditorContent editor={editor} />
        </div>
      </main>
    </>
  );
}

