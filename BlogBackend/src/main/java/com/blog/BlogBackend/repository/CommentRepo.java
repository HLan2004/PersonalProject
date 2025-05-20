package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, Long> {
}
