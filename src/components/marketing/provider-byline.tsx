import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

interface ProviderBylineProps {
  variant?: "compact" | "full";
  className?: string;
}

export function ProviderByline({ variant = "compact", className = "" }: ProviderBylineProps) {
  if (variant === "full") {
    return (
      <div className={`flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl ${className}`}>
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cyan-200">
          <Image
            src="/dr-alex-headshot.jpg"
            alt="Dr. Alex Chireau, DDS"
            fill
            sizes="56px"
            className="object-cover object-top"
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Written &amp; reviewed by</p>
          <Link
            href="/team/dr-alex-chireau"
            className="font-semibold text-gray-900 hover:text-cyan-600 transition-colors"
          >
            Dr. Alex Chireau, DDS
          </Link>
          <p className="text-xs text-gray-500">UNLV School of Dental Medicine · Las Vegas, NV</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <Shield className="h-3 w-3" />
          <span>Clinically reviewed</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src="/dr-alex-headshot.jpg"
          alt="Dr. Alex Chireau, DDS"
          fill
          sizes="28px"
          className="object-cover object-top"
        />
      </div>
      <span>Written by </span>
      <Link
        href="/team/dr-alex-chireau"
        className="font-medium text-gray-700 hover:text-cyan-600 transition-colors"
      >
        Dr. Alex Chireau, DDS
      </Link>
    </div>
  );
}
