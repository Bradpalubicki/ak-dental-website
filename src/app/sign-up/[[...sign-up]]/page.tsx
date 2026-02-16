import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/ak-logo-gold.jpg"
            alt="AK Ultimate Dental"
            width={200}
            height={80}
            className="mx-auto mb-4 h-16 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">AK Ultimate Dental</h1>
          <p className="text-sm text-cyan-400">One Engine &middot; AI Operations Platform</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              logoBox: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
