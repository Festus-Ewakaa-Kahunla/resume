import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sreda = localFont({
  src: "../../public/fonts/Sreda-Regular.ttf",
  variable: "--font-sreda",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume - AI-Powered Resume Builder",
  description:
    "Build professional resumes with AI assistance. Tailor your resume to job descriptions, improve bullet points, and check ATS compatibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sreda.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0a] font-sans text-white">
        {children}
      </body>
    </html>
  );
}
