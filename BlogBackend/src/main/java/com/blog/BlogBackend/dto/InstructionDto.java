package com.blog.BlogBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InstructionDto {
    private Integer stepOrder;
    private String description;

    private MultipartFile imageFile;

    private String stepImageType;
    private String stepImageData;
}
