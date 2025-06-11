package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.repository.PostRepo;
import com.blog.BlogBackend.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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

    @Autowired
    private PostRepo postRepo;

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
            // userId, mealCateId or difficultyCateId not found
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


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long id) {
        try {
            postService.delete(id);
            return ResponseEntity.ok("Post deleted successfully");

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


    @GetMapping("/mealCategory/{mealCategoryId}")
    public ResponseEntity<?> getPostByMealCate(@PathVariable("mealCategoryId") Long mealCategoryId) {
        try {
            List<PostDto> list = postService.getPostByMealCate(mealCategoryId);
            return ResponseEntity.ok(list);

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Meal category not found with id " + mealCategoryId);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @GetMapping("/difficultyCategory/{difficultyCategoryId}")
    public ResponseEntity<?> getPostByDifficultyCate(@PathVariable("difficultyCategoryId") Long difficultyCategoryId) {
        try {
            List<PostDto> list = postService.getPostByDifficultyCate(difficultyCategoryId);
            return ResponseEntity.ok(list);

        } catch (EntityNotFoundException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Difficulty category not found with id " + difficultyCategoryId);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @PutMapping("/{postId}/toggle-like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        try {
            // Get current authenticated user
            User currentUser = (User) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();

            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not authenticated");
            }

            postService.toggleLike(postId, currentUser.getId()); // Use getId() instead of getUserId()
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