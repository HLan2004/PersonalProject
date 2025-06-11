package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.repository.DifficultyCateRepo;
import com.blog.BlogBackend.repository.MealCateRepo;
import com.blog.BlogBackend.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final MealCateRepo mealCateRepo;
    private final DifficultyCateRepo difficultyCateRepo;

    @Override
    public List<MealCate> getAllMealCategories() {
        return mealCateRepo.findAll();
    }

    @Override
    public List<DifficultyCate> getAllDifficultyCategories() {
        return difficultyCateRepo.findAll();
    }
}

