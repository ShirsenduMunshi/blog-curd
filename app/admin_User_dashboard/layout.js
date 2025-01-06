import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "phoenix - Admin Dashboard",
  description: "Admin dashboard for the phoenix blog",
  author: "Shirsendu Munshi",
  keywords: "technology, programming, development, blogs, tutorials",
};

export default function RootLayout({ children }) {
  return (
    <>
     <SidebarProvider>
      <main className="overflow-x-hidden min-w-full flex items-center min-h-screen justify-center px-4 py-8">
        {/* <Sidebar /> */}
        {children}
      </main>
    </SidebarProvider>
    </>
  );
}
