package com.blog.BlogBackend.service;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;

import java.util.List;

public interface CategoryService {
    List<MealCate> getAllMealCategories();
    List<DifficultyCate> getAllDifficultyCategories();

}
