package com.blog.BlogBackend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEventDto {

    private Long id;

    @NotBlank(message = "Title is required and cannot be empty")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotNull(message = "Start date and time is required")
    // @Future(message = "Start date and time must be in the future") // Removed this line
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;
    private Boolean allDay;

    // Make color patterns optional by removing @Pattern or allowing empty values
    private String backgroundColor;
    private String borderColor;
    private String textColor;

    private String difficultyLevel;
    private String mealType;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be a positive number")
    private Long userId;

    @Positive(message = "Post ID must be a positive number")
    private Long postId;

    private String postTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}