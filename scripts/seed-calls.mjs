import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

const callerNames = [
  "Maria Garcia", "John Smith", "David Lee", "Sarah Johnson", "Robert Chen",
  "Lisa Patel", "Michael Brown", "Jennifer Kim", "James Wilson", "Emily Davis",
  "Carlos Martinez", "Amanda White", "Thomas Anderson", "Rachel Green", "Daniel Taylor",
];

const intents = ["appointment", "billing", "emergency", "information", "prescription", "follow_up", "insurance", "other"];
const intentWeights = [35, 15, 5, 15, 5, 10, 10, 5]; // percentage distribution
const statuses = ["answered", "missed", "voicemail", "abandoned"];
const statusWeights = [82, 8, 7, 3]; // answer rate ~82%
const urgencies = ["low", "medium", "high", "emergency"];
const urgencyWeights = [50, 30, 15, 5];

const aiSummaries = [
  "Patient called to schedule a cleaning appointment. AI booked for next available slot.",
  "Billing inquiry about recent crown procedure. AI provided itemized breakdown.",
  "Patient requesting prescription refill for pain medication. Transferred to provider.",
  "Insurance eligibility question. AI verified coverage and explained benefits.",
  "Follow-up call regarding post-op care instructions after extraction.",
  "New patient inquiry about dental implant costs and insurance coverage.",
  "Appointment confirmation call. Patient confirmed attendance.",
  "Patient called about tooth sensitivity. AI recommended scheduling exam.",
  "Billing question about outstanding balance. AI provided payment options.",
  "Emergency call - severe tooth pain. Transferred to on-call provider.",
];

const actionsTaken = [
  "Appointment scheduled", "Information provided", "Voicemail recorded",
  "Transferred to staff", "Follow-up task created", "Callback scheduled",
  "Insurance verified", "Payment arranged",
];

function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomPhone() {
  return `(702) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

async function seed() {
  console.log("Seeding call data...");
  const calls = [];
  const now = new Date();

  // Generate 6 months of calls (roughly 20-35 calls per day, Mon-Sat)
  for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dow = date.getDay();

    if (dow === 0) continue; // Sunday - minimal calls
    const callCount = dow === 6
      ? Math.floor(Math.random() * 10) + 8  // Saturday: 8-17
      : Math.floor(Math.random() * 15) + 20; // Weekday: 20-34

    for (let c = 0; c < callCount; c++) {
      const hour = 8 + Math.floor(Math.random() * 10); // 8am-5pm
      const minute = Math.floor(Math.random() * 60);
      const callDate = new Date(date);
      callDate.setHours(hour, minute, Math.floor(Math.random() * 60));

      const status = weightedRandom(statuses, statusWeights);
      const isAnswered = status === "answered";
      const duration = isAnswered
        ? Math.floor(Math.random() * 300) + 30 // 30s - 5.5min
        : status === "voicemail"
        ? Math.floor(Math.random() * 60) + 15
        : null;

      const aiHandled = isAnswered && Math.random() < 0.6; // 60% of answered calls handled by AI
      const intent = weightedRandom(intents, intentWeights);
      const urgency = weightedRandom(urgencies, urgencyWeights);
      const afterHours = hour < 8 || hour >= 17;
      const caller = callerNames[Math.floor(Math.random() * callerNames.length)];

      calls.push({
        created_at: callDate.toISOString(),
        caller_phone: randomPhone(),
        caller_name: caller,
        direction: Math.random() < 0.7 ? "inbound" : "outbound",
        status,
        duration_seconds: duration,
        after_hours: afterHours,
        intent,
        urgency,
        ai_handled: aiHandled,
        ai_summary: aiHandled ? aiSummaries[Math.floor(Math.random() * aiSummaries.length)] : null,
        action_taken: isAnswered ? actionsTaken[Math.floor(Math.random() * actionsTaken.length)] : null,
        follow_up_required: Math.random() < 0.15,
        follow_up_completed: false,
        call_type: aiHandled ? "ai" : "human",
      });
    }
  }

  // Insert in batches of 500
  let inserted = 0;
  for (let i = 0; i < calls.length; i += 500) {
    const batch = calls.slice(i, i + 500);
    const { error } = await supabase.from("oe_calls").insert(batch);
    if (error) {
      console.error(`Batch ${i} error:`, error.message);
    } else {
      inserted += batch.length;
    }
  }

  console.log(`Seeded ${inserted} call records (${Math.round(inserted / 180)} calls/day avg)`);

  // Print stats
  const answered = calls.filter(c => c.status === "answered").length;
  const aiHandled = calls.filter(c => c.ai_handled).length;
  console.log(`  Answered: ${answered} (${Math.round(answered/calls.length*100)}%)`);
  console.log(`  AI Handled: ${aiHandled} (${Math.round(aiHandled/calls.length*100)}%)`);
  console.log("Done!");
}

seed().catch(console.error);
