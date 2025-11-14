# Admin 역할 설정 가이드

기존 사용자를 Admin으로 만드는 방법을 단계별로 안내합니다.

## 방법 1: Prisma Studio 사용 (가장 쉬움) 🎨

### 1단계: Prisma Studio 실행

```bash
pnpm prisma studio
```

브라우저가 자동으로 열립니다 (보통 `http://localhost:5555`)

### 2단계: User 테이블 열기

1. 왼쪽 사이드바에서 **"User"** 클릭
2. 사용자 목록이 표시됩니다

### 3단계: Admin으로 만들 사용자 선택

1. Admin으로 만들 사용자의 **행(row)** 클릭
2. 또는 우측 상단의 **"Add record"** 버튼으로 새 사용자 생성

### 4단계: role 필드 설정

1. 사용자 상세 페이지에서 **"role"** 필드 찾기
2. 필드에 `admin` 입력 (따옴표 없이)
3. 우측 상단의 **"Save 1 change"** 버튼 클릭

✅ 완료! 이제 이 사용자로 `/admin/login`에 접속할 수 있습니다.

---

## 방법 2: SQL 직접 실행 (빠름) ⚡

### 옵션 A: Neon Console 사용 (권장)

1. **Neon 대시보드 접속**

   - https://console.neon.tech 접속
   - 프로젝트 선택

2. **SQL Editor 열기**

   - 왼쪽 메뉴에서 **"SQL Editor"** 클릭
   - 또는 상단의 **"Query"** 탭

3. **SQL 실행**

   ```sql
   -- 이메일 주소를 본인의 이메일로 변경하세요
   UPDATE "User"
   SET "role" = 'admin'
   WHERE "email" = 'your-email@example.com';
   ```

4. **확인**
   ```sql
   -- Admin 권한이 있는 사용자 확인
   SELECT id, "name", "email", "role"
   FROM "User"
   WHERE "role" = 'admin';
   ```

### 옵션 B: psql 또는 다른 DB 클라이언트 사용

```bash
# DATABASE_URL 환경 변수가 설정되어 있다면
psql $DATABASE_URL

# 또는 직접 연결
psql "postgresql://user:password@host/database"
```

그 다음 SQL 실행:

```sql
UPDATE "User" SET "role" = 'admin' WHERE "email" = 'your-email@example.com';
```

---

## 방법 3: Node.js 스크립트 사용 (프로그래밍 방식) 💻

### 스크립트 생성

`scripts/set-admin.ts` 파일 생성:

```typescript
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
    console.log(`   이름: ${user.name}`);
    console.log(`   이메일: ${user.email}`);
    console.log(`   역할: ${user.role}`);
  } catch (error: any) {
    if (error.code === "P2025") {
      console.error(
        `❌ 이메일 "${email}"에 해당하는 사용자를 찾을 수 없습니다.`
      );
    } else {
      console.error("❌ 오류:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
```

### 실행

```bash
# tsx 설치 (아직 없다면)
pnpm add -D tsx

# 스크립트 실행
pnpm tsx scripts/set-admin.ts your-email@example.com
```

---

## 방법 4: Prisma Client 직접 사용 (개발 중) 🔧

개발 중이라면 임시로 Node.js REPL에서 실행할 수 있습니다:

```bash
node
```

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Admin 권한 부여
prisma.user
  .update({
    where: { email: "your-email@example.com" },
    data: { role: "admin" },
  })
  .then((user) => {
    console.log("✅ Admin 설정 완료:", user);
    prisma.$disconnect();
  });
```

---

## ✅ 확인 방법

Admin 권한이 제대로 설정되었는지 확인:

1. **Prisma Studio에서 확인**

   - Prisma Studio에서 User 테이블 열기
   - 해당 사용자의 `role` 필드가 `admin`인지 확인

2. **로그인 테스트**

   - `/admin/login` 접속
   - 해당 이메일로 로그인 시도
   - 성공하면 `/admin` 대시보드로 리다이렉트됨

3. **SQL로 확인**
   ```sql
   SELECT "email", "role" FROM "User" WHERE "email" = 'your-email@example.com';
   ```

---

## ⚠️ 주의사항

1. **이메일 주소 확인**: 정확한 이메일 주소를 사용하세요 (대소문자 구분 없음)
2. **기존 사용자만**: 새 사용자를 만들려면 먼저 일반 회원가입을 통해 User를 생성한 후 role을 설정하세요
3. **보안**: Admin 권한은 신중하게 부여하세요

---

## 🆘 문제 해결

### "사용자를 찾을 수 없습니다"

- 이메일 주소가 정확한지 확인
- 먼저 일반 회원가입으로 사용자를 생성했는지 확인

### "role 필드가 없습니다"

- 마이그레이션이 실행되었는지 확인:
  ```bash
  pnpm prisma db push
  pnpm prisma generate
  ```

### "권한이 없습니다" 오류

- 브라우저 캐시 삭제
- 로그아웃 후 다시 로그인
- 세션 쿠키 삭제
