package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.CommentDto;

public interface CommentService {

    CommentDto addComment(CommentDto commentDto, Long postId);

    void deleteComment(Long id);
}
