import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";

const users = [["Người dùng A", "a@example.com", "Quản trị", "blue", "08/11", "Hoạt động"], ["Người dùng B", "b@example.com", "C&B", "green", "07/11", "Hoạt động"], ["Người dùng C", "c@example.com", "Chỉ xem", "neutral", "—", "Đã mời"]] as const;
const perms = [["Xem dữ liệu", "Có", "Có", "Có"], ["Import", "Có", "Có", "Không"], ["Sửa dữ liệu", "Có", "Có", "Không"], ["Commit về nguồn", "Có", "Có", "Không"], ["Xoá", "Có", "Không", "Không"], ["Cài đặt", "Có", "Không", "Không"]];

export default function UsersSettingsPage() {
  return (
    <section className="grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Card><CardContent className="pt-6">
        <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Người dùng</h2><Button variant="outline" className="h-11">+ Mời người dùng</Button></div>
        <Table>
          <TableHeader><TableRow><TableHead>Tên</TableHead><TableHead>Email</TableHead><TableHead>Vai trò</TableHead><TableHead>Đăng nhập cuối</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
          <TableBody>{users.map(([n, e, r, t, d, s]) => <TableRow key={e}><TableCell>{n}</TableCell><TableCell>{e}</TableCell><TableCell><StatusBadge status={t} label={r} /></TableCell><TableCell>{d}</TableCell><TableCell>{s}</TableCell></TableRow>)}</TableBody>
        </Table>
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h2 className="mb-2 font-semibold">Quyền theo vai trò</h2>
        <Table>
          <TableHeader><TableRow><TableHead>Quyền</TableHead><TableHead>Quản trị</TableHead><TableHead>C&B</TableHead><TableHead>Chỉ xem</TableHead></TableRow></TableHeader>
          <TableBody>{perms.map(([p, ...v]) => <TableRow key={p}><TableCell>{p}</TableCell>{v.map((x, i) => <TableCell key={i}>{x}</TableCell>)}</TableRow>)}</TableBody>
        </Table>
      </CardContent></Card>
    </section>
  );
}
