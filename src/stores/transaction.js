import api from '@/plugins/axios'
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [],
    error: null,
  }),
  actions: {
    async getTransactions(params) {
      this.error = null
      try {
        const response = await api.get('/transactions', { params })
        this.transactions = response.data
      } catch (error) {
        this.error = error.response?.data?.message || error || 'Something went wrong'
      }
    },
    async getTransactionById(id) {
      this.error = null
      try {
        const response = await api.get(`/transactions/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || error || 'Something went wrong'
      }
    },
    async createTransaction(data) {
      this.error = null
      try {
        const response = await api.post('/transactions', data)
        this.transactions.push(response.data)
      } catch (error) {
        this.error = error.response?.data?.message || error || 'Something went wrong'
      }
    },
    async updateTransaction(id, data) {
      this.error = null
      try {
        const response = await api.put(`/transactions/${id}`, data)
        this.transactions[id] = response.data
      } catch (error) {
        this.error = error.response?.data?.message || error || 'Something went wrong'
      }
    },
    async deleteTransaction(id) {
      this.error = null
      try {
        await api.delete(`/transactions/${id}`)
        this.transactions = this.transactions.filter(transaction => transaction.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || error || 'Something went wrong'
      }
    },
  },
})
