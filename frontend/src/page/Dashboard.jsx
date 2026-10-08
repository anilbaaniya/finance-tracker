import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../ui/SideBar";
import FinancialOverview from "./dashboard/FinancialOverview";
import SummaryCards from "./dashboard/SummaryCards";
import TransactionFormModal from "./dashboard/TransactionFormModal";
import TransactionsTable from "./dashboard/TransactionsTable";
import { formatMoney } from "./dashboard/dashboardData";
import {
  createTransaction as postTransaction,
  deleteTransaction as deleteTransactionRequest,
  getDashboard,
  initializeCategories,
  getTransactions,
} from "../services/api";

const emptyTotals = {
  income: 0,
  expenses: 0,
  balance: 0,
  savings: 0,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [auth] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("expenseTrackerAuth") ?? "null");
    } catch {
      return null;
    }
  });
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totals, setTotals] = useState(emptyTotals);
  const [monthlyTotals, setMonthlyTotals] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    categoryId: "",
    date: new Date().toLocaleDateString("en-CA"),
  });

  const loadDashboard = useCallback(async () => {
    const [dashboardData, transactionData] = await Promise.all([
      getDashboard(),
      getTransactions(),
    ]);
    const userCategories = await initializeCategories();

    setTotals({
      income: Number(dashboardData.totalIncome ?? 0),
      expenses: Number(dashboardData.totalExpenses ?? 0),
      balance: Number(dashboardData.balance ?? 0),
      savings: Number(dashboardData.balance ?? 0),
    });
    setMonthlyTotals({
      income: Number(dashboardData.monthlyIncome ?? 0),
      expenses: Number(dashboardData.monthlyExpenses ?? 0),
      balance: Number(dashboardData.monthlyBalance ?? 0),
    });
    setTransactions(
      transactionData.map((transaction) => ({
        id: transaction.transactionId,
        title: transaction.description || transaction.categoryName,
        category: transaction.categoryName,
        categoryId: transaction.categoryId,
        date: transaction.transactionDate,
        amount: Number(transaction.amount),
        type: transaction.type,
      })),
    );
    setCategories(userCategories);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeDashboard() {
      try {
        await loadDashboard();
      } catch (loadError) {
        if (isMounted) {
          if (loadError.status === 401 || loadError.status === 403) {
            window.localStorage.removeItem("expenseTrackerAuth");
            navigate("/login", { replace: true });
            return;
          }
          setError(loadError.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeDashboard();
    return () => {
      isMounted = false;
    };
  }, [loadDashboard, navigate]);

  const filteredTransactions = transactions.filter((transaction) =>
    `${transaction.title} ${transaction.category} ${transaction.type}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const openTransactionForm = (type) => {
    setTransactionType(type);
    const defaultCategory = categories.find(
      (category) => category.type === type,
    );
    setForm({
      title: "",
      amount: "",
      categoryId: defaultCategory ? String(defaultCategory.categoryId) : "",
      date: new Date().toLocaleDateString("en-CA"),
    });
    setOperationError("");
    setShowForm(true);
  };

  const addTransaction = async (event) => {
    event.preventDefault();

    const amount = Number(form.amount);
    if (
      !form.title.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !form.categoryId ||
      !form.date
    ) {
      setOperationError("Enter a description, a valid amount, category, and date.");
      return;
    }

    setIsSubmitting(true);
    setOperationError("");
    try {
      await postTransaction({
        categoryId: Number(form.categoryId),
        type: transactionType,
        amount,
        description: form.title.trim(),
        transactionDate: form.date,
      });
      setShowForm(false);
      try {
        await loadDashboard();
      } catch (refreshError) {
        setOperationError(
          `Transaction saved, but the dashboard could not refresh: ${refreshError.message}`,
        );
      }
    } catch (submitError) {
      if (submitError.status === 401 || submitError.status === 403) {
        window.localStorage.removeItem("expenseTrackerAuth");
        navigate("/login", { replace: true });
      } else {
        setOperationError(submitError.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    setOperationError("");
    try {
      await deleteTransactionRequest(transactionId);
      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== transactionId),
      );
      try {
        await loadDashboard();
      } catch (refreshError) {
        setOperationError(
          `Transaction deleted, but the dashboard could not refresh: ${refreshError.message}`,
        );
      }
    } catch (deleteError) {
      if (deleteError.status === 401 || deleteError.status === 403) {
        window.localStorage.removeItem("expenseTrackerAuth");
        navigate("/login", { replace: true });
      } else {
        setOperationError(deleteError.message);
      }
    }
  };

  const displayName = auth?.username?.trim() || auth?.email || "there";
  const userInitial = displayName.charAt(0).toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SideBar activePage={activePage} setActivePage={setActivePage} />

      <div className="min-h-screen ml-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur-md">
          <div>
            <p className="text-sm text-slate-400">Your workspace</p>
            <p className="font-semibold text-slate-800">{activePage}</p>
          </div>

          <div className="flex items-center gap-5">
            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
            >
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {userInitial}
              </div>

              <div>
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-slate-400">Personal Account</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-8 p-8">
          <section className="flex flex-row items-center justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                {greeting}, {displayName} 👋
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Here's your financial overview.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openTransactionForm("INCOME")}
                disabled={isLoading}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                + Add Income
              </button>

              <button
                onClick={() => openTransactionForm("EXPENSE")}
                disabled={isLoading}
                className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                + Add Expense
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          {operationError && !showForm && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {operationError}
            </div>
          )}

          <SummaryCards totals={totals} />

          {activePage === "Dashboard" && (
            <FinancialOverview
              totals={monthlyTotals}
              formatMoney={formatMoney}
            />
          )}

          <TransactionsTable
            activePage={activePage}
            filteredTransactions={filteredTransactions}
            formatMoney={formatMoney}
            isLoading={isLoading}
            onDelete={handleDeleteTransaction}
            onReturnToDashboard={() => setActivePage("Dashboard")}
            search={search}
            setSearch={setSearch}
          />
        </main>
      </div>

      {showForm && (
        <TransactionFormModal
          addTransaction={addTransaction}
          form={form}
          onClose={() => setShowForm(false)}
          categories={categories}
          error={operationError}
          isSubmitting={isSubmitting}
          setForm={setForm}
          setTransactionType={setTransactionType}
          transactionType={transactionType}
        />
      )}
    </div>
  );
}
