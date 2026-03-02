import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { connectDB } from "@/lib/db"; // ✅ Add this

// ✅ Call database connection (server-side only)
connectDB();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Secure Auth App",
    template: "%s | Secure Auth App",
  },
  description: "Production-grade secure authentication system",
  metadataBase: new URL("http://localhost:3000"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans 
          antialiased 
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}
