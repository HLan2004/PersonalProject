
package com.blog.BlogBackend.controller;

import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.service.FollowService;
import com.blog.BlogBackend.service.PostService;
import com.blog.BlogBackend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FollowService followService;

    @Autowired
    private PostService postService;


    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        User u = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(userService.toDto(u));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId);
            UserDto userDto = userService.toDto(user);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam(required = false) String username) {
        List<UserDto> users = userService.searchUsersByUsername(username);
        return ResponseEntity.ok(users);
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDto> updateProfile(
            @ModelAttribute UserDto userDto) {

        UserDto updatedUser = userService.updateProfile(userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<Map<String, String>> followUser(@PathVariable Long userId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        followService.followUser(currentUser, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User followed successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<Map<String, String>> unfollowUser(@PathVariable Long userId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        followService.unfollowUser(currentUser, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User unfollowed successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/is-following/{userId}")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable Long userId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        User targetUser = userService.findById(userId);
        boolean isFollowing = followService.isFollowing(currentUser, targetUser);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        return ResponseEntity.ok(response);
    }

    // Get user's followers
    @GetMapping("/{userId}/followers")
    public ResponseEntity<Page<UserDto>> getFollowers(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = userService.findById(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> followers = followService.getFollowers(user, pageable);

        return ResponseEntity.ok(followers);
    }

    // Get users that the user is following
    @GetMapping("/{userId}/following")
    public ResponseEntity<Page<UserDto>> getFollowing(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = userService.findById(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDto> following = followService.getFollowing(user, pageable);

        return ResponseEntity.ok(following);
    }

    @GetMapping("/{userId}/follow-stats")
    public ResponseEntity<Map<String, Long>> getFollowStats(@PathVariable Long userId) {
        User user = userService.findById(userId);

        Map<String, Long> stats = new HashMap<>();
        stats.put("followersCount", followService.getFollowersCount(user));
        stats.put("followingCount", followService.getFollowingCount(user));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/me/posts/meal-category/{mealCategoryId}")
    public ResponseEntity<?> getMyPostsByMealCategory(@PathVariable Long mealCategoryId) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();

            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            List<PostDto> posts = postService.getUserPostsByMealCategory(currentUser.getId(), mealCategoryId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User or meal category not found: " + e.getMessage());
        }
    }

}