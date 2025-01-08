import { ConnectDB } from "@/lib/config/db";
import blogModel from "@/lib/models/blogMobel";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
const { NextResponse } = require("next/server");

// Connect to the database
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

// Helper functions
const ensureDirectoryExists = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
};

const saveFile = async (file, prefix = "") => {
  if (!file) return null;

  const timestamp = Date.now();
  const uploadDir = path.join(process.cwd(), "public");
  await ensureDirectoryExists(uploadDir);

  const fileByteData = await file.arrayBuffer();
  const buffer = Buffer.from(fileByteData);

  const fileName = `${prefix}${timestamp}_${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/${fileName}`; // Return relative file path
};

const deleteFile = async (filePath) => {
  if (filePath && filePath !== "/banner.jpg") {
    const fullPath = path.join(process.cwd(), "public", filePath.replace("/", ""));
    if (fs.existsSync(fullPath)) {
      try {
        await unlink(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      } catch (error) {
        console.warn(`Error deleting file: ${fullPath}`, error);
      }
    }
  }
};

// Handlers
export async function GET(request) {
  try {
    const blogSlug = request.nextUrl.searchParams.get("slug");
    const blogAuthor = request.nextUrl.searchParams.get("author");
    
    if (blogAuthor) {
      const authorBlog = await blogModel.find({ author: blogAuthor });
      if (!authorBlog) {
        return new Response({error: "Author not found"}, { status: 404 });
      }
      return NextResponse.json(authorBlog);
    }
    if (blogSlug) {
      const blog = await blogModel.findOne({ slug: blogSlug });
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }
    const blogs = await blogModel.find({});
    const totalBlogs = await blogModel.countDocuments();
    // const author = localStorage.getItem("name");
    const author = request.nextUrl.searchParams.get("author")
    const authorBlog = await blogModel.find({ author: author });
    const authorBlogCount = await blogModel.find({ author: author }).countDocuments();
    // return NextResponse.json(blogs);
    return NextResponse.json({blogs, total: totalBlogs, authorBlog, totalAuthorBlogCount: authorBlogCount});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// export async function GET(request) {
//   try {
//     const blogSlug = request.nextUrl.searchParams.get("slug");

//     if (blogSlug) {
//       const blog = await blogModel.findOne({ slug: blogSlug });
//       if (!blog) {
//         return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//       }
//       return NextResponse.json({ blog });
//     }

//     const blogs = await blogModel.find({});
//     const totalBlogs = await blogModel.countDocuments();

//     return NextResponse.json({
//       total: totalBlogs,
//       blogs,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


export async function POST(request) {
  const formData = await request.formData();
  try {
    const imageUri = await saveFile(formData.get("image"));
    const authorImageUri = await saveFile(formData.get("authorImage"), "author_") || "/banner.jpg";

    const blogData = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      category: formData.get("category"),
      body: formData.get("body"),
      author: formData.get("author"),
      image: imageUri,
      authorImage: authorImageUri,
    };

    await blogModel.create(blogData);
    return NextResponse.json({ success: true, msg: "Blog post created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}

export async function PUT(request) {
  const slug = request.nextUrl.searchParams.get("slug");
  const formData = await request.formData();

  try {
    const blog = await blogModel.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete old images if new ones are provided
    if (formData.has("image")) {
      await deleteFile(blog.image);
      blog.image = await saveFile(formData.get("image"));
    }

    if (formData.has("authorImage")) {
      await deleteFile(blog.authorImage);
      blog.authorImage = await saveFile(formData.get("authorImage"), "author_");
    }

    // Update other fields
    blog.title = formData.get("title");
    blog.summary = formData.get("summary");
    blog.body = formData.get("body");
    blog.category = formData.get("category");
    blog.author = formData.get("author");

    await blog.save();
    return NextResponse.json({ success: true, msg: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const blog = await blogModel.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete images
    await deleteFile(blog.image);
    await deleteFile(blog.authorImage);

    // Delete the blog document
    await blog.deleteOne();
    return NextResponse.json({ success: true, msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}

// import { ConnectDB } from "@/lib/config/db";
// import blogModel from "@/lib/models/blogMobel";
// import { writeFile, mkdir, unlink } from "fs/promises";
// import path from 'path';
// import fs from "fs";
// const { NextResponse } = require("next/server");

// const LoadDB = async () => {
//   await ConnectDB();
// };
// LoadDB();

// // Add GET Handler
// export async function GET(request) {
//   try {
//     const blogSlug = request.nextUrl.searchParams.get("slug");
//     if (blogSlug) {
//       const blog = await blogModel.findOne({ slug: blogSlug });
//       if (!blog) {
//         return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//       }
//       return NextResponse.json(blog);
//     } else {
//       const blogs = await blogModel.find({});
//       return NextResponse.json(blogs);
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
// // Add POST Handler
// export async function POST(request) {
//   const formData = await request.formData();
//   const timestamp = Date.now();
//   const image = formData.get("image");
//   const authorImage = formData.get("authorImage");

//   const relativeUploadDir = 'public';
//   const uploadDir = path.join(process.cwd(), relativeUploadDir);
//   await mkdir(uploadDir, { recursive: true });

//   if (!image) {
//     return NextResponse.json({ error: "No image provided" });
//   }

//   try {
//     const imageByteData = await image.arrayBuffer();
//     const buffer = Buffer.from(imageByteData);
//     const imagePath = path.join(uploadDir, `${timestamp}_${image.name}`);
//     await writeFile(imagePath, buffer);
//     const imageUri = `/${timestamp}_${image.name}`;

//     let authorImageUri = "/banner.jpg"; // Default author image
//     if (authorImage) {
//       const authorImageByteData = await authorImage.arrayBuffer();
//       const authorImageBuffer = Buffer.from(authorImageByteData);
//       const authorImagePath = path.join(uploadDir, `author_${timestamp}_${authorImage.name}`);
//       await writeFile(authorImagePath, authorImageBuffer);
//       authorImageUri = `/author_${timestamp}_${authorImage.name}`;
//     }

//     const blogData = {
//       title: `${formData.get("title")}`,
//       summary: `${formData.get("summary")}`,
//       category: `${formData.get("category")}`,
//       body: `${formData.get("body")}`,
//       author: `${formData.get("author")}`,
//       image: `${imageUri}`,
//       authorImage: `${authorImageUri}`,
//     };

//     await blogModel.create(blogData);
//     console.log("Blog post created successfully");
//     return NextResponse.json({ success: true, msg: "Blog post created successfully" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Something Went Wrong!..." }, { status: 500 });
//   }
// }
// // Add PUT Handler
// export async function PUT(request) {
//   const slug = request.nextUrl.searchParams.get("slug");
//   const formData = await request.formData();

//   try {
//     const blog = await blogModel.findOne({ slug });
//     if (!blog) {
//       return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//     }

//     // Update blog data (excluding slug which is immutable)
//     blog.title = formData.get("title");
//     blog.summary = formData.get("summary");
//     blog.body = formData.get("body");
//     blog.category = formData.get("category");
//     blog.author = formData.get("author");

//     // Handle image upload if available
//     if (formData.has("image")) {
//       const image = formData.get("image");
//       const timestamp = Date.now(); // Generate a unique timestamp for file naming

//       // Ensure the upload directory exists
//       const uploadDir = path.join(process.cwd(), "public");
//       await mkdir(uploadDir, { recursive: true }); // Create if it doesn't exist

//       const imageByteData = await image.arrayBuffer(); // Convert image to byte data
//       const buffer = Buffer.from(imageByteData); // Create buffer from byte data

//       // Create a unique image file name
//       const imagePath = path.join(uploadDir, `${timestamp}_${image.name}`);
//       await writeFile(imagePath, buffer); // Save the image to the file system

//       // Assign the relative file path (as a string) to the blog's image field
//       blog.image = `/${timestamp}_${image.name}`; // Save the image path relative to public folder
//     }

//     // Handle author image if available
//     if (formData.has("authorImage")) {
//       const authorImage = formData.get("authorImage");
//       const timestamp = Date.now(); // Generate a unique timestamp for file naming

//       // Ensure the upload directory exists
//       const uploadDir = path.join(process.cwd(), "public");
//       await mkdir(uploadDir, { recursive: true }); // Create if it doesn't exist

//       const authorImageByteData = await authorImage.arrayBuffer(); // Convert to byte data
//       const buffer = Buffer.from(authorImageByteData); // Create buffer from byte data

//       // Create a unique author image file name
//       const authorImagePath = path.join(uploadDir, `author_${timestamp}_${authorImage.name}`);
//       await writeFile(authorImagePath, buffer); // Save the author image to the file system

//       // Assign the relative file path (as a string) to the blog's authorImage field
//       blog.authorImage = `/${timestamp}_${authorImage.name}`; // Save the author image path relative to public folder
//     }

//     await blog.save(); // Save the updated blog document in the database

//     return NextResponse.json({ success: true, msg: "Blog updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     const slug = request.nextUrl.searchParams.get("slug");
//     if (!slug) {
//       return NextResponse.json({ error: "Slug is required" }, { status: 400 });
//     }

//     const blog = await blogModel.findOne({ slug });
//     if (!blog) {
//       return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//     }

//     // Delete images
//     const imagesToDelete = [blog.image, blog.authorImage];
//     for (const imagePath of imagesToDelete) {
//       if (imagePath && imagePath !== "/banner.jpg") {
//         const fullPath = path.join(process.cwd(), "public", imagePath.replace("/", ""));
//         console.log("Attempting to delete file at:", fullPath);

//         if (fs.existsSync(fullPath)) {
//           try {
//             await unlink(fullPath);
//             console.log(`Successfully deleted: ${fullPath}`);
//           } catch (error) {
//             console.warn(`Error deleting file at: ${fullPath}`, error);
//           }
//         } else {
//           console.warn(`File does not exist: ${fullPath}`);
//         }
//       }
//     }

//     // Delete the blog from the database
//     await blog.deleteOne();

//     return NextResponse.json({ success: true, msg: "Blog deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting blog:", error);
//     return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
//   }
// }