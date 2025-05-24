package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepo extends JpaRepository<Content, Long> {
}
