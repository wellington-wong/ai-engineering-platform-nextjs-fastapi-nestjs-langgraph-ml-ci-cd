import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",


  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"]
});

export const metadata: Metadata = {

  title: { default: "Wellington Wong | Portfolio", template: '%s | Wellington Codes' },
  description: "Full-Stack Engineer | AI/ML & Automation",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (

    <html
      lang="en"
      className={`${notoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F1F3F5]">
        {children}
      </body>
    </html>

  );
}
