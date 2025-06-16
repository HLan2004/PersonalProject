
package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    public UserDto updateProfile(UserDto userDto) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        currentUser.setAbout(userDto.getAbout());

        MultipartFile imageFile = userDto.getImageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                currentUser.setImageData(imageFile.getBytes());
                currentUser.setImageType(imageFile.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        User savedUser = userRepo.save(currentUser);
        return toDto(savedUser);
    }

    @Override
    public User findById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }


    @Override
    public List<UserDto> searchUsersByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return List.of();
        }

        List<User> users = userRepo.findByUsernameContainingIgnoreCase(username.trim());
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setUsername(user.getBlogUsername());
        dto.setEmail(user.getEmail());
        dto.setAbout(user.getAbout());
        if (user.getImageData() != null) {
            dto.setImageType(user.getImageType());
            dto.setImageData(Base64.getEncoder()
                    .encodeToString(user.getImageData()));
        }
        return dto;
    }
}