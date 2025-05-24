package com.blog.BlogBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentDto {
    private String description;
    private String descriptionImage;
    private List<String> ingredients;
    private List<InstructionDto> instructions;
    // getters / setters
}
