export const tiers = [
  {
    name: "Free",
    id: null,
    href: "#",
    price: { monthly: "$0" },
    description: "Get started with AI workout generation.",
    features: [
      "100 AI workout generations per month",
      "Basic workout tracking",
      "Access to pre-made templates",
      "Community support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    price: { monthly: "$10" },
    description: "Unlock the full potential of AI workout generation.",
    features: [
      "Unlimited AI workout generations",
      "Advanced workout tracking",
      "Custom template creation",
      "Priority support",
      "Advanced analytics",
    ],
    featured: true,
  },
];

export function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Pricing
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the right plan for you
        </p>
      </div>
      <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id ?? "free"}
            className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
              tier.featured
                ? "bg-gray-900 text-white ring-gray-900"
                : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
            <p className="mt-4 text-sm leading-6">{tier.description}</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight">
                {tier.price.monthly}
              </span>
              <span className="text-sm font-semibold leading-6">/month</span>
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <span
                    className={tier.featured ? "text-white" : "text-gray-600"}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
