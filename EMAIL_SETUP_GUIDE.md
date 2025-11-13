# 이메일 발송 설정 가이드

ENGZ AI 레벨 테스트 결과를 이메일로 발송하기 위한 환경 변수 설정 방법입니다.

## 필요한 환경 변수

1. **`EMAIL_SERVER`**: SMTP 서버 연결 문자열
2. **`EMAIL_FROM`**: 발신자 이메일 주소

---

## 방법 1: Gmail 사용 (가장 간단)

### 1단계: Gmail 앱 비밀번호 생성

1. [Google 계정 관리](https://myaccount.google.com/) 접속
2. **보안** → **2단계 인증** 활성화 (필수)
3. **앱 비밀번호** 생성:
   - **보안** → **앱 비밀번호**
   - 앱 선택: "메일"
   - 기기 선택: "기타 (맞춤 이름)" → "ENGZ" 입력
   - **생성** 클릭
   - 생성된 16자리 비밀번호 복사 (예: `abcd efgh ijkl mnop`)

### 2단계: Vercel 환경 변수 설정

1. [Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수 추가:

```
EMAIL_SERVER=smtps://your-email@gmail.com:앱비밀번호@smtp.gmail.com:465
EMAIL_FROM=your-email@gmail.com
```

**예시:**

```
EMAIL_SERVER=smtps://engz@gmail.com:abcd efgh ijkl mnop@smtp.gmail.com:465
EMAIL_FROM=engz@gmail.com
```

> ⚠️ **주의**: 앱 비밀번호의 공백은 제거하거나 URL 인코딩해야 합니다.
> 예: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

## 방법 2: Resend 사용 (추천 - 무료 플랜 제공)

### 1단계: Resend 계정 생성

1. [Resend](https://resend.com/) 가입
2. **API Keys** → **Create API Key**
3. API 키 복사 (예: `re_1234567890abcdef`)

### 2단계: 도메인 인증 (선택사항)

- Resend는 기본적으로 `onboarding@resend.dev`로 발송 가능
- 커스텀 도메인 사용 시 도메인 인증 필요

### 3단계: Vercel 환경 변수 설정

```
EMAIL_SERVER=smtp://resend:re_1234567890abcdef@smtp.resend.com:587
EMAIL_FROM=onboarding@resend.dev
```

또는 커스텀 도메인 사용 시:

```
EMAIL_SERVER=smtp://resend:re_1234567890abcdef@smtp.resend.com:587
EMAIL_FROM=noreply@eng-z.com
```

---

## 방법 3: SendGrid 사용

### 1단계: SendGrid 계정 생성

1. [SendGrid](https://sendgrid.com/) 가입
2. **Settings** → **API Keys** → **Create API Key**
3. API 키 복사

### 2단계: Vercel 환경 변수 설정

```
EMAIL_SERVER=smtp://apikey:YOUR_SENDGRID_API_KEY@smtp.sendgrid.net:587
EMAIL_FROM=noreply@eng-z.com
```

---

## 방법 4: AWS SES 사용

### 1단계: AWS SES 설정

1. AWS 콘솔 → **SES** 서비스
2. 이메일 주소 인증 또는 도메인 인증
3. SMTP 자격 증명 생성

### 2단계: Vercel 환경 변수 설정

```
EMAIL_SERVER=smtp://SMTP_USERNAME:SMTP_PASSWORD@email-smtp.region.amazonaws.com:587
EMAIL_FROM=verified-email@eng-z.com
```

---

## 환경 변수 형식 설명

### EMAIL_SERVER 형식

```
smtp://[username]:[password]@[host]:[port]
```

또는 SSL/TLS 사용 시:

```
smtps://[username]:[password]@[host]:[port]
```

**예시:**

- Gmail (SSL): `smtps://user:pass@smtp.gmail.com:465`
- 일반 SMTP: `smtp://user:pass@smtp.example.com:587`

### EMAIL_FROM 형식

```
발신자이름 <email@example.com>
```

또는 간단히:

```
email@example.com
```

**예시:**

- `ENGZ AI <noreply@eng-z.com>`
- `noreply@eng-z.com`

---

## Vercel에 환경 변수 추가하는 방법

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Environment Variables** 선택
5. **Add New** 클릭
6. 변수 이름과 값 입력:
   - **Key**: `EMAIL_SERVER`
   - **Value**: `smtps://...` (위에서 생성한 값)
   - **Environment**: Production, Preview, Development 모두 선택
7. **Save** 클릭
8. `EMAIL_FROM`도 동일하게 추가
9. **Redeploy** 버튼 클릭하여 재배포

---

## 테스트 방법

환경 변수 설정 후:

1. 레벨 테스트 완료
2. 로그인한 상태에서 테스트 제출
3. 등록된 이메일 주소로 리포트 수신 확인

---

## 문제 해결

### 이메일이 발송되지 않는 경우

1. **환경 변수 확인**

   - Vercel Dashboard에서 변수가 올바르게 설정되었는지 확인
   - 재배포가 완료되었는지 확인

2. **로그 확인**

   - Vercel Dashboard → **Deployments** → 최신 배포 → **Functions** 탭
   - `/api/leveltest/send-email` 함수 로그 확인

3. **일반적인 오류**
   - `EMAIL_SERVER` 형식 오류: `smtp://` 또는 `smtps://` 확인
   - 인증 실패: 사용자명/비밀번호 확인
   - 포트 오류: 587 (TLS) 또는 465 (SSL) 확인

---

## 보안 주의사항

- ✅ 환경 변수는 절대 코드에 하드코딩하지 마세요
- ✅ `.env.local` 파일은 Git에 커밋하지 마세요
- ✅ Vercel 환경 변수는 암호화되어 저장됩니다
- ✅ 앱 비밀번호나 API 키는 정기적으로 갱신하세요

---

## 추천 서비스 비교

| 서비스       | 무료 플랜 | 월 발송 한도 | 설정 난이도   |
| ------------ | --------- | ------------ | ------------- |
| **Resend**   | ✅        | 3,000건      | ⭐ 쉬움       |
| **Gmail**    | ✅        | 500건/일     | ⭐⭐ 보통     |
| **SendGrid** | ✅        | 100건/일     | ⭐⭐ 보통     |
| **AWS SES**  | ✅        | 62,000건/월  | ⭐⭐⭐ 어려움 |

**추천**: 처음 사용하시는 경우 **Resend**가 가장 간단하고 무료 플랜이 충분합니다.
