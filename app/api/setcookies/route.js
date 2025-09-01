import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const { token } = await req.json();
console.log('bhai suun',req)
const cookieStore = await cookies();

  // Set cookie
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/", 
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });

  return NextResponse.json({ success: true });
}
