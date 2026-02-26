import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Request an Appointment | AK Ultimate Dental Las Vegas",
  description:
    "Schedule your dental appointment at AK Ultimate Dental in Las Vegas. New patients welcome. Call (702) 935-4395 or request online. Located at 7480 W Sahara Ave.",
  alternates: { canonical: `${siteConfig.url}/appointment` },
  openGraph: {
    title: "Request an Appointment | AK Ultimate Dental Las Vegas",
    description: "Schedule your dental appointment online. New patients welcome. Located at 7480 W Sahara Ave, Las Vegas, NV 89117.",
    images: [{ url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=630&fit=crop&q=80", width: 1200, height: 630, alt: "AK Ultimate Dental appointment booking" }],
  },
};

export default function AppointmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
