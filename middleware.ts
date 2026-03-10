import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  console.log("middleware called:", req.nextUrl.pathname, "auth:", !!req.auth);
  
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";
  
  if (!isLoggedIn && !isLoginPage) {
    console.log("redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};