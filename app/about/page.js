"use client"; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function About() {
    return (
      <section className="px-4 py-8 md:px-12 md:py-16">
        {/* Header Section */}
        <div className="text-center space-y-4">
            <div className="leading-5">
                <span className="font-1 text-4xl tracking-[10px] text-yellow-600">Phoenix</span><br/>
                <span className="text-xl font-2">Unbound Thought</span>
            </div>
          {/* <h2 className="text-4xl font-bold">Phoenix - Unbound Thought</h2>
          <h5 className="text-xl">A Blog About Infinite Ideas, Thought Experiments, and Creative Exploration</h5> */}
        </div>
  
        {/* About the Blog */}
        <div className="mt-8">
          <Card>
            <div className="space-y-4 p-4">
              <h4 className="text-2xl font-semibold">About This App</h4>
              <p>
                "Phoenix - Unbound Thought" is a place where ideas rise like the mythical Phoenix, constantly
                evolving and reborn. This blog explores concepts, thought experiments, and creative musings
                on technology, philosophy, and self-improvement. Expect to challenge your mind with engaging
                content aimed at expanding your horizon.
              </p>
            </div>
          </Card>
        </div>
  
        {/* About the Creator */}
        <div className="mt-8">
          <Card>
            <div className="space-y-4 p-4">
              <h4 className="text-2xl font-semibold">The Creator</h4>
              <p>
                The creator of "Phoenix - Unbound Thought" is a passionate individual dedicated to exploring
                the intersection of technology and creative expression. Through this platform, I aim to share
                my thoughts, ideas, and experiences with others who are eager to grow and evolve.
              </p>
            </div>
          </Card>
        </div>
  
        {/* Contact Button */}
        <div className="mt-8 flex justify-center">
          <Link href={"/contact"}><Button variant="solid">Contact Me</Button></Link>
        </div>
  
        <Separator className="mt-8" />
      </section>
    );
  }