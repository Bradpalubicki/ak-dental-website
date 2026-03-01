import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * POST /api/users/invite
 * Sends a Clerk invitation email and pre-sets the user's authority level.
 * Admin-only.
 *
 * Body: { email, firstName, lastName, role, authorityLevel }
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only admins can invite
  const clerk = await clerkClient();
  const inviter = await clerk.users.getUser(userId);
  const inviterLevel = inviter.publicMetadata?.authorityLevel as string | undefined;
  if (!inviterLevel || !["global_admin", "admin"].includes(inviterLevel)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const { email, firstName, lastName, role, authorityLevel } = body as {
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    authorityLevel: string;
  };

  if (!email || !role || !authorityLevel) {
    return NextResponse.json(
      { error: "email, role, and authorityLevel are required" },
      { status: 400 }
    );
  }

  // Validate authority level — admins cannot invite global_admin
  const allowedLevels = ["admin", "manager", "staff"];
  if (!allowedLevels.includes(authorityLevel)) {
    return NextResponse.json({ error: "Invalid authority level" }, { status: 400 });
  }

  try {
    // Send Clerk invitation with publicMetadata pre-set
    const invitation = await clerk.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        authorityLevel,
        role,
        invitedBy: userId,
        practiceName: "AK Ultimate Dental",
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://ak-ultimate-dental.vercel.app"}/dashboard`,
    });

    // Log the invite in Supabase for tracking
    const supabase = createServiceSupabase();
    await supabase.from("oe_user_invites").insert({
      clerk_invitation_id: invitation.id,
      email,
      first_name: firstName || null,
      last_name: lastName || null,
      role,
      authority_level: authorityLevel,
      invited_by: userId,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
      message: `Invitation sent to ${email}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send invitation";
    // Clerk throws if email already has an account or pending invite
    if (message.includes("already")) {
      return NextResponse.json({ error: "This email already has an account or pending invitation." }, { status: 409 });
    }
    console.error("[Invite]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/users/invite
 * Returns all pending invites.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const inviter = await clerk.users.getUser(userId);
  const level = inviter.publicMetadata?.authorityLevel as string | undefined;
  if (!level || !["global_admin", "admin"].includes(level)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from("oe_user_invites")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

/**
 * DELETE /api/users/invite
 * Revokes a pending invitation.
 * Body: { invitationId }
 */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const inviter = await clerk.users.getUser(userId);
  const level = inviter.publicMetadata?.authorityLevel as string | undefined;
  if (!level || !["global_admin", "admin"].includes(level)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { invitationId } = await req.json();
  if (!invitationId) return NextResponse.json({ error: "invitationId required" }, { status: 400 });

  try {
    await clerk.invitations.revokeInvitation(invitationId);

    const supabase = createServiceSupabase();
    await supabase
      .from("oe_user_invites")
      .update({ status: "revoked" })
      .eq("clerk_invitation_id", invitationId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to revoke" },
      { status: 500 }
    );
  }
}
