
package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.transaction.TransactionRequest;
import com.example.expense_tracker.dto.transaction.TransactionResponse;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    // CREATE: POST /api/transactions
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request) {

        TransactionResponse response = transactionService.createTransaction(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // LIST AND FILTER: GET /api/transactions
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(
            @RequestParam(required = false) Category.CategoryType type,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<TransactionResponse> transactions = transactionService.getMyTransactions(
                type,
                startDate,
                endDate);

        return ResponseEntity.ok(transactions);
    }

    // GET ONE: GET /api/transactions/{transactionId}
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @PathVariable Long transactionId) {

        return ResponseEntity.ok(
                transactionService.getTransaction(transactionId));
    }

    // UPDATE: PUT /api/transactions/{transactionId}
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long transactionId,
            @Valid @RequestBody TransactionRequest request) {

        TransactionResponse response = transactionService.updateTransaction(
                transactionId,
                request);

        return ResponseEntity.ok(response);
    }

    // DELETE: DELETE /api/transactions/{transactionId}
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long transactionId) {

        transactionService.deleteTransaction(transactionId);

        return ResponseEntity.noContent().build();
    }
}