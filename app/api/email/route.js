// import { ConnectDB } from "@/lib/config/db";
// import EmailModel from "@/lib/models/emailModel";
// import jwt from "jsonwebtoken";

// const LoadDB = async () => {
//     const db = await ConnectDB();
//     // Assuming the connection logic is done in ConnectDB, no need to re-call db here
// }

// export async function POST(request) {
//     const formData = await request.formData();
    
//     // Collect form data into an object
//     const userData = {
//         name: formData.get('name'),
//         email: formData.get('email'),
//         password: formData.get('password'),
//         phone: formData.get('phone'),
//         address: formData.get('address'),
//         role: formData.get('role'),
//     };
//     try {
//         // Make sure to connect to the DB
//         await LoadDB();
//         // Save the user data to the database using the EmailModel
//         const newUser = await EmailModel.create(userData);

//         // Return a success response
//         return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });

//     } catch (error) {
//         // Handle any errors during the database operation
//         return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
//     }
// }

// export async function GET() {
//     try {
//         // Make sure to connect to the DB
//         await LoadDB();

//         // Fetch all the email documents from the database
//         const emails = await EmailModel.find({}); // Fetch all records
//         const totalEmails = await EmailModel.countDocuments(); // Get total count of emails

//         // Return success response with email data and total count
//         return new Response(
//             JSON.stringify({ success: true, total: totalEmails, emails }),
//             { status: 200 }
//         );
//     } catch (error) {
//         // Handle any errors during the database operation
//         return new Response(
//             JSON.stringify({ success: false, message: error.message }),
//             { status: 500 }
//         );
//     }
// }

import jwt from "jsonwebtoken";
import { ConnectDB } from "@/lib/config/db"// Ensure correct imports
const JWT_SECRET = "your_secret_key"; // Replace with your actual secret
import EmailModel from "@/lib/models/emailModel";

export async function POST(request) {
    const LoadDB = async () => {
        const db = await ConnectDB();
        // Assuming the connection logic is done in ConnectDB
    };

    try {
        // Parse the request body as JSON or form data
        const contentType = request.headers.get("content-type");
        let userData;

        if (contentType.includes("application/json")) {
            userData = await request.json();
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            userData = {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                role: formData.get("role"),
            };
        } else {
            return new Response(
                JSON.stringify({ success: false, message: "Unsupported content type" }),
                { status: 400 }
            );
        }

        const { email, password, role, name } = userData;

        // Ensure the database is loaded
        await LoadDB();

        if (role) {
            // **Registration logic**
            const existingUser = await EmailModel.findOne({ email });
            if (existingUser) {
                return new Response(
                    JSON.stringify({ success: false, message: "Email already exists" }),
                    { status: 400 }
                );
            }

            const newUser = await EmailModel.create(userData);
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "User registered successfully",
                    user: { name: newUser.name, email: newUser.email, role: newUser.role },
                }),
                { status: 201 }
            );
        } else if (email && password) {
            // **Login logic**
            const user = await EmailModel.findOne({ email });

            if (!user || user.password !== password) {
                return new Response(
                    JSON.stringify({ success: false, message: "Invalid email or password" }),
                    { status: 400 }
                );
            }

            // Create a JWT token
            const token = jwt.sign(
                { email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Login successful",
                    token,
                    user: {
                        name: user.name, // Include the name field here
                        email: user.email,
                        role: user.role,
                    },
                }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid request data" }),
                { status: 400 }
            );
        }
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
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