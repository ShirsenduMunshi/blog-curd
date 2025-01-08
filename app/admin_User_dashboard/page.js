"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 

import { Sidebar } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogCount, setBlogCount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClose, setIsClose] = useState(true);
  const isMobile = useIsMobile();
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

  useEffect(() => {
    async function initializeDashboard() {
      try {
        const storedUser = localStorage.getItem("name");
        if (storedUser) {
          const decodedUser = decodeURIComponent(storedUser);
          setLoggedInUser(decodedUser);

          const encodedUser = encodeURIComponent(decodedUser);
          const blogCountResponse = await axios.get(`/api/blog?author=${encodedUser}`);
          setBlogCount(blogCountResponse.data.length || 0);
          setUserBlogs(blogCountResponse.data);
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      }
    }

    initializeDashboard();
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
      setUserBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.slug !== slug));
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
      const response = await axios.put(
        `/api/blog?slug=${selectedBlog.slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      // Update the blog list after the request is successful
      setUserBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.slug === selectedBlog.slug ? { ...blog, ...updateForm } : blog
        )
      );
      setSelectedBlog(null); // Close the modal
      toast.success("Blog updated successfully");
    } catch (error) {
      toast.error("update failed");
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
      <Sidebar 
      className={` bg-background/50 backdrop-blur max-h-[50vh] fixed inset-y-0 left-0 z-40 border-b w-64 shadow-md transition-transform ${ isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 flex gap-6">Admin Menu
           <button className="" onClick={() => {
                setIsSidebarOpen(false);
                setIsClose(false);
              }}>✕</button>
          </h2>
          <ul className="space-y-4">
            <li>
              <Link href="/user_add-blog" className="text-xl font-medium hover:text-accent">Add Blog</Link>
            </li>
            <li>
              <Link href="/admin_User_dashboard" className="text-xl font-medium hover:text-accent">Dashboard</Link>
            </li>
            <li>
              <Link href="/" className="text-xl font-medium hover:text-accent">Home</Link>
            </li>
          </ul>
        </div>
      </Sidebar>

      <main className={`p-4 md:p-8 bg-background/50 backdrop-blur ${isSidebarOpen ? "" : "ml-0 min-w-[95vw] md:-translate-x-40"}`}
      >
      <h2 className="text-lg font-bold">Admin Menu</h2>
        <Button className="text-gray-500 dark:text-gray-200 text-3xl font-bold sticky top-0"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setIsClose(!isClose);
            }}variant={"outline"}>☰</Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
            <p className="text-2xl font-bold">{blogCount}</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-2xl font-bold">4</p>
          </div>
        </div>

        {isMobile ? (
                <div className="space-y-4">
                  {userBlogs.map((blog) => (
                    <Card key={blog.slug} className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{blog.title}</span>
                          <Badge>{blog.category}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {blog.image && (
                          <div className="relative w-full h-40">
                            <Image src={blog.image} alt={blog.title} fill className="object-cover rounded"/>
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          Published on:{" "}{blog.date.slice(0, 10).split("-").reverse().join("-")}
                        </p>
                        <p className="text-sm text-gray-700">{blog.summary}</p>
                        <div className="flex space-x-2">
                          <Button variant="default" onClick={() => openUpdateModal(blog)}>
                            Edit
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeleteBlog(blog.slug)}>
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
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
                    {userBlogs.map((blog) => (
                      <TableRow key={blog.slug}>
                        <TableCell className="w-24">
                          {blog.image && (
                            <Image  src={blog.image} alt={blog.title} width={80} height={60} className="rounded object-cover"/>
                          )}
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
                            <Button variant="default" onClick={() => openUpdateModal(blog)}>Edit</Button>
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
                  <DialogContent className="w-full max-w-[90%] sm:max-w-md md:max-w-lg mx-auto bg-background text-foreground rounded-md shadow-md overflow-auto" style={{ maxHeight: "90vh" }}>
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        Update Blog
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        Edit the blog details below and save changes.
                      </p>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={updateForm.title} onChange={(e) =>
                            setUpdateForm({
                              ...updateForm,
                              title: e.target.value,
                            })
                          }className="w-full"/>
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={updateForm.slug}
                          onChange={(e) =>
                            setUpdateForm({
                              ...updateForm,
                              slug: e.target.value,
                            })
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
                            setUpdateForm({
                              ...updateForm,
                              author: e.target.value,
                            })
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
                            setUpdateForm({
                              ...updateForm,
                              category: e.target.value,
                            })
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
                            setUpdateForm({
                              ...updateForm,
                              date: e.target.value,
                            })
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
                            setUpdateForm({
                              ...updateForm,
                              summary: e.target.value,
                            })
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
                            setUpdateForm({
                              ...updateForm,
                              body: e.target.value,
                            })
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
                </Dialog>
              )}
      </main>
    </>
  );
}
