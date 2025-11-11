export type Testimonial = {
  id: string;
  name: string;
  location: string;
  profile: "학생" | "학부모" | "사회인" | "대학생" | "고등학생" | "기타";
  segment: string;
  date: string;
  professionalism: number;
  teaching: number;
  preparation: number;
  punctuality: number;
  startPeriod: string;
  monthlyFee: string;
  review: string;
  response?: {
    author: string;
    message: string;
    date: string;
  };
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "익명",
    location: "인천",
    profile: "사회인",
    segment: "학생",
    date: "2025-11-03",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2025년 3분기",
    monthlyFee: "월 480,000원",
    review:
      "과외는 정해진 정규수업이 아닌 각 학생에 맞춘 1:1 맞춤 수업입니다. 해나쌤은 매 수업마다 제 수준에 맞춘 단어집과 회화 자료를 정성껏 준비해 주셨고 덕분에 눈에 띄게 실력이 성장했습니다. 가르침과 준비, 시간 준수까지 모든 것이 완벽했고 해나쌤을 만난 것이 큰 행운이었습니다.",
    response: {
      author: "영어친구 해나쌤",
      message:
        "우리 유민님! 첫 수업부터 목표 달성까지 함께한 시간이 너무 소중했어요. 준비해 간 자료들을 감동적으로 받아줘서 저도 더 힘낼 수 있었답니다. 앞으로도 하고 싶은 일 모두 이루길 응원할게요!",
      date: "2025-11-03",
    },
  },
  {
    id: "testimonial-2",
    name: "익명",
    location: "서울",
    profile: "사회인",
    segment: "학생",
    date: "2025-10-09",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2025년 2분기",
    monthlyFee: "월 360,000원",
    review:
      "영어 수업을 시작했을 때는 말이 잘 안 나왔지만 다양한 수업 방식과 세심한 지도 덕분에 지금은 먼저 말을 꺼낼 수 있게 됐어요. 수업이 부담스럽지 않고 매번 기대가 됩니다. 온라인 수업이지만 실시간 자료 공유 덕분에 대면처럼 느껴졌고 긍정적인 에너지를 받았습니다.",
    response: {
      author: "영어친구 해나쌤",
      message:
        "밝은 에너지 덕분에 저도 항상 기운을 얻었답니다! 꾸준함이 가장 큰 무기니까 지금처럼 자신 있게 영어로 표현해 보아요. 앞으로도 함께 달려봐요!",
      date: "2025-10-09",
    },
  },
  {
    id: "testimonial-3",
    name: "익명",
    location: "경기",
    profile: "사회인",
    segment: "학생",
    date: "2025-10-05",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2025년 2분기",
    monthlyFee: "월 660,000원",
    review:
      "아이엘츠를 단기간에 준비해야 했는데 라이팅, 스피킹 등 전 영역을 체계적으로 잡아주셔서 목표 점수를 달성했습니다. 숙제 피드백이 꼼꼼했고 수업 분위기도 따뜻해서 부담 없이 꾸준히 배울 수 있었습니다.",
    response: {
      author: "영어친구 해나쌤",
      message:
        "라이팅 템플릿을 단숨에 완성하고 목표 점수까지 해낸 열정이 정말 대단했어요! 앞으로도 원하는 목표 하나하나 이뤄 나가길 응원해요.",
      date: "2025-10-06",
    },
  },
  {
    id: "testimonial-4",
    name: "익명",
    location: "서울",
    profile: "대학생",
    segment: "학생",
    date: "2025-10-02",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2025년 3분기",
    monthlyFee: "월 120,000원",
    review:
      "토익스피킹 수업 두 번만에 IM에서 IH까지 올랐습니다. 실제 시험과 유사한 피드백을 받아 유용했고 부담 없는 분위기 덕분에 영어가 재미있어졌어요. 온라인 수업이지만 실시간 시트 공유로 대면처럼 느껴졌습니다.",
    response: {
      author: "영어친구 해나쌤",
      message:
        "짧은 기간 안에 이렇게 성장한 건 놀라운 일입니다! 항상 활기찬 태도로 수업에 참여해 줘서 고마워요. 다음 시험에서는 IH를 넘어서 AL까지 함께 도전해요!",
      date: "2025-10-02",
    },
  },
  {
    id: "testimonial-5",
    name: "익명",
    location: "부산",
    profile: "사회인",
    segment: "학생",
    date: "2025-06-10",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2025년 2분기",
    monthlyFee: "월 240,000원",
    review:
      "영어 회화 수업을 찾다가 해나쌤을 만나게 되었는데 회화 중심 수업과 다양한 과제 덕분에 실력이 크게 향상됐습니다. 자연스럽게 토익스피킹이나 오픽 준비도 욕심이 생겼어요. 집중력 있는 수업과 맞춤형 커리큘럼을 강력 추천합니다.",
    response: {
      author: "영어친구 해나쌤",
      message:
        "늦은 시간에도 꾸준히 참여해 준 성실함 덕분에 빠르게 성장했어요! 앞으로도 함께 공부하면서 회화 마스터에 도전해봐요. 화이팅!",
      date: "2025-06-10",
    },
  },
  {
    id: "testimonial-6",
    name: "익명",
    location: "서울",
    profile: "학부모",
    segment: "학부모",
    date: "2024-12-09",
    professionalism: 5,
    teaching: 5,
    preparation: 5,
    punctuality: 5,
    startPeriod: "2024년 3분기",
    monthlyFee: "월 650,000원",
    review:
      "오랜 기간 학습을 쉬었던 아이가 다시 공부하려니 걱정이 많았지만 선생님께서 잘 이끌어주셔서 열심히 따라가고 있습니다. 학원으로 이동하게 되어 마무리했지만 끝까지 좋은 말씀해 주셔서 감사합니다.",
  },
];

export const testimonialSummary = {
  total: 24,
  conversionRate: "33%",
};

export default testimonials;
