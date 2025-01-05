import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "phoenix - unbound thought",
  description: "Discover 'Phoenix - Unbound Thought', a cutting-edge blog built with Curd and Next.js. Explore unbounded creativity, innovative ideas, and powerful insights seamlessly presented in a modern, dynamic web app experience.",
  author: "Shirsendu Munshi",
  keywords: "technology, programming, development, blogs, tutorials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="author" content={metadata.author} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="icon" href="/logos-favicon/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
