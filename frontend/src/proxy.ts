import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/customer(.*)", "/business(.*)"]);
const isBusinessRoute = createRouteMatcher(["/business(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (!isProtectedRoute(req)) {
        return;
    }

    // Todo (remove on auth test)
    const development = true;

    if (development) {
        return;
    }

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const userRoles = sessionClaims?.metadata?.roles ?? [];

    const hasBusinessRole = userRoles.includes("Business");

    const hasAdminRole = userRoles.includes("Admin");

    if (isBusinessRoute(req) && !hasBusinessRole) {
        return NextResponse.redirect(new URL("/customer", req.url));
    }

    if (isAdminRoute(req) && !hasAdminRole) {
        const fallbackPath = hasBusinessRole ? "/business" : "/customer";
        return NextResponse.redirect(new URL(fallbackPath, req.url));
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/__clerk/(.*)",
        "/(.*)",
    ],
};
