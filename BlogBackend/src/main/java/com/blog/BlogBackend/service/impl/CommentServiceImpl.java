package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.CommentDto;
import com.blog.BlogBackend.entity.Comment;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.repository.CommentRepo;
import com.blog.BlogBackend.repository.PostRepo;
import com.blog.BlogBackend.service.CommentService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private ModelMapper model;

    public CommentDto addComment(CommentDto commentDto, Long postId) {
        Post post = postRepo.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        Comment comment = model.map(commentDto, Comment.class);
        comment.setPost(post);
        Comment savedComment = commentRepo.save(comment);
        return model.map(savedComment, CommentDto.class);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));
        commentRepo.delete(comment);
    }
}
