# Environment Variables Setup Guide

## Required Environment Variables

### NextAuth Configuration

```bash
# Generate a strong secret: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# Production
NEXTAUTH_URL=https://www.eng-z.com

# Development
NEXTAUTH_URL=http://localhost:3000
```

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - Production: `https://www.eng-z.com/api/auth/callback/google`
   - Development: `http://localhost:3000/api/auth/callback/google`

```bash
GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_SECRET=your-google-client-secret
```

### Kakao OAuth

1. Go to [Kakao Developer Console](https://developers.kakao.com/console/app)
2. Go to "앱 설정" > "플랫폼" > "Web 플랫폼 등록"
3. Add redirect URI:
   - Production: `https://www.eng-z.com/api/auth/callback/kakao`
   - Development: `http://localhost:3000/api/auth/callback/kakao`
4. Go to "제품 설정" > "카카오 로그인" > "활성화"
5. Get REST API Key and Client Secret

```bash
KAKAO_ID=your-kakao-rest-api-key
KAKAO_SECRET=your-kakao-client-secret
```

### Database

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Stripe (Optional)

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_MONTHLY_ID=price_...
STRIPE_PRICE_ANNUAL_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Vercel Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all required variables
4. Make sure to set them for:
   - Production
   - Preview (optional)
   - Development (optional)

## Verification Checklist

- [ ] `NEXTAUTH_SECRET` is set and is a strong random string
- [ ] `NEXTAUTH_URL` matches your production domain (`https://www.eng-z.com`)
- [ ] Google OAuth redirect URI is registered in Google Cloud Console
- [ ] Kakao OAuth redirect URI is registered in Kakao Developer Console
- [ ] All environment variables are set in Vercel dashboard
- [ ] Test login with Google in production
- [ ] Test login with Kakao in production
