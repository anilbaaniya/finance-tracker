import { useState } from "react";

const initialForm = { name: "", type: "EXPENSE" };

export default function CategoriesView({
  categories,
  onCreate,
  onDelete,
  onUpdate,
  transactions,
}) {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editingCategory = categories.find(
    (category) => category.categoryId === editingId,
  );
  const isEditingUsedCategory =
    editingCategory &&
    transactions.some(
      (transaction) =>
        transaction.categoryId === editingCategory.categoryId,
    );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (name.length < 2 || name.length > 100) {
      setError("Category name must be between 2 and 100 characters.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      if (editingId === null) {
        await onCreate({ name, type: form.type });
      } else {
        await onUpdate(editingId, { name, type: form.type });
      }
      resetForm();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const beginEdit = (category) => {
    setEditingId(category.categoryId);
    setForm({ name: category.name, type: category.type });
    setError("");
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h3 className="font-bold text-slate-800">Your categories</h3>
          <p className="mt-1 text-sm text-slate-400">
            Manage the categories used to organize your income and expenses.
          </p>
        </div>
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No categories found. Create one to organize transactions.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => {
              const isUsed = transactions.some(
                (transaction) =>
                  transaction.categoryId === category.categoryId,
              );
              return (
                <li
                  key={category.categoryId}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-700">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {category.type === "INCOME" ? "Income" : "Expense"}
                      {isUsed ? " · Used by transactions" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                      onClick={() => beginEdit(category)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={isUsed}
                      onClick={() => onDelete(category.categoryId)}
                      title={
                        isUsed
                          ? "A category used by transactions cannot be deleted."
                          : "Delete category"
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form
        className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={submit}
      >
        <h3 className="font-bold text-slate-800">
          {editingId === null ? "Create category" : "Edit category"}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Keep categories clear and easy to recognize.
        </p>

        <label
          className="mb-2 mt-6 block text-sm font-medium text-slate-700"
          htmlFor="category-name"
        >
          Name
        </label>
        <input
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
          id="category-name"
          maxLength={100}
          minLength={2}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          required
          value={form.name}
        />

        <label
          className="mb-2 mt-4 block text-sm font-medium text-slate-700"
          htmlFor="category-type"
        >
          Type
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400"
          disabled={Boolean(isEditingUsedCategory)}
          id="category-type"
          onChange={(event) =>
            setForm((current) => ({ ...current, type: event.target.value }))
          }
          value={form.type}
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        {isEditingUsedCategory && (
          <p className="mt-1 text-xs text-slate-500">
            The type cannot be changed while this category is used by a
            transaction.
          </p>
        )}

        {error && (
          <p
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          {editingId !== null && (
            <button
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          )}
          <button
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving
              ? "Saving..."
              : editingId === null
                ? "Create category"
                : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
