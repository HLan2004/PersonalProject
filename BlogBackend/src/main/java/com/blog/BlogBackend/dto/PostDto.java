package com.blog.BlogBackend.dto;

import com.blog.BlogBackend.entity.DifficultyCate;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private Long postId;
    private String title;
    private String content;
    private String imageName;
    private String cuisine;
    private Integer duration;
}
