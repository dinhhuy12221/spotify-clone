import axios from 'axios'

const token = localStorage.getItem('access_token')

axios.defaults.baseURL = 'http://localhost:8000/api'
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default axios
