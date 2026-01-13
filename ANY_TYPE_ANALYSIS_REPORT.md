# `any` Type Usage Analysis Report

This report documents all instances of `any` type usage in the codebase, categorized by type and priority for fixing.

## Summary Statistics

- **Total `any` usages found**: 21 instances
- **Files affected**: 9 files
- **Critical files**: 3 (lib/auth.ts, app/api/auth/[...nextauth]/route.ts, components/admin/DataTable.tsx)

---

## Category 1: NextAuth/Prisma Type Extensions (HIGH PRIORITY)

### File: `lib/auth.ts`
**Issue**: Multiple `as any` assertions due to NextAuth type extensions not being properly recognized.

#### Line 55: Kakao Profile Return Type
```typescript
} as any; // Type assertion to avoid type conflict with extended User type
```
**Current Code**:
```55:55:lib/auth.ts
        } as any; // Type assertion to avoid type conflict with extended User type
```
**Category**: Third-party library types (NextAuth)
**Suggested Fix**: Use proper NextAuth User type from `next-auth.d.ts`:
```typescript
import type { User } from "next-auth";

profile(profile): User {
  return {
    id: profile.id.toString(),
    name: profile.kakao_account?.profile?.nickname || ...,
    email: profile.kakao_account?.email || null,
    image: profile.kakao_account?.profile?.profile_image_url || ...,
  };
}
```

#### Line 107: Prisma User Query Result
```typescript
const user = (await prisma.user.findUnique({...})) as any;
```
**Current Code**:
```105:107:lib/auth.ts
      const user = (await prisma.user.findUnique({
        where: { email: credentials.email },
      })) as any;
```
**Category**: Prisma-related types
**Suggested Fix**: Use Prisma generated types:
```typescript
import type { User } from "@prisma/client";

const user = await prisma.user.findUnique({
  where: { email: credentials.email },
  select: {
    id: true,
    email: true,
    name: true,
    image: true,
    plan: true,
    trialActive: true,
    trialEndsAt: true,
    subscriptionActive: true,
    role: true,
  },
});
```

#### Line 109: User Role Check
```typescript
if (!user || (user as any).role !== "admin") {
```
**Current Code**:
```109:109:lib/auth.ts
      if (!user || (user as any).role !== "admin") {
```
**Category**: Prisma-related types
**Suggested Fix**: Use proper type guard:
```typescript
if (!user || user.role !== "admin") {
```

#### Line 128: User Role Access
```typescript
role: (user as any).role,
```
**Current Code**:
```128:128:lib/auth.ts
        role: (user as any).role,
```
**Category**: Prisma-related types
**Suggested Fix**: Remove assertion if using proper select above:
```typescript
role: user.role,
```

#### Line 129: Return Type Assertion
```typescript
} as any;
```
**Current Code**:
```119:129:lib/auth.ts
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        plan: user.plan,
        trialActive: user.trialActive,
        trialEndsAt: user.trialEndsAt,
        subscriptionActive: user.subscriptionActive,
        role: (user as any).role,
      } as any;
```
**Category**: NextAuth User type
**Suggested Fix**: Use proper NextAuth User type:
```typescript
import type { User } from "next-auth";

return {
  id: user.id,
  email: user.email,
  name: user.name,
  image: user.image,
  plan: user.plan,
  trialActive: user.trialActive,
  trialEndsAt: user.trialEndsAt,
  subscriptionActive: user.subscriptionActive,
  role: user.role ?? null,
} satisfies User;
```

#### Line 134: Token Parameter Type
```typescript
async function enrichToken(token: any) {
```
**Current Code**:
```134:134:lib/auth.ts
async function enrichToken(token: any) {
```
**Category**: NextAuth JWT type
**Suggested Fix**: Use NextAuth JWT type:
```typescript
import type { JWT } from "next-auth/jwt";

async function enrichToken(token: JWT): Promise<JWT> {
```

#### Line 139: Prisma User Query Result
```typescript
const user = (await prisma.user.findUnique({...})) as any;
```
**Current Code**:
```137:139:lib/auth.ts
    const user = (await prisma.user.findUnique({
      where: { id: token.userId as string },
    })) as any;
```
**Category**: Prisma-related types
**Suggested Fix**: Use Prisma select:
```typescript
const user = await prisma.user.findUnique({
  where: { id: token.userId as string },
  select: {
    plan: true,
    trialActive: true,
    trialEndsAt: true,
    subscriptionActive: true,
    role: true,
  },
});
```

#### Line 257: Kakao Profile Type Assertion
```typescript
const kakaoProfile = profile as any;
```
**Current Code**:
```257:257:lib/auth.ts
          const kakaoProfile = profile as any;
```
**Category**: Third-party library types (Kakao OAuth)
**Suggested Fix**: Create proper Kakao profile interface:
```typescript
interface KakaoProfile {
  id: number;
  kakao_account?: {
    email?: string;
    is_email_verified?: boolean;
    profile?: {
      nickname?: string;
    };
  };
}

const kakaoProfile = profile as KakaoProfile;
```

#### Line 389: User Role Access
```typescript
token.role = (user as any).role ?? null;
```
**Current Code**:
```389:389:lib/auth.ts
          token.role = (user as any).role ?? null;
```
**Category**: Prisma-related types
**Suggested Fix**: Remove assertion if using proper select:
```typescript
token.role = user.role ?? null;
```

#### Line 412: Session User Role Assignment
```typescript
(session.user as any).role = token.role ?? null;
```
**Current Code**:
```412:412:lib/auth.ts
          (session.user as any).role = token.role ?? null;
```
**Category**: NextAuth Session type
**Suggested Fix**: The `next-auth.d.ts` already extends Session type with role. Remove assertion:
```typescript
if (session.user) {
  session.user.role = token.role ?? null;
}
```

---

### File: `app/api/auth/[...nextauth]/route.ts`
**Issue**: Next.js route handler context parameter type is `any`.

#### Line 8: GET Handler Context Parameter
```typescript
export const GET = async (req: NextRequest, context: any) => {
```
**Current Code**:
```8:8:app/api/auth/[...nextauth]/route.ts
export const GET = async (req: NextRequest, context: any) => {
```
**Category**: Next.js route handler types
**Suggested Fix**: Use proper Next.js route handler context type:
```typescript
import type { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  const params = await context.params;
  return await handler(req, params);
};
```

#### Line 25: POST Handler Context Parameter
```typescript
export const POST = async (req: NextRequest, context: any) => {
```
**Current Code**:
```25:25:app/api/auth/[...nextauth]/route.ts
export const POST = async (req: NextRequest, context: any) => {
```
**Category**: Next.js route handler types
**Suggested Fix**: Same as GET handler:
```typescript
export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  const params = await context.params;
  return await handler(req, params);
};
```

---

## Category 2: Prisma User Type Extensions (MEDIUM PRIORITY)

### File: `app/admin/layout.tsx`
**Issue**: Prisma user query result uses `as any` to access role field.

#### Line 26: Prisma User Query Result
```typescript
const user = (await prisma.user.findUnique({...})) as any;
```
**Current Code**:
```24:26:app/admin/layout.tsx
    const user = (await prisma.user.findUnique({
      where: { id: session.user.id },
    })) as any;
```
**Category**: Prisma-related types
**Suggested Fix**: Use Prisma select to include role:
```typescript
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    role: true,
  },
});
```

---

### File: `app/admin/users/page.tsx`
**Issue**: User parameter type is `any` in helper function.

#### Line 29: User Parameter Type
```typescript
const getSubscriptionStatus = (user: any) => {
```
**Current Code**:
```29:29:app/admin/users/page.tsx
  const getSubscriptionStatus = (user: any) => {
```
**Category**: Prisma-related types
**Suggested Fix**: Use proper type from Prisma query:
```typescript
type UserWithSubscription = {
  subscriptionActive: boolean;
  trialActive: boolean;
  trialEndsAt: Date | null;
};

const getSubscriptionStatus = (user: UserWithSubscription) => {
```

---

## Category 3: Stripe API Types (MEDIUM PRIORITY)

### File: `app/admin/payments/page.tsx`
**Issue**: Stripe API response types use `as any` to access nested properties.

#### Line 23: Stripe Customer Email Access
```typescript
? (sub.customer as any).email
```
**Current Code**:
```22:23:app/admin/payments/page.tsx
      customerEmail:
        typeof sub.customer === "object" && sub.customer
          ? (sub.customer as any).email
```
**Category**: Third-party library types (Stripe)
**Suggested Fix**: Use Stripe types:
```typescript
import type Stripe from "stripe";

const customer = sub.customer as Stripe.Customer;
const customerEmail = customer.email ?? null;
```

#### Line 31-32: Stripe Subscription Period Dates
```typescript
currentPeriodStart: new Date((sub as any).current_period_start * 1000),
currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
```
**Current Code**:
```31:32:app/admin/payments/page.tsx
      currentPeriodStart: new Date((sub as any).current_period_start * 1000),
      currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
```
**Category**: Third-party library types (Stripe)
**Suggested Fix**: Use Stripe Subscription type:
```typescript
import type Stripe from "stripe";

const subscription = sub as Stripe.Subscription;
currentPeriodStart: new Date(subscription.current_period_start * 1000),
currentPeriodEnd: new Date(subscription.current_period_end * 1000),
```

---

## Category 4: Generic Component Types (LOW PRIORITY)

### File: `components/admin/DataTable.tsx`
**Issue**: Generic render prop uses `any` for value parameter.

#### Line 8: Render Prop Value Parameter
```typescript
render?: (value: any, row: T) => React.ReactNode;
```
**Current Code**:
```8:8:components/admin/DataTable.tsx
  render?: (value: any, row: T) => React.ReactNode;
```
**Category**: Generic component types
**Suggested Fix**: Use proper generic type:
```typescript
type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: <K extends keyof T>(value: T[K], row: T) => React.ReactNode;
};
```

#### Line 19: Record Constraint
```typescript
export default function DataTable<T extends Record<string, any>>({
```
**Current Code**:
```19:19:components/admin/DataTable.tsx
export default function DataTable<T extends Record<string, any>>({
```
**Category**: Generic component types
**Suggested Fix**: Use `unknown` or more specific constraint:
```typescript
export default function DataTable<T extends Record<string, unknown>>({
```

---

## Category 5: Question/Test Types (LOW PRIORITY)

### File: `app/level-test/grammar/page.tsx`
**Issue**: Question filter callback uses `any` type.

#### Line 39: Question Filter Callback
```typescript
(q: any) => q.type === "multiple-choice" && q.options
```
**Current Code**:
```38:39:app/level-test/grammar/page.tsx
    const filteredQuestions = (data.grammarQuestions || []).filter(
      (q: any) => q.type === "multiple-choice" && q.options
```
**Category**: API response types
**Suggested Fix**: Define proper question interface:
```typescript
interface GrammarQuestion {
  id: string;
  type: "multiple-choice" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer?: number;
}

const filteredQuestions = (data.grammarQuestions || []).filter(
  (q: GrammarQuestion): q is GrammarQuestion & { options: string[] } =>
    q.type === "multiple-choice" && q.options !== undefined
);
```

---

### File: `app/level-test/writing/page.tsx`
**Issue**: Questions parameter uses `any[]` type.

#### Line 147: Questions Array Parameter
```typescript
const calculateScore = (answers: (number | string)[], questions: any[]) => {
```
**Current Code**:
```147:147:app/level-test/writing/page.tsx
  const calculateScore = (answers: (number | string)[], questions: any[]) => {
```
**Category**: API response types
**Suggested Fix**: Define proper question interface:
```typescript
interface Question {
  id: string;
  type: "vocabulary" | "grammar" | "writing";
  correctAnswer?: number;
  correctAnswerText?: string;
}

const calculateScore = (
  answers: (number | string)[],
  questions: Question[]
) => {
```

---

## Category 6: Error Handling (LOW PRIORITY)

### File: `scripts/set-admin.ts`
**Issue**: Error catch block uses `any` type.

#### Line 23: Error Catch Block
```typescript
} catch (error: any) {
```
**Current Code**:
```23:23:scripts/set-admin.ts
  } catch (error: any) {
```
**Category**: Error handling
**Suggested Fix**: Use proper error type:
```typescript
} catch (error) {
  if (error instanceof Error && 'code' in error) {
    const prismaError = error as { code: string; message: string };
    if (prismaError.code === "P2025") {
      // handle error
    }
  }
}
```

---

## Priority Fix Order

1. **HIGH PRIORITY** (Fix First):
   - `lib/auth.ts` - All NextAuth/Prisma type issues (affects core authentication)
   - `app/api/auth/[...nextauth]/route.ts` - Route handler context types

2. **MEDIUM PRIORITY** (Fix Next):
   - `app/admin/layout.tsx` - Prisma user query
   - `app/admin/users/page.tsx` - User type in helper function
   - `app/admin/payments/page.tsx` - Stripe API types

3. **LOW PRIORITY** (Fix Last):
   - `components/admin/DataTable.tsx` - Generic component types
   - `app/level-test/grammar/page.tsx` - Question filter types
   - `app/level-test/writing/page.tsx` - Question array types
   - `scripts/set-admin.ts` - Error handling types

---

## Recommended Action Plan

1. **Step 1**: Create shared type definitions file (`types/index.ts`) for:
   - Question interfaces (GrammarQuestion, WritingPrompt, etc.)
   - User types with role extensions
   - Stripe API response types

2. **Step 2**: Fix `lib/auth.ts` by:
   - Using Prisma select statements instead of `as any`
   - Properly typing NextAuth callbacks with extended types
   - Creating Kakao profile interface

3. **Step 3**: Fix route handlers in `app/api/auth/[...nextauth]/route.ts`:
   - Use proper Next.js 13+ route handler context types

4. **Step 4**: Fix admin pages:
   - Use Prisma select for user queries
   - Use Stripe types for payment data

5. **Step 5**: Fix component types:
   - Improve DataTable generic types
   - Define question interfaces for level test pages

6. **Step 6**: Fix error handling:
   - Use proper error type guards instead of `any`

---

## Notes

- Most `any` usages are due to Prisma/NextAuth type extensions not being properly recognized
- Stripe types can be imported from `stripe` package (likely already installed)
- Question types should be centralized in a shared types file
- Consider using `satisfies` operator (TypeScript 4.9+) instead of `as` assertions where possible
