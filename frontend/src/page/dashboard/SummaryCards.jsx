import { formatMoney } from "./dashboardData";

const cards = [
  {
    title: "Total Balance",
    amountKey: "balance",
    icon: "◈",
    color: "emerald",
    subtitle: "Income minus expenses",
    featured: true,
  },
  {
    title: "Total Income",
    amountKey: "income",
    icon: "↗",
    color: "blue",
    subtitle: "All recorded income",
  },
  {
    title: "Total Expenses",
    amountKey: "expenses",
    icon: "↘",
    color: "rose",
    subtitle: "All recorded expenses",
  },
  {
    title: "Net Savings",
    amountKey: "savings",
    icon: "◉",
    color: "violet",
    subtitle: "Income − expenses",
  },
];

const colors = {
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    value: "text-blue-700",
  },
  rose: {
    icon: "bg-rose-100 text-rose-600",
    value: "text-rose-600",
  },
  violet: {
    icon: "bg-violet-100 text-violet-700",
    value: "text-violet-700",
  },
};

export default function SummaryCards({ totals }) {
  return (
    <section className="grid grid-cols-4 gap-5">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          {...card}
          amount={totals[card.amountKey]}
        />
      ))}
    </section>
  );
}

function SummaryCard({ title, amount, icon, color, subtitle, featured }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
        featured
          ? "border-emerald-200 bg-linear-to-br from-emerald-50 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colors[color].icon}`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-5 wrap-break-word text-3xl font-extrabold tracking-tight ${colors[color].value}`}
      >
        {formatMoney(amount)}
      </p>

      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}
