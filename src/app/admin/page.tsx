import { redirect } from "next/navigation";
import AdminGuestbookDashboard from "@/components/AdminGuestbookDashboard";
import { getAdminSession } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminGuestbookDashboard username={session.username} />;
}
