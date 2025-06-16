package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.UserDto;
import com.blog.BlogBackend.entity.Follow;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.repository.FollowRepo;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.FollowService;
import com.blog.BlogBackend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class FollowServiceImpl implements FollowService {

    private final FollowRepo followRepo;
    private final UserRepo userRepository;
    private final UserService userService;

    @Override
    public void followUser(User follower, Long followingUserId) {
        if (follower.getId().equals(followingUserId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }

        User following = userRepository.findById(followingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followingUserId));

        if (!followRepo.existsByFollowerAndFollowing(follower, following)) {
            Follow follow = new Follow(follower, following);
            followRepo.save(follow);
        }
    }

    @Override
    public void unfollowUser(User follower, Long followingUserId) {
        User following = userRepository.findById(followingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", followingUserId));

        followRepo.deleteByFollowerAndFollowing(follower, following);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(User follower, User following) {
        return followRepo.existsByFollowerAndFollowing(follower, following);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowersCount(User user) {
        return followRepo.countFollowersByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFollowingCount(User user) {
        return followRepo.countFollowingByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getFollowers(User user, Pageable pageable) {
        Page<User> followers = followRepo.findFollowersByUser(user, pageable);
        return followers.map(userService::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> getFollowing(User user, Pageable pageable) {
        Page<User> following = followRepo.findFollowingByUser(user, pageable);
        return following.map(userService::toDto);
    }
}