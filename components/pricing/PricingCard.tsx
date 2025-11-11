import CheckoutButton from "./CheckoutButton";

type PricingCardProps = {
  plan: "monthly" | "annual";
  title: string;
  subtitle?: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  buttonVariant?: "solid" | "outline";
  buttonLabel: string;
  disabled?: boolean;
};

export default function PricingCard({
  plan,
  title,
  subtitle,
  price,
  description,
  features,
  highlight = false,
  buttonVariant = "solid",
  buttonLabel,
  disabled = false,
}: PricingCardProps) {
  return (
    <div
      className={`flex h-full flex-col gap-6 rounded-3xl border p-6 shadow-lg sm:p-8 ${
        highlight
          ? "border-[#F5472C]/40 bg-[#FFF5F3]"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="space-y-3">
        {subtitle && (
          <p className="text-xs font-semibold tracking-[0.2em] text-[#F5472C]/80">
            {subtitle}
          </p>
        )}
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-3xl font-bold text-[#F5472C]">{price}</p>
      </div>

      <ul className="space-y-3 text-sm text-gray-700">
        {features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>

      <CheckoutButton
        plan={plan}
        label={buttonLabel}
        variant={buttonVariant}
        disabled={disabled}
      />
    </div>
  );
}
