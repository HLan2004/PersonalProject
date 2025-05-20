package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.LogInDto;
import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.VerifyDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.responses.LogInResponse;
import com.blog.BlogBackend.service.AuthenticationService;
import com.blog.BlogBackend.service.JwtService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/signup")
    public ResponseEntity<User> createUser(@Valid @RequestBody RegisterDto RegisterDto){
        User savedUser = authenticationService.signup(RegisterDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LogInResponse> authenticate(@RequestBody LogInDto logInDto){

        User authenticatedUser = authenticationService.authenticate(logInDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LogInResponse loginResponse = new LogInResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyDto verifyDto) {
        try {
            authenticationService.verifyUser(verifyDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
