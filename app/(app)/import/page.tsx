import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field, PageHeader } from "@/components/page-header";
import { Stepper } from "./stepper";
import { imports } from "@/lib/mock";

export default function ImportStartPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Import dữ liệu" description="Bước 1" />
      <Stepper current={0} />
      <section className="grid items-start gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card><CardContent className="space-y-4 pt-6">
          <h2 className="font-semibold">Chọn file</h2>
          <div className="rounded-xl border-2 border-dashed p-10 text-center text-muted-foreground">Kéo thả file .xlsx hoặc .csv vào đây, hoặc chọn file</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nguồn dữ liệu"><Select defaultValue="ver"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["VER", "HRIS", "DECL", "OTHER"].map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Mẫu ánh xạ (tuỳ chọn)"><Select defaultValue="m1"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="m1">VER – VCB hàng tháng</SelectItem><SelectItem value="new">Tạo mẫu mới</SelectItem></SelectContent></Select></Field>
          </div>
          <div className="flex justify-end"><Button asChild className="h-11"><Link href="/import/preview">Tiếp tục</Link></Button></div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <h2 className="mb-2 font-semibold">Import gần đây</h2>
          <Table>
            <TableHeader><TableRow><TableHead>File</TableHead><TableHead>Nguồn</TableHead><TableHead>Kết quả</TableHead><TableHead>Ngày</TableHead></TableRow></TableHeader>
            <TableBody>{imports.map((i) => <TableRow key={i.file}><TableCell>{i.file}</TableCell><TableCell className="font-semibold">{i.source}</TableCell><TableCell>{i.result}</TableCell><TableCell>{i.date}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent></Card>
      </section>
    </div>
  );
}
