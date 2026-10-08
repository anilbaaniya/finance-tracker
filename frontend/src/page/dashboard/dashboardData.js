export const initialTransactions = [
  {
    id: 1,
    title: "Monthly Salary",
    category: "Salary",
    date: "2026-10-01",
    amount: 60000,
    type: "INCOME",
  },
  {
    id: 2,
    title: "Lunch",
    category: "Food",
    date: "2026-10-04",
    amount: 500,
    type: "EXPENSE",
  },
  {
    id: 3,
    title: "Bus Fare",
    category: "Transport",
    date: "2026-10-03",
    amount: 200,
    type: "EXPENSE",
  },
  {
    id: 4,
    title: "Freelance Work",
    category: "Freelance",
    date: "2026-10-02",
    amount: 5000,
    type: "INCOME",
  },
  {
    id: 5,
    title: "Groceries",
    category: "Food",
    date: "2026-10-02",
    amount: 1800,
    type: "EXPENSE",
  },
];

export const monthlyData = [
  { month: "May", income: 45, expense: 25 },
  { month: "Jun", income: 65, expense: 35 },
  { month: "Jul", income: 55, expense: 30 },
  { month: "Aug", income: 80, expense: 45 },
  { month: "Sep", income: 70, expense: 38 },
  { month: "Oct", income: 95, expense: 48 },
];

export const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
