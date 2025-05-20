package com.blog.BlogBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private String title;
    private String content;
    private Date date;
    private String imageName;
    private String cuisine;
    private Integer duration;
    private Integer countLike;
    private DifficultyCateDto difficulty;
    private MealCateDto category;
    private RegisterDto user;
    private Set<CommentDto> comSet = new HashSet<>();
}
