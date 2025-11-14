# Admin Dashboard 오류 해결 가이드

## 🔍 일반적인 오류와 해결 방법

### 1. "role 필드가 없습니다" 오류

**증상**: 브라우저 콘솔이나 서버 로그에 "role" 필드를 찾을 수 없다는 오류

**해결 방법**:

#### 방법 A: SQL로 직접 추가 (권장)

1. **Neon Console 접속**

   - https://console.neon.tech 접속
   - 프로젝트 선택
   - SQL Editor 열기

2. **SQL 실행**:

   ```sql
   -- User 테이블에 role 컬럼 추가
   ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT;
   ```

3. **Prisma Client 재생성**:
   ```bash
   pnpm prisma generate
   ```

#### 방법 B: Prisma DB Push 사용

```bash
# 스키마를 데이터베이스에 직접 푸시 (주의: 데이터 손실 가능)
pnpm prisma db push --accept-data-loss
pnpm prisma generate
```

### 2. "관리자 권한이 필요합니다" 오류

**증상**: 로그인은 되지만 `/admin` 접근 시 리다이렉트

**해결 방법**:

1. 사용자의 `role` 필드가 `"admin"`으로 설정되어 있는지 확인
2. Prisma Studio에서 확인:
   ```bash
   pnpm prisma studio
   ```
3. 또는 스크립트로 설정:
   ```bash
   pnpm tsx scripts/set-admin.ts your-email@example.com
   ```

### 3. 데이터베이스 연결 오류

**증상**: "Database connection failed" 또는 Prisma 오류

**해결 방법**:

1. `.env` 파일에서 `DATABASE_URL` 확인
2. 데이터베이스 연결 테스트:
   ```bash
   pnpm prisma db pull
   ```

### 4. Prisma Client 타입 오류

**증상**: TypeScript 컴파일 오류

**해결 방법**:

```bash
# Prisma Client 재생성
pnpm prisma generate

# TypeScript 서버 재시작 (VS Code)
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### 5. 미들웨어 무한 리다이렉트

**증상**: `/admin/login`과 `/admin` 사이를 계속 리다이렉트

**해결 방법**:

1. 브라우저 쿠키 삭제
2. 세션 확인:
   ```bash
   # 개발 서버 재시작
   # 브라우저 캐시 삭제
   ```

## 🛠 단계별 점검 체크리스트

### 1단계: 데이터베이스 스키마 확인

```sql
-- Neon Console에서 실행
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'User' AND column_name = 'role';
```

결과가 없으면:

```sql
ALTER TABLE "User" ADD COLUMN "role" TEXT;
```

### 2단계: Prisma Client 재생성

```bash
pnpm prisma generate
```

### 3단계: 개발 서버 재시작

```bash
# 서버 중지 (Ctrl+C)
pnpm dev
```

### 4단계: Admin 권한 설정

```bash
# 이메일 주소를 본인의 이메일로 변경
pnpm tsx scripts/set-admin.ts your-email@example.com
```

### 5단계: 브라우저 테스트

1. `/admin/login` 접속
2. 이메일 입력 (비밀번호는 아무거나 - 현재는 role만 체크)
3. 로그인 시도

## 🐛 디버깅 팁

### 서버 로그 확인

개발 서버 터미널에서 오류 메시지 확인:

- Prisma 오류: 데이터베이스 스키마 문제
- NextAuth 오류: 인증 설정 문제
- 미들웨어 오류: 권한 체크 문제

### 브라우저 콘솔 확인

F12 -> Console 탭에서:

- 네트워크 오류
- JavaScript 오류
- API 응답 오류

### 데이터베이스 직접 확인

```sql
-- Neon Console에서 실행
SELECT id, email, name, role FROM "User" LIMIT 10;
```

## 📞 추가 도움이 필요한 경우

오류 메시지를 복사해서 알려주시면 더 정확한 해결책을 제시할 수 있습니다:

1. 브라우저 콘솔 오류
2. 서버 터미널 오류
3. 어떤 페이지에서 오류가 발생하는지
