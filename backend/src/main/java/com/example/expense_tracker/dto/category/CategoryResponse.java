package com.example.expense_tracker.dto.category;

import com.example.expense_tracker.entity.Category;
import java.time.LocalDateTime;

public class CategoryResponse {

    private Long categoryId;
    private String name;
    private Category.CategoryType type;
    private LocalDateTime createdAt;

    public CategoryResponse() {
    }

    public CategoryResponse(
            Long categoryId,
            String name,
            Category.CategoryType type,
            LocalDateTime createdAt) {

        this.categoryId = categoryId;
        this.name = name;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getName() {
        return name;
    }

    public Category.CategoryType getType() {
        return type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}