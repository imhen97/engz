import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  // Check if user has admin role
  try {
    const user = (await prisma.user.findUnique({
      where: { id: session.user.id },
    })) as any;

    if (!user || user.role !== "admin") {
      redirect("/admin/login?error=unauthorized");
    }
  } catch (error) {
    console.error("Admin role check error:", error);
    redirect("/admin/login?error=database_error");
  }

  return (
    <SessionProviderWrapper>
      <div className="flex min-h-screen bg-[#FFF8F4]">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Topbar />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
