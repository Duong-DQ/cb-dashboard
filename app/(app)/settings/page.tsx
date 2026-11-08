import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";

const groups = [["HRIS", 100, true], ["C&B đã xác thực", 90, true], ["Nguồn đối chiếu khác", 80, true], ["NLĐ tự kê khai", 10, false]] as const;
const mappings = [
  ["VER – VCB hàng tháng", "VER", "VCB", "CCCD / Mã NV", "flag_conflict"],
  ["HRIS – nhân sự và tài khoản", "HRIS", "Nhân sự, VCB", "CCCD / Mã NV", "overwrite"],
  ["DECL – form kê khai", "DECL", "VCB, MST, BHXH", "CCCD / Mã NV", "overwrite"],
  ["OTHER – MST từ email", "OTHER", "MST", "CCCD", "flag_conflict"],
];
const rules = [["overwrite", "Ghi đè"], ["flag_conflict", "Gắn cờ xung đột"], ["skip_existing", "Bỏ qua nếu có"]];

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Nhóm nguồn và độ tin cậy</CardTitle><p className="text-xs text-muted-foreground">Giá trị hiệu lực lấy từ nhóm có độ tin cậy cao nhất được phép.</p></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nhóm nguồn</TableHead><TableHead>Độ tin cậy</TableHead><TableHead>Được làm giá trị hiệu lực</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{groups.map(([n, t, ok]) => <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{t}</TableCell><TableCell><StatusBadge status={ok ? "green" : "red"} label={ok ? "Có" : "Không, chỉ đối chiếu"} /></TableCell><TableCell><Button variant="link" className="h-11">Sửa</Button></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between"><div><CardTitle className="text-base">Mẫu ánh xạ import</CardTitle><p className="text-xs text-muted-foreground">Mỗi mẫu gồm nguồn, loại đích, khoá, quy tắc upsert và cột → trường.</p></div><Button variant="outline" className="h-11">+ Mẫu mới</Button></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Tên mẫu</TableHead><TableHead>Nguồn</TableHead><TableHead>Loại đích</TableHead><TableHead>Khoá / dự phòng</TableHead><TableHead>Quy tắc upsert</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{mappings.map(([n, s, d, k, r]) => (
              <TableRow key={n}><TableCell>{n}</TableCell><TableCell>{s}</TableCell><TableCell>{d}</TableCell><TableCell>{k}</TableCell>
                <TableCell><Select defaultValue={r}><SelectTrigger className="h-11 w-44" aria-label={`Quy tắc ${n}`}><SelectValue /></SelectTrigger><SelectContent>{rules.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></TableCell>
                <TableCell><Button variant="link" className="h-11">Sửa cột</Button></TableCell></TableRow>
            ))}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
