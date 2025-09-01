import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r h-[10rem] from-green-500 to-green-700 text-white rounded-t-3xl shadow-lg mt-10">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Logo / Text */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">PlantPal 🌿</h2>
          <p className="text-sm mt-1">© 2025 All rights reserved.</p>
        </div>

        {/* Middle: Links */}
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="#" className="hover:underline text-sm">Home</a>
          <a href="#" className="hover:underline text-sm">About</a>
          <a href="#" className="hover:underline text-sm">Contact</a>
          <a href="#" className="hover:underline text-sm">FAQ</a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-200 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
