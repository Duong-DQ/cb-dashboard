import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import type { Status } from "@/lib/mock";

type Emp = { eid: string; name: string; pid: string; dept: string; vcb: Status; tax: Status; ss: Status };

// Giá trị theo nguồn lấy từ v_c_status; hiện là dữ liệu mẫu.
const values: Record<string, { label: string; key: "vcb" | "tax" | "ss"; rows: [string, string][]; effective: string }> = {
  vcb: { label: "Tài khoản VCB", key: "vcb", rows: [["HRIS", "0071••••455"], ["Xác thực", "0071••••612"], ["Kê khai", "—"]], effective: "0071••••455 (HRIS)" },
  tax: { label: "Mã số thuế", key: "tax", rows: [["HRIS", "—"], ["Xác thực", "8012••••34"], ["Kê khai", "8012••••34"]], effective: "8012••••34 (Xác thực)" },
  ss: { label: "Số BHXH", key: "ss", rows: [["HRIS", "7922••••01"], ["Xác thực", "7922••••01"], ["Kê khai", "7922••••01"]], effective: "7922••••01 (HRIS)" },
};

export function EmployeeDetail({ employee }: { employee: Emp }) {
  return (
    <Card className="xl:sticky xl:top-4"><CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{employee.name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{employee.eid} · CCCD {employee.pid}</p>
        </div>
        <Button asChild variant="outline" className="h-11"><Link href="/employees/new">Sửa</Link></Button>
      </div>
      <p className="mt-2 text-sm">{employee.dept}</p>
      <h3 className="mt-4 text-sm font-semibold">Dữ liệu C&amp;B</h3>
      {Object.values(values).map((d) => (
        <div key={d.key} className="border-t py-3">
          <div className="flex items-center justify-between"><b className="text-sm">{d.label}</b><StatusBadge status={employee[d.key]} /></div>
          {d.rows.map(([src, v]) => (
            <div key={src} className="flex items-center justify-between text-sm">
              <span className="w-20 text-muted-foreground">{src}</span>
              <span className={v === "—" ? "flex-1 text-muted-foreground" : "flex-1"}>{v}</span>
              <Button asChild variant="link" className="h-11"><Link href={`/employees/${employee.eid}/edit?type=${d.key}`}>{v === "—" ? "Thêm" : "Sửa"}</Link></Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Hiệu lực: <b className="text-foreground">{d.effective}</b></p>
        </div>
      ))}
      <Link href="#" className="text-sm font-semibold text-primary">Xem lịch sử thay đổi</Link>
    </CardContent></Card>
  );
}
