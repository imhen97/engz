# 카카오 로그인 콜백 오류 해결 가이드

## 가능한 원인들

### 1. NEXTAUTH_URL 환경 변수 문제
- **문제**: 프로덕션에서 `NEXTAUTH_URL`이 제대로 설정되지 않음
- **해결**: Vercel 환경 변수에 `NEXTAUTH_URL=https://www.eng-z.com` 설정 확인

### 2. 카카오 Developer Console Redirect URI 설정
- **문제**: Redirect URI가 정확히 일치하지 않음
- **해결**: 
  - [Kakao Developer Console](https://developers.kakao.com/console/app) 접속
  - 앱 선택 → "제품 설정" → "카카오 로그인" → "Redirect URI"
  - 다음 URI가 정확히 등록되어 있는지 확인:
    - 프로덕션: `https://www.eng-z.com/api/auth/callback/kakao`
    - 개발: `http://localhost:3000/api/auth/callback/kakao`

### 3. 카카오 앱 상태
- **문제**: 카카오 앱이 "개발 중" 상태일 수 있음
- **해결**: 카카오 Developer Console에서 앱 상태를 "운영 중"으로 변경

### 4. 환경 변수 누락
- **문제**: `KAKAO_ID` 또는 `KAKAO_SECRET`이 설정되지 않음
- **해결**: Vercel 환경 변수에 다음이 설정되어 있는지 확인:
  - `KAKAO_ID`
  - `KAKAO_SECRET`

### 5. signIn callback 오류
- **문제**: `signIn` callback에서 예외가 발생하여 `return false` 반환
- **해결**: 로그 확인 및 오류 처리 개선 필요

## 확인 사항 체크리스트

- [ ] Vercel 환경 변수에 `NEXTAUTH_URL=https://www.eng-z.com` 설정됨
- [ ] Vercel 환경 변수에 `KAKAO_ID` 설정됨
- [ ] Vercel 환경 변수에 `KAKAO_SECRET` 설정됨
- [ ] 카카오 Developer Console에 Redirect URI 정확히 등록됨
- [ ] 카카오 앱 상태가 "운영 중"
- [ ] 카카오 로그인 제품이 활성화됨

## 디버깅 방법

1. **브라우저 콘솔 확인**
   - 카카오 로그인 버튼 클릭 후 콘솔 로그 확인
   - 오류 메시지 확인

2. **Vercel 로그 확인**
   - Vercel 대시보드 → 프로젝트 → Deployments → Functions 로그 확인
   - `/api/auth/callback/kakao` 관련 오류 확인

3. **카카오 Developer Console 로그 확인**
   - 카카오 Developer Console → "통계" → "오류 로그" 확인

## 일반적인 오류 코드

- `OAuthCallback`: OAuth 콜백 처리 중 오류
- `Callback`: 일반 콜백 처리 중 오류
- `Configuration`: 설정 오류 (환경 변수 문제)
- `AccessDenied`: 접근 거부
