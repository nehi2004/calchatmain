//import axios from "axios"

//const api = axios.create({
//    baseURL: "https://calchatmain.runasp.net/api"
//})

//api.interceptors.request.use((config) => {

//    const token = localStorage.getItem("token")

//    if (token) {
//        config.headers.Authorization = `Bearer ${token}`
//    }

//    return config
//})

//export default api
import axios from "axios"

// fallback + compatibility
const BASE_URL =
    (import.meta as any).env?.VITE_API_URL ||
    process.env.REACT_APP_API_URL ||
    "https://calchat-backend.onrender.com/api"

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default api