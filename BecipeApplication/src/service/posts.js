import api from './api'      // ← your configured instance

export const fetchAllPosts = () =>
    api.get('/post/')

export const fetchPostById = id =>
    api.get(`/post/${id}`)

export const createPost = (formData, userId, mealId, diffId) => {
    return api.post(`/post/user/${userId}/meal/${mealId}/difficulty/${diffId}`, formData, {
        headers: {}
    })
}

export const updatePost = (id, formData) => {
    return api.put(`/post/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const fetchTrendingPost = () =>
    api.get('/post/trending')

export const likePost = (postId) =>
    api.put(`/post/${postId}/toggle-like`)

export const deleteMultiplePosts = (postIds) =>
    api.delete('/post/bulk', { data: postIds })

export const fetchPostsFromFollowedUsers = () =>
    api.get('/post/following')

export const fetchFilteredPosts = async (mealCategoryId, difficultyCategoryId) => {
    const params = new URLSearchParams();
    if (mealCategoryId) params.append('mealCategoryId', mealCategoryId);
    if (difficultyCategoryId) params.append('difficultyCategoryId', difficultyCategoryId);

    const queryString = params.toString();
    const url = queryString ? `/post/filter?${queryString}` : '/post/';

    return api.get(url);
}

export const searchPosts = (title, mealCategoryId, difficultyCategoryId) => {
    const params = new URLSearchParams();

    if (title && title.trim()) {
        params.append('title', title);
    }
    if (mealCategoryId) {
        params.append('mealCategoryId', mealCategoryId);
    }
    if (difficultyCategoryId) {
        params.append('difficultyCategoryId', difficultyCategoryId);
    }

    return api.get(`/post/search?${params.toString()}`);
};