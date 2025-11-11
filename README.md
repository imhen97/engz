# ENGZ Landing Page

ENGZ는 AI와 사람의 힘으로 언어의 한계를 넘는 영어 학습 플랫폼의 랜딩 페이지입니다.

## 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Pretendard** - 한글 웹폰트

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
잉즈/
├── app/
│   ├── layout.tsx      # 루트 레이아웃
│   ├── page.tsx        # 메인 랜딩 페이지
│   └── globals.css     # 전역 스타일
├── public/             # 정적 파일 (이미지 등)
└── package.json        # 프로젝트 설정
```

## 주요 기능

- **Hero 섹션**: 스크롤 애니메이션이 적용된 메인 비주얼
- **서비스 섹션**: ENGZ Core 서비스 소개 (1:1 맞춤 코칭, AI 피드백, 주간 성장 리포트)
- **CEO 소개**: 설립자 김해나님의 소개
- **요금제**: 3가지 플랜 제공 (Starter, Standard, Pro)
- **문의 섹션**: 카카오톡, 인스타그램, 이메일 문의 버튼

## 커스터마이징

### 프로필 이미지 추가

`public/profile.jpeg` 파일을 추가하면 CEO 소개 섹션에 표시됩니다.
이미지가 없을 경우 이니셜(HK)이 그라데이션 배경과 함께 표시됩니다.

### 아이콘 이미지 추가

문의 섹션의 버튼 아이콘을 추가하려면 다음 파일들을 `public/` 폴더에 추가하세요:

- `kakao-icon.png` - 카카오톡 아이콘
- `insta-icon.png` - 인스타그램 아이콘
- `mail-icon.png` - 이메일 아이콘

아이콘이 없어도 버튼은 정상적으로 작동합니다.

### 색상 변경

메인 브랜드 컬러는 `#F5472C`입니다. 이 색상을 변경하려면 `app/page.tsx` 파일에서 해당 색상 코드를 찾아 수정하거나, `tailwind.config.js`에서 테마를 확장하여 커스텀 색상을 정의할 수 있습니다.

## 빌드

프로덕션 빌드를 생성하려면:

```bash
pnpm build
```

빌드된 애플리케이션을 실행하려면:

```bash
pnpm start
```
