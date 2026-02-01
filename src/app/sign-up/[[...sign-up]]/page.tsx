import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">One Engine</h1>
          <p className="text-sm text-slate-500">AI Operations Platform</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
