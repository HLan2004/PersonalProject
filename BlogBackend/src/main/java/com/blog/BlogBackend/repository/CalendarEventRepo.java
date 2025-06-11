
package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.CalendarEvent;
import com.blog.BlogBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CalendarEventRepo extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByUser(User user);

    List<CalendarEvent> findByUserId(Long userId);

    @Query("SELECT ce FROM CalendarEvent ce WHERE ce.user.id = :userId " +
            "AND ce.startDateTime >= :startDate " +
            "AND ce.startDateTime <= :endDate " +
            "ORDER BY ce.startDateTime ASC")

    List<CalendarEvent> findByUserAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    List<CalendarEvent> findByPostPostId(Long postId);

    List<CalendarEvent> findByUserIdAndDifficultyLevel(Long userId, String difficultyLevel);

    List<CalendarEvent> findByUserIdAndMealType(Long userId, String mealType);

    @Query("SELECT COUNT(ce) FROM CalendarEvent ce WHERE ce.user.id = :userId " +
            "AND YEAR(ce.startDateTime) = :year " +
            "AND MONTH(ce.startDateTime) = :month")
    Long countEventsInMonth(@Param("userId") Long userId,
                            @Param("year") int year,
                            @Param("month") int month);
}