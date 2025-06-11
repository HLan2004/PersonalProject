package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.LogInDto;
import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.VerifyDto;
import com.blog.BlogBackend.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface AuthenticationService {
    Long getCurrentUserId();

    User getCurrentUser();

    User signup(RegisterDto input, MultipartFile imageFile);

    User authenticate(LogInDto input);

    void verifyUser(VerifyDto input);

    void resendVerificationCode(String email);
}
