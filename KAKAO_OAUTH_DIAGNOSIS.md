# Kakao OAuth Callback Error Diagnosis

## Current Configuration Files

### 1. `lib/auth.ts` - NextAuth Configuration

**Key Points:**

- ✅ Kakao provider is properly configured with custom profile mapping
- ✅ Session strategy is set to "jwt" (correct for serverless)
- ✅ Custom cookies configuration with domain `.eng-z.com` for production
- ✅ Error handling in signIn callback returns `true` even on errors (may mask issues)
- ⚠️ NEXTAUTH_URL validation only logs warnings but doesn't enforce

**Potential Issues:**

1. **Cookie Domain**: Using `.eng-z.com` (with leading dot) - this should work but verify
2. **signIn Callback**: Always returns `true` even on errors - this might hide real issues
3. **No explicit NEXTAUTH_URL in authOptions**: NextAuth should infer from environment, but explicit is better

### 2. `app/api/auth/[...nextauth]/route.ts` - API Route Handler

**Key Points:**

- ✅ Standard NextAuth handler setup
- ✅ Exports both GET and POST handlers correctly
- ⚠️ No explicit error handling wrapper

### 3. `middleware.ts` - Route Protection

**Key Points:**

- ✅ Uses `getToken` from `next-auth/jwt` correctly
- ✅ Properly handles admin routes
- ✅ Sets callbackUrl for redirects
- ⚠️ No explicit handling for OAuth callback routes

## Identified Issues

### 🔴 Critical Issues

#### 1. **Missing NEXTAUTH_URL in authOptions**

NextAuth needs `NEXTAUTH_URL` to be explicitly set in production. While it can infer from headers, explicit configuration is more reliable.

**Current Code:**

```typescript
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  // ❌ Missing: NEXTAUTH_URL is not explicitly set
  ...
}
```

**Fix:**

```typescript
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  // ✅ Add explicit NEXTAUTH_URL
  url: process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'production'
    ? 'https://www.eng-z.com'
    : 'http://localhost:3000'),
  ...
}
```

#### 2. **Cookie Domain Configuration**

The cookie domain `.eng-z.com` (with leading dot) should work, but NextAuth recommends using the domain without the leading dot in some cases.

**Current Code:**

```typescript
domain: process.env.NODE_ENV === "production" ? ".eng-z.com" : undefined,
```

**Potential Fix:**

```typescript
domain: process.env.NODE_ENV === "production" ? "www.eng-z.com" : undefined,
```

#### 3. **signIn Callback Always Returns True**

The signIn callback always returns `true` even when errors occur. This might hide authentication failures.

**Current Code:**

```typescript
} catch (error) {
  console.error("❌ signIn callback 오류:", error);
  // ⚠️ Always returns true - might hide real issues
  return true;
}
```

**Better Approach:**

```typescript
} catch (error) {
  console.error("❌ signIn callback 오류:", error);
  // Only return true for non-critical errors
  // Return false for critical authentication failures
  if (error instanceof Error && error.message.includes('critical')) {
    return false;
  }
  return true;
}
```

### 🟡 Medium Priority Issues

#### 4. **Missing Trust Host Configuration**

Next.js 14 with NextAuth might need explicit trust host configuration for production.

**Add to authOptions:**

```typescript
trustHost: true, // Trust the host header in production
```

#### 5. **OAuth Provider Configuration**

The Kakao provider doesn't have explicit callback URL configuration. While NextAuth generates it automatically, explicit configuration can help.

**Current Code:**

```typescript
KakaoProvider({
  clientId: process.env.KAKAO_ID,
  clientSecret: process.env.KAKAO_SECRET,
  // ⚠️ No explicit authorization or token URLs
  profile(profile) { ... }
})
```

**Optional Enhancement:**

```typescript
KakaoProvider({
  clientId: process.env.KAKAO_ID,
  clientSecret: process.env.KAKAO_SECRET,
  authorization: {
    params: {
      redirect_uri: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/api/auth/callback/kakao`
        : undefined,
    },
  },
  profile(profile) { ... }
})
```

### 🟢 Low Priority / Verification Needed

#### 6. **Environment Variables Check**

Verify these are set correctly in Vercel:

- `NEXTAUTH_URL=https://www.eng-z.com` (no trailing slash)
- `NEXTAUTH_SECRET` (should be a random string)
- `KAKAO_ID` (REST API Key from Kakao Developer Console)
- `KAKAO_SECRET` (Client Secret from Kakao Developer Console)

#### 7. **Kakao Developer Console Settings**

Verify in [Kakao Developer Console](https://developers.kakao.com/console/app):

- Redirect URI: `https://www.eng-z.com/api/auth/callback/kakao` (exact match, no trailing slash)
- App Status: "운영 중" (Running)
- 카카오 로그인 제품: 활성화됨

## Recommended Fixes

### Priority 1: Add Explicit NEXTAUTH_URL

```typescript
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  url:
    process.env.NEXTAUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.eng-z.com"
      : "http://localhost:3000"),
  trustHost: true, // Important for Vercel/production
  // ... rest of config
};
```

### Priority 2: Improve Error Handling in signIn Callback

```typescript
async signIn({ user, account, profile }) {
  try {
    // ... existing code ...

    // Validate critical data
    if (!user || !account) {
      console.error("❌ Missing user or account data");
      return false; // Critical failure
    }

    // ... rest of code ...

    return true;
  } catch (error) {
    console.error("❌ signIn callback 오류:", error);

    // Check if it's a critical error
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Critical errors that should block login
    const criticalErrors = [
      'database',
      'prisma',
      'adapter',
    ];

    if (criticalErrors.some(keyword => errorMessage.toLowerCase().includes(keyword))) {
      console.error("❌ Critical error - blocking login");
      return false;
    }

    // Non-critical errors - allow login to proceed
    return true;
  }
}
```

### Priority 3: Add Debug Logging

Add more detailed logging to track the OAuth flow:

```typescript
callbacks: {
  async signIn({ user, account, profile }) {
    console.log("🔵 signIn callback 시작:", {
      userId: user?.id,
      email: user?.email,
      provider: account?.provider,
      accountType: account?.type,
      accountId: account?.providerAccountId,
    });

    // ... rest of code
  },

  async jwt({ token, user, account }) {
    if (account) {
      console.log("🔵 JWT callback - OAuth account:", {
        provider: account.provider,
        type: account.type,
      });
    }
    // ... rest of code
  },
}
```

## Testing Checklist

After applying fixes, test:

1. ✅ Check Vercel environment variables are set correctly
2. ✅ Verify Kakao Developer Console Redirect URI matches exactly
3. ✅ Test Kakao login flow:
   - Click Kakao login button
   - Should redirect to Kakao login page
   - After login, should redirect back to `/api/auth/callback/kakao`
   - Should then redirect to intended destination
4. ✅ Check Vercel function logs for any errors
5. ✅ Verify cookies are set correctly (check browser DevTools)
6. ✅ Test on both `www.eng-z.com` and `eng-z.com` (if both domains work)

## Common Error Messages and Solutions

| Error           | Likely Cause           | Solution                                    |
| --------------- | ---------------------- | ------------------------------------------- |
| `OAuthCallback` | Callback URL mismatch  | Check Kakao Developer Console Redirect URI  |
| `Callback`      | General callback error | Check NEXTAUTH_URL and NEXTAUTH_SECRET      |
| `Configuration` | Missing env vars       | Verify KAKAO_ID, KAKAO_SECRET, NEXTAUTH_URL |
| `AccessDenied`  | User denied permission | Normal user action, not a bug               |
| Cookie not set  | Domain mismatch        | Check cookie domain configuration           |
