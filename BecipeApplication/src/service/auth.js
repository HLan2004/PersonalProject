import api from './api'

const TOKEN_KEY = 'jwt_token'

export const login = ({ email, password }) =>
    api.post('/auth/login', { email, password })

export const saveToken = token => {
    if (token && token !== 'undefined' && token !== 'null') {
        localStorage.setItem(TOKEN_KEY, token)
    }
}

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token && token !== 'undefined' && token !== 'null' ? token : null
}

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}

export const logout = async (showNotification = true, redirectToAuth = true) => {
    const token = getToken()
    if (token) {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            removeToken()

            if (showNotification) {
                alert('You have been logged out successfully')
            }

            if (redirectToAuth) {
                window.location.replace('/auth')
            }
        }
    }
}

export const isAuthenticated = () => {
    const token = getToken()
    return !!token
}

// Thêm hàm kiểm tra token có hợp lệ không
export const validateToken = async () => {
    const token = getToken()
    if (!token) return false

    try {
        // Thử gọi một API endpoint để verify token
        await api.get('/auth/validate')
        return true
    } catch (error) {
        console.log('Token validation failed:', error.response?.status)
        removeToken()
        return false
    }
}