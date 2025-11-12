# 🔍 마이그레이션 상태 확인 가이드

## 현재 상황

`emailVerified` 필드가 스키마에 추가되었지만, Vercel 프로덕션 데이터베이스에 아직 적용되지 않았을 수 있습니다.

## 확인 사항

### 1. 스키마 확인 ✅

- `prisma/schema.prisma`에 `emailVerified DateTime?` 필드가 있습니다
- NextAuth 표준 형식에 맞춰 필드 순서를 재정렬했습니다

### 2. 마이그레이션 파일 확인 ✅

- `prisma/migrations/1_add_email_verified/migration.sql` 파일이 있습니다
- 내용: `ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);`

### 3. 빌드 스크립트 확인 ✅

- `package.json`의 `build` 스크립트:
  ```json
  "build": "prisma generate && prisma migrate deploy && next build"
  ```

## Vercel 배포 확인

### 배포 로그에서 확인할 내용:

1. **Prisma Client 생성**

   ```
   ✅ Generated Prisma Client
   ```

2. **마이그레이션 적용**

   ```
   ✅ Applied migration 1_add_email_verified
   ```

   또는

   ```
   ✅ Migration applied successfully
   ```

3. **에러가 있는 경우**
   ```
   ❌ Migration failed
   ```
   또는
   ```
   ❌ The table 'public.User' does not exist
   ```

## 문제 해결

### 마이그레이션이 적용되지 않은 경우

1. **Vercel 대시보드 확인**

   - Deployments → 최신 배포 → Build Logs
   - `prisma migrate deploy` 실행 여부 확인

2. **수동으로 마이그레이션 실행** (필요시)

   ```bash
   # 로컬에서 환경 변수 설정 후
   vercel env pull .env.local
   pnpm prisma migrate deploy
   ```

3. **데이터베이스 직접 확인** (PostgreSQL)

   ```sql
   -- User 테이블의 컬럼 확인
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'User';

   -- emailVerified 컬럼이 있는지 확인
   ```

## 예상 결과

마이그레이션이 성공적으로 적용되면:

- ✅ `emailVerified` 컬럼이 `User` 테이블에 추가됨
- ✅ NextAuth가 사용자 생성 시 `emailVerified: null`을 포함할 수 있음
- ✅ `Unknown argument 'emailVerified'` 에러가 사라짐
- ✅ 로그인이 정상적으로 작동함

## 다음 단계

1. **Vercel 배포 완료 대기** (자동 배포 중)
2. **배포 로그 확인** - 마이그레이션 성공 여부 확인
3. **로그인 테스트** - `https://www.eng-z.com/signup`에서 로그인 시도
4. **에러 확인** - 여전히 에러가 발생하면 Vercel 로그에서 상세 내용 확인
