# 🔧 로그인 오류 해결 가이드

## 일반적인 로그인 오류 원인

### 1. 환경 변수 미설정 또는 잘못된 값

**확인 사항:**
- Vercel 대시보드에서 다음 환경 변수가 모두 설정되어 있는지 확인:
  - `NEXTAUTH_URL=https://www.eng-z.com`
  - `NEXTAUTH_SECRET` (강력한 랜덤 문자열)
  - `GOOGLE_ID`
  - `GOOGLE_SECRET`
  - `KAKAO_ID`
  - `KAKAO_SECRET`

**해결 방법:**
1. Vercel 프로젝트 → Settings → Environment Variables
2. 각 변수가 Production 환경에 설정되어 있는지 확인
3. `NEXTAUTH_SECRET` 생성: `openssl rand -base64 32`
4. 변경 후 재배포 필요

### 2. OAuth Redirect URI 불일치

**확인 사항:**

#### Google Cloud Console
- [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속
- OAuth 2.0 Client ID 선택
- "승인된 리디렉션 URI"에 다음이 정확히 등록되어 있는지 확인:
  - `https://www.eng-z.com/api/auth/callback/google`

#### Kakao Developer Console
- [Kakao Developer Console](https://developers.kakao.com/console/app) 접속
- 앱 선택 → "제품 설정" → "카카오 로그인"
- "Redirect URI"에 다음이 정확히 등록되어 있는지 확인:
  - `https://www.eng-z.com/api/auth/callback/kakao`
- 앱 상태가 "운영 중"인지 확인

### 3. NEXTAUTH_URL 불일치

**확인 사항:**
- Vercel의 `NEXTAUTH_URL`이 `https://www.eng-z.com`으로 설정되어 있는지 확인
- `http://`가 아닌 `https://`로 시작해야 함
- 끝에 슬래시(`/`)가 없어야 함

### 4. Provider가 등록되지 않음

**확인 방법:**
- Vercel 로그에서 다음 메시지 확인:
  - `❌ GOOGLE_ID 또는 GOOGLE_SECRET 환경 변수가 설정되지 않았습니다`
  - `❌ KAKAO_ID 또는 KAKAO_SECRET 환경 변수가 설정되지 않았습니다`

**해결 방법:**
- 환경 변수가 올바르게 설정되어 있는지 확인
- 변수 이름에 오타가 없는지 확인 (대소문자 구분)

### 5. 데이터베이스 연결 문제

**확인 사항:**
- `DATABASE_URL`이 올바르게 설정되어 있는지 확인
- Prisma Client가 최신 상태인지 확인

## 디버깅 단계

### 1. 브라우저 콘솔 확인
- 개발자 도구 (F12) → Console 탭
- 로그인 버튼 클릭 시 나타나는 에러 메시지 확인

### 2. Vercel 로그 확인
- Vercel 대시보드 → 프로젝트 → Logs
- 로그인 시도 시 나타나는 서버 로그 확인
- 특히 `❌` 또는 `⚠️`로 시작하는 메시지 확인

### 3. 네트워크 탭 확인
- 개발자 도구 → Network 탭
- 로그인 버튼 클릭 후 `/api/auth/signin/kakao` 또는 `/api/auth/signin/google` 요청 확인
- 상태 코드가 302 (리다이렉트)인지 확인
- 500 에러가 발생하면 서버 로그 확인

### 4. URL 파라미터 확인
- 로그인 실패 후 URL에 `?error=...` 파라미터가 있는지 확인
- 예: `/signup?error=Configuration`
- 에러 타입에 따라 원인 파악 가능

## 일반적인 에러 코드

- `Configuration`: 환경 변수 또는 OAuth 설정 문제
- `AccessDenied`: 로그인이 거부됨
- `OAuthSignin`: OAuth 제공자 페이지로 이동 실패
- `OAuthCallback`: OAuth 콜백 처리 실패
- `OAuthCreateAccount`: 계정 생성 실패
- `Callback`: 일반 콜백 처리 실패

## 빠른 체크리스트

- [ ] Vercel에 모든 환경 변수가 설정되어 있음
- [ ] `NEXTAUTH_URL`이 `https://www.eng-z.com`으로 설정됨
- [ ] `NEXTAUTH_SECRET`이 설정되어 있고 강력한 값임
- [ ] Google OAuth Redirect URI가 정확히 등록됨
- [ ] Kakao OAuth Redirect URI가 정확히 등록됨
- [ ] Kakao 앱이 "운영 중" 상태임
- [ ] 환경 변수 변경 후 재배포 완료

## 추가 도움

문제가 계속되면:
1. Vercel 로그의 전체 에러 메시지 복사
2. 브라우저 콘솔의 에러 메시지 복사
3. 네트워크 탭의 실패한 요청 정보 확인

