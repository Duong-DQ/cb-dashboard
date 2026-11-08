import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";

// Khớp với bảng domain trong db/schema.sql (data_schema).
const domains = [
  ["BANK_VCB", "Tài khoản VCB", "vcb_account", "10–13 chữ số"],
  ["BANK_OTHER", "Tài khoản ngân hàng khác", "bank_code + bank_account", "Không giới hạn"],
  ["TAX", "Mã số thuế", "tax_code", "10 số, hoặc 10 số + 3 số chi nhánh"],
  ["SS", "Số BHXH", "ss_number", "10 chữ số"],
];

export default function DomainsSettingsPage() {
  return (
    <section className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card><CardContent className="pt-6">
        <h2 className="font-semibold">Loại dữ liệu C&amp;B</h2>
        <p className="mb-2 text-xs text-muted-foreground">Mỗi loại có schema riêng để kiểm tra và chuẩn hoá giá trị.</p>
        <Table>
          <TableHeader><TableRow><TableHead>Mã</TableHead><TableHead>Tên</TableHead><TableHead>Trường khoá</TableHead><TableHead>Định dạng</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{domains.map(([id, n, k, f]) => <TableRow key={id}><TableCell className="font-mono text-xs">{id}</TableCell><TableCell>{n}</TableCell><TableCell>{k}</TableCell><TableCell>{f}</TableCell><TableCell><Button variant="link" className="h-11">Sửa</Button></TableCell></TableRow>)}</TableBody>
        </Table>
      </CardContent></Card>
      <Card><CardContent className="space-y-3 pt-6 text-sm">
        <h2 className="font-semibold">Kiểm tra thử</h2>
        <p className="text-xs text-muted-foreground">Loại: Tài khoản VCB</p>
        <Field label="Giá trị"><Input className="h-11" defaultValue="0071 0000 0045 5" /></Field>
        <p>Sau chuẩn hoá: <b>0071000000455</b> <StatusBadge status="green" label="Hợp lệ" /></p>
        <p className="text-xs text-muted-foreground">Chuẩn hoá: VCB, BHXH chỉ lấy chữ số; MST bỏ khoảng trắng và viết hoa; tài khoản khác ghép mã ngân hàng với số tài khoản.</p>
      </CardContent></Card>
    </section>
  );
}
