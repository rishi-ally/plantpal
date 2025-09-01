"use client";

import { auth, db } from "@/app/lib/firestore";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const setcookies=async(token)=>{
const reuslt = await axios.post(
    "/api/setcookies",
    { token }, // body
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // 🔥 important! this allows cookies to be set
    }
  )



  }
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear previous errors
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
const token=await result.user.getIdToken();
setcookies(token);
      console.log("User created:", result.user.email);

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: formData.username || result.user.email,
        email: result.user.email,
        createdAt: new Date(),
      });

      localStorage.setItem("uid", result.user.uid);

      // redirect after success
      router.push("/page2");
    } catch (error) {
      console.error("Signup error:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("⚠️ This email is already registered. Please log in instead.");
      setInterval(() => {
        router.push('/login')
      }, 2000);
      } else if (error.code === "auth/invalid-email") {
        setErrorMsg("❌ Please enter a valid email.");
      } else if (error.code === "auth/weak-password") {
        setErrorMsg("🔑 Password should be at least 6 characters.");
      } else {
        setErrorMsg("⚠️ Something went wrong: " + error.message);
      }
    }
  };

  const handlechange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <form className="text-left" onSubmit={handlesubmit}>
        {errorMsg && (
          <p className="mb-4 text-red-600 font-semibold">{errorMsg}</p>
        )}

        <label
          className="block mb-2 font-semibold text-green-800"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handlechange}
          value={formData.email}
          required
          placeholder="you@example.com"
          className="w-full mb-4 p-3 rounded-lg border text-gray-950 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <label
          className="block mb-2 font-semibold text-green-800"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handlechange}
          value={formData.password}
          required
          placeholder="Enter a secure password"
          className="w-full mb-6 p-3 rounded-lg border text-gray-950 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Create Account
        </button>
      </form>
    </>
  );
};

export default Signup;
