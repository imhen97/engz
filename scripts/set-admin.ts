import prisma from "../lib/prisma";

async function setAdminRole() {
  const email = process.argv[2]; // 명령줄에서 이메일 받기

  if (!email) {
    console.error(
      "❌ 사용법: pnpm tsx scripts/set-admin.ts your-email@example.com"
    );
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    console.log("✅ Admin 권한이 부여되었습니다:");
    console.log(`   이름: ${user.name || "(없음)"}`);
    console.log(`   이메일: ${user.email}`);
    console.log(`   역할: ${user.role}`);
  } catch (error: any) {
    if (error.code === "P2025") {
      console.error(
        `❌ 이메일 "${email}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
      console.error("   먼저 일반 회원가입으로 사용자를 생성해주세요.");
    } else {
      console.error("❌ 오류:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
