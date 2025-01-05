// app/components/Footer.js
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-6 px-6 border-t bg-background text-foreground bg-gray-200 dark:bg-[#2a2633]">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Footer Brand */}
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-1 pt-1">
                        <Link href={`/`}>
                            <Image src="/logos-favicon/logo.jpg" alt="Phoenix Logo" width={40} height={40} />
                        </Link>
                    </div>
                    <Link href="/" className="text-xl font-bold flex flex-col items-center leading-3  pb-1">
                        <span className="text-[16px] font-1 tracking-[5px]">Phoenix</span>
                        <span className="text-[10px] font-2">Unbound Thought</span>
                    </Link>
                </div>
                {/* Footer Links */}
                <nav className="flex space-x-6 margin-x-30px mt-6 md:mt-0">
                    <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="hover:underline">Terms of Service</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                </nav>
                {/* Copyright */}
                <div className="mt-4 md:mt-0 text-sm text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Phoenix - Unbound Thought. All rights reserved.
                </div>
            </div>
            <div className="mb-1 pt-1 w-full flex justify-center border-none outline-none">
                <Link href={`/`}>
                    <Image src="/logos-favicon/logo.jpg" alt="Phoenix Logo" width={160} height={160} priority={true}/>
                </Link>
            </div>
        </footer>
    );
}
