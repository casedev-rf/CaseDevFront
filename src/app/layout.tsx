import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const workSans = Work_Sans({ 
  subsets: ["latin"],
  variable: "--font-work-sans"
});

export const metadata: Metadata = {
  title: "Multi Family Office",
  description: "Planejamento e projeção patrimonial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${workSans.variable}`}>
      <body
        className="antialiased bg-background text-foreground font-sans"
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}