package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.MealCate;
import com.blog.BlogBackend.entity.Post;
import com.blog.BlogBackend.entity.User;
import com.blog.BlogBackend.exception.ResourceNotFoundException;
import com.blog.BlogBackend.repository.DifficultyCateRepo;
import com.blog.BlogBackend.repository.MealCateRepo;
import com.blog.BlogBackend.repository.PostRepo;
import com.blog.BlogBackend.repository.UserRepo;
import com.blog.BlogBackend.service.PostService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private ModelMapper model;

    @Autowired
    private MealCateRepo mealCateRepo;

    @Autowired
    private DifficultyCateRepo difficultyCateRepo;

    @Autowired
    private UserRepo userRepo;





    @Override
    public PostDto createPost(PostDto postdto, Long userId, Long mealCateRepoId, Long difficultyCateRepoId) {
        User user = userRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));
        MealCate mealCate = mealCateRepo.findById(mealCateRepoId).orElseThrow(()-> new ResourceNotFoundException("MealCate", "id", mealCateRepoId));
        DifficultyCate difficultyCate = difficultyCateRepo.findById(difficultyCateRepoId).orElseThrow(()-> new ResourceNotFoundException("DifficultyCate", "id", difficultyCateRepoId));

        Post post = DtoToPost(postdto);
        post.setUser(user);
        post.setDate(new Date());
        post.setMealCate(mealCate);
        post.setDifficultyCate(difficultyCate);
        post.setCountLike(0);
        Post savedPost = postRepo.save(post);

        return PostToDto(savedPost);
    }

    @Override
    public PostDto updatePost(PostDto postdto, Long id) {
        return null;
    }

    @Override
    public PostDto getByIdPost(Long id) {
        return null;
    }

    @Override
    public List<PostDto> getAllPost() {
        return List.of();
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public List<PostDto> getPostByCategory(Long id) {
        return List.of();
    }

    @Override
    public List<PostDto> getPostByUser(Long id) {
        return List.of();
    }




    public Post DtoToPost(PostDto pd) {
        return model.map(pd,Post.class);
    }

    public PostDto PostToDto(Post post) {
        return model.map(post, PostDto.class);
    }
}
