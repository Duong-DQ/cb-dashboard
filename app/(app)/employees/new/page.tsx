import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, PageHeader } from "@/components/page-header";

export default function NewEmployeePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Thêm nhân viên" description="Hồ sơ cá nhân và đợt làm việc" />
      <section className="grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        <Card><CardContent className="space-y-4 pt-6">
          <h2 className="font-semibold">Thông tin cá nhân</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Họ tên"><Input className="h-11" /></Field>
            <Field label="Tên không dấu"><Input className="h-11" /></Field>
            <Field label="Loại giấy tờ"><Select defaultValue="cccd"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["cccd", "cmnd", "passport", "other"].map((v) => <SelectItem key={v} value={v}>{v.toUpperCase()}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Số giấy tờ"><Input className="h-11" /></Field>
            <Field label="Số điện thoại"><Input className="h-11" /></Field>
            <Field label="Email"><Input type="email" className="h-11" /></Field>
          </div>
          <h2 className="pt-2 font-semibold">Đợt làm việc</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Mã nhân viên"><Input className="h-11" /></Field>
            <Field label="Phòng ban"><Input className="h-11" /></Field>
            <Field label="Loại hình"><Select defaultValue="C01"><SelectTrigger className="h-11"><SelectValue /></SelectTrigger><SelectContent>{["C01", "C02", "C03"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Ngày vào làm"><Input type="date" className="h-11" /></Field>
            <Field label="Ngày nghỉ việc (nếu có)"><Input type="date" className="h-11" /></Field>
          </div>
        </CardContent></Card>
        <Card><CardContent className="space-y-3 pt-6 text-sm">
          <h2 className="font-semibold">Kiểm tra trùng</h2>
          <p className="rounded-md bg-emerald-50 p-3 text-emerald-800">Số giấy tờ này chưa có trong hệ thống.</p>
          <p className="text-muted-foreground">Nếu CCCD đã tồn tại, hệ thống gợi ý thêm đợt làm việc mới cho người cũ (trường hợp quay lại làm). Mỗi người chỉ có một đợt làm việc đang mở.</p>
          <div className="flex justify-end gap-2"><Button asChild variant="outline" className="h-11"><Link href="/employees">Huỷ</Link></Button><Button className="h-11">Lưu nhân viên</Button></div>
        </CardContent></Card>
      </section>
    </div>
  );
}
