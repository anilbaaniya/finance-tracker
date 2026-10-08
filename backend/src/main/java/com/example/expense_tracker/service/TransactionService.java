
package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.transaction.TransactionRequest;
import com.example.expense_tracker.dto.transaction.TransactionResponse;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.Transaction;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.BadRequestException;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.CategoryRepository;
import com.example.expense_tracker.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository,
            AuthenticatedUserService authenticatedUserService) {

        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    // CREATE TRANSACTION
    @Transactional
    public TransactionResponse createTransaction(
            TransactionRequest request) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Category category = getOwnedCategory(
                request.getCategoryId(),
                currentUser);

        validateCategoryType(category, request);

        Transaction transaction = new Transaction();

        transaction.setUser(currentUser);
        transaction.setCategory(category);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(cleanDescription(request.getDescription()));
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction saved = transactionRepository.save(transaction);

        return convertToResponse(saved);
    }

    // GET TRANSACTION HISTORY WITH OPTIONAL FILTERS
    @Transactional(readOnly = true)
    public List<TransactionResponse> getMyTransactions(
            Category.CategoryType type,
            LocalDate startDate,
            LocalDate endDate) {

        User currentUser = authenticatedUserService.getCurrentUser();

        if (startDate != null && endDate != null
                && startDate.isAfter(endDate)) {
            throw new BadRequestException(
                    "Start date cannot be after end date");
        }

        return transactionRepository.findUserTransactions(
                currentUser,
                type,
                startDate,
                endDate)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // GET ONE TRANSACTION
    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(Long transactionId) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Transaction transaction = getOwnedTransaction(
                transactionId,
                currentUser);

        return convertToResponse(transaction);
    }

    // UPDATE TRANSACTION
    @Transactional
    public TransactionResponse updateTransaction(
            Long transactionId,
            TransactionRequest request) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Transaction transaction = getOwnedTransaction(
                transactionId,
                currentUser);

        Category category = getOwnedCategory(
                request.getCategoryId(),
                currentUser);

        validateCategoryType(category, request);

        transaction.setCategory(category);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(cleanDescription(request.getDescription()));
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction updated = transactionRepository.save(transaction);

        return convertToResponse(updated);
    }

    // DELETE TRANSACTION
    @Transactional
    public void deleteTransaction(Long transactionId) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Transaction transaction = getOwnedTransaction(
                transactionId,
                currentUser);

        transactionRepository.delete(transaction);
    }

    // FIND A CATEGORY THAT BELONGS TO THE CURRENT USER
    private Category getOwnedCategory(
            Long categoryId,
            User currentUser) {

        return categoryRepository
                .findByCategoryIdAndUser(categoryId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));
    }

    // FIND A TRANSACTION THAT BELONGS TO THE CURRENT USER
    private Transaction getOwnedTransaction(
            Long transactionId,
            User currentUser) {

        return transactionRepository
                .findByTransactionIdAndUser(
                        transactionId,
                        currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction not found"));
    }

    // ENSURE INCOME USES AN INCOME CATEGORY, AND VICE VERSA
    private void validateCategoryType(
            Category category,
            TransactionRequest request) {

        if (category.getType() != request.getType()) {
            throw new BadRequestException(
                    "Transaction type must match the category type");
        }
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }

        return description.trim();
    }

    // CONVERT ENTITY INTO API RESPONSE
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