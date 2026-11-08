"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { sidebarSheets } from "@/lib/mock";

const nav = [
  { href: "/", label: "Tổng quan" },
  { href: "/employees", label: "Nhân viên" },
];
const navAfter = [
  { href: "/import", label: "Import" },
  { href: "/settings", label: "Cài đặt" },
];

function item(active: boolean) {
  return cn(
    "flex min-h-11 items-center justify-between rounded-md px-3 text-sm",
    active ? "bg-primary/10 font-semibold text-primary" : "text-foreground/80 hover:bg-muted"
  );
}

export function AppSidebar() {
  const path = usePathname();
  const is = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <aside className="w-full shrink-0 border-r bg-card p-3 md:w-64">
      <div className="px-3 pb-4 pt-2 text-base font-bold">C&amp;B Monitoring</div>
      <nav className="space-y-1">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={item(is(n.href))}>{n.label}</Link>
        ))}
        <Link href="/sheets" className={item(path.startsWith("/sheets"))}>
          <span>Working Sheets</span>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 text-xs">10</span>
            <ChevronDown className="size-4" aria-hidden />
          </span>
        </Link>
        <div className="flex gap-1.5 px-1">
          <Input aria-label="Tìm working sheet" placeholder="Tìm sheet…" className="h-11" />
          <Button asChild className="h-11"><Link href="/sheets/new">+ Mới</Link></Button>
        </div>
        <ul className="px-1">
          {sidebarSheets.map((s) => (
            <li key={s.id} className={cn("flex items-center rounded-md", path.startsWith(`/sheets/${s.id}`) && "bg-primary/10 text-primary")}>
              <Link href={`/sheets/${s.id}`} className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-2 px-2 text-[13px]">
                <span className="truncate">{s.name}</span>
                <span className="text-xs">{s.count.toLocaleString("vi-VN")}</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8" aria-label={`Tuỳ chọn ${s.name}`}><MoreHorizontal /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href={`/sheets/${s.id}`}>Mở</Link></DropdownMenuItem>
                  <DropdownMenuItem>Đổi tên</DropdownMenuItem>
                  <DropdownMenuItem>Lưu trữ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
          <li><Link href="/sheets" className="flex min-h-11 items-center px-2 text-[13px] font-semibold text-primary">Xem tất cả</Link></li>
        </ul>
        {navAfter.map((n) => (
          <Link key={n.href} href={n.href} className={item(is(n.href))}>{n.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
