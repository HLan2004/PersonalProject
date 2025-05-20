package com.blog.BlogBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {

    private Long id;

    @NotEmpty
    @Size(min=3,message = "first name must be minimum gerater than 4 character")
    private String username;

    @Email(message = "this email not found or this email not valid")
    private String email;

    @NotEmpty
    @Size(min=4,max = 10,message = "password must be minimum 4 characters and garater 10 characters")
    private String password;

    private String imageName;

    @NotNull
    private String about;


}
