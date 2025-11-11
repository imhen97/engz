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
    name: "Sungmin Ryu",
    role: "Pilot",
    city: "Seoul",
    course: "Business English Intensive",
    duration: "6-week sprint",
    improvement: "Now briefing international crews daily",
    story:
      "After six weeks with ENGZ, pre-flight briefings stopped feeling like an obstacle. The coaching team drilled real cockpit scenarios with me, corrected my phrasing, and made sure my tone sounded calm and authoritative. I now lead multilingual crews without pausing to translate in my head.",
  },
  {
    id: "testimonial-hayley",
    name: "Hayley Kim",
    role: "Hotel General Manager",
    city: "Busan",
    course: "Presentation Coaching",
    duration: "8-week leadership track",
    improvement: "Closed a new partnership with a U.S. travel brand",
    story:
      "I manage regional operations for a luxury hotel group, but presenting in English to overseas partners always felt shaky. ENGZ rebuilt my pitch deck, rehearsed every Q&A, and coached me on intonation. Two months later I signed a new alliance with a U.S. agency — entirely in English.",
  },
  {
    id: "testimonial-minjun",
    name: "Minjun Park",
    role: "University Student",
    city: "Daejeon",
    course: "IELTS Speaking Accelerator",
    duration: "5-week exam camp",
    improvement: "Band 5.5 → 7.0 in speaking",
    story:
      "I had failed the speaking section twice. ENGZ diagnosed my weak pronunciation patterns and trained me with AI-generated feedback. The daily mission recordings felt tough, but by week five my examiner said my answers sounded ‘clear and confident’. I finally hit the 7.0 mark I needed for graduate school abroad.",
  },
  {
    id: "testimonial-ari",
    name: "Ari Jeong",
    role: "Marketing Executive",
    city: "Singapore",
    course: "Business English Intensive",
    duration: "7-week growth sprint",
    improvement: "Delivered a global product launch in English",
    story:
      "I lead campaigns for a fintech company, and English meetings always drained me. ENGZ focused on storytelling, negotiation phrases, and live rehearsal with tough feedback. By week seven I led our global launch webinar without switching back to Korean once.",
  },
  {
    id: "testimonial-daon",
    name: "Daon Choi",
    role: "Flight Attendant",
    city: "Incheon",
    course: "Daily Conversation Mastery",
    duration: "90-day habit program",
    improvement: "Passenger satisfaction score up 18%",
    story:
      "My airline tracks English service comments every month. ENGZ designed micro-missions that matched actual in-flight scenarios and coached my pronunciation daily. Three months later, English compliments doubled and my supervisor asked me to mentor new crew members.",
  },
  {
    id: "testimonial-wooju",
    name: "Wooju Seo",
    role: "CFO & Co-founder",
    city: "Seoul",
    course: "Investor Pitch Lab",
    duration: "4-week accelerator",
    improvement: "Raised $4.2M from a U.S. VC",
    story:
      "Our SaaS startup kept losing momentum when investor meetings switched to English. ENGZ dissected my pitch, tightened every metric explanation, and simulated rapid-fire questions. After four weeks I closed our Series A with an American lead investor.",
  },
  {
    id: "testimonial-sofia",
    name: "Sofia Lee",
    role: "High School Teacher",
    city: "Daegu",
    course: "TOEIC Speaking Pro",
    duration: "6-week certification plan",
    improvement: "Score 140 → 180 on TOEIC Speaking",
    story:
      "I teach social studies but needed a higher TOEIC Speaking score for promotion. ENGZ mapped out a daily speaking ladder, recorded every answer, and highlighted the exact grammar slips that cost me points. I submitted the 180 scorecard to my principal last month.",
  },
  {
    id: "testimonial-hannah",
    name: "Hannah Yoo",
    role: "Corporate Lawyer",
    city: "New York",
    course: "Advanced Negotiation English",
    duration: "10-week immersion",
    improvement: "Negotiated cross-border deal in English",
    story:
      "I moved to New York for work but still drafted negotiation clauses in Korean first. ENGZ built case studies from my actual deals, drilled me on precise legal phrasing, and used AI feedback to polish my delivery. Now I negotiate term sheets directly with U.S. counsel.",
  },
];

export const testimonialSummary = {
  total: 24,
  conversionRate: "33%",
};

export default testimonials;
