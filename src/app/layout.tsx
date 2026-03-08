import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'CheckBill - ระบบคิดบิลใบเสร็จ',
  description: 'ระบบจัดการบิลและใบเสร็จรับเงินออนไลน์ สร้างบิล พิมพ์ใบเสร็จ ง่ายและรวดเร็ว',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
