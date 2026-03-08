import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyEmergencyBar } from "@/components/marketing/sticky-emergency-bar";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { ChatWidget } from "@/components/marketing/chat-widget";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      <main className="min-h-screen pb-14 md:pb-0">{children}</main>
      <Footer />
      <StickyEmergencyBar />
      <ChatWidget />
    </>
  );
}
