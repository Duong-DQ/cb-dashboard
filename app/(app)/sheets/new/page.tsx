import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";

const sources = [
  ["hris", "Lọc từ HRIS", "Tự thêm NLĐ theo ngày nghỉ việc, phòng ban, loại hình"],
  ["paste", "Dán danh sách", "Dán cột CCCD hoặc mã nhân viên từ Excel"],
  ["upload", "Upload file", "Chọn file .xlsx hoặc .csv, ví dụ danh sách onboard"],
  ["empty", "Sheet trống", "Thêm nhân viên sau bằng tìm kiếm hoặc chọn từ HRIS"],
];
const keyOptions = (
  <SelectContent><SelectItem value="cccd">CCCD</SelectItem><SelectItem value="eid">Mã nhân viên</SelectItem></SelectContent>
);

export default function NewSheetPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Tạo working sheet mới" />
      <section className="grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card><CardContent className="space-y-4 pt-6">
          <Field label="Tên working sheet"><Input className="h-11" defaultValue="Leaver payroll - đợt 3 T10" /></Field>
          <Field label="Ghi chú (tuỳ chọn)"><Input className="h-11" placeholder="Ví dụ: lương cuối cho NLĐ nghỉ việc 16–25/10" /></Field>
          <h2 className="pt-2 font-semibold">Nguồn danh sách</h2>
          <RadioGroup defaultValue="hris" className="space-y-2">
            {sources.map(([v, t, d]) => (
              <Label key={v} htmlFor={`src-${v}`} className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value={v} id={`src-${v}`} className="mt-0.5" />
                <span><span className="block font-semibold">{t}</span><span className="block text-xs font-normal text-muted-foreground">{d}</span></span>
              </Label>
            ))}
          </RadioGroup>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Nghỉ việc từ"><Input type="date" className="h-11" defaultValue="2026-10-16" /></Field>
            <Field label="Đến"><Input type="date" className="h-11" defaultValue="2026-10-25" /></Field>
            <Field label="Phòng ban"><Select defaultValue="all"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem></SelectContent></Select></Field>
          </div>
          <h2 className="pt-2 font-semibold">Khoá và đối chiếu</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Khoá nhận diện"><Select defaultValue="cccd"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>{keyOptions}</Select></Field>
            <Field label="Khoá dự phòng"><Select defaultValue="eid"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger>{keyOptions}</Select></Field>
          </div>
          <div className="flex flex-wrap gap-x-4">
            {["HRIS", "Xác thực", "Kê khai"].map((t) => <Label key={t} className="flex min-h-11 items-center gap-2"><Checkbox defaultChecked />{t}</Label>)}
          </div>
          <Label className="flex min-h-11 items-center gap-2"><Checkbox defaultChecked />Tự điền thông tin cá nhân từ HRIS</Label>
        </CardContent></Card>
        <Card className="lg:sticky lg:top-4"><CardContent className="space-y-3 pt-6 text-sm">
          <h2 className="font-semibold">Xem trước danh sách</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["48", "Lọc được"], ["47", "Ghép được người"], ["1", "Bỏ qua"]].map(([v, l]) => <div key={l} className="rounded-md border p-2"><p className="text-xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
          </div>
          {[["Nguyễn Văn A", "E10231", "16/10", "green", "Ghép được"], ["Trần Thị B", "E10244", "18/10", "green", "Ghép được"], ["—", "—", "—", "neutral", "Bỏ qua"]].map(([n, e, d, s, l]) => (
            <div key={n + e} className="flex items-center justify-between gap-2 border-t pt-2"><span>{n} · {e}</span><span className="text-muted-foreground">{d}</span><StatusBadge status={s as "green" | "neutral"} label={l} /></div>
          ))}
          <p className="text-xs text-muted-foreground">Dòng không ghép được người sẽ bị bỏ qua.</p>
          <div className="flex justify-end gap-2"><Button asChild variant="outline" className="h-11"><Link href="/sheets">Huỷ</Link></Button><Button asChild className="h-11"><Link href="/sheets/1">Tạo sheet với 47 người</Link></Button></div>
        </CardContent></Card>
      </section>
    </div>
  );
}
