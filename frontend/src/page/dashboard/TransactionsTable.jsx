export default function TransactionsTable({
  activePage,
  filteredTransactions,
  formatMoney,
  isLoading,
  onDelete,
  onEdit,
  onReturnToDashboard,
  search,
  setSearch,
}) {
  const isDashboard = activePage === "Dashboard";
  const displayedTransactions = filteredTransactions.slice(
    0,
    isDashboard ? 5 : undefined,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6">
        <div>
          <h3 className="font-bold text-slate-800">
            {isDashboard ? "Recent Transactions" : activePage}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {activePage === "Transactions"
              ? "Search all recorded transactions."
              : "Your latest income and expenses."}
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-64 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />

          {!isDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      <div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Transaction</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 text-right font-semibold">Amount</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                        transaction.type === "INCOME"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "↗" : "↘"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {transaction.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.type === "INCOME"
                          ? "Money received"
                          : "Money spent"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {transaction.category}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(`${transaction.date}T12:00:00`).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </td>

                <td
                  className={`px-6 py-4 text-right text-sm font-bold ${
                    transaction.type === "INCOME"
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "−"}
                  {formatMoney(transaction.amount)}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(transaction)}
                    title="Edit transaction"
                    className="rounded-lg px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    title="Delete transaction"
                    className="rounded-lg px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-slate-700">
              {isLoading ? "Loading your transactions..." : "No transactions yet"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {isLoading
                ? "Your account data is being loaded."
                : search
                  ? "Try another search or clear the search field."
                  : "Add income or an expense to get started."}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
        Showing {displayedTransactions.length} of {filteredTransactions.length}{" "}
        transactions
      </div>
    </section>
  );
}
