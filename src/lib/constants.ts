import { engineConfig } from "@/config";

export const APP_NAME = engineConfig.engineLabel;

export const PLAN_TIERS = {
  starter: {
    name: "Starter",
    price: 99,
    messageLimit: 500,
    staffLimit: 2,
    features: ["1 Twilio number", "500 messages/mo", "2 staff users", "Default templates"],
  },
  professional: {
    name: "Professional",
    price: 249,
    messageLimit: 2000,
    staffLimit: 10,
    features: ["1 Twilio number", "2,000 messages/mo", "10 staff users", "Custom templates", "CSV import"],
  },
  enterprise: {
    name: "Enterprise",
    price: 499,
    messageLimit: -1, // unlimited
    staffLimit: -1,
    features: ["Multiple Twilio numbers", "Unlimited messages", "Unlimited staff", "API access", "Priority support"],
  },
} as const;

export const OPT_OUT_KEYWORDS = ["stop", "unsubscribe", "optout", "opt out", "cancel", "quit"];
export const OPT_IN_KEYWORDS = ["start", "yes", "subscribe", "optin", "opt in", "unstop"];

export const DENTRIX_CSV_COLUMNS = {
  PatNum: "external_id",
  LName: "last_name",
  FName: "first_name",
  Preferred: null,
  Birthdate: "date_of_birth",
  Gender: null,
  Address: "address",
  Address2: null,
  City: "city",
  State: "state",
  Zip: "zip",
  HmPhone: "phone",
  WkPhone: null,
  WirelessPhone: "phone",
  Email: "email",
  PatStatus: null,
} as const;
