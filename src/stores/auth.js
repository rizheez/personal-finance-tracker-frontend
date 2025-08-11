import api from '@/plugins/axios'
import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    error: null,
  }),
  getters: {
    isAuth: state => !!state.token,
    getUser: state => state.user,
  },
  actions: {
    setUser(user) {
      this.user = user
    },
    setToken(token) {
      this.token = token
    },
    async login(credentials) {
      try {
        const response = await api.post('auth/login', credentials)
        const { user, token } = response.data
        this.setUser(user)
        this.setToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        localStorage.setItem('token', token)
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data : 'An error occurred during login'
        throw this.error
      }
    },
    async logout() {
      try {
        this.user = null
        this.token = null

        delete api.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
      } catch (error) {
        this.error = error.response ? error.response.data : 'An error occurred during logout'
        throw this.error
      }
    },

    async register(userData) {
      try {
        const response = await api.post('auth/register', userData)
        const { user, token } = response.data
        this.setUser(user)
        this.setToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        localStorage.setItem('token', token)
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data : 'An error occurred during registration'
        throw this.error
      }
    },

    async fetchUser() {
      if (!this.token) return

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        const res = await api.get('/user')
        this.user = res.data
      } catch {
        this.logout()
      }
    },
  },
})
