import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  if ( request.nextUrl.pathname.startsWith('/postdetails')||request.nextUrl.pathname.startsWith('/askthedoc')||request.nextUrl.pathname.startsWith('/api/addplant')) {
     const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
console.log("middleware executedddddddd23888d",token)


   
      
  if (!token) {
 console.log("this is executing yes 2 ")
    return NextResponse.redirect(new URL("/alert", request.url)); 
   
  }
console.log("not this is executed")

  return NextResponse.next();
}

  
 

}
export const config = {
  matcher: ["/postdetails/:path*", "/askthedoc/:path*", "/api/addplant"],
};
