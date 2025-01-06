"use client"
import { FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
  });

  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Prepare the form data as a JSON object
    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      role: formData.role,
    };
  
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send data as JSON
      });
  
      if (response.ok) {
        setIsSuccess(true);
        setIsSubmitting(false);
        // Redirect to the login page after successful sign-up
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Unexpected error occurred, please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-6">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign Up</h2>
  
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <FormLabel htmlFor="name" className="text-gray-700">Name</FormLabel>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>
  
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
  
          {/* Phone Field */}
          <div className="mb-4">
            <FormLabel htmlFor="phone" className="text-gray-700">Phone</FormLabel>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Enter your phone number"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>
  
          {/* Address Field */}
          <div className="mb-4">
            <FormLabel htmlFor="address" className="text-gray-700">Address</FormLabel>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
              placeholder="Enter your address"
              required
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <FormMessage />
          </div>
  
          {/* Role Field with Select */}
          <div className="mb-4">
            <FormLabel htmlFor="role" className="text-gray-700">Role</FormLabel>
            <select name="role" id="role" value={formData.role} onChange={(e) => handleChange(e)} required className="border-gray-300 w-full dark:bg-white focus:ring-2 focus:ring-blue-500">
              <option>Your Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <FormMessage />
          </div>
  
          {/* Displaying Errors or Success Message */}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {isSuccess && <div className="text-green-500 mt-2">Sign-up successful! Redirecting...</div>}
  
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700">
            {isSubmitting ? "Signing Up" : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
