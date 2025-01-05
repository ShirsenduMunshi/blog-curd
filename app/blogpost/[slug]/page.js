"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BlogPost({ params: paramsPromise }) {
  const [slug, setSlug] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Unwrap the `params` Promise and set the slug
    const fetchParams = async () => {
      const params = await paramsPromise;
      setSlug(params.slug);
    };

    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    // Fetch the blog data once the slug is available
    if (slug) {
      const fetchBlogData = async () => {
        const url = `/api/blog?slug=${slug}`;
        // console.log("URL:", url);

        try {
          const response = await axios.get(url);
          if (response.data) { // Ensure the response contains the 'blog' key
            setData(response.data);  // Set the blog data
          } else {
            console.error("Blog not found");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };

      fetchBlogData();
    }
  }, [slug]);

  // Render the blog content
  if (!slug || !data) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 relative">
      <div className="relative">
        <Image
          src={data.image ? data.image : "/banner.jpg"}
          alt={data.title}
          width={300}
          height={300}
          className="w-full h-60 rounded-2xl shadow-lg object-cover border-white border"
          priority={true}
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center md:text-5xl">
        {data.title}
      </h1>
      <div className="flex flex-col justify-center items-center text-sm text-gray-500 dark:text-gray-400">
        <Image src={data.authorImage} alt="author-image" width={"50"} height={"50"} className="rounded-full w-auto h-auto"></Image>
        <p><span className="font2 text-blue-500">{data.author}</span></p>
        <p>Date: {data.date.slice(0,10).split("-").reverse().join("-")}</p>
      </div>
      <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400 text-center md:text-2xl">
        {data.summary}
      </h2>
      <pre className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed md:text-xl text-wrap text-start mb-[10vh]">
        {data.body}
      </pre>
    </div>
  );
}