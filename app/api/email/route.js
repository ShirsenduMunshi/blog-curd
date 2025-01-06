import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/emailModel";
import jwt from "jsonwebtoken";

const LoadDB = async () => {
  const db = await ConnectDB();
};

export async function POST(request) {
    const textBody = await request.text(); // Get raw body text
    console.log("Raw request body:", textBody); // Log the raw body
    if (!textBody) {
      return new Response(JSON.stringify({ success: false, message: "Request body is empty" }), { status: 400 });
    }
  
    const { email, password, name, role, phone, address } = JSON.parse(textBody);
    // const { email, password, name, role, phone, address } = await request.json();
  
    try {
      // Connect to the DB
      await LoadDB();
  
      if (name && role && phone && address) {
        // Signup Logic
        const existingUser = await EmailModel.findOne({ email });
        if (existingUser) {
          return new Response(
            JSON.stringify({ success: false, message: "Email is already registered" }),
            { status: 400 }
          );
        }
  
        const newUser = new EmailModel({
          name,
          email,
          password,
          phone,
          address,
          role,
          author: name,
        });
  
        await newUser.save();
  
        return new Response(
          JSON.stringify({
            success: true,
            user: { name: newUser.name, email: newUser.email, role: newUser.role },
          }),
          { status: 201 }
        );
      } else {
        // Login Logic
        const user = await EmailModel.findOne({ email });
        if (!user) {
          return new Response(
            JSON.stringify({ success: false, message: "Invalid email" }),
            { status: 400 }
          );
        }
  
        if (user.password !== password) {
          return new Response(
            JSON.stringify({ success: false, message: "Invalid password" }),
            { status: 400 }
          );
        }
  
        const token = jwt.sign(
          { userId: user._id, role: user.role, email: user.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
  
        return new Response(
          JSON.stringify({
            success: true,
            token,
            user: { name: user.name, email: user.email, role: user.role },
          }),
          { status: 200 }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Internal server error" }),
        { status: 500 }
      );
    }
  }
  
export async function GET() {
    const LoadDB = async () => {
        const db = await ConnectDB();
        // Assuming the connection logic is done in ConnectDB
    };
        try {
            // Make sure to connect to the DB
            await LoadDB();
    
            // Fetch all the email documents from the database
            const emails = await EmailModel.find({}); // Fetch all records
            const totalEmails = await EmailModel.countDocuments(); // Get total count of emails
    
            // Return success response with email data and total count
            return new Response(
                JSON.stringify({ success: true, total: totalEmails, emails }),
                { status: 200 }
            );
        } catch (error) {
            // Handle any errors during the database operation
            return new Response(
                JSON.stringify({ success: false, message: error.message }),
                { status: 500 }
            );
        }
}
