import { useMemo, useState } from "react";
import { formatMoney } from "./dashboardData";

const sliceColors = [
  "#10b981",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#06b6d4",
  "#eab308",
  "#ec4899",
  "#64748b",
  "#14b8a6",
  "#f43f5e",
];

function getPoint(angle) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: 100 + 90 * Math.cos(radians),
    y: 100 + 90 * Math.sin(radians),
  };
}

function getSlicePath(startAngle, sweepAngle) {
  const start = getPoint(startAngle);
  const end = getPoint(startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;

  return `M 100 100 L ${start.x} ${start.y} A 90 90 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function CategoryPieChart({ title, description, categories, type }) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  const slices = categories.reduce(
    (result, category, index) => {
      const percentage = total > 0 ? category.amount / total : 0;
      const slice = {
        ...category,
        color: sliceColors[index % sliceColors.length],
        percentage,
        startAngle: result.currentAngle,
        sweepAngle: percentage * 360,
      };

      return {
        currentAngle: result.currentAngle + slice.sweepAngle,
        slices: [...result.slices, slice],
      };
    },
    { currentAngle: -90, slices: [] },
  ).slices;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {slices.length === 0 || total <= 0 ? (
        <p className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No {type.toLowerCase()} transactions for this year.
        </p>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <svg
            aria-label={`${title} pie chart`}
            className="h-48 w-48 shrink-0"
            role="img"
            viewBox="0 0 200 200"
          >
            {slices.map((slice) =>
              slice.percentage >= 1 ? (
                <circle
                  cx="100"
                  cy="100"
                  fill={slice.color}
                  key={slice.name}
                  r="90"
                />
              ) : (
                <path
                  d={getSlicePath(slice.startAngle, slice.sweepAngle)}
                  fill={slice.color}
                  key={slice.name}
                >
                  <title>
                    {slice.name}: {formatMoney(slice.amount)} (
                    {(slice.percentage * 100).toFixed(1)}%)
                  </title>
                </path>
              ),
            )}
          </svg>

          <ul className="w-full space-y-3">
            {slices.map((slice) => (
              <li
                className="flex items-start gap-3"
                key={slice.name}
              >
                <span
                  aria-hidden="true"
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-slate-700">
                      {slice.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-slate-800">
                      {(slice.percentage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatMoney(slice.amount)}
                  </p>
                </div>
              </li>
            ))}
            <li className="border-t border-slate-100 pt-3 text-sm text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-800">
                {formatMoney(total)}
              </span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}

export default function StatsView({ transactions }) {
  const availableYears = useMemo(
    () =>
      [
        ...new Set(
          transactions.map((transaction) => transaction.date.slice(0, 4)),
        ),
      ].sort((left, right) => right.localeCompare(left)),
    [transactions],
  );
  const [selectedYear, setSelectedYear] = useState("");
  const year =
    selectedYear || availableYears[0] || String(new Date().getFullYear());

  const categoryTotals = useMemo(() => {
    const totals = new Map();
    for (const transaction of transactions) {
      if (!transaction.date.startsWith(`${year}-`)) continue;
      const key = `${transaction.type}:${transaction.category}`;
      const current = totals.get(key) ?? {
        name: transaction.category,
        type: transaction.type,
        amount: 0,
      };
      current.amount += transaction.amount;
      totals.set(key, current);
    }

    return [...totals.values()].sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [transactions, year]);

  const incomeCategories = categoryTotals.filter(
    (category) => category.type === "INCOME",
  );
  const expenseCategories = categoryTotals.filter(
    (category) => category.type === "EXPENSE",
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Income and expense stats
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Compare how your income and expenses are distributed by category.
          </p>
        </div>
        <label className="text-sm font-medium text-slate-600">
          Year
          <select
            className="ml-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5"
            onChange={(event) => setSelectedYear(event.target.value)}
            value={year}
          >
            {availableYears.length === 0 && <option value={year}>{year}</option>}
            {availableYears.map((availableYear) => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CategoryPieChart
          categories={incomeCategories}
          description={`Income by category for ${year}.`}
          title="Income by category"
          type="Income"
        />
        <CategoryPieChart
          categories={expenseCategories}
          description={`Expenses by category for ${year}.`}
          title="Expenses by category"
          type="Expense"
        />
      </div>
    </section>
  );
}
