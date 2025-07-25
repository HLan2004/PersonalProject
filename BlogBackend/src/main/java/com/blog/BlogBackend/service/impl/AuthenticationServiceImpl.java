package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.LogInDto;
import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.VerifyDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.AuthenticationService;
import com.blog.BlogBackend.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;


@Service
@AllArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }


    public Long getCurrentUserId() {
        try {
            User currentUser = (User) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
            return currentUser != null ? currentUser.getId() : null; // Use getId() instead of getUserId()
        } catch (Exception e) {
            return null;
        }
    }

    public User getCurrentUser() {
        try {
            return (User) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }





    public User signup(RegisterDto input, MultipartFile imageFile) {
        if (userRepository.existsByUsername(input.getUsername())) {
            throw new RuntimeException("Username already exists: " + input.getUsername());
        }

        User user = new User(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()),input.getAbout());

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                user.setImageData(imageFile.getBytes());
                user.setImageType(imageFile.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read image file", e);
            }
        }
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        sendVerificationEmail(user);
        return userRepository.save(user);
    }

    public User authenticate(LogInDto input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return user;
    }

    public void verifyUser(VerifyDto input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(User user) { //TODO: Update with company logo
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
