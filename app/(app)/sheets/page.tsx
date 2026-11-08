import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { sheets } from "@/lib/mock";

export default function SheetsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Tất cả working sheets" description="10 sheet" actions={<Button asChild className="h-11"><Link href="/sheets/new">+ Sheet mới</Link></Button>} />
      <Card><CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="blue" label="Đang mở 3" /><StatusBadge status="neutral" label="Đã lưu trữ 7" />
          <Input aria-label="Tìm sheet" placeholder="Tìm sheet…" className="ml-auto h-11 w-64" />
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Tên sheet</TableHead><TableHead>Ghi chú</TableHead><TableHead>Số NV</TableHead><TableHead className="w-44">Tiến độ khớp</TableHead><TableHead>Cập nhật</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
          <TableBody>
            {sheets.map((s) => (
              <TableRow key={s.id}>
                <TableCell><Link href={`/sheets/${s.id}`} className="font-semibold text-primary">{s.name}</Link></TableCell>
                <TableCell>{s.note}</TableCell>
                <TableCell>{s.count.toLocaleString("vi-VN")}</TableCell>
                <TableCell><Progress value={s.progress} aria-label={`${s.progress}% khớp`} /><span className="text-xs text-muted-foreground">{s.progress}% khớp</span></TableCell>
                <TableCell>{s.updated}</TableCell>
                <TableCell><StatusBadge status={s.open ? "green" : "neutral"} label={s.open ? "Đang mở" : "Lưu trữ"} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
