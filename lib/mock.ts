export type Status = "match" | "conflict" | "pending" | "hris_only" | "missing";

export const statusLabel: Record<Status, string> = {
  match: "Khớp",
  conflict: "Lệch HRIS",
  pending: "Chờ push",
  hris_only: "Chỉ có HRIS",
  missing: "Thiếu",
};

export const domainSummary = [
  { id: "BANK_VCB", label: "Tài khoản VCB", counts: { match: 8420, conflict: 96, pending: 310, hris_only: 540, missing: 634 } },
  { id: "TAX", label: "Mã số thuế", counts: { match: 7980, conflict: 142, pending: 520, hris_only: 690, missing: 668 } },
  { id: "SS", label: "Số BHXH", counts: { match: 9010, conflict: 58, pending: 180, hris_only: 410, missing: 342 } },
] as { id: string; label: string; counts: Record<Status, number> }[];

export const tasks = [
  { title: "Gửi email nhắc bổ sung", detail: "1,644 mục thiếu cả HRIS và xác thực", action: "Gửi email", href: "/employees" },
  { title: "Push HCP", detail: "1,010 mục đã xác thực, chưa có trên HRIS", action: "Xuất file", href: "/employees" },
  { title: "Update HCP", detail: "296 mục lệch giữa HRIS và xác thực", action: "Xem danh sách", href: "/employees" },
  { title: "Xung đột import", detail: "23 mục chờ chọn giá trị", action: "Xử lý", href: "/sheets/1/commit" },
];

export const imports = [
  { file: "hris_2026-11-05.xlsx", source: "HRIS", result: "10,012 dòng · 0 xung đột", date: "05/11", warn: false },
  { file: "decl_form_tuan45.csv", source: "DECL", result: "214 dòng · 0 xung đột", date: "07/11", warn: false },
  { file: "ver_vcb_thang11.xlsx", source: "VER", result: "380 dòng · 12 không ghép được", date: "07/11", warn: false },
  { file: "other_mst_email.xlsx", source: "OTHER", result: "66 dòng · 23 xung đột", date: "08/11", warn: true },
];

export const sheets = [
  { id: "1", name: "Leaver payroll - đợt 3 T10", note: "Nghỉ việc 16–25/10", count: 48, progress: 81, updated: "08/11", open: true },
  { id: "2", name: "Onboard tháng 11", note: "Theo dõi kê khai", count: 214, progress: 67, updated: "07/11", open: true },
  { id: "3", name: "Lương tháng 11/2026", note: "Cả công ty", count: 10000, progress: 84, updated: "05/11", open: true },
  { id: "4", name: "Leaver payroll - đợt 2 T10", note: "Nghỉ việc 6–15/10", count: 52, progress: 100, updated: "20/10", open: false },
  { id: "5", name: "Leaver payroll - đợt 1 T10", note: "Nghỉ việc 1–5/10", count: 31, progress: 100, updated: "10/10", open: false },
  { id: "6", name: "Onboard tháng 10", note: "Theo dõi kê khai", count: 187, progress: 100, updated: "12/10", open: false },
];

export const employees = [
  { eid: "E10231", name: "Nguyễn Văn A", pid: "0010••••1234", dept: "Phòng ban A", vcb: "match", tax: "match", ss: "match", working: true },
  { eid: "E10244", name: "Trần Thị B", pid: "0010••••5678", dept: "Phòng ban A", vcb: "conflict", tax: "pending", ss: "match", working: true },
  { eid: "E10260", name: "Lê Văn C", pid: "0010••••9012", dept: "Phòng ban B", vcb: "missing", tax: "missing", ss: "hris_only", working: false },
  { eid: "E10275", name: "Phạm Thị D", pid: "0010••••3456", dept: "Phòng ban B", vcb: "match", tax: "hris_only", ss: "match", working: true },
  { eid: "E10281", name: "Hoàng Văn E", pid: "0010••••7788", dept: "Phòng ban C", vcb: "pending", tax: "missing", ss: "match", working: true },
] as { eid: string; name: string; pid: string; dept: string; vcb: Status; tax: Status; ss: Status; working: boolean }[];

export const sheetRows = [
  { eid: "E10231", name: "Nguyễn Văn A", key: "CCCD", hris: "0071••••890", ver: "0071••••890", decl: "0071••••890", status: "match" },
  { eid: "E10244", name: "Trần Thị B", key: "CCCD", hris: "0071••••455", ver: "0071••••612", decl: "—", status: "conflict" },
  { eid: "E10260", name: "Lê Văn C", key: "CCCD", hris: "—", ver: "—", decl: "0071••••302", status: "missing" },
  { eid: "E10275", name: "Phạm Thị D", key: "Mã NV", hris: "0071••••118", ver: "0071••••118", decl: "—", status: "match" },
  { eid: "E10281", name: "Hoàng Văn E", key: "CCCD", hris: "—", ver: "0071••••774", decl: "—", status: "missing" },
] as { eid: string; name: string; key: string; hris: string; ver: string; decl: string; status: "match" | "conflict" | "missing" }[];

export const conflicts = [
  { eid: "E10302", name: "Nguyễn Thị G", existing: "0071••••221", incoming: "0071••••778", pick: "incoming" },
  { eid: "E10244", name: "Trần Thị B", existing: "0071••••612", incoming: "0071••••455", pick: null },
  { eid: "E10318", name: "Vũ Văn H", existing: "0071••••093", incoming: "0071••••930", pick: null },
] as { eid: string; name: string; existing: string; incoming: string; pick: "existing" | "incoming" | "manual" | null }[];

export const sidebarSheets = sheets.slice(0, 3);
