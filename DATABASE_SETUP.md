# 데이터베이스 설정 가이드

## 문제: 테이블이 존재하지 않음

에러 메시지:
```
The table `public.Account` does not exist in the current database.
```

## 해결 방법

### 방법 1: Vercel에서 자동 마이그레이션 (권장)

`package.json`의 `build` 스크립트가 이미 `prisma migrate deploy`를 포함하도록 설정되어 있습니다.

**확인 사항:**
1. Vercel에 `DATABASE_URL` 환경 변수가 설정되어 있는지 확인
2. 다음 배포 시 자동으로 마이그레이션이 실행됩니다

### 방법 2: 수동으로 마이그레이션 실행

#### 로컬에서 마이그레이션 생성 및 적용

```bash
# 1. 마이그레이션 파일 생성
pnpm prisma migrate dev --name init

# 2. 프로덕션 데이터베이스에 적용
pnpm prisma migrate deploy
```

#### 또는 Prisma Studio로 확인

```bash
pnpm prisma studio
```

### 방법 3: Vercel CLI로 마이그레이션 실행

```bash
# Vercel CLI 설치 (이미 설치되어 있다면 생략)
npm i -g vercel

# Vercel에 로그인
vercel login

# 프로젝트 연결
vercel link

# 마이그레이션 실행
vercel env pull .env.local
pnpm prisma migrate deploy
```

### 방법 4: Vercel Build Command 수정

Vercel 대시보드에서:
1. Settings → Build & Development Settings
2. Build Command를 다음으로 변경:
   ```
   pnpm prisma migrate deploy && pnpm build
   ```

## 필요한 환경 변수

Vercel에 다음 환경 변수가 설정되어 있어야 합니다:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

## 마이그레이션 확인

마이그레이션이 성공적으로 실행되었는지 확인:

```bash
# 로컬에서
pnpm prisma migrate status

# 또는 Prisma Studio로 테이블 확인
pnpm prisma studio
```

## 예상되는 테이블

마이그레이션 후 다음 테이블이 생성되어야 합니다:
- `User`
- `Account` (NextAuth용)
- `Session` (NextAuth용)
- `VerificationToken` (NextAuth용)
- `Course`
- `Lesson`
- `Enrollment`
- `FeedbackSession`
- `WeeklyReport`

## 문제 해결

### 마이그레이션이 실패하는 경우

1. **데이터베이스 연결 확인**
   ```bash
   pnpm prisma db pull
   ```

2. **스키마 동기화**
   ```bash
   pnpm prisma db push
   ```
   ⚠️ 주의: `db push`는 프로덕션에서는 사용하지 마세요. 개발 환경에서만 사용하세요.

3. **마이그레이션 리셋 (주의: 데이터 삭제됨)**
   ```bash
   pnpm prisma migrate reset
   ```

### Vercel 빌드 로그 확인

Vercel 대시보드 → 프로젝트 → Deployments → 최신 배포 → Build Logs에서:
- `prisma migrate deploy` 명령이 실행되는지 확인
- 에러 메시지가 있는지 확인

