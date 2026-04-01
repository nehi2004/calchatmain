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
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined ❌")
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api