package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.MealCate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealCateRepo extends JpaRepository<MealCate, Long> {
}
