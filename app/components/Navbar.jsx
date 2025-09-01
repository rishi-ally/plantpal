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
  async function deletePlant(plantId) {
    try {
      await deleteDoc(doc(db, "plants", plantId));
      console.log(`Plant ${plantId} deleted ✅`);
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
  }
  const [nav, setNav] = useState(false);
  const [user, setUser] = useState(null);
const router=useRouter()
  const handleNav = () => setNav(!nav);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // clear any extra data you saved
      alert("User signed out successfully ✅");
       const reuslt = await axios.post(
      "/api/clearcookies",
    );
   
router.push('/')
    } catch (error) {
      console.error("Error during sign out ❌", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  
        localStorage.setItem("uid", currentUser.uid); // optional
      } else {
        setUser(null);
        localStorage.removeItem("uid");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="top-0 sticky z-50">
      <div className="backdrop-blur-md bg-gradient-to-r from-green-200 via-green-300 to-green-500/90 rounded-b-3xl shadow-lg px-6 py-4 flex items-center justify-between border-b-2 border-green-600/30">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105">
          <Image
            src="/plantpal.png"
            alt="PlantPal Logo"
            width={80}
            height={80}
            className="rounded-full shadow-lg border-4 border-green-50"
          />
          <h1 className="text-green-900 text-2xl sm:text-3xl font-extrabold tracking-wide flex items-center gap-2">
            PlantPal <FaLeaf className="text-green-700 animate-bounce" />
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 text-green-900 font-medium text-lg">
          {["Home", "My Garden", "Plant-o-pedia", "Askthedoc"].map((item, idx) => (
            <a
              key={idx}
              href={item === "Home" ? "/" : `/${item.replace(/\s+/g, "").toLowerCase()}`}
              className="relative group font-light"
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
              {/* Profile Image */}
              <img
              onClick={()=>{ console.log(user) 
                router.push('/profile')}}
                src={ user.photoURL   || "https://i.pravatar.cc/150"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full border-2 border-green-700 shadow-md cursor-pointer"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/signup"
              className="px-6 py-3 rounded-full border-2 border-green-700 bg-white/80 text-green-800 font-semibold text-lg shadow-md transition-all duration-500 hover:bg-green-700 hover:text-white hover:shadow-xl hover:scale-105"
            >
              🌸 Sign Up
            </a>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div onClick={handleNav} className="md:hidden z-50">
          {nav ? (
            <AiOutlineClose size={30} className="text-green-900 cursor-pointer" />
          ) : (
            <AiOutlineMenu size={30} className="text-green-900 cursor-pointer" />
          )}
        </div>

        {/* Mobile Nav */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-gradient-to-b from-green-500 to-green-700/95 backdrop-blur-md flex flex-col justify-center items-center text-center transition-transform duration-500 ease-in-out ${
            nav ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-10 text-white font-semibold text-2xl">
            {["Home", "My Garden", "Plant-o-pedia", "Askthedoc"].map((item, idx) => (
              <a
                key={idx}
                href={item === "Home" ? "/" : `/${item.replace(/\s+/g, "").toLowerCase()}`}
                onClick={handleNav}
                className="hover:text-green-200 transition-all duration-300"
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
                className="mt-6 px-8 py-4 rounded-full border-2 border-white bg-red-500 text-white shadow-lg transition duration-500 hover:bg-white hover:text-red-600 hover:scale-105"
              >
                🚪 Logout
              </button>
            ) : (
              <a
                href="/signup"
                onClick={handleNav}
                className="mt-6 px-8 py-4 rounded-full border-2 border-white bg-green-100 text-green-800 shadow-lg transition duration-500 hover:bg-white hover:text-green-900 hover:scale-105"
              >
                🌿 Join PlantPal
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
