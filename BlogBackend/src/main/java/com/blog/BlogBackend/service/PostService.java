package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.PostDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostService {

   PostDto createPost(PostDto postdto, Long userId, Long mealCateRepoId, Long difficultyCateRepoId);

   PostDto updatePost(PostDto postdto,Long id);

   PostDto getByIdPost(Long id);

   List<PostDto> getAllPost();

   void deleteMultiplePosts(List<Long> postIds);

   List<PostDto> getPostByUser(Long id);

   void toggleLike(Long id, Long userId);

   PostDto getMostLikedPostLastWeek();

   List<PostDto> getFilteredPosts(Long mealCategoryId, Long difficultyCategoryId);

   List<PostDto> searchPosts(String title, Long mealCategoryId, Long difficultyCategoryId);

   List<PostDto> getUserPostsByMealCategory(Long userId, Long mealCategoryId);

}
