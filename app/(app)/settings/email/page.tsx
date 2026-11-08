import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/page-header";

const templates = [["Nhắc bổ sung tài khoản", "Dùng cho trạng thái Thiếu", true], ["Nhắc kê khai onboard", "Dùng cho sheet onboard", false]] as const;

export default function EmailSettingsPage() {
  return (
    <section className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
      <Card><CardContent className="space-y-2 pt-6">
        <h2 className="font-semibold">Mẫu email</h2>
        {templates.map(([n, d, on]) => (
          <div key={n} className={`rounded-md border p-3 text-sm font-semibold ${on ? "border-primary bg-primary/5 text-primary" : ""}`}>{n}<p className="text-xs font-normal text-muted-foreground">{d}</p></div>
        ))}
        <Button variant="outline" className="h-11">+ Mẫu mới</Button>
      </CardContent></Card>
      <Card><CardContent className="space-y-3 pt-6">
        <h2 className="font-semibold">Soạn mẫu</h2>
        <p className="text-xs text-muted-foreground">Biến: [Họ tên], [Mã NV], [Loại dữ liệu còn thiếu], [Link kê khai]</p>
        <Field label="Tên mẫu"><Input className="h-11" defaultValue="Nhắc bổ sung tài khoản" /></Field>
        <Field label="Tiêu đề"><Input className="h-11" defaultValue="Bổ sung thông tin tài khoản ngân hàng" /></Field>
        <Field label="Nội dung"><Textarea rows={8} defaultValue={"Chào [Họ tên] ([Mã NV]),\n\nPhòng C&B còn thiếu thông tin: [Loại dữ liệu còn thiếu].\nBạn vui lòng bổ sung tại [Link kê khai].\n\nCảm ơn bạn."} /></Field>
        <div className="flex justify-end gap-2"><Button variant="outline" className="h-11">Gửi thử cho tôi</Button><Button className="h-11">Lưu mẫu</Button></div>
      </CardContent></Card>
    </section>
  );
}
