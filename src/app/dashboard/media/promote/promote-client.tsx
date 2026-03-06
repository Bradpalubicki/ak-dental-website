"use client";

import { useState } from "react";
import { Copy, CheckCircle, MessageSquare, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRACTICE_NAME = "AK Ultimate Dental";
const UPLOAD_URL = "https://akultimatedental.com/dashboard/media/upload";

const MESSAGES = [
  {
    id: "text-short",
    label: "Text Message — Short",
    icon: Phone,
    content: `Hi [Patient Name]! It's the team at ${PRACTICE_NAME}. Loved working with you — would you be willing to share a before & after photo for our website? It helps other patients feel confident about treatment. Upload here (takes 2 min): ${UPLOAD_URL} — Reply STOP to opt out.`,
  },
  {
    id: "text-long",
    label: "Text Message — Detailed",
    icon: Phone,
    content: `Hi [Patient Name], this is [Your Name] at ${PRACTICE_NAME}! We hope you're loving your smile results. We'd love to feature your transformation on our website to inspire other patients considering [treatment]. It's completely optional — you stay 100% in control, and we'll ask for your consent before anything goes live.\n\nUpload your before & after photos here: ${UPLOAD_URL}\n\nTakes about 2 minutes. Thank you so much! — Reply STOP to opt out.`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    subject: `Would you share your smile transformation? — ${PRACTICE_NAME}`,
    content: `Hi [Patient Name],

Thank you so much for trusting us with your smile! We truly love seeing the results our patients achieve, and yours is one we're especially proud of.

We'd love to feature your before & after photos on our website to help other patients feel confident about starting their own treatment. Here's how it works:

• You upload your photos directly (takes about 2 minutes)
• We review and confirm your consent before anything is published
• You can request removal at any time

To share your photos, visit:
${UPLOAD_URL}

This is completely optional — there's absolutely no pressure. But if you're open to it, your story could make a real difference for someone else.

Thank you again for being such a wonderful patient.

Warmly,
[Your Name]
${PRACTICE_NAME}`,
  },
  {
    id: "in-office",
    label: "In-Office Script",
    icon: MessageSquare,
    content: `"Your results look amazing — we're so proud of how this turned out! We're building out our smile gallery on the website and would love to feature your transformation. It's totally optional, and we always get your sign-off before anything goes live. Would you be open to uploading a before and after? I can text you the link right now — it only takes about two minutes."`,
  },
  {
    id: "followup",
    label: "Follow-Up (No Response)",
    icon: MessageSquare,
    content: `Hi [Patient Name]! Just following up — we'd still love to feature your smile transformation on our website if you're open to it. No pressure at all, but your results really are incredible. Here's the link whenever you're ready: ${UPLOAD_URL} — Reply STOP to opt out.`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0">
      {copied ? (
        <><CheckCircle className="mr-1.5 h-3.5 w-3.5 text-green-600" /> Copied</>
      ) : (
        <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy</>
      )}
    </Button>
  );
}

export function PromoteClient() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Get More Before & After Photos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ready-to-send messages to ask patients for their transformation photos. Copy and send directly — no editing needed (just fill in the brackets).
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Why this matters:</strong> Practices with 10+ before & after photos on their site convert 40% more consultations. Patients trust real results more than any ad.
      </div>

      <div className="space-y-4">
        {MESSAGES.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <msg.icon className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-semibold text-gray-800">{msg.label}</span>
              </div>
              <CopyButton text={msg.subject ? `Subject: ${msg.subject}\n\n${msg.content}` : msg.content} />
            </div>
            {msg.subject && (
              <p className="mb-2 text-xs font-medium text-gray-500">
                Subject: <span className="text-gray-700">{msg.subject}</span>
              </p>
            )}
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-700 font-sans leading-relaxed">
              {msg.content}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-800">
        <strong>Pro tip:</strong> The best time to ask is at checkout, right after the patient sees their results for the first time. Use the in-office script above — a warm, personal ask converts 3x better than a text alone.
      </div>
    </div>
  );
}
