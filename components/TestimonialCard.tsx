import { Testimonial } from "@/data/testimonials";

type RatingKey = "professionalism" | "teaching" | "preparation" | "punctuality";

const categoryLabels: { key: RatingKey; label: string }[] = [
  { key: "professionalism", label: "전문성" },
  { key: "teaching", label: "강의력" },
  { key: "preparation", label: "준비성" },
  { key: "punctuality", label: "시간준수" },
];

const renderStars = (score: number) => {
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(
      <span key={i} className={i < score ? "text-[#F5472C]" : "text-gray-200"}>
        ★
      </span>
    );
  }
  return <div className="text-[0.85rem] leading-none">{stars}</div>;
};

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
      <header className="flex flex-col gap-3 text-left">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            {testimonial.segment}
          </span>
          <span>{testimonial.location}</span>
          <span>{testimonial.profile}</span>
          <span>{testimonial.date.replace(/-/g, ".")}</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">
            수업 시작{" "}
            <strong className="text-gray-900">{testimonial.startPeriod}</strong>
          </p>
        </div>
      </header>

      <ul className="grid gap-3 rounded-2xl bg-[#FFF5F3] p-4 text-sm text-gray-700 sm:grid-cols-2">
        {categoryLabels.map(({ key, label }) => (
          <li key={key} className="flex items-center justify-between gap-3">
            <span>{label}</span>
            {renderStars(testimonial[key])}
          </li>
        ))}
      </ul>

      <p className="flex-1 text-sm leading-relaxed text-gray-700">
        {testimonial.review}
      </p>
    </article>
  );
}
