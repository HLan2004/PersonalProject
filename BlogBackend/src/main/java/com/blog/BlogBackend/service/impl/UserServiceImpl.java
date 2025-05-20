package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepository;

    public List<User> allUsers() {
        return new ArrayList<>(userRepository.findAll());
    }


}
