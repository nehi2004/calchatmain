export const API_BASE = "http://localhost:5009/api"

export function getAuthHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
    }
}
