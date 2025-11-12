# Vercel 환경 변수 목록

이 파일은 Vercel에 설정된 환경 변수 목록을 기록합니다.
**실제 값은 보안상의 이유로 저장하지 않습니다.**

## 필수 환경 변수

### NextAuth

- `NEXTAUTH_URL` = `https://www.eng-z.com`
- `NEXTAUTH_SECRET` = (강력한 랜덤 문자열)

### OAuth - Google

- `GOOGLE_ID` = (Google Cloud Console에서 가져오기)
- `GOOGLE_SECRET` = (Google Cloud Console에서 가져오기)

### OAuth - Kakao

- `KAKAO_ID` = (Kakao Developer Console에서 가져오기)
- `KAKAO_SECRET` = (Kakao Developer Console에서 가져오기)

### Database

- `DATABASE_URL` = (PostgreSQL 연결 문자열)

## 선택적 환경 변수

### Email Provider

- `EMAIL_SERVER` = (SMTP 서버 설정)
- `EMAIL_FROM` = (발신자 이메일)

### Stripe

- `STRIPE_SECRET_KEY` = (Stripe Secret Key)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (Stripe Publishable Key)
- `STRIPE_PRICE_MONTHLY_ID` = (월간 플랜 Price ID)
- `STRIPE_PRICE_ANNUAL_ID` = (연간 플랜 Price ID)
- `STRIPE_WEBHOOK_SECRET` = (Stripe Webhook Secret)

### Public URL

- `NEXT_PUBLIC_URL` = `https://www.eng-z.com`

## 로컬 개발 환경 설정

1. `env.template` 파일을 복사하여 `.env.local` 생성:

   ```bash
   cp env.template .env.local
   ```

2. `.env.local` 파일을 열어 실제 값 입력

3. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

## Vercel에서 환경 변수 내보내기

Vercel CLI를 사용하여 환경 변수를 로컬 파일로 가져올 수 있습니다:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 가져오기
vercel env pull .env.local
```

⚠️ **주의**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!
