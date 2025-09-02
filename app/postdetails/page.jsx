"use client"
import React, { useContext, useState } from 'react'
import { Mycontext } from '../context/Mycontext'
import comments1 from '../data/fakecomments.json'
import { Heart, ThumbsDown, MessageCircle, Eye, EyeClosed } from "lucide-react";
const Page = () => {

  const {currentdisplay}=useContext(Mycontext)
const [isopen,setisopen]=useState(false)
 
    if (!currentdisplay) {
    return (
      <div className="text-center text-green-700 mt-10 text-xl">
        Loading your plant vibes... 🌿
      </div>
    );
  } 
   const fakecomments = comments1.find(comment => comment.userId == currentdisplay.userId);
   console.log(fakecomments)

  const {
    avatar,
    caption,
    date,
    description,
    username,
    image,

    
  } = currentdisplay;

 return ( <>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-green-50 rounded-2xl shadow-xl border border-green-200">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6">
        <img src={avatar} className="w-12 h-12 rounded-full border border-green-300" />
        <div>
          <h2 className="text-green-900 font-semibold text-lg">@{username}</h2>
          <p className="text-green-600 text-sm">{new Date(date).toLocaleString()}</p>
        </div>
      </div>

      {/* Image & Caption */}
      <img
        src={image}
        alt="Plant"
        className="w-full h-64 object-cover rounded-xl border border-green-300"
      />
      <h3 className="mt-4 text-green-800 text-xl font-bold">{caption}</h3>
      <p className="text-green-700 mt-2 text-sm leading-relaxed">{description}</p>

      {/* Reactions */}
      <div className="flex items-center gap-6 mt-4 text-green-800">
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5" /> <span>{fakecomments.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="w-5 h-5" /> <span>{fakecomments.dislikes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-5 h-5" /> <span>{fakecomments.comments.length}</span>
        </div>
      </div>

      {/* Comments */}
      <div onClick={()=>{
        setisopen(!isopen)
      }} className="mt-6  cursor-pointer h-[3rem] flex justify-between">
        <h4 className="text-green-900 font-semibold mb-2">🌱 Comments</h4>
      {isopen?<EyeClosed color='black'></EyeClosed>:<Eye color='black' />}
      </div>
    </div>
    {isopen &&  <div className="max-w-3xl mx-auto mt-10 p-6 bg-green-50 rounded-2xl shadow-xl border border-green-200"> <ul className="space-y-2">
          {fakecomments.comments.map((c, i) => (
            <li
              key={i}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm"
            >
             👤{""} {c}
            </li>
          ))}
        </ul></div>}
   </>
  );
}

export default Page