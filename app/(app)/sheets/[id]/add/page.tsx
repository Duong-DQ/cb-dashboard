import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field, PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";

const candidates = [
  ["E10281", "Hoàng Văn E", "Phòng ban C", false],
  ["E10318", "Vũ Văn H", "Phòng ban A", false],
  ["E10330", "Đỗ Thị K", "Phòng ban B", false],
  ["E10244", "Trần Thị B", "Phòng ban A", true],
] as const;

export default async function AddToSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <PageHeader title="Thêm nhân viên vào sheet" description="Leaver payroll - đợt 3 T10" />
      <section className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <Card><CardContent className="space-y-3 pt-6">
          <h2 className="font-semibold">Chọn từ HRIS</h2>
          <div className="flex flex-wrap gap-2">
            <Input aria-label="Tìm" placeholder="Tìm gần đúng tên, CCCD, mã NV…" className="h-11 min-w-48 flex-1" />
            <Select><SelectTrigger className="h-11 w-44"><SelectValue placeholder="Phòng ban: tất cả" /></SelectTrigger><SelectContent><SelectItem value="a">Phòng ban A</SelectItem></SelectContent></Select>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead className="w-8" /><TableHead>Mã NV</TableHead><TableHead>Họ tên</TableHead><TableHead>Phòng ban</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {candidates.map(([e, n, d, inSheet]) => (
                <TableRow key={e}>
                  <TableCell><Checkbox aria-label={`Chọn ${n}`} disabled={inSheet} defaultChecked={!inSheet} /></TableCell>
                  <TableCell>{e}</TableCell><TableCell>{n}</TableCell><TableCell>{d}</TableCell>
                  <TableCell><StatusBadge status={inSheet ? "neutral" : "green"} label={inSheet ? "Đã có trong sheet" : "Có thể thêm"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
        <Card><CardContent className="space-y-3 pt-6 text-sm">
          <h2 className="font-semibold">Hoặc dán / upload danh sách</h2>
          <Field label="Dán danh sách"><Textarea rows={4} defaultValue={"0010••••1234\n0010••••5678\nE10331"} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Khoá"><Select defaultValue="cccd"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cccd">CCCD</SelectItem><SelectItem value="eid">Mã nhân viên</SelectItem></SelectContent></Select></Field>
            <Field label="Dự phòng"><Select defaultValue="eid"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="eid">Mã nhân viên</SelectItem><SelectItem value="none">Không dùng</SelectItem></SelectContent></Select></Field>
          </div>
          <div className="rounded-md border-2 border-dashed p-4 text-center text-muted-foreground">Kéo thả file .xlsx hoặc .csv, hoặc chọn file</div>
          <p className="rounded-md bg-primary/10 p-3">Sẽ thêm <b>3 từ HRIS</b> và <b>2 từ danh sách dán</b>, bỏ qua 1 dòng không ghép được.</p>
          <div className="flex justify-end gap-2"><Button asChild variant="outline" className="h-11"><Link href={`/sheets/${id}`}>Huỷ</Link></Button><Button asChild className="h-11"><Link href={`/sheets/${id}`}>Thêm 5 người</Link></Button></div>
        </CardContent></Card>
      </section>
    </div>
  );
}
