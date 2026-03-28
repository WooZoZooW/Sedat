import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

export const metadata = {
  title: "Next.js App",
  description: "Deployed on Strato",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
