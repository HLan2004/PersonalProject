package com.blog.BlogBackend.controller;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/meals")
    public List<MealCate> getAllMealCategories() {
        return categoryService.getAllMealCategories();
    }

    @GetMapping("/difficulties")
    public List<DifficultyCate> getAllDifficultyCategories() {
        return categoryService.getAllDifficultyCategories();
    }
}