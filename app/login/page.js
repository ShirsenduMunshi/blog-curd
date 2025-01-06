"use client";

import { Input } from "@/components/ui/input"; // Adjust the import path as needed
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { FormLabel, FormMessage } from "@/components/ui/form"; // Adjust the import path as needed
import { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Add name field here
  });

  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleName = (e) =>{
    // console.log(e.target.value)
    let name = e.target.value
    localStorage.setItem("name", name);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send login request to the backend
    try {
      const response = await fetch(`/api/email`, { // Your backend login endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send formData, including name
      });

      const result = await response.json();

      if (response.ok) {
        // Successful login
        setIsSuccess(true);
        setError(null);

        // Ensure that the result.user object contains the necessary data
        console.log("Logged in user:", result.user); // Check this in the console

        // Store the JWT token and user data in localStorage
        localStorage.setItem('token', result.token); // Store JWT token
        localStorage.setItem('role', result.user.role); // Store user role
        localStorage.setItem('email', result.user.email); // Store user email
        // localStorage.setItem('name', result.user.name); // Store user name

        // Optionally, you can redirect the user to the dashboard or another page
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = "/admin_User_dashboard"; // Redirect to the admin dashboard
          } else if (result.user.role === 'ceo' || result.user.role === 'CEO') {
            window.location.href = "/admin"; // Redirect to the user dashboard
          } else {
            window.location.href = "/user_dashboard"; // Redirect to the user dashboard
          }
        }, 2000);
      } else {
        // Handle login failure
        setIsSuccess(false);
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      setIsSuccess(false);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-6">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>

        {/* Name Field */}
        <div className="mb-4">
            <FormLabel htmlFor="name" className="text-gray-700">Name</FormLabel>
            <Input
              id="name"
              name="name"
              // value={e.target.value}
              onChange={handleName}
              type="text"
              placeholder="Enter your name"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <FormLabel htmlFor="email" className="text-gray-700">Email</FormLabel>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <FormLabel htmlFor="password" className="text-gray-700">Password</FormLabel>
            <Input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter your password"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>

          {/* Displaying Errors or Success Message */}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {isSuccess && <div className="text-green-500 mt-2">Login successful! Redirecting...</div>}

          {/* Submit Button */}
          <Button type="submit"onSubmit={handleName} className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
