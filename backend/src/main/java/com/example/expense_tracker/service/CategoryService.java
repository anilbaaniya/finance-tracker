package com.example.expense_tracker.service;

import com.example.expense_tracker.dto.category.CategoryRequest;
import com.example.expense_tracker.dto.category.CategoryResponse;
import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;
import com.example.expense_tracker.exception.BadRequestException;
import com.example.expense_tracker.exception.ResourceNotFoundException;
import com.example.expense_tracker.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private static final List<DefaultCategory> DEFAULT_CATEGORIES = List.of(
            new DefaultCategory("Salary", Category.CategoryType.INCOME),
            new DefaultCategory("Freelance", Category.CategoryType.INCOME),
            new DefaultCategory("Business", Category.CategoryType.INCOME),
            new DefaultCategory("Investment", Category.CategoryType.INCOME),
            new DefaultCategory("Other", Category.CategoryType.INCOME),
            new DefaultCategory("Food", Category.CategoryType.EXPENSE),
            new DefaultCategory("Transport", Category.CategoryType.EXPENSE),
            new DefaultCategory("Shopping", Category.CategoryType.EXPENSE),
            new DefaultCategory("Bills", Category.CategoryType.EXPENSE),
            new DefaultCategory("Health", Category.CategoryType.EXPENSE),
            new DefaultCategory("Education", Category.CategoryType.EXPENSE),
            new DefaultCategory("Other", Category.CategoryType.EXPENSE));

    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CategoryService(
            CategoryRepository categoryRepository,
            AuthenticatedUserService authenticatedUserService) {

        this.categoryRepository = categoryRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    // ===============================
    // CREATE CATEGORY
    // ===============================

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {

        User currentUser = authenticatedUserService.getCurrentUser();

        String name = request.getName().trim();

        if (categoryRepository.existsByUserAndNameAndType(
                currentUser,
                name,
                request.getType())) {

            throw new BadRequestException(
                    "This category already exists");
        }

        Category category = new Category();

        category.setUser(currentUser);
        category.setName(name);
        category.setType(request.getType());

        Category savedCategory = categoryRepository.save(category);

        return convertToResponse(savedCategory);
    }

    // ===============================
    // GET MY CATEGORIES
    // ===============================

    @Transactional(readOnly = true)
    public List<CategoryResponse> getMyCategories() {

        User currentUser = authenticatedUserService.getCurrentUser();

        List<Category> categories = categoryRepository.findByUser(currentUser);

        return categories.stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public List<CategoryResponse> ensureDefaultCategories() {
        User currentUser = authenticatedUserService.getCurrentUser();

        for (DefaultCategory defaultCategory : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByUserAndNameAndType(
                    currentUser,
                    defaultCategory.name(),
                    defaultCategory.type())) {
                Category category = new Category();
                category.setUser(currentUser);
                category.setName(defaultCategory.name());
                category.setType(defaultCategory.type());
                categoryRepository.save(category);
            }
        }

        return categoryRepository.findByUser(currentUser).stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ===============================
    // UPDATE CATEGORY
    // ===============================

    @Transactional
    public CategoryResponse updateCategory(
            Long categoryId,
            CategoryRequest request) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Category category = categoryRepository
                .findByCategoryIdAndUser(
                        categoryId,
                        currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        String name = request.getName().trim();

        if (categoryRepository.existsByUserAndNameAndType(
                currentUser,
                name,
                request.getType())) {

            if (!category.getName().equalsIgnoreCase(name)
                    || category.getType() != request.getType()) {

                throw new BadRequestException(
                        "This category already exists");
            }
        }

        category.setName(name);
        category.setType(request.getType());

        Category updatedCategory = categoryRepository.save(category);

        return convertToResponse(updatedCategory);
    }

    // ===============================
    // DELETE CATEGORY
    // ===============================

    @Transactional
    public void deleteCategory(Long categoryId) {

        User currentUser = authenticatedUserService.getCurrentUser();

        Category category = categoryRepository
                .findByCategoryIdAndUser(
                        categoryId,
                        currentUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found"));

        categoryRepository.delete(category);
    }

    // ===============================
    // CONVERT ENTITY → RESPONSE
    // ===============================

    private CategoryResponse convertToResponse(
            Category category) {

        return new CategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getType(),
                category.getCreatedAt());
    }

    private record DefaultCategory(
            String name,
            Category.CategoryType type) {
    }
}