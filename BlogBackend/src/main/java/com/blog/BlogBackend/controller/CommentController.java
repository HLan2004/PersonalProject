package com.blog.BlogBackend.controller;


import com.blog.BlogBackend.dto.CommentDto;
import com.blog.BlogBackend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{id}")
    public ResponseEntity<CommentDto> addComment(@Valid @RequestBody CommentDto commentDto, @PathVariable("id") Long id ){
        CommentDto answer = commentService.addComment(commentDto, id);
        return ResponseEntity.status(HttpStatus.CREATED).body(answer);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}
