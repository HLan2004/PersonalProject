package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.RegisterDto;
import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface UserService {
    UserDto updateProfile(UserDto userDto);

    UserDto toDto(User user);

    User findById(Long id);

    List<UserDto> searchUsersByUsername(String username);
}
