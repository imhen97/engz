# 🚀 데이터베이스 마이그레이션 실행 가이드

## 현재 상황
- 데이터베이스에 테이블이 없어서 로그인 오류 발생
- `Account` 테이블이 존재하지 않음

## 해결 방법

### 방법 1: Vercel에서 직접 마이그레이션 실행 (가장 빠름)

#### Step 1: Vercel CLI 설치 및 로그인
```bash
npm i -g vercel
vercel login
```

#### Step 2: 프로젝트 연결
```bash
cd "/Users/haenakim/잉즈"
vercel link
```

#### Step 3: 환경 변수 가져오기
```bash
vercel env pull .env.local
```

#### Step 4: 마이그레이션 실행
```bash
pnpm prisma migrate deploy
```

### 방법 2: Vercel 대시보드에서 Build Command 수정

1. Vercel 대시보드 접속
2. 프로젝트 선택 → Settings → Build & Development Settings
3. Build Command를 다음으로 변경:
   ```
   pnpm prisma migrate deploy && pnpm build
   ```
4. 저장 후 재배포

### 방법 3: 수동으로 마이그레이션 파일 생성 후 배포

#### Step 1: 로컬에서 마이그레이션 파일 생성
```bash
# DATABASE_URL을 임시로 설정 (로컬 개발용)
export DATABASE_URL="your-local-db-url"
pnpm prisma migrate dev --name init
```

#### Step 2: 생성된 마이그레이션 파일 커밋
```bash
git add prisma/migrations
git commit -m "Add initial database migration"
git push
```

#### Step 3: Vercel에서 자동 배포
- GitHub에 푸시하면 Vercel이 자동으로 배포
- `package.json`의 `build` 스크립트에 `prisma migrate deploy`가 포함되어 있으므로 자동 실행됨

## 확인 방법

### Vercel 로그에서 확인
1. Vercel 대시보드 → 프로젝트 → Deployments
2. 최신 배포 클릭 → Build Logs
3. 다음 메시지 확인:
   - `✅ Applied migration` (성공)
   - `❌ Migration failed` (실패)

### 데이터베이스에서 직접 확인
```sql
-- PostgreSQL에서 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

다음 테이블이 있어야 합니다:
- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Course`
- `Lesson`
- `Enrollment`
- `FeedbackSession`
- `WeeklyReport`

## 문제 해결

### 마이그레이션이 실패하는 경우

1. **DATABASE_URL 확인**
   - Vercel → Settings → Environment Variables
   - `DATABASE_URL`이 올바른 형식인지 확인: `postgresql://user:password@host:port/database`

2. **데이터베이스 연결 확인**
   ```bash
   pnpm prisma db pull
   ```

3. **마이그레이션 리셋 (주의: 데이터 삭제)**
   ```bash
   pnpm prisma migrate reset
   pnpm prisma migrate deploy
   ```

## 다음 단계

마이그레이션이 성공하면:
1. 로그인 다시 시도
2. Vercel 로그에서 `✅` 메시지 확인
3. 로그인 성공 시 `/pricing` 또는 `/dashboard`로 리다이렉트되는지 확인

