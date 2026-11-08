import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 md:flex-row">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-6 md:px-8">{children}</main>
    </div>
  );
}
