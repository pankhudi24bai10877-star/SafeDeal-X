
const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  const token = localStorage.getItem("safedeal_token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
