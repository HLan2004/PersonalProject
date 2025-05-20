package com.blog.BlogBackend.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DifficultyCateDto {

    private Long id;

    @NotEmpty
    @Size(max=100,message="this title not sutable")
    @Column(name="title")
    private String DifficultyTitle;

    @NotNull
    @Column(name="Description")
    private String DifficultyDescription;
}
