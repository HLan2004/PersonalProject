package com.blog.BlogBackend.repository;

import com.blog.BlogBackend.entity.Follow;
import com.blog.BlogBackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepo extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.following = :user")
    long countFollowersByUser(@Param("user") User user);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower = :user")
    long countFollowingByUser(@Param("user") User user);

    @Query("SELECT f.following FROM Follow f WHERE f.follower = :user")
    Page<User> findFollowingByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT f.follower FROM Follow f WHERE f.following = :user")
    Page<User> findFollowersByUser(@Param("user") User user, Pageable pageable);

    void deleteByFollowerAndFollowing(User follower, User following);
}