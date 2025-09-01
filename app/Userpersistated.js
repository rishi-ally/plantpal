import { useEffect, useState } from "react"

export  const Userpersist=(key,defaultvalue)=>{
const [value,setvalue]=useState(
()=>{

if(typeof window==="undefined") return defaultvalue;
const localval=localStorage.getItem(key)
return localval?JSON.parse(localval):defaultvalue;




})


useEffect(()=>{
if(typeof window !=="undefined") return localStorage.setItem(key,JSON.stringify(value));




},[key,value])


return [value,setvalue];

}