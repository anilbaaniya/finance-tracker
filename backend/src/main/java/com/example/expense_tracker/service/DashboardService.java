
package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.dashboard.DashboardResponse;
import com.example.expense_tracker.dto.transaction.TransactionResponse;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Transaction;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.repository.TransactionRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public DashboardService(
            TransactionRepository transactionRepository,
            AuthenticatedUserService authenticatedUserService) {

        this.transactionRepository = transactionRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {

        // 1. Get the logged-in user
        User currentUser = authenticatedUserService.getCurrentUser();

        // 2. Calculate all-time totals
        BigDecimal totalIncome = transactionRepository.calculateTotalByUserAndType(
                currentUser,
                Category.CategoryType.INCOME);

        BigDecimal totalExpenses = transactionRepository.calculateTotalByUserAndType(
                currentUser,
                Category.CategoryType.EXPENSE);

        BigDecimal balance = totalIncome.subtract(totalExpenses);

        // 3. Determine the current month's date range
        YearMonth currentMonth = YearMonth.now();

        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.plusMonths(1).atDay(1);

        // 4. Calculate current-month totals
        BigDecimal monthlyIncome = transactionRepository.calculateMonthlyTotal(
                currentUser,
                Category.CategoryType.INCOME,
                startDate,
                endDate);

        BigDecimal monthlyExpenses = transactionRepository.calculateMonthlyTotal(
                currentUser,
                Category.CategoryType.EXPENSE,
                startDate,
                endDate);

        BigDecimal monthlyBalance = monthlyIncome.subtract(monthlyExpenses);

        // 5. Retrieve the five most recent transactions
        List<Transaction> transactions = transactionRepository.findRecentTransactions(
                currentUser,
                PageRequest.of(0, 5));

        List<TransactionResponse> recentTransactions = transactions.stream()
                .map(this::convertToResponse)
                .toList();

        // 6. Return all dashboard data
        return new DashboardResponse(
                totalIncome,
                totalExpenses,
                balance,
                monthlyIncome,
                monthlyExpenses,
                monthlyBalance,
                recentTransactions);
    }

    private TransactionResponse convertToResponse(
            Transaction transaction) {

        return new TransactionResponse(
                transaction.getTransactionId(),
                transaction.getCategory().getCategoryId(),
                transaction.getCategory().getName(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt());
    }
}