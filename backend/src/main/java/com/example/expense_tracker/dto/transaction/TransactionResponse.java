
package com.example.expense_tracker.dto.transaction;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long transactionId;
    private Long categoryId;
    private String categoryName;
    private Category.CategoryType type;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;

    public TransactionResponse(
            Long transactionId,
            Long categoryId,
            String categoryName,
            Category.CategoryType type,
            BigDecimal amount,
            String description,
            LocalDate transactionDate,
            LocalDateTime createdAt) {

        this.transactionId = transactionId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
        this.createdAt = createdAt;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Category.CategoryType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}