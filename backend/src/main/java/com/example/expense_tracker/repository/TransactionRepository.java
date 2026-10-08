package com.example.expense_tracker.repository;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Transaction;
import com.example.expense_tracker.entity.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

        // Find one transaction belonging to the logged-in user
        Optional<Transaction> findByTransactionIdAndUser(
                        Long transactionId,
                        User user);

        // Get transactions with optional filters
        @Query("""
                        SELECT t
                        FROM Transaction t
                        JOIN FETCH t.category
                        WHERE t.user = :user
                          AND (:type IS NULL OR t.type = :type)
                          AND (:startDate IS NULL OR t.transactionDate >= :startDate)
                          AND (:endDate IS NULL OR t.transactionDate <= :endDate)
                        ORDER BY t.transactionDate DESC, t.transactionId DESC
                        """)
        List<Transaction> findUserTransactions(
                        @Param("user") User user,
                        @Param("type") Category.CategoryType type,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // Calculate total income or total expenses
        @Query("""
                        SELECT COALESCE(SUM(t.amount), 0)
                        FROM Transaction t
                        WHERE t.user = :user
                          AND t.type = :type
                        """)
        BigDecimal calculateTotalByUserAndType(
                        @Param("user") User user,
                        @Param("type") Category.CategoryType type);

        // Calculate current month's income or expenses
        @Query("""
                        SELECT COALESCE(SUM(t.amount), 0)
                        FROM Transaction t
                        WHERE t.user = :user
                          AND t.type = :type
                          AND t.transactionDate >= :startDate
                          AND t.transactionDate < :endDate
                        """)
        BigDecimal calculateMonthlyTotal(
                        @Param("user") User user,
                        @Param("type") Category.CategoryType type,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // Get the most recent transactions for the dashboard
        @Query("""
                        SELECT t
                        FROM Transaction t
                        JOIN FETCH t.category
                        WHERE t.user = :user
                        ORDER BY t.transactionDate DESC, t.transactionId DESC
                        """)
        List<Transaction> findRecentTransactions(
                        @Param("user") User user,
                        Pageable pageable);
}