import { api } from "./api";

export async function request(config) {
  try {
    const response = await api(config);
    return { success: true, data: response.data, error: null };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return { success: false, data: null, error: message };
  }
}

export function get(url, params = {}) {
  return request({ method: "get", url, params });
}

export function post(url, data = {}) {
  return request({ method: "post", url, data });
}
