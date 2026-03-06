import { redirect } from "next/navigation";

// /dashboard/media → redirect to new /dashboard/postings hub
export default function MediaPage() {
  redirect("/dashboard/postings");
}
