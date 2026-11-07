import { Suspense } from "react";
import EditorCanvas from "./EditorCanvas";

// Kiểu dữ liệu params chuẩn Next.js 16
interface PageProps {
  params: Promise<{ id: string }>;
}

// Khối đọc ID từ URL và hiển thị giao diện
async function DocumentContent({ params }: PageProps) {
  const { id } = await params;
  return (
    // Khung soạn thảo Tiptap tích hợp Header điều khiển
    <EditorCanvas docId={id} />
  );
}

// Trang chính bọc Suspense
export default function DocumentEditorPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] flex flex-col">
      <Suspense fallback={<div className="p-4 text-xs text-gray-400 font-mono">Đang tải phòng...</div>}>
        <DocumentContent params={params} />
      </Suspense>
    </div>
  );
}
