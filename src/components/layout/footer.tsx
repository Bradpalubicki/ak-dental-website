import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Star, Instagram } from "lucide-react";
import { siteConfig, navigation, services, engineConfig } from "@/lib/config";

// Custom SVG icons for platforms not in lucide
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18V11.2a4.85 4.85 0 01-2.99-1.04V6.69h2.99z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.056-2.94c.135-.193.063-.458-.135-.543l-.002-.001a8.23 8.23 0 00-3.228-.657c-.206 0-.39.145-.42.35l-.59 4.04c-.17 1.154-1.858 1.07-1.91-.097L9.37 5.573c-.02-.454.33-.843.785-.876a8.316 8.316 0 016.282 2.054c.164.15.17.405.015.563l-3.56 3.63c-.636.648.076 1.704.908 1.346l5.027-2.16c.193-.083.418.015.488.213a8.2 8.2 0 01.455 2.886c0 .076-.01.152-.014.228-.018.318-.288.528-.596.428v.001z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    { name: "Facebook", href: siteConfig.social.facebook, icon: Facebook },
    { name: "Instagram", href: siteConfig.social.instagram, icon: Instagram },
    { name: "TikTok", href: siteConfig.social.tiktok, icon: TikTokIcon },
    { name: "YouTube", href: siteConfig.social.youtube, icon: YouTubeIcon },
    { name: "Yelp", href: siteConfig.social.yelp, icon: YelpIcon },
    { name: "Google", href: siteConfig.ratings.googleReviewUrl || siteConfig.social.google, icon: GoogleIcon },
  ].filter((l) => l.href && l.href !== "#");

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <Image
              src={siteConfig.branding.footerLogo}
              alt={siteConfig.name}
              width={512}
              height={198}
              className="h-10 w-auto mb-4 brightness-110"
            />
            <ul className="space-y-3">
              <li>
                <a href={siteConfig.phoneHref} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{siteConfig.address.full}</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-600 transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Office Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Monday</span>
                <span>{siteConfig.hours.monday}</span>
              </li>
              <li className="flex justify-between">
                <span>Tuesday</span>
                <span>{siteConfig.hours.tuesday}</span>
              </li>
              <li className="flex justify-between">
                <span>Wednesday</span>
                <span>{siteConfig.hours.wednesday}</span>
              </li>
              <li className="flex justify-between">
                <span>Thursday</span>
                <span>{siteConfig.hours.thursday}</span>
              </li>
              <li className="flex justify-between">
                <span>Friday</span>
                <span>{siteConfig.hours.friday}</span>
              </li>
              <li className="flex justify-between">
                <span>Sat-Sun</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={engineConfig.navigation.ctaHref} className="hover:text-white transition-colors">
                  {engineConfig.navigation.ctaLabel}
                </Link>
              </li>
              <li>
                <Link href="/patient-portal" className="hover:text-white transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-cyan-400 hover:text-white transition-colors font-medium">
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Reviews Badge */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-center">
          <a
            href={siteConfig.ratings.googleReviewUrl || siteConfig.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gray-800 rounded-xl px-5 py-3 hover:bg-gray-700 transition-colors"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white font-semibold">{siteConfig.ratings.count} Five-Star Google Reviews</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <span className="text-gray-700">|</span>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <span className="text-gray-700">|</span>
            <Link href="/patient-portal" className="hover:text-white transition-colors">Patient Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
