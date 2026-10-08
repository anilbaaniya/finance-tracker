import { useNavigate } from "react-router-dom";

const navigation = [
  { label: "Dashboard", icon: "◫" },
  { label: "Transactions", icon: "⇄" },
  { label: "Categories", icon: "▦" },
  { label: "Reports", icon: "▥" },
  { label: "Settings", icon: "⚙" },
];

export default function SideBar({ activePage, setActivePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("expenseTrackerAuth");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-white shadow-lg shadow-emerald-200">
          ₹
        </div>

        <div>
          <h1 className="text-lg font-extrabold tracking-tight">
            Expense<span className="text-emerald-500">Track</span>
          </h1>

          <p className="text-xs text-slate-400">Personal Finance</p>
        </div>
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.label}
              onClick={() => setActivePage(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                activePage === item.label
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="w-6 text-center text-lg">{item.icon}</span>

              {item.label}

              {activePage === item.label && (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            ✨
          </div>

          <p className="font-semibold text-slate-800">Smart money habits</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Small steps today can make a big difference tomorrow.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <span className="text-lg">↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
