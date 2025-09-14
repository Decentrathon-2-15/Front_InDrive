const BASE_URL = import.meta.env.VITE_API_URL

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions<T = unknown> {
  url: string;
  method?: HttpMethod;
  data?: T | FormData | null;
  params?: Record<string, string | number | boolean>;
}

export async function request<R = any, T = unknown>({
  url,
  method = "GET",
  data = null,
  params = null,
}: RequestOptions<T>): Promise<R> {
  let fullUrl = `api/${url}` // `${BASE_URL}${url}`;

  // 🔹 Конвертация объекта params → query string
  if (params && typeof params === "object") {
    const query = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();

    if (query) {
      fullUrl += `?${query}`;
    }
  }

  const headers: HeadersInit = {};
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const options: RequestInit = {
    method,
    headers,
    body: data
      ? data instanceof FormData
        ? data
        : JSON.stringify(data)
      : null,
  };

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    let errMessage = `Ошибка: ${response.status}`;
    try {
      const err = await response.json();
      errMessage = err.message || errMessage;
    } catch {
      // игнорируем, если не json
    }
    throw new Error(errMessage);
  }

  return (await response.json()) as R;
}