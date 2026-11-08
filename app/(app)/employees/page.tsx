import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmployeeDetail } from "./employee-detail";
import { employees } from "@/lib/mock";

const filters = ["VCB", "MST", "BHXH"];

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ eid?: string }> }) {
  const { eid = "E10244" } = await searchParams;
  const selected = employees.find((e) => e.eid === eid) ?? employees[0];
  return (
    <div className="space-y-4">
      <PageHeader title="Nhân viên" description="10,000 người" actions={<Button asChild className="h-11"><Link href="/employees/new">+ Thêm nhân viên</Link></Button>} />
      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card><CardContent className="space-y-3 pt-6">
          <div className="flex flex-wrap gap-2">
            <Input aria-label="Tìm nhân viên" placeholder="Tìm gần đúng tên, CCCD, mã NV…" className="h-11 min-w-56 flex-1" />
            {filters.map((f) => (
              <Select key={f}><SelectTrigger className="h-11 w-36" aria-label={`Lọc ${f}`}><SelectValue placeholder={`${f}: tất cả`} /></SelectTrigger>
                <SelectContent>{["Khớp", "Lệch HRIS", "Chờ push", "Thiếu"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm">
            <b>Đã chọn 1</b>
            <Button variant="outline" className="h-11">Gửi email theo mẫu</Button>
            <Button asChild variant="outline" className="h-11"><Link href="/sheets/1/add">Thêm vào working sheet</Link></Button>
            <Button variant="outline" className="h-11">Xuất file</Button>
            <Button variant="outline" className="h-11 text-destructive">Xoá</Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead className="w-8" /><TableHead>Mã NV</TableHead><TableHead>Họ tên</TableHead><TableHead>Phòng ban</TableHead><TableHead>VCB</TableHead><TableHead>MST</TableHead><TableHead>BHXH</TableHead><TableHead>Làm việc</TableHead></TableRow></TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.eid} data-state={e.eid === selected.eid ? "selected" : undefined}>
                  <TableCell><Checkbox aria-label={`Chọn ${e.name}`} defaultChecked={e.eid === selected.eid} /></TableCell>
                  <TableCell>{e.eid}</TableCell>
                  <TableCell><Link href={`/employees?eid=${e.eid}`} className="font-semibold">{e.name}</Link><div className="text-[11px] text-muted-foreground">{e.pid}</div></TableCell>
                  <TableCell>{e.dept}</TableCell>
                  <TableCell><StatusBadge status={e.vcb} /></TableCell>
                  <TableCell><StatusBadge status={e.tax} /></TableCell>
                  <TableCell><StatusBadge status={e.ss} /></TableCell>
                  <TableCell><StatusBadge status={e.working ? "green" : "neutral"} label={e.working ? "Đang làm" : "Đã nghỉ"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between text-sm text-muted-foreground"><span>1–5 / 10,000</span><span className="flex gap-2"><Button variant="outline" className="h-11">Trước</Button><Button variant="outline" className="h-11">Sau</Button></span></div>
        </CardContent></Card>
        <EmployeeDetail employee={selected} />
      </section>
    </div>
  );
}
