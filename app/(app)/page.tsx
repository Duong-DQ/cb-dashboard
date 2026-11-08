import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { StatusBar, StatusLegend } from "@/components/status-bar";
import { StatusBadge } from "@/components/status-badge";
import { domainSummary, imports, tasks } from "@/lib/mock";

const kpis = [
  { label: "Nhân sự đang theo dõi", value: "10,000", sub: "Theo person, chưa xoá" },
  { label: "Khớp HRIS và xác thực", value: "84.4%", sub: "Trung bình 3 loại dữ liệu" },
  { label: "Working sheets đang mở", value: "3", sub: "Onboard · Leaver đợt 3/10 · Lương T11" },
  { label: "Xung đột import chờ xử lý", value: "23", sub: "Từ 1 batch nguồn OTHER" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Tổng quan dữ liệu C&B"
        description="Cập nhật 08/11/2026"
        actions={<><Input aria-label="Tìm nhân viên" placeholder="Tìm tên, CCCD, mã NV (gần đúng)…" className="h-11 w-72" /><Button asChild className="h-11"><Link href="/import">Import file</Link></Button></>}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}><CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{k.label}</p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </CardContent></Card>
        ))}
      </section>
      <section className="grid items-start gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Trạng thái dữ liệu C&amp;B theo loại</CardTitle>
            <StatusLegend />
          </CardHeader>
          <CardContent className="space-y-5">
            {domainSummary.map((d) => (
              <div key={d.id}>
                <div className="mb-2 flex justify-between text-sm"><b>{d.label}</b><span className="text-xs text-muted-foreground">10,000 người</span></div>
                <StatusBar counts={d.counts} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Việc cần làm</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {tasks.map((t) => (
              <div key={t.title} className="flex items-center justify-between gap-3 py-3">
                <div><p className="text-sm font-semibold">{t.title}</p><p className="text-xs text-muted-foreground">{t.detail}</p></div>
                <Button asChild variant="outline" className="h-11"><Link href={t.href}>{t.action}</Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle className="text-base">Import gần đây</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>File</TableHead><TableHead>Nguồn</TableHead><TableHead>Kết quả</TableHead><TableHead className="text-right">Ngày</TableHead></TableRow></TableHeader>
            <TableBody>
              {imports.map((i) => (
                <TableRow key={i.file}>
                  <TableCell>{i.file}</TableCell>
                  <TableCell className="font-semibold">{i.source}</TableCell>
                  <TableCell>{i.warn ? <StatusBadge status="red" label={i.result} /> : i.result}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{i.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
