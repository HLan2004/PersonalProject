package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.LogInDto;
import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.VerifyDto;
import com.blog.BlogBackend.entity.User;

public interface AuthenticationService {

    User signup(RegisterDto input);

    User authenticate(LogInDto input);

    void verifyUser(VerifyDto input);

    void resendVerificationCode(String email);
}
