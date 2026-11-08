"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/settings", label: "Nguồn và mẫu import" },
  { href: "/settings/email", label: "Mẫu email" },
  { href: "/settings/domains", label: "Loại dữ liệu" },
  { href: "/settings/users", label: "Người dùng" },
];

export function SettingsTabs() {
  const path = usePathname();
  return (
    <nav className="flex flex-wrap border-b" aria-label="Cài đặt">
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} aria-current={path === t.href ? "page" : undefined}
          className={cn("flex min-h-11 items-center border-b-2 px-4 text-sm font-semibold", path === t.href ? "border-primary text-primary" : "border-transparent text-foreground/80")}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
