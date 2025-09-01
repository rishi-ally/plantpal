'use client'


import React from 'react'
import Signup from '../components/auth/Signup'
import Googleigninbutton from '../components/auth/Googleigninbutton'

const Page = () => {


  return ( 
     <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-green-100 via-green-50 to-green-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-extrabold text-green-900 mb-6 font-serif tracking-tight">
          Welcome to PlantPal 🌿
        </h1>
        <p className="text-green-700 mb-8 font-medium text-lg">
          Sign up and start caring for your plants the smart way!
        </p>

        {/* Google Sign-In Button */}
      <Googleigninbutton></Googleigninbutton>
       
      <div className="flex items-center justify-center gap-3 mb-6">
          <hr className="flex-grow border-green-300" />
          <span className="text-green-500 font-semibold">OR</span>
          <hr className="flex-grow border-green-300" />
        </div>

          <Signup></Signup>
          

        <p className="mt-6 text-green-700 text-center text-sm font-light">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-900 font-semibold hover:underline hover:text-green-800 transition"
          >
            Log In
          </a>
        </p>
        </div>  
         <div className="mt-6 text-green-600 font-light text-sm">
          By signing up, you agree to our{" "}
          <a
            href="/terms"
            className="underline hover:text-green-800 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
          .
        </div>
    
    </div>
  )
}

export default Page