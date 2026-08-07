import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Умная прихожая в подарок — CJ/CJM V0.1",
  description: "Интерактивный каркас клиентского пути и работы команды для пилота SberDevices × АТЛОН.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
