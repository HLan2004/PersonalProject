package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.ContentDto;
import com.blog.BlogBackend.dto.InstructionDto;
import com.blog.BlogBackend.dto.PostDto;
import com.blog.BlogBackend.entity.Content;
import com.blog.BlogBackend.entity.DifficultyCate;
import com.blog.BlogBackend.entity.Instruction;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
    public PostDto createPost(PostDto dto, Long userId, Long mealCateId, Long difficultyCateId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        MealCate mealCate = mealCateRepo.findById(mealCateId)
                .orElseThrow(() -> new ResourceNotFoundException("MealCate", "id", mealCateId));
        DifficultyCate difficultyCate = difficultyCateRepo.findById(difficultyCateId)
                .orElseThrow(() -> new ResourceNotFoundException("DifficultyCate", "id", difficultyCateId));

        // map flat fields
        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setImageName(dto.getImageName());
        post.setCuisine(dto.getCuisine());
        post.setDuration(dto.getDuration());
        post.setCountLike(0);
        post.setDate(new Date());
        post.setUser(user);
        post.setMealCate(mealCate);
        post.setDifficultyCate(difficultyCate);

        // build content
        ContentDto cdto = dto.getContent();
        Content content = new Content();
        content.setDescription(cdto.getDescription());
        content.setDescriptionImage(cdto.getDescriptionImage());
        content.setIngredients(new ArrayList<>(cdto.getIngredients()));
        // instructions
        List<Instruction> insts = cdto.getInstructions().stream()
                .map(idto -> {
                    Instruction i = new Instruction();
                    i.setStep(idto.getStep());
                    i.setImage(idto.getImage());
                    i.setContent(content);
                    return i;
                })
                .collect(Collectors.toList());
        content.setInstructions(insts);
        // link back
        content.setPost(post);
        post.setContent(content);

        Post saved = postRepo.save(post);
        return PostToDto(saved);
    }



    @Override
    public PostDto updatePost(PostDto dto, Long postId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // flat fields
        post.setTitle(dto.getTitle());
        post.setImageName(dto.getImageName());
        post.setCuisine(dto.getCuisine());
        post.setDuration(dto.getDuration());

        // merge content
        Content content = post.getContent();
        ContentDto cdto = dto.getContent();
        content.setDescription(cdto.getDescription());
        content.setDescriptionImage(cdto.getDescriptionImage());
        // replace ingredients
        content.getIngredients().clear();
        content.getIngredients().addAll(cdto.getIngredients());
        // replace instructions
        content.getInstructions().clear();
        cdto.getInstructions().forEach(idto -> {
            Instruction i = new Instruction();
            i.setStep(idto.getStep());
            i.setImage(idto.getImage());
            i.setContent(content);
            content.getInstructions().add(i);
        });

        Post updated = postRepo.save(post);
        return PostToDto(updated);
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

    @Override
    public void likePost(Long id, Long userId) {
        Post post = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));

        if (post.getLikedUserIds().contains(userId)) {
            throw new IllegalStateException("User has already liked this post.");
        }

        post.getLikedUserIds().add(userId);

        post.setCountLike(post.getCountLike() + 1);
        postRepo.save(post);
    }


    public Post DtoToPost(PostDto pd) {

        return model.map(pd, Post.class);
    }


    public PostDto PostToDto(Post post) {return model.map(post, PostDto.class);}
}
