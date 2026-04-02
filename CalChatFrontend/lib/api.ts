//export const API_BASE = "https://calchat-backend.onrender.com//api"

//export function getAuthHeaders() {
//    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

//    return {
//        "Content-Type": "application/json",
//        Authorization: token ? `Bearer ${token}` : ""
//    }
//}

// ✅ Dynamic API base (local + production)
export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://calchat-backend.onrender.com//api"

// ✅ Auth headers
export function getAuthHeaders() {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
    }
}