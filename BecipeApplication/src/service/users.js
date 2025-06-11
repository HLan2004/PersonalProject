import api from './api'

export const fetchCurrentUser = () =>
    api.get('/user/me')

