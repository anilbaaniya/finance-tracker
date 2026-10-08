export default function TransactionFormModal({
  addTransaction,
  form,
  onClose,
  categories,
  error,
  isSubmitting,
  setForm,
  setTransactionType,
  transactionType,
}) {
  const availableCategories = categories.filter(
    (category) => category.type === transactionType,
  );

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
                const firstCategory = categories.find(
                  (category) => category.type === type,
                );
                setForm((previous) => ({
                  ...previous,
                  categoryId: firstCategory
                    ? String(firstCategory.categoryId)
                    : "",
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
              name="description"
              required
              maxLength={255}
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
              name="amount"
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
              required
              value={form.categoryId}
              onChange={(event) =>
                setForm({ ...form, categoryId: event.target.value })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400"
            >
              {availableCategories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            {availableCategories.length === 0 && (
              <p className="mt-1 text-sm text-rose-600">
                No categories are available for this transaction type.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <input
              name="date"
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

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

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
            disabled={isSubmitting || availableCategories.length === 0}
            className={`flex-1 rounded-xl py-3 font-semibold text-white transition ${
              transactionType === "INCOME"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
