package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("user/{userId}/meal/{mealCateId}/difficulty/{difficultyCateId}/POST")
    public ResponseEntity<PostDto> createPost(
            @RequestBody PostDto postDto,
            @PathVariable Long userId,
            @PathVariable Long mealCateId,
            @PathVariable Long difficultyCateId) {

        PostDto savedPost = postService.createPost(postDto, userId, mealCateId, difficultyCateId);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }
}
