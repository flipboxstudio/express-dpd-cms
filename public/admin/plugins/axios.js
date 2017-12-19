import axios from 'axios'
import Vue from 'vue'

Vue.prototype.$axios = axios

axios.defaults.baseURL = process.env.backendUrl
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true
