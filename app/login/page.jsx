"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { auth, db } from "../lib/firestore";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";


const Page = () => {
   const setcookies=async(token)=>{
    console.log('tokennnnn119n',token)
try {
  const reuslt = await axios.post(
      "/api/setcookies",
      { token }, // body
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // 🔥 important! this allows cookies to be set
      }
    );
 
} catch (error) {
  console.log(error)
}


  }
  const router=useRouter()
const handlegooglesignin=async ()=>{
  const provider=new GoogleAuthProvider()
try {
const result=await signInWithPopup(auth,provider)
const user=result.user;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    console.log("✅ User is logging in");
    
  localStorage.setItem("uid",user.uid);
  const token=await user.getIdToken();

   setcookies(token);
  router.push('/')
  } else {
   const dbuser=await setDoc(doc(db,"users",user.uid),{
     uid:user.uid,
  name:user.displayName,
  email:user.email,
  photoURL:user.photoURL,
  createdAt: new Date(),
  })
 

  
  localStorage.setItem("uid",user.uid);
  const token=await user.getIdToken()
   setcookies(token)
  router.push('/page2')
console.log(result.user)
  }
  
} catch (error) {
  console.log(error)
}



}
const [formdata,setfomdata]=useState({
  email:"",
  password:""
})
const handlechange=(e)=>{
setfomdata(prev=>({...prev,
  [e.target.name]:e.target.value
}))

}
const handlesubmit=async(e)=>{
e.preventDefault();
try {
  console.log(formdata.email)
  const result=await signInWithEmailAndPassword(auth, formdata.email, formdata.password)
  localStorage.setItem('uid',result.user.uid)
  const token =await result.user.getIdToken()
  setcookies(token)
}  catch (error) {
  console.log("Error code:", error.code);
  console.log("Error message:", error.message);

  if (error.code === "auth/user-not-found") {
    alert("❌ No account found with this email. Please sign up first.");
    router.push("/signup");
  } 
  else if (error.code === "auth/wrong-password") {
    alert("⚠️ Wrong password. Please try again.");
  } 
  else {
    alert("⚠️ Something went wrong: " + error.code + " → " + error.message);
  }
}
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-200 to-green-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back 🌿</h1>
          <p className="text-green-100 text-sm mt-1">Login to continue your journey</p>
        </div>

        {/* Login Form */}
        <div className="p-6 space-y-4">
          <input
            type="email"
            name="email"
            onChange={handlechange}
            placeholder="Email"
            className="w-full p-3 text-black rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <input
            type="password"
            name="password"
            onChange={handlechange}
            placeholder="Password"
            className="w-full p-3 text-black rounded-xl border border-green-300 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button onClick={handlesubmit} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md">
            Login
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span className="w-1/5 h-px bg-gray-300"></span>
            <span>or</span>
            <span className="w-1/5 h-px bg-gray-300"></span>
          </div>

          <button onClick={handlegooglesignin} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl hover:bg-green-50 transition duration-300 shadow-sm">
            <FaGoogle className="text-red-500 text-lg" />
            <span className="text-gray-900 font-medium">Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-600 hover:underline font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
