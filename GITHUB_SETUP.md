# GitHub 저장소 생성 및 배포 가이드

## 1. GitHub에서 저장소 생성

1. [GitHub.com](https://github.com)에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 설정:
   - Repository name: `engz-landing` (또는 원하는 이름)
   - Description: "ENGZ 랜딩 페이지"
   - Public 또는 Private 선택
   - **"Initialize this repository with a README" 체크 해제** (이미 로컬에 파일이 있으므로)
4. "Create repository" 클릭

## 2. 로컬 저장소와 연결

터미널에서 다음 명령어 실행:

```bash
cd "/Users/haenakim/잉즈"
git remote add origin https://github.com/YOUR_USERNAME/engz-landing.git
git branch -M main
git push -u origin main
```

**주의**: `YOUR_USERNAME`을 본인의 GitHub 사용자명으로 변경하세요.

## 3. Vercel에서 GitHub 연동

1. [vercel.com](https://vercel.com) 접속 및 로그인
2. "Add New Project" 클릭
3. "Import Git Repository"에서 방금 만든 `engz-landing` 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: **Next.js** (자동 감지됨)
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Root Directory: `./`
5. "Deploy" 클릭

## 4. 도메인 연결

배포 완료 후:

1. Vercel 대시보드 → 프로젝트 선택 → Settings → Domains
2. "Add Domain" 클릭
3. `eng-z.com` 입력
4. DNS 설정 안내에 따라 도메인 등록 업체에서 설정
