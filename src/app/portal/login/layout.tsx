export default function PortalLoginLayout({ children }: { children: React.ReactNode }) {
  // Login page gets its own layout without auth check
  return <>{children}</>;
}
