# Admin Dashboard 배포 가이드

## 🚀 프로덕션 배포 체크리스트

### 1. 코드 커밋 및 푸시

```bash
git add .
git commit -m "Add admin dashboard"
git push origin main
```

### 2. Vercel 자동 배포 확인

- Vercel이 자동으로 배포를 시작합니다
- Vercel 대시보드에서 배포 상태 확인:
  - https://vercel.com/dashboard

### 3. 배포 후 확인사항

#### A. 데이터베이스 마이그레이션

프로덕션 데이터베이스에 `role` 컬럼이 있는지 확인:

**Neon Console에서 실행:**

```sql
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT;
```

#### B. Admin 권한 설정

프로덕션 DB에도 Admin 권한 부여:

```sql
UPDATE "User"
SET "role" = 'admin'
WHERE "email" = 'imhen97@gmail.com';
```

또는 스크립트 사용 (로컬에서 프로덕션 DB 연결):

```bash
# .env에 프로덕션 DATABASE_URL 설정 후
pnpm tsx scripts/set-admin.ts imhen97@gmail.com
```

### 4. 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인:

- `DATABASE_URL` - 프로덕션 데이터베이스 URL
- `NEXTAUTH_SECRET` - 인증 시크릿
- `NEXTAUTH_URL` - `https://www.eng-z.com`
- `STRIPE_SECRET_KEY` - Payments 페이지용
- 기타 필요한 환경 변수들

### 5. 빌드 로그 확인

Vercel 배포 로그에서 오류 확인:

- Build Logs 탭에서 오류 메시지 확인
- 특히 Prisma 관련 오류 확인

### 6. 테스트

배포 완료 후:

1. **로그인 페이지 접속:**

   ```
   https://www.eng-z.com/admin/login
   ```

2. **로그인 테스트:**

   - 이메일: `imhen97@gmail.com`
   - 비밀번호: 아무거나

3. **대시보드 접속 확인:**
   - 로그인 성공 시 `/admin`으로 리다이렉트
   - 대시보드가 정상적으로 표시되는지 확인

## 🔧 문제 해결

### 404 오류

**원인:**

- 배포가 완료되지 않음
- 빌드 실패
- 파일이 인식되지 않음

**해결:**

1. Vercel 대시보드에서 배포 상태 확인
2. 빌드 로그 확인
3. 재배포 시도:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### "관리자 권한이 필요합니다" 오류

**원인:**

- 프로덕션 DB에 role 컬럼이 없음
- 사용자의 role이 "admin"으로 설정되지 않음

**해결:**

1. Neon Console에서 role 컬럼 추가
2. Admin 권한 부여 (위 SQL 실행)

### 빌드 오류

**원인:**

- Prisma Client 생성 실패
- 타입 오류
- 의존성 문제

**해결:**

1. 로컬에서 빌드 테스트:
   ```bash
   pnpm build
   ```
2. 오류 수정 후 재배포

## 📝 배포 후 작업

1. ✅ 프로덕션 DB에 role 컬럼 추가
2. ✅ Admin 권한 부여
3. ✅ 환경 변수 확인
4. ✅ 로그인 테스트
5. ✅ 각 Admin 페이지 테스트

## 🎯 빠른 배포 명령어

```bash
# 1. 변경사항 커밋
git add .
git commit -m "Add admin dashboard"

# 2. 푸시 (Vercel 자동 배포)
git push origin main

# 3. 배포 완료 대기 (약 2-3분)

# 4. 프로덕션 DB 설정
# Neon Console에서 SQL 실행:
# ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT;
# UPDATE "User" SET "role" = 'admin' WHERE "email" = 'imhen97@gmail.com';

# 5. 테스트
# https://www.eng-z.com/admin/login 접속
```
