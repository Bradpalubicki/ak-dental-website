import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/approvals(.*)",
  "/api/settings(.*)",
  "/api/outreach(.*)",
  "/api/ai(.*)",
  "/api/hr(.*)",
  "/api/treatments(.*)",
  "/api/dashboard(.*)",
  "/api/leads/:id/respond(.*)",
  "/api/appointments(.*)",
  "/api/patients(.*)",
  "/api/insurance(.*)",
  "/api/documents(.*)",
  "/api/upload(.*)",
  "/api/rbac(.*)",
  "/api/seo/keywords(.*)",
  "/api/seo/indexnow(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
