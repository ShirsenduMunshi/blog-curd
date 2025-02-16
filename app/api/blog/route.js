import { ConnectDB } from "@/lib/config/db";
import blogModel from "@/lib/models/blogMobel";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
const { NextResponse } = require("next/server");
import { exec } from "child_process";

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
  if (!file) return "/banner.jpg";

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

// export async function POST(request) {
//   const formData = await request.formData();
//   try {
//     const imageUri = await saveFile(formData.get("image"));
//     const authorImageUri = await saveFile(formData.get("authorImage"), "author_") || "/banner.jpg";

//     const blogData = {
//       title: formData.get("title"),
//       summary: formData.get("summary"),
//       category: formData.get("category"),
//       body: formData.get("body"),
//       author: formData.get("author"),
//       image: imageUri,
//       authorImage: authorImageUri,
//     };

//     await blogModel.create(blogData);

//     // Trigger rebuild process
//     exec("npm run build-and-restart", (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error during rebuild: ${error.message}`);
//         return; // You can optionally log or return a rebuild error response
//       }
//       console.log(`Rebuild output: ${stdout}`);
//     });

//     return NextResponse.json({ success: true, msg: "Blog post created successfully" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
//   }
// }


export async function POST(request) {
  const formData = await request.formData();
  try {
    // Save the uploaded images
    const imageFile = formData.get("image");
    const imageUri = imageFile ? await saveFile(imageFile) : "/banner.jpg";
    const authorImageFile = formData.get("authorImage");
    const authorImageUri = authorImageFile ? await saveFile(authorImageFile, "author_") : "/banner.jpg";

    // Prepare the blog data object
    const blogData = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      category: formData.get("category"),
      body: formData.get("body"),
      author: formData.get("author"),
      image: imageUri,
      authorImage: authorImageUri,
    };

    // Create the blog entry in the database
    if (!blogData.author || blogData.author === "" || !blogData.title || !blogData.summary || !blogData.body) {
      return NextResponse.json({ error: "Fill All The Fields!" }, { status: 400 });
    }

    await blogModel.create(blogData);

    // Trigger rebuild and server restart using PM2
    exec("npx pm2 restart blog-curd", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during PM2 restart: ${error.message}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
    });

// Send success response
    return NextResponse.json({ success: true, msg: "Blog post created successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}