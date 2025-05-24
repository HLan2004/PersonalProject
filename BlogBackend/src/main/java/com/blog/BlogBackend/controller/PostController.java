package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/user/{userId}/meal/{mealCateId}/difficulty/{difficultyCateId}")
    public ResponseEntity<PostDto> createPost(
            @RequestBody PostDto postDto,
            @PathVariable Long userId,
            @PathVariable Long mealCateId,
            @PathVariable Long difficultyCateId) {
        System.out.println("Received body: " + postDto);
        PostDto savedPost = postService.createPost(postDto, userId, mealCateId, difficultyCateId);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@RequestBody PostDto postDto, @PathVariable("id") Long id) {
        PostDto updatedPost = postService.updatePost(postDto, id);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);

    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getByIdPost(@PathVariable("id") Long id) {
        PostDto postDto = postService.getByIdPost(id);
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<PostDto>> getAllPost() {
        List<PostDto> postDtoList = postService.getAllPost();
        return new ResponseEntity<>(postDtoList, HttpStatus.OK);

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostByUser(@PathVariable("userId") Long userId) {
        List<PostDto> postDtoList = postService.getPostByUser(userId);
        return new ResponseEntity<>(postDtoList, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long id) {
        postService.delete(id);
        return ResponseEntity.ok("Post deleted successfully");

    }

    @GetMapping("/mealCategory/{mealCategoryId}")
    public ResponseEntity<List<PostDto>> getPostByMealCate(@PathVariable("mealCategoryId") Long categoryId) {
        List<PostDto> postDtoList = postService.getPostByMealCate(categoryId);
        return new ResponseEntity<>(postDtoList, HttpStatus.OK);
    }

    @GetMapping("/difficultyCategory/{difficultyCategoryId}")
    public ResponseEntity<List<PostDto>> getPostByDifficultyCate(@PathVariable("difficultyCategoryId") Long categoryId) {
        List<PostDto> postDtoList = postService.getPostByDifficultyCate(categoryId);
        return new ResponseEntity<>(postDtoList, HttpStatus.OK);
    }

    @PutMapping("/user/{userId}/like/{id}")
    public ResponseEntity<?> likePost(@PathVariable Long id, @PathVariable Long userId) {
        try {
            postService.likePost(id, userId);
            return ResponseEntity.ok("Post liked successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
