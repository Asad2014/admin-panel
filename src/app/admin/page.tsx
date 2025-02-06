"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();


    if (email === "asadkk2014@gmail.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
    
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={password}
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-3 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}