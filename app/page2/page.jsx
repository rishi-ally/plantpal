"use client";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../lib/firestore";
import { useRouter } from "next/navigation";

const Page = () => {
  const route=useRouter()
  const[newuid,setuid]=useState(null)
  useEffect(()=>{
const uid=localStorage.getItem('uid')
setuid(uid)
  },[])
  console.log('pag2',newuid)
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
  const usersquery = query(
          collection(db, "users"),
          where("uid", "==", newuid)
        );
        const querySnapshot = await getDocs(usersquery);

    
        const userDoc = querySnapshot.docs[0];
        const userRef=userDoc.ref;
 await updateDoc(userRef, formData);

route.push('/')
    // TODO: send to Firestore / backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Your Profile 🌱
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="3"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
              
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl shadow-md transition-all duration-200"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
