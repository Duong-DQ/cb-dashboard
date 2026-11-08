import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field, PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Stepper } from "../stepper";

const mapping = [["CCCD", "pid (cccd)", "Khoá chính"], ["Mã NV", "eid", "Khoá dự phòng"], ["Số TK VCB", "BANK_VCB.vcb_account", "Giá trị"], ["Ghi chú", "Bỏ qua", "Không import"]];
const summary = [["301", "Mới", "blue"], ["52", "Cập nhật", "green"], ["15", "Xung đột", "orange"], ["12", "Không ghép được", "red"]] as const;
const preview = [["Nguyễn Văn A", "0010••••1234", "0071••••890", "Mới", "blue"], ["Trần Thị B", "0010••••5678", "0071••••455", "Cập nhật", "green"], ["Lê Văn C", "0010••••9012", "0071••••302", "Xung đột", "orange"], ["—", "0010••••3456", "0071••••118", "Không ghép được", "red"]] as const;
const rules = [["overwrite", "Ghi đè giá trị cũ"], ["skip_existing", "Bỏ qua nếu đã có"], ["flag_conflict", "Giữ giá trị cũ, gắn cờ xung đột"]];

export default function ImportPreviewPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Import dữ liệu" description="Bước 4 trên 4" />
      <Stepper current={3} />
      <section className="grid items-start gap-4 lg:grid-cols-[1fr_2fr]">
        <Card><CardContent className="space-y-4 pt-6">
          <h2 className="font-semibold">Cấu hình import</h2>
          <div className="rounded-md border border-dashed p-3 text-sm"><b>ver_vcb_thang11.xlsx</b><p className="text-muted-foreground">380 dòng · 4 cột · Sheet1</p></div>
          <Field label="Nguồn dữ liệu"><Select defaultValue="ver"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["VER", "HRIS", "DECL", "OTHER"].map((s) => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}</SelectContent></Select></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Khoá chính"><Select defaultValue="cccd"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cccd">CCCD</SelectItem><SelectItem value="eid">Mã NV</SelectItem></SelectContent></Select></Field>
            <Field label="Dự phòng"><Select defaultValue="eid"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="eid">Mã NV</SelectItem><SelectItem value="none">Không dùng</SelectItem></SelectContent></Select></Field>
          </div>
          <fieldset><legend className="text-sm font-medium">Loại dữ liệu đích</legend>
            {["Tài khoản VCB", "Tài khoản ngân hàng khác", "Mã số thuế", "Số BHXH"].map((t, i) => <Label key={t} className="flex min-h-11 items-center gap-2 font-normal"><Checkbox defaultChecked={i === 0} />{t}</Label>)}
          </fieldset>
          <fieldset><legend className="text-sm font-medium">Quy tắc upsert</legend>
            <RadioGroup defaultValue="flag_conflict">{rules.map(([v, l]) => <div key={v} className="flex min-h-11 items-center gap-2"><RadioGroupItem value={v} id={v} /><Label htmlFor={v} className="font-normal">{l}</Label></div>)}</RadioGroup>
            <p className="text-xs text-muted-foreground">Mặc định lấy từ Cài đặt, có thể đổi cho lần import này.</p>
          </fieldset>
        </CardContent></Card>
        <div className="space-y-4">
          <Card><CardContent className="pt-6">
            <h2 className="mb-2 font-semibold">Ánh xạ cột</h2>
            <Table>
              <TableHeader><TableRow><TableHead>Cột trong file</TableHead><TableHead>Trường hệ thống</TableHead><TableHead>Vai trò</TableHead></TableRow></TableHeader>
              <TableBody>{mapping.map(([a, b, c]) => <TableRow key={a}><TableCell>{a}</TableCell><TableCell className="font-semibold">{b}</TableCell><TableCell className="text-muted-foreground">{c}</TableCell></TableRow>)}</TableBody>
            </Table>
          </CardContent></Card>
          <Card><CardContent className="space-y-3 pt-6">
            <h2 className="font-semibold">Xem trước kết quả</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{summary.map(([v, l, s]) => <div key={l} className="rounded-md border p-2"><p className="text-2xl font-bold">{v}</p><StatusBadge status={s} label={l} /></div>)}</div>
            <Table>
              <TableHeader><TableRow><TableHead>Họ tên</TableHead><TableHead>CCCD</TableHead><TableHead>Số TK VCB</TableHead><TableHead>Kết quả</TableHead></TableRow></TableHeader>
              <TableBody>{preview.map(([n, c, v, l, s]) => <TableRow key={c}><TableCell>{n}</TableCell><TableCell>{c}</TableCell><TableCell>{v}</TableCell><TableCell><StatusBadge status={s} label={l} /></TableCell></TableRow>)}</TableBody>
            </Table>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Dòng không ghép được người sẽ bị bỏ qua. 15 xung đột chuyển sang hàng chờ xử lý.</p>
              <div className="flex gap-2"><Button asChild variant="outline" className="h-11"><Link href="/import">Quay lại</Link></Button><Button asChild className="h-11"><Link href="/">Import 368 dòng</Link></Button></div>
            </div>
          </CardContent></Card>
        </div>
      </section>
    </div>
  );
}
