"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import for the body and summary fields
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Sidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

const BlogListPage = () => {
  
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    category: "",
    date: "",
    summary: "",
    body: "",
    image: "",
    author: "",
    authorImage: "",
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/blog");
        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (slug) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );
  
    if (!confirmDeletion) {
      return; // Exit if the user cancels the action
    }
    try {
      await axios.delete(`/api/blog?slug=${slug}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.slug !== slug));
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting the blog");
    }
  };

  const handleUpdateBlog = async () => {
    try {
      // Create a new FormData object
      const formData = new FormData();
  
      // Append regular fields to FormData
      formData.append("title", updateForm.title);
      formData.append("category", updateForm.category);
      formData.append("date", updateForm.date);
      formData.append("summary", updateForm.summary);
      formData.append("body", updateForm.body);
      formData.append("author", updateForm.author);
  
      // Append files (if they exist)
      if (updateForm.image) {
        formData.append("image", updateForm.image);
      }
      if (updateForm.authorImage) {
        formData.append("authorImage", updateForm.authorImage);
      }
  
      // Send the PUT request with FormData
      const response = await axios.put(`/api/blog?slug=${selectedBlog.slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      // Update the blog list after the request is successful
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.slug === selectedBlog.slug ? { ...blog, ...updateForm } : blog
        )
      );
      setSelectedBlog(null); // Close the modal
    } catch (error) {
      console.error("Error during update:", error);
      console.error("Response error details:", error.response?.data || error.response);
    }
  };

  const openUpdateModal = (blog) => {
    setSelectedBlog(blog);
    setUpdateForm({
      title: blog.title,
      category: blog.category,
      date: blog.date,
      summary: blog.summary,
      body: blog.body,
      image: blog.image,
      author: blog.author,
      authorImage: blog.authorImage,
      slug: blog.slug,
    });
  };

  return (
    <>
      <Sidebar open={isSidebarOpen} className={`bg-background/50 backdrop-blur max-h-[50vh] fixed top-[9vh] left-0 z-40 border-b w-64 shadow-md ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4">
          <div className="flex justify-between items-center bg-accent p-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold">Admin Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <ul className="space-y-2 min-h-full bg-background/50 backdrop-blur rounded-xl p-4">
            <li className="border-b-4 border-b-[#6d28d9]"><Link href="/admin/add-product" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent :text-accent-foreground">Add Blog</Link></li>
            <li className="border-b-4 border-b-[#6d28d9]"><Link href="/admin/blog-list"className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">Blog Lists</Link></li>
            <li className="border-b-4 border-b-[#6d28d9]"><Link href="/admin/subscription"className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">Subscription</Link></li>
            <li className="border-b-4 border-b-[#6d28d9]"><Link href="/admin"className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">Dashboard</Link></li>
            <li className="border-b-4 border-b-[#6d28d9]"> <Link href="/" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">Home</Link></li>
          </ul>
        </div>
      </Sidebar>

      {loading ? <div>Loading...</div> : <div className={`container mx-auto px-4 py-6 space-y-6 ${isSidebarOpen ? '' : 'min-w-[95vw] md:-translate-x-32'}`}>
          <ToastContainer />
          <h1 className="mt-0 text-3xl font-bold text-center min-w-full relative"><button className={`text-gray-500 dark:text-gray-200 w-fit absolute left-0 text-start ${isSidebarOpen ? "" : ""}`} onClick={() => setIsSidebarOpen(!isSidebarOpen)} >☰</button>Blog List</h1>
          {isMobile ? (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.slug} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{blog.title}</span>
                      <Badge>{blog.category}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {blog.image && (<div className="relative w-full h-40">
                        <Image src={blog.image}alt={blog.title}fill className="object-cover rounded"/>
                      </div>)}
                    <p className="text-sm text-gray-600">Published on:{" "}{blog.date.slice(0, 10).split("-").reverse().join("-")}</p>
                    <p className="text-sm text-gray-700">{blog.summary}</p>
                    <div className="flex space-x-2">
                      <Button variant="default"onClick={() => openUpdateModal(blog)}>Edit</Button>
                      <Button variant="destructive"onClick={() => handleDeleteBlog(blog.slug)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>))}
            </div>) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Image</TableCell>
                  <TableCell className="font-bold">Title</TableCell>
                  <TableCell className="font-bold">Category</TableCell>
                  <TableCell className="font-bold">Date</TableCell>
                  <TableCell className="font-bold">Summary</TableCell>
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.slug}>
                    <TableCell className="w-24">
                      {blog.image && (<Image src={blog.image} alt={blog.title}width={80}height={60}className="rounded object-cover"/>)}
                    </TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>
                      <Badge>{blog.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {blog.date.slice(0, 10).split("-").reverse().join("-")}
                    </TableCell>
                    <TableCell>{blog.summary}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="default"onClick={() => openUpdateModal(blog)}>Edit</Button>
                        <Button variant="destructive"onClick={() => handleDeleteBlog(blog.slug)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Update Modal */}
          {selectedBlog && (
            <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
              <DialogContent
                className="w-full max-w-[90%] sm:max-w-md md:max-w-lg mx-auto bg-background text-foreground rounded-md shadow-md overflow-auto"
                style={{ maxHeight: '90vh' }}
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Update Blog</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Edit the blog details below and save changes.
                  </p>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={updateForm.title}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, title: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={updateForm.slug}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, slug: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={updateForm.author}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, author: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={updateForm.category}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, category: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={updateForm.date.slice(0, 10)}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, date: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={updateForm.summary}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, summary: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorImage">Author Image</Label>
                    <Input
                      type="file"
                      id="authorImage"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setUpdateForm({ ...updateForm, authorImage: file });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                      type="file"
                      id="image"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setUpdateForm({ ...updateForm, image: file });
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="body">Body</Label>
                    <Textarea
                      id="body"
                      value={updateForm.body}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, body: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="default"
                    onClick={() => setSelectedBlog(null)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateBlog}
                    className="w-full sm:w-auto"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>)}
        </div>}
    </>
  );
};

export default BlogListPage;


// {selectedBlog && (
//   <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
//     <DialogContent>
//       <DialogHeader>
//         {/* DialogTitle added here */}
//         <visualViewport>
//         <DialogTitle>Update Blog</DialogTitle>
//         </visualViewport>
//         <p className="text-sm text-gray-500">Edit the blog details below and save changes.</p>
//       </DialogHeader>
//       <div className="space-y-4">
//         <div>
//           <Label htmlFor="title">Title</Label>
//           <Input id="title" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}/>
//         </div>
//         <div>
//           <Label htmlFor="slug">Slug</Label>
//           <Input id="slug" value={updateForm.slug} onChange={(e) => setUpdateForm({ ...updateForm, slug: e.target.value }) } />
//         </div>
//         <div>
//           <Label htmlFor="author">Author</Label>
//           <Input id="author"value={updateForm.author}onChange={(e) =>setUpdateForm({ ...updateForm, author: e.target.value })}/>
//         </div>
//         <div>
//           <Label htmlFor="category">Category</Label>
//           <Input id="category"value={updateForm.category}onChange={(e) =>setUpdateForm({ ...updateForm, category: e.target.value })}/>
//         </div>
//         <div>
//           <Label htmlFor="date">Date</Label>
//           <Input id="date"type="date"value={updateForm.date.slice(0, 10)}onChange={(e) =>setUpdateForm({ ...updateForm, date: e.target.value })}/>
//         </div>
//         <div>
//           <Label htmlFor="summary">Summary</Label>
//           <Textarea id="summary"value={updateForm.summary}onChange={(e) =>setUpdateForm({ ...updateForm, summary: e.target.value })}/>
//         </div>
//         <div>
//           <Label htmlFor="authorImage">Author Image</Label>
//           <Input type="file" id="authorImage"onChange={(e) => {
//               const file = e.target.files[0]; // Get the selected file
//               setUpdateForm({ ...updateForm, authorImage: file }); // Store the file in the state
//             }}/>
//         </div>

//         <div>
//           <Label htmlFor="image">Image</Label>
//           <Input type="file" id="image" onChange={(e) => {
//               const file = e.target.files[0]; // Get the selected file
//               setUpdateForm({ ...updateForm, image: file }); // Store the file in the state
//             }}/>
//         </div>
//         <div>
//           <Label htmlFor="body">Body</Label>
//           <Textarea id="body"value={updateForm.body}onChange={(e) => setUpdateForm({ ...updateForm, body: e.target.value })}/>
//         </div>
//       </div>
//       <DialogFooter>
//         <Button variant="default" onClick={() => setSelectedBlog(null)}>Cancel</Button>
//         <Button variant="primary" onClick={handleUpdateBlog}>Save Changes</Button>
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>)}