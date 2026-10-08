package com.example.expense_tracker.repository;

import com.example.expense_tracker.entity.Category;
import com.example.expense_tracker.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUser(User user);

    Optional<Category> findByCategoryIdAndUser(
            Long categoryId,
            User user);

    boolean existsByUserAndNameAndType(
            User user,
            String name,
            Category.CategoryType type);
}