"use client"
import { createContext } from "react"
import { useState } from "react"
import { Userpersist } from "../Userpersistated.js"
export const Mycontext=createContext()
export const Myprovider=({children})=>{
const [currentdisplay,setcurrentdisplay]=Userpersist("user",null)
return(

<>
<Mycontext.Provider value={{currentdisplay,setcurrentdisplay}}>{children}</Mycontext.Provider>

</>



)

}