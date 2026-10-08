import { monthlyData } from "./dashboardData";

export default function FinancialOverview({ totals, formatMoney }) {
  const expensePercentage =
    totals.income > 0
      ? Math.min(100, (totals.expenses / totals.income) * 100)
      : totals.expenses > 0
        ? 100
        : 0;

  return (
    <section className="grid grid-cols-3 gap-6">
      <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-800">Income vs Expenses</h3>
            <p className="mt-1 text-sm text-slate-400">
              Your monthly financial activity
            </p>
          </div>

          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              Expenses
            </span>
          </div>
        </div>

        <div className="mt-8 flex h-56 items-end justify-around gap-3 border-b border-slate-100 pb-2">
          {monthlyData.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-3"
            >
              <div className="flex h-full w-full max-w-14 items-end justify-center gap-1">
                <div
                  title={`Income: ${item.income}k`}
                  className="w-1/2 rounded-t-md bg-emerald-400 transition-all duration-500 hover:bg-emerald-600"
                  style={{ height: `${item.income}%` }}
                />
                <div
                  title={`Expenses: ${item.expense}k`}
                  className="w-1/2 rounded-t-md bg-rose-300 transition-all duration-500 hover:bg-rose-500"
                  style={{ height: `${item.expense}%` }}
                />
              </div>

              <span className="text-xs text-slate-400">{item.month}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Illustrative chart data. Connect your monthly summary API for real
          figures.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Your Money Snapshot</h3>
          <span className="text-xl text-emerald-400">✦</span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Here is how your recorded money is distributed.
        </p>

        <div className="mt-7">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Income</span>
            <span>{formatMoney(totals.income)}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-full rounded-full bg-emerald-400" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Expenses</span>
            <span>{formatMoney(totals.expenses)}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-rose-400"
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Current net balance</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {formatMoney(totals.balance)}
          </p>
        </div>
      </div>
    </section>
  );
}
