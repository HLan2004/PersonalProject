package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username LIKE %:username% AND u.enabled = true")
    List<User> findByUsernameContainingIgnoreCase(@Param("username") String username);


}
