import { useMemo, useState } from "react";
import { formatMoney } from "./dashboardData";

function pieSlicePath(startAngle, sweepAngle, radius = 90) {
  const center = 100;
  const toPoint = (angle) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };
  const start = toPoint(startAngle);
  const end = toPoint(startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;

  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export default function ReportsView({ transactions }) {
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
  const year = selectedYear || availableYears[0] || String(new Date().getFullYear());

  const report = useMemo(() => {
    const filtered = transactions.filter((transaction) =>
      transaction.date.startsWith(`${year}-`),
    );
    const months = new Map();
    const categories = new Map();
    let income = 0;
    let expenses = 0;

    for (const transaction of filtered) {
      const month = transaction.date.slice(0, 7);
      const monthTotals = months.get(month) ?? { income: 0, expenses: 0 };
      const categoryKey = `${transaction.type}:${transaction.category}`;
      const categoryTotal = categories.get(categoryKey) ?? {
        name: transaction.category,
        type: transaction.type,
        amount: 0,
      };

      if (transaction.type === "INCOME") {
        income += transaction.amount;
        monthTotals.income += transaction.amount;
      } else {
        expenses += transaction.amount;
        monthTotals.expenses += transaction.amount;
      }
      categoryTotal.amount += transaction.amount;
      months.set(month, monthTotals);
      categories.set(categoryKey, categoryTotal);
    }

    return {
      income,
      expenses,
      balance: income - expenses,
      months: [...months.entries()].sort(([left], [right]) =>
        right.localeCompare(left),
      ),
      categories: [...categories.values()].sort(
        (left, right) => right.amount - left.amount,
      ),
    };
  }, [transactions, year]);
  const totalFlow = report.income + report.expenses;
  const incomeShare = totalFlow > 0 ? report.income / totalFlow : 0;
  const incomeAngle = incomeShare * 360;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Spending reports</h3>
          <p className="mt-1 text-sm text-slate-500">
            Summaries are calculated from your saved transactions.
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

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Income", value: report.income, color: "text-emerald-700" },
          { label: "Expenses", value: report.expenses, color: "text-rose-600" },
          { label: "Net balance", value: report.balance, color: "text-slate-800" },
        ].map((item) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            key={item.label}
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className={`mt-3 text-2xl font-bold ${item.color}`}>
              {formatMoney(item.value)}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h4 className="font-bold text-slate-800">
            Income and expenses in {year}
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Compare each against the total money recorded during the year.
          </p>
        </div>

        {totalFlow === 0 ? (
          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Add income or expenses to see your pie chart for {year}.
          </p>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
            <svg
              aria-label={`Income is ${(incomeShare * 100).toFixed(1)} percent and expenses are ${((1 - incomeShare) * 100).toFixed(1)} percent of recorded money in ${year}`}
              className="h-56 w-56 shrink-0"
              role="img"
              viewBox="0 0 200 200"
            >
              {report.income > 0 && report.expenses > 0 ? (
                <>
                  <path
                    d={pieSlicePath(-90, incomeAngle)}
                    fill="#10b981"
                  />
                  <path
                    d={pieSlicePath(-90 + incomeAngle, 360 - incomeAngle)}
                    fill="#fb7185"
                  />
                </>
              ) : (
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill={report.income > 0 ? "#10b981" : "#fb7185"}
                />
              )}
            </svg>

            <div className="w-full max-w-xs space-y-5">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-700">Income</span>
                    <span className="font-semibold text-slate-800">
                      {totalFlow > 0
                        ? `${(incomeShare * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatMoney(report.income)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-3 w-3 shrink-0 rounded-full bg-rose-400"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-slate-700">Expenses</span>
                    <span className="font-semibold text-slate-800">
                      {(((report.expenses / totalFlow) * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatMoney(report.expenses)}
                  </p>
                </div>
              </div>
              <p className="border-t border-slate-100 pt-4 text-sm text-slate-500">
                Total recorded:{" "}
                <span className="font-semibold text-slate-700">
                  {formatMoney(totalFlow)}
                </span>
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h4 className="font-bold text-slate-800">Monthly totals</h4>
          </div>
          {report.months.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No transactions recorded for {year}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Month</th>
                    <th className="px-6 py-3 text-right">Income</th>
                    <th className="px-6 py-3 text-right">Expenses</th>
                    <th className="px-6 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.months.map(([month, totals]) => (
                    <tr key={month}>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {new Date(`${month}-01T12:00:00`).toLocaleDateString(
                          "en",
                          { month: "long", year: "numeric" },
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-700">
                        {formatMoney(totals.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600">
                        {formatMoney(totals.expenses)}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700">
                        {formatMoney(totals.income - totals.expenses)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h4 className="font-bold text-slate-800">Category totals</h4>
          </div>
          {report.categories.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Category totals will appear when you add transactions.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {report.categories.map((category) => (
                <li
                  className="flex items-center justify-between gap-4 px-6 py-4"
                  key={`${category.type}:${category.name}`}
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {category.type === "INCOME" ? "Income" : "Expense"}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {formatMoney(category.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
