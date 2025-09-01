import { db } from "@/app/lib/firestore";
import { addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";




export const POST =async(req)=>{
const formdata=await req.json();
try {
  if (
  !formdata.name.trim() ||
  
  !formdata.freq.toString().trim() ||
  !formdata.date.trim()
) {
  
  return NextResponse.json({error:"please fill all fields "},{status:400});
}

const addedplant=await addDoc(collection(db,'plants'),{formdata})
return NextResponse.json({id:addedplant.id},{status:201})

} catch (error) {
  return NextResponse.json({error:error.message},{status:400})
}










}