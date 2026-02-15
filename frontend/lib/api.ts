const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const defaultOptions: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}
