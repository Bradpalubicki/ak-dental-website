/**
 * TCPA Compliance Module
 * Handles time-of-day restrictions, message classification,
 * opt-out formatting, and A2P 10DLC compliance helpers.
 */

/**
 * Check if current time is within TCPA-allowed sending hours.
 * TCPA restricts calls/texts to 8 AM - 9 PM in recipient's local time.
 * Default timezone: America/Los_Angeles (Las Vegas, NV)
 */
export function isWithinSendingHours(timezone: string = "America/Los_Angeles"): boolean {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(now), 10);
  return hour >= 8 && hour < 21; // 8 AM to 9 PM
}

/**
 * Get the next allowed sending time if currently outside hours.
 */
export function getNextSendingWindow(timezone: string = "America/Los_Angeles"): Date | null {
  if (isWithinSendingHours(timezone)) return null;

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(formatter.format(now), 10);

  // If after 9 PM, next window is 8 AM tomorrow
  // If before 8 AM, next window is 8 AM today
  const next = new Date(now);
  if (hour >= 21) {
    next.setDate(next.getDate() + 1);
  }
  // Set to 8 AM in the target timezone (approximate)
  next.setHours(8 + (now.getTimezoneOffset() / 60), 0, 0, 0);
  return next;
}

export type MessageType = "transactional" | "marketing";

/**
 * Classify a message as transactional or marketing.
 * Transactional messages (appointment reminders, confirmations) have
 * lighter consent requirements under TCPA healthcare exemption.
 */
export function classifyMessage(content: string): MessageType {
  const transactionalKeywords = [
    "appointment", "reminder", "confirm", "reschedule",
    "check-in", "follow-up", "test results", "prescription",
    "balance due", "payment received", "insurance verification",
    "treatment plan", "pre-authorization",
  ];

  const marketingKeywords = [
    "special offer", "discount", "promotion", "limited time",
    "new service", "refer a friend", "holiday", "whitening special",
    "free consultation", "we miss you", "haven't seen you",
  ];

  const lowerContent = content.toLowerCase();
  const transactionalScore = transactionalKeywords.filter(k => lowerContent.includes(k)).length;
  const marketingScore = marketingKeywords.filter(k => lowerContent.includes(k)).length;

  return marketingScore > transactionalScore ? "marketing" : "transactional";
}

/**
 * Format a TCPA-compliant footer for SMS messages.
 * Required: practice identification + opt-out instructions.
 */
export function formatComplianceFooter(messageType: MessageType): string {
  if (messageType === "marketing") {
    return "\n\nAK Ultimate Dental (702) 562-2033\nReply STOP to unsubscribe. Msg&data rates may apply.";
  }
  // Transactional - lighter requirement but still include opt-out
  return "\n\nAK Ultimate Dental\nReply STOP to opt out.";
}

/**
 * Check if a message contains PHI that should NOT be in an SMS.
 * Returns list of concerns found.
 */
export function checkForPhi(content: string): string[] {
  const concerns: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for specific PHI indicators
  const phiPatterns = [
    { pattern: /\b(diagnosis|diagnosed)\b/i, concern: "Diagnosis information" },
    { pattern: /\b(hiv|aids|std|sti)\b/i, concern: "Sensitive health condition" },
    { pattern: /\b(prescription|rx|medication)\b/i, concern: "Prescription information" },
    { pattern: /\bssn\b|\bsocial security\b/i, concern: "Social Security Number" },
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/, concern: "SSN format detected" },
    { pattern: /\b(mental health|psychiatric|therapy)\b/i, concern: "Mental health information" },
    { pattern: /\b(substance|addiction|rehab)\b/i, concern: "Substance abuse information" },
  ];

  for (const { pattern, concern } of phiPatterns) {
    if (pattern.test(content)) {
      concerns.push(concern);
    }
  }

  // Safe content for appointment reminders
  const safePatterns = ["appointment", "date", "time", "location", "provider", "office"];
  if (concerns.length === 0 && !safePatterns.some(p => lowerContent.includes(p))) {
    // Generic message with no safe indicators - flag for review
    if (content.length > 160) {
      concerns.push("Message exceeds 160 characters (SMS best practice)");
    }
  }

  return concerns;
}

/**
 * Validate message is compliant before sending.
 * Returns { valid: true } or { valid: false, reasons: string[] }
 */
export function validateMessageCompliance(
  content: string,
  recipientTimezone: string = "America/Los_Angeles"
): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Check sending hours
  if (!isWithinSendingHours(recipientTimezone)) {
    reasons.push("Outside TCPA sending hours (8 AM - 9 PM recipient local time)");
  }

  // Check for PHI
  const phiConcerns = checkForPhi(content);
  if (phiConcerns.length > 0) {
    reasons.push(...phiConcerns.map(c => `PHI detected: ${c}`));
  }

  return { valid: reasons.length === 0, reasons };
}
