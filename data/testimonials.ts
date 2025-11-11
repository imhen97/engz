export type Testimonial = {
  id: string;
  name: string;
  role: string;
  city: string;
  course: string;
  duration: string;
  improvement: string;
  story: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-sungmin",
    name: "류ㅇㅇ",
    role: "파일럿",
    city: "서울",
    course: "비즈니스 영어 인텐시브",
    duration: "6주 집중 과정",
    improvement: "지금은 매일 국제 승무원 브리핑 진행",
    story:
      "6주 동안 ENGZ와 함께하면서 영어 브리핑이 더 이상 두려움이 아니게 되었습니다. 실제 운항 상황을 그대로 가져온 코칭과 세밀한 발음 교정 덕분에, 머릿속에서 한국어를 번역하지 않아도 자연스럽게 말이 나옵니다. 지금은 외국인 승무원 앞에서도 침착하게 지시하고 팀을 이끌 수 있게 되었어요.",
  },
  {
    id: "testimonial-hayley",
    name: "김ㅇㅇ",
    role: "호텔 총지배인",
    city: "부산",
    course: "프레젠테이션 코칭",
    duration: "8주 리더십 트랙",
    improvement: "미국 여행 브랜드와 신규 제휴 체결",
    story:
      "해외 파트너를 상대로 프레젠테이션할 때마다 긴장했는데, ENGZ가 제 발표 자료를 처음부터 다시 설계해 주고 Q&A까지 반복 연습해 줬습니다. 억양과 속도를 잡아준 덕분에, 8주 후 미국 파트너와 전 과정을 영어로 협상해 제휴 계약을 성사시켰습니다.",
  },
  {
    id: "testimonial-minjun",
    name: "박ㅇㅇ",
    role: "대학교 4학년",
    city: "대전",
    course: "IELTS 스피킹 집중",
    duration: "5주 시험 캠프",
    improvement: "스피킹 5.5 → 7.0",
    story:
      "스피킹에서 매번 5점대에 머물렀는데, ENGZ가 발음 패턴을 분석해 매일 미션을 주고 AI 피드백으로 약점을 짚어줬습니다. 5주 차 실전 모의시험에서 처음으로 7.0을 기록했고, 실제 시험에서도 그대로 점수를 받아 해외 대학원 지원 조건을 충족했습니다.",
  },
  {
    id: "testimonial-ari",
    name: "정ㅇㅇ",
    role: "마케팅 이사",
    city: "싱가포르",
    course: "비즈니스 영어 인텐시브",
    duration: "7주 성장 스프린트",
    improvement: "글로벌 런칭 웨비나 단독 진행",
    story:
      "다국적 팀과 회의할 때마다 표현이 막히곤 했는데, ENGZ가 스토리텔링 구조부터 협상 표현까지 제 업무에 맞춰 훈련해 줬습니다. 7주 만에 글로벌 제품 발표 웨비나를 처음부터 끝까지 영어로 진행했고, 이후 사내에서 영어 발표는 제가 맡게 되었어요.",
  },
  {
    id: "testimonial-daon",
    name: "최ㅇㅇ",
    role: "항공 승무원",
    city: "인천",
    course: "데일리 회화 마스터",
    duration: "90일 습관 프로그램",
    improvement: "영어 서비스 만족도 18% 상승",
    story:
      "ENGZ는 실제 기내 상황을 반영한 미션과 매일 발음 코칭을 제공했습니다. 3개월 동안 꾸준히 연습한 결과 승객 칭찬 메시지가 두 배 이상 늘었고, 영어 대응이 뛰어나다는 이유로 신규 승무원 교육까지 맡게 되었습니다.",
  },
  {
    id: "testimonial-wooju",
    name: "서ㅇㅇ",
    role: "CFO & 공동 창업자",
    city: "서울",
    course: "투자자 피치 랩",
    duration: "4주 집중 과정",
    improvement: "미국 VC로부터 42억 원 투자 유치",
    story:
      "투자 미팅이 영어로 전환되면 설명이 흐트러졌는데, ENGZ가 우리 지표와 비즈니스 모델을 바탕으로 피치 덱을 다듬고 예상 질문을 끝까지 시뮬레이션해 줬습니다. 4주 후 미국 투자사와의 미팅에서 모든 질답을 영어로 소화하며 시리즈 A 투자를 유치했습니다.",
  },
  {
    id: "testimonial-sofia",
    name: "이ㅇㅇ",
    role: "고등학교 교사",
    city: "대구",
    course: "TOEIC Speaking Pro",
    duration: "6주 자격 준비",
    improvement: "TOEIC Speaking 140 → 180",
    story:
      "승진을 위해 TOEIC Speaking 점수가 필요했는데, ENGZ가 답변 구조와 억양을 세밀하게 피드백해 주고 매 수업마다 녹음한 파일을 분석해 주었습니다. 6주 만에 점수를 40점 올려 180점을 달성했고, 학교에서도 영어 수업 시범교사로 추천받았습니다.",
  },
  {
    id: "testimonial-hannah",
    name: "유ㅇㅇ",
    role: "기업 변호사",
    city: "뉴욕",
    course: "어드밴스드 협상 영어",
    duration: "10주 몰입 과정",
    improvement: "국제 계약 협상 전 과정을 영어로 진행",
    story:
      "뉴욕 사무소로 발령받고도 협상 문서를 항상 한국어로 작성한 뒤 번역했는데, ENGZ가 실제 계약서를 기반으로 표현을 다듬고 상황별 롤플레이를 반복해 줬습니다. 10주가 지나자 영어로 바로 용어가 떠오르기 시작했고, 최근 크로스보더 딜 협상을 처음부터 끝까지 영어로 마무리했습니다.",
  },
];

export const testimonialSummary = {
  total: 24,
  conversionRate: "33%",
};

export default testimonials;
