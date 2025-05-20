package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepo extends JpaRepository<Post, Long> {
}
