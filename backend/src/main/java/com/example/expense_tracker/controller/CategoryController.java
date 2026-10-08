package com.example.expense_tracker.controller;

import com.example.expense_tracker.dto.category.CategoryRequest;
import com.example.expense_tracker.dto.category.CategoryResponse;
import com.example.expense_tracker.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService) {

        this.categoryService = categoryService;
    }

    // ===============================
    // CREATE CATEGORY
    // POST /api/categories
    // ===============================

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse response = categoryService.createCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ===============================
    // GET MY CATEGORIES
    // GET /api/categories
    // ===============================

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getMyCategories() {

        List<CategoryResponse> categories = categoryService.getMyCategories();

        return ResponseEntity.ok(categories);
    }

    // ===============================
    // UPDATE CATEGORY
    // PUT /api/categories/{categoryId}
    // ===============================

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse response = categoryService.updateCategory(
                categoryId,
                request);

        return ResponseEntity.ok(response);
    }

    // ===============================
    // DELETE CATEGORY
    // DELETE /api/categories/{categoryId}
    // ===============================

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId) {

        categoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }
}