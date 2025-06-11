package com.blog.BlogBackend.config;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.repository.DifficultyCateRepo;
import com.blog.BlogBackend.repository.MealCateRepo;
import lombok.AllArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final DifficultyCateRepo difficultyCateRepo;
    private final MealCateRepo mealCateRepo;

    @Override
    public void run(ApplicationArguments args) {
        seedDifficultyCategories();
        seedMealCategories();
    }

    private void seedDifficultyCategories() {
        if (difficultyCateRepo.count() == 0) {
            List<DifficultyCate> defaults = List.of(
                    new DifficultyCate(null, "Easy", List.of()),
                    new DifficultyCate(null, "Medium", List.of()),
                    new DifficultyCate(null, "Hard", List.of()),
                    new DifficultyCate(null, "Professional", List.of()),
                    new DifficultyCate(null, "Ultimate", List.of())
            );
            difficultyCateRepo.saveAll(defaults);
        }
    }

    private void seedMealCategories() {
        if (mealCateRepo.count() == 0) {
            List<MealCate> defaults = List.of(
                    new MealCate(null, "Breakfast", List.of()),
                    new MealCate(null, "Lunch",     List.of()),
                    new MealCate(null, "Dinner",    List.of()),
                    new MealCate(null, "Snack",     List.of()),
                    new MealCate(null, "Dessert",   List.of())
            );
            mealCateRepo.saveAll(defaults);
        }
    }
}