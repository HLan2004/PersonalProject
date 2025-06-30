package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PostRepo extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    Optional<Post> findById(Long id);
    Optional<Post> findFirstByDateAfterOrderByCountLikeDesc(Date date);
    List<Post> findByUserAndMealCate(User user, MealCate mealCate);

    @Query("SELECT p FROM Post p WHERE " +
            "(:mealCate IS NULL OR p.mealCate = :mealCate) AND " +
            "(:difficultyCate IS NULL OR p.difficultyCate = :difficultyCate)")
    List<Post> findByMealCateAndDifficultyCate(
            @Param("mealCate") MealCate mealCate,
            @Param("difficultyCate") DifficultyCate difficultyCate);

    @Query("SELECT p FROM Post p WHERE " +
            "(:title IS NULL OR :title = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:mealCate IS NULL OR p.mealCate = :mealCate) AND " +
            "(:difficultyCate IS NULL OR p.difficultyCate = :difficultyCate)")
    List<Post> findByTitleAndMealCateAndDifficultyCate(
            @Param("title") String title,
            @Param("mealCate") MealCate mealCate,
            @Param("difficultyCate") DifficultyCate difficultyCate);


    @Query("SELECT p FROM Post p WHERE p.user IN " +
            "(SELECT f.following FROM Follow f WHERE f.follower = :currentUser)")
    List<Post> findPostsByFollowedUsers(@Param("currentUser") User currentUser);
}
