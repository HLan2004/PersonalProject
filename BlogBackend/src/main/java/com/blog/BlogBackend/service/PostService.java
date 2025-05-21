package com.blog.BlogBackend.service;

import com.blog.BlogBackend.dto.PostDto;

import java.util.List;

public interface PostService {

   public PostDto createPost(PostDto postdto, Long userId, Long mealCateRepoId, Long difficultyCateRepoId);

   public PostDto updatePost(PostDto postdto,Long id);

   public PostDto getByIdPost(Long id);

   public List<PostDto> getAllPost();

   public void delete(Long id);

   public List<PostDto> getPostByMealCate(Long id);

   public List<PostDto> getPostByDifficultyCate(Long id);

   public List<PostDto> getPostByUser(Long id);
}
