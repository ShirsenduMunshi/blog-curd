import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="Background-image flex flex-col md:flex-row items-center justify-between ">
        <div className="Background-image-glass px-6 py-16 flex flex-col md:flex-row items-center justify-between w-full">
          
        
        <div className="max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-roboto text-white">
            <span className="mb-6">Welcome to</span> <br/><br/>
            <div className="leading-5">
              <span className="font-1 tracking-[10px] text-yellow-600">Phoenix</span><br/>
              <span className="text-[20px] font-2 ml-4">Unbound Thought</span>
            </div>
          </h1>
          <p className="text-lg text-gray-200">
            Share your thoughts, explore new ideas, and connect with like-minded individuals in a boundless space of creativity and expression.
          </p>
          <div className="space-x-4">
            <Link href="/blogs">
              <Button variant="default" className="">
                Explore blogs
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-yellow-400">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-0 rounded-full overflow-hidden">
          <Image
            src="/logos-favicon/logo.jpg"
            alt="Phoenix Illustration"
            width={300}
            height={300}
          />
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center font-roboto">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="text-center space-y-4 border p-2">
              <h3 className="text-xl font-bold">Creative Freedom</h3>
              <p className="">
                Express yourself without boundaries in a community that values your individuality.
              </p>
            </div>
            <div className="text-center space-y-4 border p-2">
              <h3 className="text-xl font-bold">Inspiring Community</h3>
              <p className="">
                Connect with others who share your passion for knowledge, art, and creativity.
              </p>
            </div>
            <div className="text-center space-y-4 border p-2">
              <h3 className="text-xl font-bold">Seamless Experience</h3>
              <p className="">
                Enjoy an intuitive and beautifully designed platform for all your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold font-roboto">Start Your Journey Today</h2>
        <p className="text-lg mt-4">
          Join our community and let your thoughts soar like a phoenix.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <Button variant="destructive" className="">Sign Up</Button>
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
