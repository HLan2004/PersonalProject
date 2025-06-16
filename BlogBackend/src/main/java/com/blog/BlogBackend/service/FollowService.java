package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {

    void followUser(User follower, Long followingUserId);

    void unfollowUser(User follower, Long followingUserId);

    boolean isFollowing(User follower, User following);

    long getFollowersCount(User user);

    long getFollowingCount(User user);

    Page<UserDto> getFollowers(User user, Pageable pageable);

    Page<UserDto> getFollowing(User user, Pageable pageable);
}