// app/components/Navbar.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // For menu icons
import { Button } from "./ui/button";
import Image from "next/image";
import { ModeToggle } from './theme-btn';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isCEO, setIsCEO ] = useState(false);
  const [isAdmin, setIsAdmin ] = useState(false);
  const [isUser, setIsUser ] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.clear();
    setIsLogin(false);
    setIsCEO(false);
    setIsAdmin(false);
    setIsUser(false);
    window.location.href = "/"
  }

  const userRole = localStorage.getItem("role");
  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole === "admin" || userRole === "Admin") {
      setIsLogin(true);
      setIsAdmin(true);
    } else if (userRole === "CEO" || userRole === "ceo") {
      setIsLogin(true);
      setIsCEO(true);
    } else if (userRole === "user" || userRole === "User") {
      setIsLogin(true);
      setIsUser(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  return (
    <header className="flex items-center justify-between px-6 bg-background/50 sticky top-0 backdrop-blur border-b z-10">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-1 pt-1">
          <Link href={`/`}>
            <Image src="/logos-favicon/logo.jpg" alt="Phoenix Logo" width={40} height={40} priority={true}/>
          </Link>
        </div>
        <Link href="/" className="text-xl font-bold flex flex-col items-center leading-3  pb-1">
          <span className="text-[16px] font-1 tracking-[5px]">Phoenix</span>
          <span className="text-[10px] font-2">Unbound Thought</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <nav className="hidden md:flex space-x-6">
        <Link href="/" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Home</Link>
        <Link href="/about" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">About</Link>
        <Link href="/blogs" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Blogs</Link>
        <Link href="/contact" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Contact</Link>
        
        {isLogin ? "" : (<Link href="/login"><Button variant="default">Login</Button></Link>)}
        {isLogin ? "" : (<Link href="/signup"><Button variant="destructive">Sign Up</Button></Link>)}

        {isCEO && (<Link href="/admin"><Button variant="destructive">C.E.O Dashboard</Button></Link>)}
        {isAdmin && (<Link href="/admin_dashboard"><Button variant="default">Dashboard</Button></Link>)}
        {isLogin && (<Button onClick={logout} variant="destructive">Logout</Button>)}
        <ModeToggle />
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <ModeToggle />
        <Button variant="ghost" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 w-full shadow-md bg-background/90 top-[4.5rem] backdrop-blur border-b z-10 md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Home</Link>
            <Link href="/about" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">About</Link>
            <Link href="/blogs" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Blogs</Link>
            <Link href="/contact" className="font-bold text-xl hover:text-blue-500 transition-colors duration-200">Contact</Link>
            
            {isLogin ? "" : (<Link href="/login"><Button variant="default">Login</Button></Link>)}
            {isLogin ? "" : (<Link href="/signup"><Button variant="destructive">Sign Up</Button></Link>)}

            {isCEO && (<Link href="/admin"><Button variant="destructive">C.E.O Dashboard</Button></Link>)}
            {isAdmin && (<Link href="/admin_dashboard"><Button variant="default">Dashboard</Button></Link>)}
            {isLogin && (<Button onClick={logout} variant="destructive">Logout</Button>)}
          </nav>
        </div>
      )}
    </header>
  );
}
