import { useMemo, useState } from "react";
import SideBar from "../ui/SideBar";
import FinancialOverview from "./dashboard/FinancialOverview";
import SummaryCards from "./dashboard/SummaryCards";
import TransactionFormModal from "./dashboard/TransactionFormModal";
import TransactionsTable from "./dashboard/TransactionsTable";
import { formatMoney, initialTransactions } from "./dashboard/dashboardData";

export default function Dashboard() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [transactionType, setTransactionType] = useState("EXPENSE");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toLocaleDateString("en-CA"),
  });

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      savings: income - expenses,
    };
  }, [transactions]);

  const filteredTransactions = transactions.filter((transaction) =>
    `${transaction.title} ${transaction.category} ${transaction.type}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const openTransactionForm = (type) => {
    setTransactionType(type);
    setForm({
      title: "",
      amount: "",
      category: type === "INCOME" ? "Salary" : "Food",
      date: new Date().toLocaleDateString("en-CA"),
    });
    setShowForm(true);
  };

  const addTransaction = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);
    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setTransactions((previous) => [
      {
        id: Date.now(),
        title: form.title.trim(),
        category: form.category,
        date: form.date,
        amount,
        type: transactionType,
      },
      ...previous,
    ]);
    setShowForm(false);
  };

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
                A
              </div>

              <div>
                <p className="text-sm font-semibold">Anil</p>
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
                Good evening, Anil 👋
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Here's your financial overview.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openTransactionForm("INCOME")}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                + Add Income
              </button>

              <button
                onClick={() => openTransactionForm("EXPENSE")}
                className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
              >
                + Add Expense
              </button>
            </div>
          </section>

          <SummaryCards totals={totals} />

          {activePage === "Dashboard" && (
            <FinancialOverview totals={totals} formatMoney={formatMoney} />
          )}

          <TransactionsTable
            activePage={activePage}
            filteredTransactions={filteredTransactions}
            formatMoney={formatMoney}
            onDelete={(transactionId) =>
              setTransactions((previous) =>
                previous.filter((transaction) => transaction.id !== transactionId),
              )
            }
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
          setForm={setForm}
          setTransactionType={setTransactionType}
          transactionType={transactionType}
        />
      )}
    </div>
  );
}
