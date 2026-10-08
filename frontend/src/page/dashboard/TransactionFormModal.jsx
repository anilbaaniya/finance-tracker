const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Other",
];
const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Education",
  "Other",
];

export default function TransactionFormModal({
  addTransaction,
  form,
  onClose,
  setForm,
  setTransactionType,
  transactionType,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={addTransaction}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className={`text-sm font-semibold ${
                transactionType === "INCOME"
                  ? "text-emerald-600"
                  : "text-rose-500"
              }`}
            >
              NEW TRANSACTION
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">
              Add {transactionType === "INCOME" ? "Income" : "Expense"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Enter the transaction details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {["INCOME", "EXPENSE"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTransactionType(type);
                setForm((previous) => ({
                  ...previous,
                  category: type === "INCOME" ? "Salary" : "Food",
                }));
              }}
              className={`rounded-xl border p-3 text-sm font-semibold transition ${
                transactionType === type
                  ? type === "INCOME"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              {type === "INCOME" ? "↗ Income" : "↘ Expense"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Monthly salary"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Amount (NPR)
            </label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(event) =>
                setForm({ ...form, amount: event.target.value })
              }
              placeholder="Enter amount"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400"
            >
              {(transactionType === "INCOME"
                ? incomeCategories
                : expenseCategories
              ).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm({ ...form, date: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 rounded-xl py-3 font-semibold text-white transition ${
              transactionType === "INCOME"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
