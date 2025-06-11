package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.LogInDto;
import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.VerifyDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.responses.LogInResponse;
import com.blog.BlogBackend.service.AuthenticationService;
import com.blog.BlogBackend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> createUser(
            @ModelAttribute @Valid RegisterDto registerDto,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile){
        User savedUser = authenticationService.signup(registerDto, imageFile);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LogInResponse> authenticate(@RequestBody LogInDto logInDto){

        User authenticatedUser = authenticationService.authenticate(logInDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LogInResponse loginResponse = new LogInResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null) {
            jwtService.invalidateToken(token);
            return ResponseEntity.ok().body("Logged out successfully");
        }
        return ResponseEntity.ok().body("No active session found");
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

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

}
