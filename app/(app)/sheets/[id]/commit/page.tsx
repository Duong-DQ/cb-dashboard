import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { conflicts } from "@/lib/mock";

const options = [["existing", "Giữ giá trị hiện có"], ["incoming", "Dùng giá trị từ sheet"], ["manual", "Nhập tay"]] as const;

export default async function CommitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const done = conflicts.filter((c) => c.pick).length;
  return (
    <div className="space-y-4">
      <PageHeader title="Xử lý xung đột khi commit" description="Leaver payroll - đợt 3 T10" />
      <section className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card><CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <div className="w-64 max-w-full"><b className="text-sm">Đã xử lý {done} / {conflicts.length} xung đột</b><Progress className="mt-2" value={(done / conflicts.length) * 100} /></div>
            <div className="flex flex-wrap gap-2"><Button variant="outline" className="h-11">Giữ hiện có cho tất cả</Button><Button variant="outline" className="h-11">Dùng từ sheet cho tất cả</Button></div>
          </CardContent></Card>
          {conflicts.map((c) => (
            <Card key={c.eid}><CardContent className="space-y-3 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p><b>{c.name}</b> <span className="text-xs text-muted-foreground">· {c.eid} · khoá CCCD · Tài khoản VCB</span></p>
                <StatusBadge status={c.pick ? "green" : "orange"} label={c.pick ? "Đã xử lý" : "Chưa xử lý"} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-orange-50 p-3"><p className="text-xs text-muted-foreground">Hiện có trong Xác thực</p><p className="mt-1 text-lg font-bold">{c.existing}</p><p className="text-xs text-muted-foreground">Cập nhật gần nhất 02/11 qua import</p></div>
                <div className="rounded-md border bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Từ working sheet</p><p className="mt-1 text-lg font-bold">{c.incoming}</p><p className="text-xs text-muted-foreground">Lấy từ HRIS ngày 05/11</p></div>
              </div>
              <RadioGroup defaultValue={c.pick ?? undefined} className="flex flex-wrap gap-4">
                {options.map(([v, l]) => <div key={v} className="flex min-h-11 items-center gap-2"><RadioGroupItem value={v} id={`${c.eid}-${v}`} /><Label htmlFor={`${c.eid}-${v}`} className="font-normal">{l}</Label></div>)}
              </RadioGroup>
              <Input aria-label="Ghi chú xử lý" placeholder="Lý do chọn giá trị này" className="h-11" />
            </CardContent></Card>
          ))}
        </div>
        <Card className="lg:sticky lg:top-4"><CardContent className="space-y-3 pt-6 text-sm">
          <h2 className="font-semibold">Tóm tắt commit</h2>
          <p className="text-xs text-muted-foreground">Đích: Xác thực · loại VCB</p>
          <dl className="space-y-1.5">
            {[["Ghi mới", "6"], ["Không đổi (đã khớp)", "39"], ["Xung đột đã chọn", String(done)]].map(([k, v]) => <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-bold">{v}</dd></div>)}
            <div className="flex justify-between text-orange-800"><dt>Xung đột chưa chọn</dt><dd className="font-bold">{conflicts.length - done}</dd></div>
          </dl>
          <p className="text-xs text-muted-foreground">Mọi thay đổi được ghi vào lịch sử dữ liệu và có thể xem lại theo từng nhân viên.</p>
          <Button disabled className="h-11 w-full">Commit (còn {conflicts.length - done} xung đột)</Button>
          <Button asChild variant="outline" className="h-11 w-full"><Link href={`/sheets/${id}`}>Quay lại sheet</Link></Button>
        </CardContent></Card>
      </section>
    </div>
  );
}
