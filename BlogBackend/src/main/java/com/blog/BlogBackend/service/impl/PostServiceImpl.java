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
    public PostDto createPost(PostDto postdto, Long userId, Long mealCateId, Long difficultyCateId) {
        User user = userRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));
        MealCate mealCate = mealCateRepo.findById(mealCateId).orElseThrow(()-> new ResourceNotFoundException("MealCate", "id", mealCateId));
        DifficultyCate difficultyCate = difficultyCateRepo.findById(difficultyCateId).orElseThrow(()-> new ResourceNotFoundException("DifficultyCate", "id", difficultyCateId));

        Post post = DtoToPost(postdto);

        post.setCountLike(0);
        post.setDate(new Date());
        post.setMealCate(mealCate);
        post.setDifficultyCate(difficultyCate);
        post.setUser(user);
        Post savedPost = postRepo.save(post);

        return PostToDto(savedPost);
    }

    @Override
    public PostDto updatePost(PostDto postdto, Long id) {

        Post post = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));
        post.setTitle(postdto.getTitle());
        post.setContent(postdto.getContent());
        Post updatedPost = postRepo.save(post);

        return PostToDto(updatedPost);
    }

    @Override
    public PostDto getByIdPost(Long id) {
        Post post = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));
        return PostToDto(post);
    }

    @Override
    public List<PostDto> getAllPost() {
        List<Post> posts = postRepo.findAll();
        return posts.stream().map(post -> PostToDto(post)).toList();
    }

    @Override
    public void delete(Long id) {
        Post post = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));
        postRepo.delete(post);
    }

    @Override
    public List<PostDto> getPostByMealCate(Long id) {

        MealCate mealCate = mealCateRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("MealCate", "id", id));
        List<Post> posts = postRepo.findByMealCate(mealCate);
        return posts.stream().map(post -> PostToDto(post)).toList();
    }

    @Override
    public List<PostDto> getPostByDifficultyCate(Long id) {
        DifficultyCate difficultyCate = difficultyCateRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("DifficultyCate", "id", id));
        List<Post> posts = postRepo.findByDifficultyCate(difficultyCate);
        return posts.stream().map(post -> PostToDto(post)).toList();
    }

    @Override
    public List<PostDto> getPostByUser(Long id) {
        User user = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User", "id", id));
        List<Post> posts = postRepo.findByUser(user);
        return posts.stream().map(post -> PostToDto(post)).toList();
    }




    public Post DtoToPost(PostDto pd) {
        return model.map(pd,Post.class);
    }

    public PostDto PostToDto(Post post) {
        return model.map(post, PostDto.class);
    }
}
