import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DraftsQueue } from "@/components/email/DraftsQueue";
import { BillsFromEmail } from "@/components/email/BillsFromEmail";
import { Mail, DollarSign, MessageSquare, Send, BookTemplate, FolderOpen } from "lucide-react";
import { SectionHub } from "@/components/dashboard/section-hub";

export const dynamic = "force-dynamic";

type Tab = "drafts" | "bills";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function EmailPage({ searchParams }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const sp = await searchParams;
  const tab = (sp.tab as Tab) || "drafts";

  return (
    <div className="space-y-6">
      <SectionHub
        title="Inbox"
        description="Messages, outreach, email, templates, and documents"
        icon={Mail}
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
        links={[
          { label: "Messages", href: "/dashboard/inbox", icon: MessageSquare, description: "Conversations & patient messages" },
          { label: "Outreach", href: "/dashboard/outreach", icon: Send, description: "Campaigns & workflows" },
          { label: "Email", href: "/dashboard/email", icon: Mail, description: "AI drafts & bill detection" },
          { label: "Templates", href: "/dashboard/message-templates", icon: BookTemplate, description: "Message templates" },
          { label: "Dropbox", href: "/dashboard/dropbox", icon: FolderOpen, description: "AI file processing" },
        ]}
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Email Intelligence</h1>
        <p className="text-sm text-slate-500">
          AI-drafted replies and bills detected from your inbox
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 -mb-px">
          <a
            href="/dashboard/email?tab=drafts"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "drafts"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Mail className="h-4 w-4" />
            Draft Approvals
          </a>
          <a
            href="/dashboard/email?tab=bills"
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "bills"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Bills from Email
          </a>
        </nav>
      </div>

      {/* Content */}
      <div>
        {tab === "drafts" ? <DraftsQueue /> : <BillsFromEmail />}
      </div>
    </div>
  );
}
