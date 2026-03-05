import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyEmergencyBar } from "@/components/marketing/sticky-emergency-bar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-14 md:pb-0">{children}</main>
      <Footer />
      <StickyEmergencyBar />
    </>
  );
}
