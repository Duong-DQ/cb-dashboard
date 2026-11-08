import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { Field, PageHeader } from "@/components/page-header";

const types = [["vcb", "Tài khoản VCB"], ["bank", "Tài khoản khác"], ["tax", "Mã số thuế"], ["ss", "Số BHXH"]];

export default async function EditCbPage({ params, searchParams }: { params: Promise<{ eid: string }>; searchParams: Promise<{ type?: string }> }) {
  const { eid } = await params;
  const { type = "vcb" } = await searchParams;
  return (
    <div className="space-y-4">
      <PageHeader title="Sửa dữ liệu C&B" description={`Trần Thị B · ${eid}`} />
      <section className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card><CardContent className="space-y-4 pt-6">
          <fieldset><legend className="mb-1 text-sm font-medium">Loại dữ liệu</legend>
            <RadioGroup defaultValue={type} className="flex flex-wrap gap-4">
              {types.map(([v, l]) => <div key={v} className="flex min-h-11 items-center gap-2"><RadioGroupItem value={v} id={v} /><Label htmlFor={v}>{l}</Label></div>)}
            </RadioGroup>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nguồn"><Select defaultValue="ver"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ver">Xác thực</SelectItem><SelectItem value="decl">Kê khai</SelectItem><SelectItem value="other">Nguồn đối chiếu khác</SelectItem></SelectContent></Select></Field>
            <Field label="Số tài khoản VCB"><Input className="h-11" defaultValue="0071000000455" inputMode="numeric" /></Field>
          </div>
          <p className="text-xs text-muted-foreground">Dữ liệu HRIS chỉ thay đổi qua import. Định dạng: 10–13 chữ số.</p>
          <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">Đúng định dạng · chưa dùng cho người khác</p>
          <Field label="Lý do thay đổi"><Input className="h-11" placeholder="Ví dụ: NLĐ cung cấp lại sổ tài khoản" /></Field>
          <div className="flex justify-end gap-2"><Button asChild variant="outline" className="h-11"><Link href="/employees">Huỷ</Link></Button><Button className="h-11">Lưu thay đổi</Button></div>
        </CardContent></Card>
        <Card><CardContent className="space-y-3 pt-6 text-sm">
          <h2 className="font-semibold">Giá trị hiệu lực sau khi lưu</h2>
          <ul className="space-y-1"><li>HRIS: 0071••••455</li><li><b>Xác thực: 0071••••455</b> (mới)</li><li>Kê khai: —</li></ul>
          <p>Hiệu lực: <b>0071••••455 (HRIS)</b> <StatusBadge status="match" /></p>
          <p className="text-xs text-muted-foreground">Sau khi lưu, Xác thực khớp HRIS nên không cần Update HCP.</p>
        </CardContent></Card>
      </section>
    </div>
  );
}
