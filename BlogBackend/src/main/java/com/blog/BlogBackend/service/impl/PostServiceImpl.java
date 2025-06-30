package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.dto.InstructionDto;
import com.blog.BlogBackend.dto.PostDto;
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
import com.blog.BlogBackend.service.AuthenticationService;
import com.blog.BlogBackend.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
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

    @Autowired
    private AuthenticationService authenticationService;


    @Override
    public PostDto createPost(PostDto dto, Long userId, Long mealCateId, Long difficultyCateId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        MealCate mealCate = mealCateRepo.findById(mealCateId)
                .orElseThrow(() -> new ResourceNotFoundException("MealCate", "id", mealCateId));
        DifficultyCate difficultyCate = difficultyCateRepo.findById(difficultyCateId)
                .orElseThrow(() -> new ResourceNotFoundException("DifficultyCate", "id", difficultyCateId));

        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setCuisine(dto.getCuisine());
        post.setDuration(dto.getDuration());
        post.setCountLike(0);
        post.setDate(new Date());
        post.setUser(user);
        post.setMealCate(mealCate);
        post.setDifficultyCate(difficultyCate);

        post.setDescription(dto.getDescription());
        post.setIngredients(new ArrayList<>(dto.getIngredients()));

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            try {
                post.setImageData(dto.getImageFile().getBytes());
                post.setImageType(dto.getImageFile().getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed reading main image", e);
            }
        }

        List<Instruction> instructions = dto.getInstructions().stream()
                .map(idto -> {
                    Instruction i = new Instruction();
                    // ←––– replace these two lines:
                    i.setStepDescription( idto.getDescription() );   // was idto.getStep()
                    i.setStepOrder      ( idto.getStepOrder() );    // was idto.getOrder()
                    i.setPost(post);
                    if (idto.getImageFile() != null && !idto.getImageFile().isEmpty()) {
                        try {
                            i.setStepImageData(idto.getImageFile().getBytes());
                            i.setStepImageType(idto.getImageFile().getContentType());
                        } catch (IOException e) {
                            throw new RuntimeException("Failed reading step image", e);
                        }
                    }
                    return i;
                })
                .collect(Collectors.toList());

        post.setInstructions(instructions);


        Post saved = postRepo.save(post);
        return PostToDto(saved);
    }

    @Override
    public PostDto updatePost(PostDto dto, Long postId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        post.setTitle(dto.getTitle());
        post.setCuisine(dto.getCuisine());
        post.setDuration(dto.getDuration());
        post.setDescription(dto.getDescription());

        post.getIngredients().clear();
        post.getIngredients().addAll(dto.getIngredients());

        Map<Integer, Instruction> existingInstructions = post.getInstructions().stream()
                .collect(Collectors.toMap(Instruction::getStepOrder, Function.identity()));

        post.getInstructions().clear();
        dto.getInstructions().forEach(idto -> {
            Instruction i = new Instruction();
            i.setStepDescription(idto.getDescription());
            i.setStepOrder(idto.getStepOrder());
            i.setPost(post);

            MultipartFile stepImage = idto.getImageFile();
            if (stepImage != null && !stepImage.isEmpty()) {
                try {
                    i.setStepImageData(stepImage.getBytes());
                    i.setStepImageType(stepImage.getContentType());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to read instruction image", e);
                }
            } else {
                Instruction existingInstruction = existingInstructions.get(idto.getStepOrder());
                if (existingInstruction != null) {
                    i.setStepImageData(existingInstruction.getStepImageData());
                    i.setStepImageType(existingInstruction.getStepImageType());
                }
            }

            post.getInstructions().add(i);
        });

        // Handle main image
        MultipartFile mainImage = dto.getImageFile();
        if (mainImage != null && !mainImage.isEmpty()) {
            try {
                post.setImageData(mainImage.getBytes());
                post.setImageType(mainImage.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to read main image", e);
            }
        }

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
        return  posts.stream().map(this::PostToDto).toList();
    }

    @Override
    public void deleteMultiplePosts(List<Long> postIds) {
        if (postIds == null || postIds.isEmpty()) {
            throw new IllegalArgumentException("Post IDs list cannot be null or empty");
        }

        // Validate that all posts exist before deleting any
        List<Post> postsToDelete = new ArrayList<>();
        List<Long> notFoundIds = new ArrayList<>();

        for (Long postId : postIds) {
            Optional<Post> postOpt = postRepo.findById(postId);
            if (postOpt.isPresent()) {
                postsToDelete.add(postOpt.get());
            } else {
                notFoundIds.add(postId);
            }
        }

        if (!notFoundIds.isEmpty()) {
            throw new EntityNotFoundException("Posts not found with IDs: " + notFoundIds);
        }

        // Delete all posts if all exist
        postRepo.deleteAll(postsToDelete);
    }

    @Override
    public List<PostDto> getPostByUser(Long id) {
        User user = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User", "id", id));
        List<Post> posts = postRepo.findByUser(user);
        return posts.stream().map(this::PostToDto).toList();
    }

    @Override
    public void toggleLike(Long postId, Long userId) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        Set<Long> liked = post.getLikedUserIds();
        if (liked.contains(userId)) {
            liked.remove(userId);
        } else {
            liked.add(userId);
        }
        post.setLikedUserIds(liked);
        post.setCountLike(liked.size());
        postRepo.save(post);
    }


    @Override
    public PostDto getMostLikedPostLastWeek() {
        Date oneWeekAgo = Date.from(LocalDateTime.now().minusDays(7)
                .atZone(ZoneId.systemDefault()).toInstant());

        Post post = postRepo.findFirstByDateAfterOrderByCountLikeDesc(oneWeekAgo)
                .orElseThrow(() -> new ResourceNotFoundException("No trending posts found", "timeframe", 7L));

        return PostToDto(post);
    }


    @Override
    public List<PostDto> getFilteredPosts(Long mealCategoryId, Long difficultyCategoryId) {
        MealCate mealCate = null;
        DifficultyCate difficultyCate = null;

        if (mealCategoryId != null) {
            mealCate = mealCateRepo.findById(mealCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Meal category not found"));
        }

        if (difficultyCategoryId != null) {
            difficultyCate = difficultyCateRepo.findById(difficultyCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Difficulty category not found"));
        }

        List<Post> posts = postRepo.findByMealCateAndDifficultyCate(mealCate, difficultyCate);
        return posts.stream()
                .map(this::PostToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> searchPosts(String title, Long mealCategoryId, Long difficultyCategoryId) {
        MealCate mealCate = null;
        DifficultyCate difficultyCate = null;

        if (mealCategoryId != null) {
            mealCate = mealCateRepo.findById(mealCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Meal category not found"));
        }

        if (difficultyCategoryId != null) {
            difficultyCate = difficultyCateRepo.findById(difficultyCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Difficulty category not found"));
        }

        List<Post> posts = postRepo.findByTitleAndMealCateAndDifficultyCate(title, mealCate, difficultyCate);
        return posts.stream()
                .map(this::PostToDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<PostDto> getUserPostsByMealCategory(Long userId, Long mealCategoryId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        MealCate mealCate = mealCateRepo.findById(mealCategoryId)
                .orElseThrow(() -> new RuntimeException("Meal category not found with id: " + mealCategoryId));

        List<Post> posts = postRepo.findByUserAndMealCate(user, mealCate);

        return posts.stream()
                .map(this::PostToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostDto> getPostsFromFollowedUsers() {
        User currentUser = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (currentUser == null) {
            throw new IllegalStateException("User not authenticated");
        }

        List<Post> posts = postRepo.findPostsByFollowedUsers(currentUser);
        return posts.stream()
                .map(this::PostToDto)
                .collect(Collectors.toList());
    }

    public Post DtoToPost(PostDto pd) {return model.map(pd, Post.class);}


    private PostDto PostToDto(Post post) {
        // 1) map all the “easy” fields
        PostDto dto = model.map(post, PostDto.class);

        // 2) if there’s an image blob, turn it into a base64 string + type
        if (post.getImageData() != null && post.getImageType() != null) {
            dto.setImageType(post.getImageType());
            dto.setImageData(Base64
                    .getEncoder()
                    .encodeToString(post.getImageData()));
        }

        if (dto.getInstructions() != null) {
            for (InstructionDto instructionDto : dto.getInstructions()) {
                if (post.getInstructions() != null) {
                    post.getInstructions().stream()
                            .filter(instruction -> instruction.getStepOrder().equals(instructionDto.getStepOrder()))
                            .findFirst()
                            .ifPresent(instruction -> {
                                if (instruction.getStepImageData() != null && instruction.getStepImageType() != null) {
                                    instructionDto.setStepImageType(instruction.getStepImageType());
                                    instructionDto.setStepImageData(Base64
                                            .getEncoder()
                                            .encodeToString(instruction.getStepImageData()));
                                }
                            });
                }
            }
        }

        if (post.getUser() != null) {
            dto.setAuthorName(post.getUser().getBlogUsername());
            dto.setAuthorAvatar(post.getUser().getImageData());
            dto.setAuthorAvatarType(post.getUser().getImageType());
        }

        if (post.getDate() != null) {
            dto.setDate(post.getDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate());
        }

        Set<Long> liked = post.getLikedUserIds();
        dto.setCountLike(liked.size());
        dto.setLikedByCurrentUser(liked.contains(authenticationService.getCurrentUserId()));
        dto.setLikedUserIds(liked);

        return dto;
    }

}