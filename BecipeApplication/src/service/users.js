import api from './api'

export const fetchCurrentUser = () =>
    api.get('/user/me')

export const updateProfile = (userDto) =>
    api.put('/user/me', userDto, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

// Add this function to fetch a user by ID
export const fetchUserById = (userId) => api.get(`/user/${userId}`);

export const searchUsers = (username) => {
    const params = new URLSearchParams();
    if (username && username.trim()) {
        params.append('username', username);
    }
    return api.get(`/user/search?${params.toString()}`);
};


export const followUser = (userId) =>
    api.post(`/user/follow/${userId}`)

export const unfollowUser = (userId) =>
    api.delete(`/user/unfollow/${userId}`)

export const isFollowing = (userId) =>
    api.get(`/user/is-following/${userId}`)

export const getFollowers = (userId, page = 0, size = 10) =>
    api.get(`/user/${userId}/followers`, {
        params: { page, size }
    })

export const getFollowing = (userId, page = 0, size = 10) =>
    api.get(`/user/${userId}/following`, {
        params: { page, size }
    })

export const getFollowStats = (userId) =>
    api.get(`/user/${userId}/follow-stats`)


export const fetchMyPostsByMealCategory = (mealCategoryId) =>
    api.get(`/user/me/posts/meal-category/${mealCategoryId}`)