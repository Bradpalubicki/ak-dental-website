// Reusable auth helper for API routes
// Call requireAuth() at the top of any protected route handler

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AuthResult {
  userId: string;
  userName: string | null;
}

/**
 * Require authentication for an API route.
 * Returns userId and userName, or throws a 401 NextResponse.
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    throw NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Try to get user's name for audit trails
  let userName: string | null = null;
  try {
    const user = await currentUser();
    if (user) {
      userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.emailAddresses?.[0]?.emailAddress || null;
    }
  } catch {
    // Name lookup is best-effort, don't fail the request
  }

  return { userId, userName };
}

/**
 * Wrapper that catches the thrown NextResponse from requireAuth()
 * Use in route handlers: const authResult = await tryAuth(); if (authResult instanceof NextResponse) return authResult;
 */
export async function tryAuth(): Promise<AuthResult | NextResponse> {
  try {
    return await requireAuth();
  } catch (e) {
    if (e instanceof NextResponse) return e;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
