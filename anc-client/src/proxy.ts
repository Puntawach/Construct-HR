import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const adminRoutes = ["/admin"];
const employeeRoutes = [
  "/home",
  "/attendance",
  "/dashboard",
  "/reports",
  "/profile",
  "/payroll",
  "/calendar",
];
const publicRoutes = ["/", "/login"];

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role ?? "WORKER";
  const isAdmin = ADMIN_ROLES.includes(role);

  const isPublicRoute = publicRoutes.some((el) =>
    el === "/" ? pathname === el : pathname.startsWith(el),
  );

  const isAdminRoute = adminRoutes.some((el) => pathname.startsWith(el));

  const isEmployeeRoute = employeeRoutes.some((el) =>
    el === "/" ? pathname === el : pathname.startsWith(el),
  );

  // Public routes → ทุกคนเข้าได้
  if (isPublicRoute) {
    // login แล้วอยู่หน้า login → redirect ตาม role
    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(
        new URL(isAdmin ? "/admin" : "/home", req.url),
      );
    }
    return NextResponse.next();
  }

  // ยังไม่ login → ไป login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Worker เข้า admin routes → กลับ /home
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Admin เข้า employee routes → กลับ /admin
  if (isEmployeeRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
