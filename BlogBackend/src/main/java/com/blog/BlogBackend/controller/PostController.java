package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;


    @PostMapping(
            value = "/user/{userId}/meal/{mealCateId}/difficulty/{difficultyCateId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> createPost(
            @PathVariable Long userId,
            @PathVariable Long mealCateId,
            @PathVariable Long difficultyCateId,
            @ModelAttribute PostDto postDto) {
        try {
            System.out.println("Received body: " + postDto);
            PostDto savedPost = postService.createPost(postDto, userId, mealCateId, difficultyCateId);
            return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Resource not found: " + e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Bad request: " + e.getMessage());

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @ModelAttribute PostDto postDto) {
        try {
            PostDto updated = postService.updatePost(postDto, id);
            return ResponseEntity.ok(updated);

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Resource not found: " + e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Bad request: " + e.getMessage());

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getByIdPost(@PathVariable("id") Long id) {
        try {
            PostDto dto = postService.getByIdPost(id);
            return ResponseEntity.ok(dto);

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Post not found with id " + id);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }

    }


    @GetMapping("/")
    public ResponseEntity<?> getAllPost() {
        try {
            List<PostDto> list = postService.getAllPost();
            return ResponseEntity.ok(list);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostByUser(@PathVariable("userId") Long userId) {
        try {
            List<PostDto> list = postService.getPostByUser(userId);
            return ResponseEntity.ok(list);

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found with id " + userId);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<?> deleteMultiplePosts(@RequestBody List<Long> postIds) {
        try {
            if (postIds == null || postIds.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Post IDs list cannot be null or empty");
            }

            postService.deleteMultiplePosts(postIds);
            return ResponseEntity.ok("Posts deleted successfully. Total deleted: " + postIds.size());

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Bad request: " + e.getMessage());

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while deleting posts");
        }
    }


    @PutMapping("/{postId}/toggle-like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        try {
            User currentUser = (User) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();

            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            postService.toggleLike(postId, currentUser.getId());
            PostDto updatedPost = postService.getByIdPost(postId);
            return ResponseEntity.ok(updatedPost);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to toggle like: " + e.getMessage());
        }
    }


    @GetMapping("/trending")
    public ResponseEntity<?> getMostLikedPostLastWeek() {
        try {
            PostDto trending = postService.getMostLikedPostLastWeek();
            return ResponseEntity.ok(trending);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredPosts(
            @RequestParam(required = false) Long mealCategoryId,
            @RequestParam(required = false) Long difficultyCategoryId) {
        try {
            List<PostDto> list = postService.getFilteredPosts(mealCategoryId, difficultyCategoryId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long mealCategoryId,
            @RequestParam(required = false) Long difficultyCategoryId) {
        try {
            List<PostDto> list = postService.searchPosts(title, mealCategoryId, difficultyCategoryId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}