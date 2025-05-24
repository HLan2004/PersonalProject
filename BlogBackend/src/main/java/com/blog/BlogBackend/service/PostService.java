package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.PostDto;

import java.util.List;

public interface PostService {

   PostDto createPost(PostDto postdto, Long userId, Long mealCateRepoId, Long difficultyCateRepoId);

   PostDto updatePost(PostDto postdto,Long id);

   PostDto getByIdPost(Long id);

   List<PostDto> getAllPost();

   void delete(Long id);

   List<PostDto> getPostByMealCate(Long id);

   List<PostDto> getPostByDifficultyCate(Long id);

   List<PostDto> getPostByUser(Long id);

   void likePost(Long id, Long userId);
}
