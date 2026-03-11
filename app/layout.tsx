import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "./contexts/SettingsContext";
import SettingsWrapper from "./components/SettingsWrapper";

export const metadata: Metadata = {
  title: "就活管理アプリ",
  description: "企業・タスク・選考状況を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <SettingsProvider>
            <SettingsWrapper>
              <Header />
              {children}
            </SettingsWrapper>
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}