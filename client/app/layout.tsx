import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

// 1. Tự động tải và lưu trữ font chữ Offline trong dự án (Tối ưu tốc độ tải trang của Next.js):
// - Plus Jakarta Sans: Dùng cho các tiêu đề (Headings) hiện đại, nổi bật.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

// - Inter: Dùng cho nội dung văn bản (Body text) sắc nét, dễ đọc.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// 2. Cấu hình tiêu đề và mô tả hiển thị trên tab trình duyệt (Metadata):
export const metadata: Metadata = {
  title: "CollabDocs - Workspace",
  description: "Hệ thống soạn thảo văn bản cộng tác thời gian thực",
};

// 3. Khung sườn gốc (Root Layout) bao bọc toàn bộ các trang trong hệ thống:
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* 4. Nhúng bộ Icon chính thức Google Material Symbols (Chuông, Kính lúp, Thư mục, Dấu cộng...) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      {/* 5. Gắn các biến font vào thẻ body để toàn bộ ứng dụng sử dụng */}
      <body className={`${plusJakartaSans.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
