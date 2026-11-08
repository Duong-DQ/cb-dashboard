import { PageHeader } from "@/components/page-header";
import { SettingsTabs } from "./settings-tabs";
import { Button } from "@/components/ui/button";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Cài đặt" actions={<Button className="h-11">Lưu thay đổi</Button>} />
      <SettingsTabs />
      {children}
    </div>
  );
}
