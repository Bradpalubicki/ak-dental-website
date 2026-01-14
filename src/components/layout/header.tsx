"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig, navigation, services } from "@/lib/config";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href={siteConfig.phoneHref} className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
            <span className="hidden md:flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Mon-Thu: 8AM-5PM
            </span>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/appointment">Book Appointment</Link>
          </Button>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">{siteConfig.name}</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild>
              <Link href="/appointment">Request Appointment</Link>
            </Button>
          </nav>

          {/* Mobile navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.main.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Services</p>
                  {services.slice(0, 6).map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm hover:text-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
                <Button asChild className="mt-4">
                  <Link href="/appointment" onClick={() => setOpen(false)}>
                    Request Appointment
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
