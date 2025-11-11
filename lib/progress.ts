import prisma from "./prisma";

export async function startDefaultCourseForUser(userId: string) {
  const course = await prisma.course.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!course) {
    return;
  }

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    update: {
      currentWeek: 1,
      currentDay: 1,
      isCompleted: false,
    },
    create: {
      userId,
      courseId: course.id,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentCourseId: course.id,
    },
  });
}
