"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';


  export default function Blogs() {
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blog");
        // console.log("API Response:", response.data);
        setBlogs(response.data.blogs || []); // Ensure blogs is always an array
        // console.log("Blogs State:", response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]); // Set an empty array in case of error
      }
    };

    useEffect(() => {
      fetchBlogs();
    }, [])
    
    
    return (
      <section className="px-4 py-8 md:px-12 md:py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Blog Posts</h2>

        <div className='categories container w-[90%] mx-auto'>
          <h3 className='text-3xl font-bold text-center mb-8'>Categories:</h3>
          <ul className="flex flex-wrap justify-center mb-8 gap-6">
            <li><Button className={menu==="All"? "opacity-50 cursor-not-allowed":""} onClick={()=>{setMenu("All")}} variant="default">All</Button></li>
            <li><Button className={menu==="Technology"? "opacity-50 cursor-not-allowed":""} onClick={()=>{setMenu("Technology")}} variant="outline">Technology</Button></li>
            <li><Button className={menu==="Science"? "opacity-50 cursor-not-allowed":""} onClick={()=>{setMenu("Science")}} variant="outline">Science</Button></li>
            <li><Button className={menu==="Travel"? "opacity-50 cursor-not-allowed":""} onClick={()=>{setMenu("Travel")}} variant="outline">Travel</Button></li>
            <li><Button className={menu==="History"? "opacity-50 cursor-not-allowed":""} onClick={()=>{setMenu("History")}} variant="outline">History</Button></li>
          </ul>
        </div>
  {/* {console.log(menu)} */}
        {/* Loop through the blogs array and display each blog */}
        <div className="space-y-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.filter((item)=> menu==="All" ? true : item.category === menu).map((blog, index) => (
            <Card key={blog._id} className="p-4">
              <div className="space-y-4">
                {/* Blog Image */}
                <h3>Category: {blog.category}</h3>
                <div className="relative">
                  <Image
                    src={blog.image ? blog.image : '/banner.jpg'} 
                    alt={blog.title}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover rounded-md"
                    priority={true}
                  />
                </div>
                {/* Blog Title and Summary */}
                <h3 className="text-2xl font-semibold">{blog.title}</h3>
                <p className="">{blog.summary}</p>
                {/* Date and Read More Button */}
                <div className="flex justify-between text-sm ">
                  {/* {console.log(blog.date)} */}
                  <span>{blog.date.slice(0,10).split("-").reverse().join("-")}</span>
                  <Link href={`/blogpost/${blog.slug}`}>
                    <Button variant="outline">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
  
        <Separator className="mt-8" />
      </section>
    );
  }