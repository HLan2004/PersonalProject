package com.blog.BlogBackend.dto;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private Long postId;
    private String title;
    private String imageName;
    private String cuisine;
    private Integer duration;
    private ContentDto content;
}
