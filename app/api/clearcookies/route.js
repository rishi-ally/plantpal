import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST=async()=>{


  cookies().set("authToken", "", { maxAge: 0, path: "/" });

  return NextResponse.json({ message: "Logout successful" });




}