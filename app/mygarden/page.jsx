'use client'
import React, { useContext, useEffect, useState } from 'react';
import { db, messaging } from '../lib/firestore';
import {addDoc, collection, deleteDoc, doc, setDoc} from 'firebase/firestore'
import { isSupported } from 'firebase/analytics';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const page = () => {
  


const router=useRouter()
  const [uid,setuid]=useState(null);
 
  useEffect(()=>{
const newuid=localStorage.getItem("uid")
setuid(newuid)

  },[])
  const [show,setshow]=useState(false)
const[formdata,setformdata]=useState({

  name: '',
    image: '',
    freq: '',
    date: '',
    desc: ''
})
const handlechange=(e)=>{
if(e.target.name=='freq' && e.target.value==0){
  setshow(true)
  setformdata(prev=>({
  ...prev,
[e.target.name]:' '

}))
return
}


setformdata(prev=>({
  ...prev,
[e.target.name]:e.target.value

}))



}
const handlemanualchange=(e)=>{
  setformdata(prev=>({
  ...prev,
[e.target.name]:e.target.value

}))
}
const handlesubmit=async(e)=>{
  e.preventDefault()
  console.log('aee',formdata)
try {
  const response =await axios.post('api/addplant',{...formdata,uid})

    if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html>")) {
      console.log("Redirect detected, sending user to /alert");
      router.push("/alert"); // client-side navigation
      return;
    }
    else{

  const supported = await isSupported();
  if (!supported) {
    console.warn("Browser not supported for FCM.");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission not granted");
    return null;
  }
  try {
  const token = await getToken(messaging, {
    vapidKey: "BOUQUUKfXY3_KcD9CKeia28fSr4tquRvD5rOkJgs-D4IdZxa4WAFR2QLoUtgvEP_kavrkZl_jqPtwUAJkiQxP_0",
  });
const kuchbhi="Ubh893ABHNi910AHjav23hJ98v"

await setDoc(doc(db, "tokens",kuchbhi), {
  uid: uid,
  token: token,
  timestamp: new Date()
});


  // 💥 Trigger reminder check!
  await fetch("/api/sendReminder", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Reminder Function Response:", data);
      router.push('/yourplants')
    })
    .catch((err) => {
      console.error("Error calling reminder function:", err);
    });

  return token;
} catch (err) {
  console.error("Error getting FCM token", err);
  return null;
}

    }
} catch (error) {
  console.log("error while addin a plant",error)
}

}






  return (
    <>
      {/* Header Section */}
 <header className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 shadow-lg px-6 py-6 rounded-b-3xl sticky top-0 z-10 border-b border-green-800">
        <div className="flex justify-center items-center">
          <div className="flex gap-10 text-white font-semibold text-lg">
            <a
              href="/yourplants"
              className="hover:text-green-200 transition underline font-light text-2xl"
            >
              🌿 Your Plants
            </a>
            <a
              href="/mygarden"
              className="hover:text-green-200 underline text-2xl transition"
            >
              💧 Water Reminders
            </a>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-green-50 border border-green-200 shadow-2xl rounded-3xl transition duration-300 hover:shadow-green-300">
        <h2 className="text-2xl font-semibold text-green-800 mb-6 text-center font-mono tracking-wide">
          🌼 Add a Plant to Your Garden (We will remind you to water it on your given time!)
        </h2>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-green-900 font-medium mb-1">Plant Name</label>
            <input type="text" name="name" id="name"onChange={handlechange} placeholder="What's your plant name?" className="p-2 text-gray-950  rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
          </div>

     
          {/* Frequency */}
          <div className="flex flex-col">
            <label htmlFor="freq" className="text-green-900 font-medium mb-1">When should we remind you? (in days)</label>
            <select name="freq" onChange={handlechange} id="freq" className="p-2 rounded-lg border text-gray-950 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
  <option value="">Select Frequency</option>
  <option value="1">Every day</option>
  <option value="2">Every 2 days</option>
  <option value="3">Every 3 days</option>
  <option value="7">Once a week</option>
  <option value="14">Once every 2 weeks</option>
  <option value="0">Enter manually</option>

</select>

          </div>

          {/* Last Watered Date */}
          <div className="flex flex-col">
            <label htmlFor="date" className="text-green-900 font-medium mb-1">Last Watered On</label>
            <input type="date" onChange={handlechange} name="date" id="date" className="p-2 text-gray-950  rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="desc" className="text-green-900 font-medium mb-1">Plant Notes / Description</label>
            <textarea name="desc" id="desc" rows="3" onChange={handlechange} className="p-2 text-gray-950 rounded-lg border border-green-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" placeholder="E.g., Needs bright light, keep soil moist..."></textarea>
          </div>
{show && <div className="flex flex-col">
            <label htmlFor="freq" className="text-green-900 font-medium mb-1">Enter freq</label>
           <input type="number" name="freq" id="freq" onChange={handlemanualchange} placeholder='Enter freq' className="p-2 text-gray-950  rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white" />
          </div>}

          {/* Submit */}
          <button type="submit" className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform">
            🌱 Add Plant
          </button>
        </form>
      </div>
    </>
  );
};

export default page;
