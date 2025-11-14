# Admin 로그인 가이드

## 🚀 빠른 시작 (3단계)

### 1단계: 데이터베이스에 role 컬럼 추가

**Neon Console에서 실행:**

1. https://console.neon.tech 접속
2. 프로젝트 선택
3. **SQL Editor** 클릭
4. 다음 SQL 실행:

```sql
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT;
```

### 2단계: 본인 계정을 Admin으로 설정

**방법 A: 스크립트 사용 (가장 쉬움) ⭐**

```bash
# 이메일 주소를 본인의 이메일로 변경하세요
pnpm tsx scripts/set-admin.ts your-email@example.com
```

예시:

```bash
pnpm tsx scripts/set-admin.ts haena@engz.com
```

**방법 B: Prisma Studio 사용**

```bash
pnpm prisma studio
```

1. 브라우저에서 `User` 테이블 클릭
2. 본인 계정 찾아서 클릭
3. `role` 필드에 `admin` 입력 (따옴표 없이)
4. "Save 1 change" 클릭

**방법 C: SQL 직접 실행**

Neon Console SQL Editor에서:

```sql
-- 이메일 주소를 본인의 이메일로 변경
UPDATE "User"
SET "role" = 'admin'
WHERE "email" = 'your-email@example.com';
```

### 3단계: Admin 로그인

1. 브라우저에서 `/admin/login` 접속

   - 또는 `http://localhost:3000/admin/login`

2. 로그인 폼 입력:

   - **이메일**: Admin 권한이 설정된 이메일 주소
   - **비밀번호**: 아무거나 입력 가능 (현재는 role만 체크)

3. "로그인" 버튼 클릭

4. 성공하면 `/admin` 대시보드로 이동합니다! 🎉

---

## ⚠️ 중요 사항

### 현재 로그인 방식

현재 구현에서는:

- ✅ **이메일**: Admin 권한이 있는 사용자의 이메일
- ⚠️ **비밀번호**: 아무거나 입력해도 됨 (role만 체크)
- ✅ **권한**: `role = "admin"`인 사용자만 접근 가능

### 향후 개선

보안을 강화하려면:

- `AdminUser` 테이블에 해시된 비밀번호 저장
- bcrypt로 비밀번호 검증
- 비밀번호 재설정 기능

---

## 🔍 문제 해결

### "관리자 권한이 필요합니다" 오류

**원인**: 사용자의 `role`이 `"admin"`으로 설정되지 않음

**해결**:

```bash
# 다시 Admin 권한 설정
pnpm tsx scripts/set-admin.ts your-email@example.com
```

### "사용자를 찾을 수 없습니다" 오류

**원인**: 해당 이메일로 가입한 사용자가 없음

**해결**:

1. 먼저 일반 회원가입으로 사용자 생성
   - `/signup`에서 Google/Kakao로 로그인
2. 그 다음 Admin 권한 부여

### "role 필드가 없습니다" 오류

**원인**: 데이터베이스에 `role` 컬럼이 없음

**해결**:

```sql
-- Neon Console에서 실행
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT;
```

그 다음:

```bash
pnpm prisma generate
```

---

## 📝 체크리스트

로그인 전 확인사항:

- [ ] 데이터베이스에 `role` 컬럼이 있음
- [ ] 본인 계정의 `role`이 `"admin"`으로 설정됨
- [ ] 개발 서버가 실행 중 (`pnpm dev`)
- [ ] `/admin/login` 페이지 접속 가능

---

## 🎯 빠른 테스트

모든 설정이 완료되었다면:

```bash
# 1. 서버 실행 (다른 터미널)
pnpm dev

# 2. Admin 권한 설정
pnpm tsx scripts/set-admin.ts your-email@example.com

# 3. 브라우저에서
# http://localhost:3000/admin/login 접속
```

로그인 성공! 🎉
