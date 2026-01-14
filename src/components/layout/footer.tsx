import Link from "next/link";
import { Phone, Mail, MapPin, Facebook } from "lucide-react";
import { siteConfig, navigation, services } from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{siteConfig.name}</h3>
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
                <Link href="/appointment" className="hover:text-white transition-colors">
                  Book Appointment
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
                <Link href="/services" className="text-primary-foreground hover:text-white transition-colors font-medium">
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href={siteConfig.social.yelp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <span className="text-sm font-semibold">Yelp</span>
            </a>
            <a href={siteConfig.social.google} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <span className="text-sm font-semibold">Google</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
