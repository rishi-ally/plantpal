"use client";

import users from "./data/fakeusers.json";
import posts from "./data/fakeposts.json";
import Footer from "./components/Footer";
import { useContext } from "react";
import { Mycontext } from "./context/Mycontext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { currentdisplay, setcurrentdisplay } = useContext(Mycontext);
  const router = useRouter();

  return (
    <>
      {/* Navbar */}
      <div className="bg-green-200 shadow-md px-6 py-4 sticky top-0 z-10 flex justify-center items-center">
        <h1 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl font-serif text-green-600 text-center">
          ⭐ PlantPal POSTS ⭐
        </h1>
      </div>

      {/* Feed */}
      <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-emerald-300 min-h-screen">
        {users.map((user) => {
          const userpost = posts.find((post) => post.userId === user.id);
          const mergeobj = { ...user, ...userpost };

          return (
            <div
              key={user.id}
              onClick={() => {
                setcurrentdisplay(mergeobj);
                router.push("/postdetails");
              }}
              className="rounded-3xl shadow-xl p-5 bg-green-200 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Accent Bar */}
              <div className="h-1 w-full bg-emerald-400 rounded-t-2xl mb-4"></div>

              {/* User Info */}
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-green-400 shadow-md"
                />
                <h2 className="text-lg sm:text-xl font-bold text-emerald-800 truncate">
                  {user.username}
                </h2>
              </div>

              {/* Post Image */}
              <img
                src={userpost.image}
                alt="Plant Post"
                className="w-full h-44 sm:h-52 object-cover rounded-xl mb-4 border border-green-300 hover:shadow-lg transition-shadow duration-300"
              />

              {/* Caption */}
              <p className="text-emerald-900 text-sm sm:text-base italic font-semibold leading-relaxed border-l-4 border-emerald-400 pl-3 sm:pl-4 bg-green-100/50 rounded-md shadow-inner hover:shadow-md transition-shadow duration-300">
                “{userpost.caption}”
              </p>

              <h1 className="text-gray-950 mt-3 text-sm sm:text-base ">
                View more →
              </h1>
            </div>
          );
        })}
      </div>

     
    </>
  );
}
