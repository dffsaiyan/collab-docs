"use client";

import { useEditor, EditorContent, Mark, Extension, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import EditorHeader from "./EditorHeader";

// Kiểu dữ liệu thuộc tính truyền vào component
interface EditorCanvasProps {
  docId: string;
}

// Extension tùy biến kích thước chữ dạng inline mark (thẻ span style font-size)
const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[style*='font-size']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

// Extension tùy biến màu nét chữ (thẻ span style color)
const TextColor = Mark.create({
  name: "textColor",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (el) => el.style.color || null,
        renderHTML: (attrs) => (attrs.color ? { style: `color: ${attrs.color}` } : {}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[style*='color']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

// Extension tùy biến màu nền highlight (thẻ span style background-color)
const HighlightColor = Mark.create({
  name: "highlightColor",
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (el) => el.style.backgroundColor || null,
        renderHTML: (attrs) => (attrs.color ? { style: `background-color: ${attrs.color}` } : {}),
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[style*='background-color']" }, { tag: "mark" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

// Extension tùy biến căn lề đoạn văn (thẻ p, h1, h2, h3, h4 style text-align)
const TextAlign = Extension.create({
  name: "textAlign",
  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultAlignment: "left",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (el) => el.style.textAlign || this.options.defaultAlignment,
            renderHTML: (attrs) => {
              if (!attrs.textAlign || attrs.textAlign === this.options.defaultAlignment) {
                return {};
              }
              return { style: `text-align: ${attrs.textAlign}` };
            },
          },
        },
      },
    ];
  },
});

// Extension mở rộng hỗ trợ nhiều kiểu hiển thị cho danh sách
const CustomListStyle = Extension.create({
  name: "customListStyle",
  addGlobalAttributes() {
    return [
      {
        // Áp dụng thuộc tính listStyle cho danh sách chấm và danh sách số
        types: ["bulletList", "orderedList"],
        attributes: {
          listStyle: {
            default: "default",
            parseHTML: (el) => el.getAttribute("data-list-style") || "default",
            renderHTML: (attrs) => ({ "data-list-style": attrs.listStyle || "default" }),
          },
        },
      },
    ];
  },
});

export default function EditorCanvas({ docId }: EditorCanvasProps) {
  // Khởi tạo trình soạn thảo Tiptap với cấu hình cơ bản cùng các extension định dạng
  const editor = useEditor({
    extensions: [
      // Kích hoạt link và cho phép nhấp chuột để mở trang web sang tab mới
      StarterKit.configure({
        link: {
          openOnClick: true,
          autolink: true,
        },
      }),
      FontSize,
      TextColor,
      HighlightColor,
      TextAlign,
      CustomListStyle,
      // Hỗ trợ danh sách công việc có ô checkbox
      TaskList,
      // Hỗ trợ từng mục công việc và cho phép lồng cấp bằng phím Tab
      TaskItem.configure({
        nested: true,
      }),
      // Hỗ trợ chèn và hiển thị hình ảnh chuẩn (bao gồm ảnh tải lên dạng Base64)
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
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

