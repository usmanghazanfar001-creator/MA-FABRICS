import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <main className="px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
