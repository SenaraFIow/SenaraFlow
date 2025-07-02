
import fetch from "node-fetch"

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/**
 * Generic HTTP client for AiMindCell internal APIs.
 */
export class ApiClient {
  constructor(private baseUrl: string, private apiKey?: string) {}

  private buildHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`
    }
    return headers
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const res = await fetch(url.toString(), { headers: this.buildHeaders() })
    if (!res.ok) {
      return { success: false, data: null as any, error: `${res.status} ${res.statusText}` }
    }
    const json = (await res.json()) as T
    return { success: true, data: json }
  }

  async post<T, U>(path: string, body: T): Promise<ApiResponse<U>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      return { success: false, data: null as any, error: `${res.status} ${res.statusText}` }
    }
    const json = (await res.json()) as U
    return { success: true, data: json }
  }
}
