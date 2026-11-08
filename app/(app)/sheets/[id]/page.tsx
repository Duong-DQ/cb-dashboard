import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { sheetRows, sheets } from "@/lib/mock";

export default async function SheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sheet = sheets.find((s) => s.id === id) ?? sheets[0];
  return (
    <div className="space-y-4">
      <PageHeader
        title={sheet.name}
        description={`${sheet.open ? "Đang mở" : "Đã lưu trữ"} · ${sheet.note} · khoá CCCD, dự phòng mã NV`}
        actions={<>
          <Button asChild variant="outline" className="h-11"><Link href={`/sheets/${sheet.id}/add`}>Thêm nhân viên</Link></Button>
          <Button asChild variant="outline" className="h-11"><Link href="/sheets">Lưu trữ</Link></Button>
          <Button asChild className="h-11"><Link href={`/sheets/${sheet.id}/commit`}>Commit về nguồn</Link></Button>
        </>}
      />
      <Card><CardContent className="flex flex-wrap items-center gap-x-4 pt-4">
        <b className="text-sm">So sánh với</b>
        {["HRIS", "Xác thực", "Kê khai"].map((t) => <Label key={t} className="flex min-h-11 items-center gap-2 font-normal"><Checkbox defaultChecked />{t}</Label>)}
        <Label className="flex min-h-11 items-center gap-2 font-normal"><Checkbox />Dữ liệu dán/upload</Label>
        <Button asChild variant="outline" className="h-11"><Link href={`/sheets/${sheet.id}/add`}>Dán / upload dữ liệu</Link></Button>
      </CardContent></Card>
      <Card><CardContent className="space-y-3 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="blue" label="Tất cả 48" /><StatusBadge status="match" label="Khớp 39" /><StatusBadge status="conflict" label="Xung đột 3" /><StatusBadge status="missing" label="Thiếu 6" />
          </div>
          <Input aria-label="Tìm trong sheet" placeholder="Tìm gần đúng…" className="h-11 w-60" />
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm">
          <b>Đã chọn 3</b><Button variant="outline" className="h-11">Gửi email theo mẫu</Button><Button variant="outline" className="h-11">Xuất file</Button><Button variant="outline" className="h-11 text-destructive">Xoá khỏi sheet</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead className="w-8" /><TableHead>Mã NV</TableHead><TableHead>Họ tên</TableHead><TableHead>VCB (HRIS)</TableHead><TableHead>VCB (xác thực)</TableHead><TableHead>VCB (kê khai)</TableHead><TableHead>Trạng thái</TableHead><TableHead>Xử lý</TableHead></TableRow></TableHeader>
          <TableBody>
            {sheetRows.map((r) => (
              <TableRow key={r.eid}>
                <TableCell><Checkbox aria-label={`Chọn ${r.name}`} /></TableCell>
                <TableCell>{r.eid}</TableCell>
                <TableCell>{r.name}<div className="text-[11px] text-muted-foreground">{r.key}</div></TableCell>
                <TableCell>{r.hris}</TableCell><TableCell>{r.ver}</TableCell><TableCell>{r.decl}</TableCell>
                <TableCell><StatusBadge status={r.status} label={r.status === "conflict" ? "Xung đột" : undefined} /></TableCell>
                <TableCell>
                  {r.status === "conflict" ? <Button asChild variant="link" className="h-11"><Link href={`/sheets/${sheet.id}/commit`}>Chọn giá trị</Link></Button>
                    : r.status === "missing" ? <Button variant="link" className="h-11">Gửi email</Button>
                    : <Button asChild variant="link" className="h-11"><Link href={`/employees?eid=${r.eid}`}>Xem</Link></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground">Hiển thị 5 / 48 · Commit gặp khác biệt sẽ mở bước gộp từng dòng.</p>
      </CardContent></Card>
    </div>
  );
}
