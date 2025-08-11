// @/stores/category.ts
import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    error: null,
    loading: false,
  }),

  actions: {
    async fetchCategories(params) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/categories', { params })
        // Laravel resource biasanya mengembalikan dalam response.data.data
        this.categories = response.data?.data || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat mengambil kategori'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getCategoryById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/categories/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat mengambil kategori'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCategory(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/categories', payload)
        // Ambil ulang kategori berdasarkan user_id
        await this.fetchCategories({ user_id: response.data.user_id })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan kategori'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/categories/${id}`, payload)
        await this.fetchCategories({ user_id: response.data.user_id })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat memperbarui kategori'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id, user_id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/categories/${id}`)
        await this.fetchCategories({ user_id })
      } catch (error) {
        this.error = error.response?.data?.message || 'Terjadi kesalahan saat menghapus kategori'
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    categoryList: state => state.categories,
    getError: state => state.error,
    isLoading: state => state.loading,
  },
})
