package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByMealCate(MealCate mealCate);
    List<Post> findByDifficultyCate(DifficultyCate difficultyCate);
    List<Post> findByUser(User user);

}
