import axios from 'axios'

export const API_URL = `http://localhost:3001/api`

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

$api.interceptors.request.use((config) => {
  console.log(config)
  if(config.headers) config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

export default $api;
