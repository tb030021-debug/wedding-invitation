import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="section-panel w-full max-w-md">
        <div className="mb-7 space-y-2 text-center">
          <p className="section-kicker">Admin</p>
          <h1 className="section-title">관리자 로그인</h1>
          <p className="text-sm leading-6 text-ink/60">방명록 메시지를 관리하려면 로그인해 주세요.</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
