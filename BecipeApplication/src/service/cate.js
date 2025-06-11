import api from './api'

export const fetchMealCategories = () =>
    api.get('/categories/meals')

export const fetchDifficultyCategories = () =>
    api.get('/categories/difficulties')
