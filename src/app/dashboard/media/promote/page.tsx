import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PromoteClient } from "./promote-client";

export const metadata = {
  title: "Get More Photos | AK Ultimate Dental",
};

export default async function PromotePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <PromoteClient />;
}
