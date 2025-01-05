"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastContainer, toast } from 'react-toastify';

const AddBlogPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category: "",
    body: "",
    author: "",
    image: null,
    authorImage: null,
  });

  const [previewImages, setPreviewImages] = useState({
    blogImage: null,
    authorImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(formData);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlogImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
      setPreviewImages((prev) => ({
        ...prev,
        blogImage: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleAuthorImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setFormData((prevData) => ({ ...prevData, authorImage: files[0] }));
      setPreviewImages((prev) => ({
        ...prev,
        authorImage: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      setFormData({
        title: "",
        summary: "",
        category: "",
        body: "",
        author: "",
        image: null,
        authorImage: null,
      });
      // alert("Blog added successfully!");
      toast.success("Blog added successfully!");
      setPreviewImages({
        blogImage: null,
        authorImage: null,
      });
    } catch (error) {
      console.error(error);
      // alert("Error adding blog: " + error.message);
      toast.error("Error adding blog: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar
        open={isSidebarOpen}
        className={`bg-background/50 backdrop-blur max-h-[50vh] fixed top-[9vh] left-0 z-40 border-b w-64 shadow-md ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center bg-accent p-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold">Admin Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <ul className="space-y-2 min-h-full bg-background/50 backdrop-blur rounded-xl p-4">
            <li className="border-b-4 border-b-[#6d28d9]">
              <Link
                href="/admin/add-product"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Add Blog
              </Link>
            </li>
            <li className="border-b-4 border-b-[#6d28d9]">
              <Link
                href="/admin/blog-list"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Blog Lists
              </Link>
            </li>
            <li className="border-b-4 border-b-[#6d28d9]">
              <Link
                href="/admin/subscription"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Subscription
              </Link>
            </li>
            <li className="border-b-4 border-b-[#6d28d9]">
              <Link
                href="/admin"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Dashboard
              </Link>
            </li>
            <li className="border-b-4 border-b-[#6d28d9]">
              <Link
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Home
              </Link>
            </li>
          </ul>
        </div>
      </Sidebar>
      <main
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 relative top-[-3rem] md:left-[-3rem] md:top-[-3rem] min-w-full ${isSidebarOpen ? '' : ''}`}
      ><ToastContainer />
        <button
          className={`text-gray-500 dark:text-gray-200 w-full text-start text-3xl ${
            isSidebarOpen ? "" : ""
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <Card className="w-full max-w-3xl p-6">
          <h1 className="text-2xl font-bold mb-6">Add Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-4 min-h-full min-w-full">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
            <Textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Summary"
              required
            />
            <Select
              name="category"
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prevData) => ({ ...prevData, category: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Businesses">Businesses</SelectItem>
                  <SelectItem value="History">Historical</SelectItem>
                  <SelectItem value="Travel">Traveling</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Blog Content"
              rows="8"
              required
            />
            <Input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author Name"
              required
            />
            <p>Provide Blog Image</p>
            <Input
              placeholder="Blog Image"
              type="file"
              name="image"
              onChange={handleBlogImageChange}
              accept="image/*"
            />
            {previewImages.blogImage && (
              <img
                src={previewImages.blogImage}
                alt="Blog Preview"
                className="w-full h-auto max-w-xs mb-4"
              />
            )}
            <p>Provide Author Image</p>
            <Input
              placeholder="Author Image"
              type="file"
              name="authorImage"
              onChange={handleAuthorImageChange}
              accept="image/*"
            />
            {previewImages.authorImage && (
              <img
                src={previewImages.authorImage}
                alt="Author Preview"
                className="w-full h-auto max-w-xs mb-4"
              />
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Blog"}
            </Button>
          </form>
        </Card>
      </main>
    </>
  );
};

export default AddBlogPage;
