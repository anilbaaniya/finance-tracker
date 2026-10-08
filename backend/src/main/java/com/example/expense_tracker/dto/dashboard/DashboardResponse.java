
package com.example.expense_tracker.dto.dashboard;

import com.example.expense_tracker.dto.transaction.TransactionResponse;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;

    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlyBalance;

    private List<TransactionResponse> recentTransactions;

    public DashboardResponse(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal balance,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            BigDecimal monthlyBalance,
            List<TransactionResponse> recentTransactions) {

        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.balance = balance;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.monthlyBalance = monthlyBalance;
        this.recentTransactions = recentTransactions;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public BigDecimal getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public BigDecimal getMonthlyBalance() {
        return monthlyBalance;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }
}