'use client'
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Myprovider } from "./context/Mycontext";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((err) => {
        console.error('❌ SW registration failed:', err);
      });
  }
}, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Myprovider><Navbar></Navbar>
        {children}<Footer></Footer></Myprovider>  
       
      </body>
    </html>
  );
}
