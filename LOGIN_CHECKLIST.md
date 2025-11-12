# ✅ 로그인 작동 확인 체크리스트

## .env.local 파일과 프로덕션의 관계

**중요**: `.env.local` 파일은 **로컬 개발 환경**에서만 사용됩니다.
- 프로덕션 (Vercel)에서는 **Vercel 대시보드에 설정된 환경 변수**를 사용합니다
- `.env.local` 파일이 있어도 프로덕션에는 영향을 주지 않습니다

## 로그인이 작동하려면 필요한 것들

### 1. ✅ 데이터베이스 마이그레이션 완료
- [ ] Vercel 배포 로그에서 `✅ Applied migration` 또는 `Migration applied` 메시지 확인
- [ ] 또는 `The table 'public.Account' does not exist` 에러가 사라졌는지 확인

**확인 방법:**
1. Vercel 대시보드 → 프로젝트 → Deployments
2. 최신 배포 클릭 → Build Logs
3. `prisma migrate deploy` 실행 결과 확인

### 2. ✅ 환경 변수 설정 확인
Vercel 대시보드에서 다음 변수들이 모두 설정되어 있는지 확인:
- [ ] `NEXTAUTH_URL=https://www.eng-z.com`
- [ ] `NEXTAUTH_SECRET` (값이 있는지 확인)
- [ ] `GOOGLE_ID` (값이 있는지 확인)
- [ ] `GOOGLE_SECRET` (값이 있는지 확인)
- [ ] `KAKAO_ID` (값이 있는지 확인)
- [ ] `KAKAO_SECRET` (값이 있는지 확인)
- [ ] `DATABASE_URL` (값이 있는지 확인)

### 3. ✅ OAuth Redirect URI 확인
- [ ] Google Cloud Console: `https://www.eng-z.com/api/auth/callback/google` 등록됨
- [ ] Kakao Developer Console: `https://www.eng-z.com/api/auth/callback/kakao` 등록됨
- [ ] Kakao 앱 상태가 "운영 중"인지 확인

### 4. ✅ 최신 배포 완료
- [ ] 마이그레이션 파일이 포함된 최신 배포가 완료되었는지 확인
- [ ] 배포 상태가 "Ready"인지 확인

## 테스트 방법

### 1. 로그인 버튼 클릭
- `https://www.eng-z.com/signup` 접속
- 카카오 또는 Google 로그인 버튼 클릭

### 2. 예상되는 동작
- ✅ 성공: OAuth 제공자 페이지로 리다이렉트 → 로그인 후 `/pricing` 또는 `/dashboard`로 이동
- ❌ 실패: `/signup?error=...`로 리다이렉트되며 에러 메시지 표시

### 3. 에러가 발생하는 경우
- URL의 `?error=` 파라미터 확인
- Vercel 로그에서 `❌`로 시작하는 메시지 확인
- 브라우저 콘솔의 에러 메시지 확인

## 현재 상태 확인

### 마이그레이션 상태 확인
Vercel 배포 로그에서 확인:
- `prisma migrate deploy` 명령이 실행되었는지
- `✅ Applied migration` 메시지가 있는지
- `❌ Migration failed` 에러가 없는지

### 환경 변수 확인
`.env.local` 파일을 확인하면 Vercel에 설정된 변수들을 볼 수 있습니다:
```bash
cat .env.local
```

**주의**: 이 파일의 값들이 Vercel에도 동일하게 설정되어 있어야 합니다.

## 다음 단계

1. **Vercel 배포 로그 확인** - 마이그레이션이 성공했는지 확인
2. **로그인 테스트** - 실제로 로그인 시도
3. **에러 발생 시** - 에러 메시지를 확인하고 추가 디버깅

