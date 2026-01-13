# ENGZ AI Learning Platform - 프로젝트 정보

## 1. 프로젝트 단계

**현재 상태: 개발 완료 및 배포 단계**

- ✅ 핵심 기능 구현 완료
- ✅ 데이터베이스 스키마 설계 및 마이그레이션 완료
- ✅ 인증 시스템 구축 완료 (NextAuth - Google, Kakao, Email)
- ✅ 결제 시스템 통합 완료 (Stripe)
- ✅ AI 레벨 테스트 기능 구현 완료
- ✅ 학습 루틴 시스템 구현 완료
- ✅ 관리자 대시보드 구현 완료
- ✅ Vercel 배포 완료
- 🔄 현재: 카카오 로그인 콜백 오류 해결 중

## 2. 주요 기능

### 2.1 사용자 인증 및 가입

- **OAuth 로그인**: Google, Kakao 계정으로 로그인
- **이메일 로그인**: Magic Link 방식
- **7일 무료 체험**: 가입 시 자동으로 7일 무료 체험 시작
- **자동 구독 전환**: 체험 종료 후 Stripe를 통한 자동 구독

### 2.2 AI 레벨 테스트

- **게이미피케이션**: 10초 제한 타이머, 점점 어려워지는 문제 구조
- **3가지 영역 테스트**:
  - 어휘력 테스트 (20문항)
  - 문법 테스트 (10문항)
  - 작문 테스트 (5문항, AI 자동 채점)
- **결과 분석**:
  - 점수, 정답률, 속도 분석
  - 전 세계 사용자 중 순위 (Percentile)
  - AI 피드백 및 추천 루틴
- **결과 잠금**: 로그인 전에는 흐릿한 미리보기만 제공, 로그인 유도

### 2.3 학습 루틴 시스템

- **4주 집중 루틴**: 테마별 학습 (Grammar, Slang, Business, Travel 등)
- **주간 미션**: 주당 5개의 일일 미션
- **AI 피드백**: 실시간 문장 교정 및 대체 표현 제안
- **진도 추적**: 주간 성장 그래프 및 리포트
- **자동 루틴 생성**: AI가 사용자 레벨과 목표에 맞춰 루틴 생성

### 2.4 학습 룸 (Learning Room)

- **대시보드**: 현재 루틴 진행 상황 표시
- **일일 미션**: 오늘의 학습 미션 및 피드백
- **주간 리포트**: 성장 그래프 및 AI 분석 리포트
- **리뷰 시스템**: 3일/7일/14일 전 미션 복습

### 2.5 결제 및 구독 관리

- **Stripe 통합**: 월간/연간 플랜
- **자동 갱신**: 체험 종료 후 자동 구독 시작
- **구독 관리**: 계정 페이지에서 구독 상태 확인 및 해지

### 2.6 관리자 대시보드

- **사용자 관리**: 전체 사용자 목록 및 통계
- **결제 관리**: Stripe 구독 상태 확인
- **테스트 결과 관리**: 레벨 테스트 결과 모니터링
- **AI 피드백 관리**: 생성된 피드백 검토
- **통계 대시보드**: 사용자 성장 추이, 테스트 완료율 등

## 3. 구체적인 고민 및 개선 필요 사항

### 3.1 현재 해결 중인 문제

- **카카오 로그인 콜백 오류**: OAuth 콜백 처리 중 오류 발생
  - 원인: NEXTAUTH_URL 설정, 카카오 Developer Console Redirect URI 설정 문제 가능성
  - 해결 진행 중: signIn callback 오류 처리 개선

### 3.2 개선이 필요한 부분

- **상태 관리**: 현재 React 기본 상태 관리 사용, 복잡도 증가 시 Zustand/Redux 고려 필요
- **에러 처리**: 전역 에러 바운더리 및 에러 핸들링 개선
- **성능 최적화**: 이미지 최적화, 코드 스플리팅, 캐싱 전략
- **테스트**: 단위 테스트 및 통합 테스트 추가 필요
- **타입 안정성**: 일부 `any` 타입 사용, 타입 정의 강화 필요

## 4. 폴더/파일 구조

```
잉즈/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트
│   │   ├── auth/[...nextauth]/   # NextAuth 설정
│   │   ├── checkout/             # Stripe 결제
│   │   ├── leveltest/            # 레벨 테스트 API
│   │   ├── learning-room/        # 학습 룸 데이터
│   │   ├── routines/             # 루틴 생성
│   │   ├── reports/              # 리포트 데이터
│   │   └── webhook/stripe/       # Stripe 웹훅
│   ├── admin/                    # 관리자 페이지
│   │   ├── page.tsx              # 대시보드
│   │   ├── users/                # 사용자 관리
│   │   ├── payments/             # 결제 관리
│   │   ├── tests/                # 테스트 관리
│   │   └── feedback/             # 피드백 관리
│   ├── level-test/               # 레벨 테스트 페이지
│   │   ├── start/                # 테스트 시작
│   │   ├── vocab/                # 어휘 테스트
│   │   ├── grammar/              # 문법 테스트
│   │   ├── writing/              # 작문 테스트
│   │   ├── result/               # 결과 페이지
│   │   └── result-locked/        # 잠금된 결과
│   ├── learning-room/            # 학습 룸
│   ├── dashboard/               # 사용자 대시보드
│   ├── onboarding/              # 온보딩
│   ├── pricing/                 # 요금제
│   ├── signup/                  # 가입/로그인
│   └── account/                 # 계정 관리
├── components/                   # React 컴포넌트
│   ├── admin/                   # 관리자 컴포넌트
│   ├── auth/                    # 인증 컴포넌트
│   ├── level-test/              # 레벨 테스트 컴포넌트
│   ├── learning-room/           # 학습 룸 컴포넌트
│   └── ...                      # 기타 컴포넌트
├── lib/                         # 유틸리티 및 라이브러리
│   ├── auth.ts                  # NextAuth 설정
│   ├── prisma.ts                # Prisma 클라이언트
│   ├── stripe.ts                # Stripe 설정
│   ├── subscription.ts          # 구독 로직
│   ├── progress.ts              # 진도 관리
│   └── admin.ts                 # 관리자 기능
├── prisma/                      # 데이터베이스 스키마
│   ├── schema.prisma            # Prisma 스키마
│   └── migrations/              # 마이그레이션 파일
├── public/                      # 정적 파일
└── middleware.ts                # Next.js 미들웨어
```

## 5. 상태 관리 방식

### 현재 상태

- **React 기본 상태 관리**: `useState`, `useEffect` 사용
- **서버 상태**: Next.js Server Components에서 직접 데이터 페칭
- **세션 관리**: NextAuth의 `useSession` 훅 사용
- **URL 상태**: `useSearchParams`를 통한 쿼리 파라미터 관리

### 향후 개선 방향

- 복잡한 클라이언트 상태가 증가하면 Zustand 또는 Jotai 도입 고려
- 서버 상태 관리를 위해 React Query (TanStack Query) 도입 검토

## 6. 데이터베이스 스키마

### 주요 모델

#### User

- 기본 정보: id, name, email, image
- 구독 정보: plan, trialActive, trialEndsAt, subscriptionActive, subscriptionId, stripeCustomerId
- 역할: role (admin, coach, null)
- 관계: currentCourse, currentRoutine, routines, levelTestResults

#### Routine (4주 학습 루틴)

- 테마: theme (Grammar, Slang, Business 등)
- 기간: startDate, endDate
- 상태: completed
- 관계: missions, report

#### Mission (일일 미션)

- 루틴 내 위치: week, day
- 내용: content
- 피드백: aiFeedback
- 완료 상태: completed

#### LevelTestResult (레벨 테스트 결과)

- 점수: vocabScore, grammarScore, writingScore, totalScore
- 분석: avgSpeed, rankPercent, overallLevel
- AI 피드백: strengths, weaknesses, recommendedRoutine, aiFeedback, aiPlan, aiMent

#### Report (주간 리포트)

- 요약: summary
- 성장: scoreChange
- 관계: routine (1:1)

#### Course & Lesson (코스 시스템)

- Course: 코스 정보 (slug, title, description, durationWeeks)
- Lesson: 레슨 정보 (week, day, title, contentType, contentUrl)

#### AdminUser & Log (관리자 시스템)

- AdminUser: 관리자 계정
- Log: 시스템 로그 (login, payment, error 등)

## 7. API 설계

### 인증 API

- `POST /api/auth/[...nextauth]`: NextAuth 핸들러
  - OAuth 콜백 처리
  - 세션 관리
  - JWT 토큰 생성

### 레벨 테스트 API

- `GET /api/leveltest/questions`: 테스트 문제 생성
- `POST /api/leveltest/submit`: 테스트 제출
- `POST /api/leveltest/grade-writing`: 작문 채점 (AI)
- `GET /api/leveltest/result/latest`: 최신 결과 조회
- `GET /api/leveltest/result/[id]`: 특정 결과 조회
- `POST /api/leveltest/send-email`: 결과 이메일 전송

### 학습 룸 API

- `GET /api/learning-room/data`: 학습 룸 데이터 조회
- `GET /api/dashboard/data`: 대시보드 데이터 조회
- `GET /api/reports/latest`: 최신 리포트 조회

### 루틴 API

- `POST /api/routines/create`: 루틴 생성

### 결제 API

- `POST /api/checkout`: Stripe 체크아웃 세션 생성
- `POST /api/webhook/stripe`: Stripe 웹훅 처리

### 관리자 API

- `GET /api/admin/*`: 관리자 전용 API (미구현, 직접 DB 쿼리)

### 공통 특징

- 모든 API 라우트에 `export const dynamic = 'force-dynamic'` 설정
- 인증이 필요한 API는 `getToken` 또는 `getServerSession` 사용
- 에러 처리 및 로깅 포함

## 8. 컴포넌트 아키텍처

### 구조

- **서버 컴포넌트**: 기본적으로 Server Components 사용
- **클라이언트 컴포넌트**: 상호작용이 필요한 경우에만 `"use client"` 사용
- **재사용 가능한 컴포넌트**: `components/` 폴더에 분리

### 주요 컴포넌트 패턴

#### 페이지 컴포넌트

- `app/[route]/page.tsx`: 페이지 컴포넌트 (Server Component)
- `components/[feature]/[Feature]Content.tsx`: 페이지 컨텐츠 (Client Component)

#### 인증 컴포넌트

- `SignInForm`: 로그인 폼 (OAuth, Email)
- `SignupPageContent`: 가입 페이지 레이아웃

#### 레벨 테스트 컴포넌트

- `QuestionCard`: 문제 카드
- `Timer`: 타이머 컴포넌트
- `ProgressBar`: 진행률 표시
- `CountdownTimer`: 카운트다운 타이머

#### 학습 룸 컴포넌트

- `LearningRoomContent`: 학습 룸 메인 컨텐츠
- `DashboardContent`: 대시보드 컨텐츠
- `ReportContent`: 리포트 컨텐츠

#### 관리자 컴포넌트

- `StatCard`: 통계 카드
- `ChartCard`: 차트 컨테이너
- `DataTable`: 데이터 테이블
- `Sidebar`, `Topbar`: 레이아웃 컴포넌트

### 스타일링

- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Framer Motion**: 애니메이션
- **커스텀 색상**: `#F5472C` (메인 브랜드 컬러)

## 9. 기술 스택

### 프론트엔드

- **Next.js 14.2.5**: React 프레임워크 (App Router)
- **React 18.3.1**: UI 라이브러리
- **TypeScript 5.5.4**: 타입 안정성
- **Tailwind CSS 3.4.1**: 스타일링
- **Framer Motion 11.0.0**: 애니메이션
- **Recharts 3.4.1**: 차트 라이브러리

### 백엔드

- **Next.js API Routes**: 서버리스 API
- **Prisma 6.19.0**: ORM
- **PostgreSQL**: 데이터베이스 (Neon)
- **NextAuth 4.24.13**: 인증 시스템

### 외부 서비스

- **Stripe 19.3.0**: 결제 처리
- **OpenAI 6.8.1**: AI 기능 (레벨 테스트 채점, 피드백 생성)
- **Nodemailer 7.0.10**: 이메일 전송

### 배포 및 인프라

- **Vercel**: 호스팅 및 배포
- **Neon PostgreSQL**: 데이터베이스 호스팅
- **GitHub**: 버전 관리

### 개발 도구

- **pnpm**: 패키지 매니저
- **ESLint**: 코드 린팅
- **TypeScript**: 타입 체크

## 10. 환경 변수

### 필수 환경 변수

- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NEXTAUTH_SECRET`: NextAuth 시크릿 키
- `NEXTAUTH_URL`: NextAuth URL (프로덕션: https://www.eng-z.com)

### OAuth 설정

- `GOOGLE_ID`, `GOOGLE_SECRET`: Google OAuth
- `KAKAO_ID`, `KAKAO_SECRET`: Kakao OAuth

### 이메일 설정

- `EMAIL_SERVER`: 이메일 서버 설정
- `EMAIL_FROM`: 발신자 이메일

### Stripe 설정

- `STRIPE_SECRET_KEY`: Stripe 시크릿 키
- `STRIPE_PRICE_MONTHLY_ID`: 월간 플랜 가격 ID
- `STRIPE_PRICE_ANNUAL_ID`: 연간 플랜 가격 ID
- `STRIPE_WEBHOOK_SECRET`: 웹훅 시크릿

### OpenAI 설정

- `OPENAI_API_KEY`: OpenAI API 키

## 11. 주요 사용자 플로우

### 신규 사용자 가입 플로우

1. 랜딩 페이지 (`/`) 접속
2. "7일 무료 체험 시작하기" 클릭 → `/signup`
3. OAuth (Google/Kakao) 또는 Email로 가입
4. 자동으로 7일 무료 체험 시작 (`trialActive = true`)
5. 레벨 테스트 진행 (`/level-test/start`)
6. 온보딩에서 학습 목표 선택 (`/onboarding`)
7. 학습 룸 접속 (`/learning-room`)

### 레벨 테스트 플로우

1. 테스트 시작 (`/level-test/start`)
2. 어휘 테스트 (20문항, 10초 제한)
3. 문법 테스트 (10문항, 10초 제한)
4. 작문 테스트 (5문항, AI 채점)
5. 결과 잠금 화면 (`/level-test/result-locked`)
6. 로그인 후 결과 확인 (`/level-test/result`)

### 학습 루틴 플로우

1. 루틴 생성 (`/api/routines/create`)
2. 4주간 일일 미션 수행
3. 주간 리포트 생성 (`/report`)
4. 루틴 완료 후 다음 루틴 제안

### 결제 플로우

1. 체험 종료 전 요금제 선택 (`/pricing`)
2. Stripe 체크아웃 (`/api/checkout`)
3. 결제 완료 후 웹훅 처리 (`/api/webhook/stripe`)
4. 구독 활성화 (`subscriptionActive = true`)

## 12. 현재 이슈 및 개선 사항

### 해결 중

- ✅ 빌드 오류 수정 (recharts 서버 컴포넌트 문제)
- ✅ API 라우트 동적 렌더링 설정
- 🔄 카카오 로그인 콜백 오류 해결 중

### 개선 필요

- 상태 관리 라이브러리 도입 검토
- 전역 에러 핸들링 개선
- 테스트 코드 추가
- 타입 안정성 강화
- 성능 최적화 (이미지, 코드 스플리팅)

## 13. 참고 문서

- `lib/prd`: 프로젝트 요구사항 문서
- `레벨테스트.prd`: 레벨 테스트 상세 설계
- `KAKAO_LOGIN_TROUBLESHOOTING.md`: 카카오 로그인 트러블슈팅 가이드
- `ADMIN_SETUP.md`: 관리자 설정 가이드
- `DEPLOY.md`: 배포 가이드
