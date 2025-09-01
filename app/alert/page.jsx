'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
const Page = () => {
  const router=useRouter()
useEffect(()=>{
alert("Please login first")
router.push('/')

},[])


  return (
     <div style={{ background: "white", height: "100vh", width: "100vw" }}>
      {/* nothing inside */}
    </div>
  )
}

export default Page