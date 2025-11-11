# ENGZ 랜딩 페이지 배포 가이드

eng-z.com 도메인에 배포하는 방법을 안내합니다.

## 배포 방법

### 방법 1: Vercel CLI 사용 (권장)

1. **Vercel CLI 설치**

   ```bash
   pnpm add -g vercel
   ```

2. **프로젝트 디렉토리에서 로그인**

   ```bash
   vercel login
   ```

3. **프로젝트 배포**

   ```bash
   vercel
   ```

   첫 배포 시 질문에 답변:

   - Set up and deploy? **Yes**
   - Which scope? (본인의 계정 선택)
   - Link to existing project? **No**
   - What's your project's name? **engz-landing** (또는 원하는 이름)
   - In which directory is your code located? **./**

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 방법 2: Vercel 웹 대시보드 사용

1. [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
2. "Add New Project" 클릭
3. GitHub 저장소를 선택하거나 직접 업로드
4. 프로젝트 설정:
   - Framework Preset: **Next.js**
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
5. "Deploy" 클릭

## 도메인 연결

### eng-z.com 도메인 연결하기

1. **Vercel 대시보드에서 프로젝트 선택**
2. **Settings > Domains** 메뉴로 이동
3. **Add Domain** 클릭
4. `eng-z.com` 입력
5. **Add** 클릭

### DNS 설정

도메인 등록 업체(예: 가비아, 후이즈 등)에서 다음 DNS 레코드를 추가:

#### 방법 A: CNAME 레코드 (권장)

```
Type: CNAME
Name: @ (또는 www)
Value: cname.vercel-dns.com
```

#### 방법 B: A 레코드

```
Type: A
Name: @
Value: 76.76.21.21
```

#### www 서브도메인 (선택사항)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL 인증서

Vercel은 자동으로 SSL 인증서를 발급하고 관리합니다. DNS 설정이 완료되면 몇 분 내에 HTTPS가 활성화됩니다.

## 환경 변수 (필요시)

환경 변수가 필요한 경우:

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. 변수 추가 후 재배포

## 자동 배포 설정

### GitHub 연동

1. Vercel 대시보드 > 프로젝트 > Settings > Git
2. GitHub 저장소 연결
3. 이후 `main` 브랜치에 푸시하면 자동 배포됩니다

## 배포 확인

배포가 완료되면:

- Vercel이 제공하는 URL (예: `engz-landing.vercel.app`)로 접속하여 확인
- 도메인 연결 후 `eng-z.com`으로 접속하여 확인

## 문제 해결

### DNS 전파 지연

- DNS 변경사항이 전 세계에 전파되는데 최대 48시간이 소요될 수 있습니다
- 보통 몇 시간 내에 완료됩니다

### 도메인 검증 실패

- DNS 설정이 올바른지 확인
- Vercel 대시보드의 도메인 설정에서 자세한 오류 메시지 확인

### 빌드 오류

- 로컬에서 `pnpm build` 실행하여 오류 확인
- Vercel 대시보드의 배포 로그 확인

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [도메인 연결 가이드](https://vercel.com/docs/concepts/projects/domains)
