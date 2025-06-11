package com.blog.BlogBackend.dto;

import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private Long postId;
    private String title;
    private String cuisine;
    private Integer duration;
    private LocalDate date;
    private Integer countLike;
    private Set<Long> likedUserIds;
    private DifficultyCate difficultyCate;
    private MealCate mealCate;


    @JsonProperty("isLikedByCurrentUser")
    private boolean likedByCurrentUser;



    // Former Content fields
    private String description;
    private List<String> ingredients;
    private List<InstructionDto> instructions;

    private MultipartFile imageFile;

    private String imageType;
    private String imageData;

    private String authorName;
    private byte[] authorAvatar;
    private String authorAvatarType;


}
