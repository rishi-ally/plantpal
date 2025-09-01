"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firestore";
import { User, Mail, Calendar, Phone, Leaf } from "lucide-react";

const Page = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid");

    const fetchUser = async () => {
      if (!uid) return;
      const usersQuery = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setUser(userDoc);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-700 via-green-500 to-emerald-400 text-white text-2xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  // Convert Firestore timestamp to readable date
  const createdDate = user.createdAt?.seconds
    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-emerald-600 p-6">
      <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl max-w-md w-full p-8 text-center text-white border border-green-300/20">
        {/* Profile Image */}
        <div className="flex justify-center relative">
          <img
            src={
              user.photoURL ||
              "https://i.pravatar.cc/150"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-green-300/50 shadow-lg"
          />
          <Leaf className="absolute bottom-2 right-32 w-6 h-6 text-green-300" />
        </div>

        {/* Name + Username */}
        <h2 className="mt-4 text-2xl font-bold text-green-100">
          {user.name}
        </h2>
        <p className="text-sm text-green-200">@{user.username}</p>

        {/* Bio */}
        <p className="mt-3 italic text-green-50 bg-green-800/30 px-4 py-2 rounded-xl">
          “{user.bio}”
        </p>

        {/* Info Section */}
        <div className="mt-6 space-y-4 text-left">
          <div className="flex items-center gap-3 bg-green-800/40 p-3 rounded-xl">
            <Mail className="w-5 h-5 text-green-300" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 bg-green-800/40 p-3 rounded-xl">
            <Phone className="w-5 h-5 text-green-300" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-3 bg-green-800/40 p-3 rounded-xl">
            <Calendar className="w-5 h-5 text-green-300" />
            <span>Joined {createdDate}</span>
          </div>
          <div className="flex items-center gap-3 bg-green-800/40 p-3 rounded-xl">
            <User className="w-5 h-5 text-green-300" />
            <span>UID: {user.uid}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-xl shadow-md font-semibold transition">
            Follow
          </button>
          <button className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl shadow-md font-semibold transition">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
