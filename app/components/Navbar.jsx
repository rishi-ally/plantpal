"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaLeaf } from "react-icons/fa";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firestore";
import { useRouter } from "next/navigation";
import axios from "axios";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleNav = () => setNav(!nav);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      alert("User signed out successfully ✅");
      await axios.post("/api/clearcookies");
      router.push("/");
    } catch (error) {
      console.error("Error during sign out ❌", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("uid", currentUser.uid);
      } else {
        setUser(null);
        localStorage.removeItem("uid");
      }
    });
    return () => unsubscribe();
  }, []);

  const navItems = ["Home", "My Garden", "Plant-o-pedia", "Askthedoc"];

  return (
    <nav className="top-0 sticky z-50 w-full">
      <div className="backdrop-blur-md bg-gradient-to-r from-green-200 via-green-300 to-green-500/90 rounded-b-3xl shadow-lg px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between border-b-2 border-green-600/30">
        
        {/* Logo + Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => router.push("/")}
        >
          <Image
            src="/plantpal.png"
            alt="PlantPal Logo"
            width={60}
            height={60}
            className="rounded-full shadow-lg border-4 border-green-50"
          />
          <h1 className="text-green-900 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2">
            PlantPal <FaLeaf className="text-green-700 animate-bounce" />
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 lg:gap-10 text-green-900 font-medium text-base lg:text-lg">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item === "Home" ? "/" : `/${item.replace(/\s+/g, "").toLowerCase()}`}
              className="relative group font-light hover:text-green-800 transition-colors duration-300"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-700 transition-all duration-500 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <img
                onClick={() => router.push("/profile")}
                src={user.photoURL || "https://i.pravatar.cc/150"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-green-700 shadow-md cursor-pointer"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/signup"
              className="px-5 py-2 rounded-full border-2 border-green-700 bg-white/80 text-green-800 font-semibold text-base sm:text-lg shadow-md transition-all duration-500 hover:bg-green-700 hover:text-white hover:shadow-xl hover:scale-105"
            >
              🌸 Sign Up
            </a>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div onClick={handleNav} className="md:hidden z-50">
          {nav ? (
            <AiOutlineClose size={28} className="text-green-900 cursor-pointer" />
          ) : (
            <AiOutlineMenu size={28} className="text-green-900 cursor-pointer" />
          )}
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gradient-to-b from-green-500 to-green-700/95 backdrop-blur-md flex flex-col justify-center items-center text-center transition-transform duration-500 ease-in-out md:hidden ${
          nav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8 text-white font-semibold text-xl sm:text-2xl">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item === "Home" ? "/" : `/${item.replace(/\s+/g, "").toLowerCase()}`}
              onClick={handleNav}
              className="hover:text-green-200 transition-colors duration-300"
            >
              {item}
            </a>
          ))}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                handleNav();
              }}
              className="mt-6 px-8 py-3 rounded-full border-2 border-white bg-red-500 text-white shadow-lg transition duration-500 hover:bg-white hover:text-red-600 hover:scale-105"
            >
              🚪 Logout
            </button>
          ) : (
            <a
              href="/signup"
              onClick={handleNav}
              className="mt-6 px-8 py-3 rounded-full border-2 border-white bg-green-100 text-green-800 shadow-lg transition duration-500 hover:bg-white hover:text-green-900 hover:scale-105"
            >
              🌿 Join PlantPal
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
