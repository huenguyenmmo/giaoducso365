import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lớp Học K06 - Quản Lý Bài Tập & Bảng Điểm Kidsa Style',
  description: 'Hệ thống quản lý lớp học K06 phong cách Kidsa Educational đầy đủ UI/UX, nộp bài zip, duyệt chấm điểm và xuất Excel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased selection:bg-kidsa-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}
