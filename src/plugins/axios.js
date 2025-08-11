import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
