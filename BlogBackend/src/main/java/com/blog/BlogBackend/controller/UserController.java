package com.blog.BlogBackend.controller;

import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user")
@AllArgsConstructor
@NoArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(currentUser);
    }


}
