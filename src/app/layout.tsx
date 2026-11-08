import Script from "next/script";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import SnowEffect from "../components/shared/SnowEffect";
import "./globals.css";

export const metadata = {
  title: "Fahrschule Sedat | Sicher ans Ziel in Duisburg-Rheinhausen",
  description: "Ihre professionelle Fahrschule in Duisburg. Wir bilden in den Klassen B, BE, B197 aus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <Script
          id="theme-init"
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider>
          <LanguageProvider>
            <SnowEffect />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
