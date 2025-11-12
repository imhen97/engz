# Vercel 환경 변수 가져오기 가이드

## 문제: `vercel link` 오류

`Error: Detected linked project does not have "id"` 오류가 발생하는 경우, 다음 방법을 시도하세요.

## 해결 방법

### 방법 1: 프로젝트를 직접 지정하여 환경 변수 가져오기 (권장)

```bash
# 1. Vercel 프로젝트 목록 확인
vercel projects ls

# 2. 프로젝트 이름 확인 후 직접 가져오기
vercel env pull .env.local --project=프로젝트이름 --yes
```

예시:

```bash
vercel env pull .env.local --project=engz --yes
```

### 방법 2: Vercel 대시보드에서 수동으로 확인

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 각 변수의 값을 복사하여 `.env.local` 파일에 수동으로 입력

### 방법 3: Vercel CLI 재설치 및 재로그인

```bash
# Vercel CLI 재설치
npm uninstall -g vercel
npm install -g vercel

# 재로그인
vercel logout
vercel login

# 프로젝트 목록 확인
vercel projects ls

# 환경 변수 가져오기 (프로젝트 이름 지정)
vercel env pull .env.local --project=프로젝트이름 --yes
```

## .env.local 파일 생성

`env.template` 파일을 복사하여 시작할 수 있습니다:

```bash
cp env.template .env.local
```

그 다음 `.env.local` 파일을 열어 Vercel 대시보드에서 복사한 실제 값들을 입력하세요.

## 확인 사항

`.env.local` 파일이 생성되었는지 확인:

```bash
ls -la .env.local
```

파일이 생성되었다면 다음 내용이 포함되어야 합니다:

- `NEXTAUTH_URL=https://www.eng-z.com`
- `NEXTAUTH_SECRET=...`
- `GOOGLE_ID=...`
- `GOOGLE_SECRET=...`
- `KAKAO_ID=...`
- `KAKAO_SECRET=...`
- `DATABASE_URL=...`
- 기타 환경 변수들

## 보안 주의사항

⚠️ **중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

- `.gitignore`에 이미 포함되어 있습니다
- 실제 값이 GitHub에 올라가면 보안 문제가 발생할 수 있습니다
