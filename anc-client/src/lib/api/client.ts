import { serverEnv } from "@/config/env.validatiion";
import { ApiError } from "@/lib/api/api.error";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

const BACKEND_URL = serverEnv.BACKEND_URL;

const UNAUTHORIZED_CODE = ["INVALID_TOKEN", "TOKEN_EXPIRED"] as const;

const apiFetch = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body } = options;
  const session = await auth();

  const headers: Record<string, string> = {};
  if (body && !(body instanceof FormData))
    headers["Content-type"] = "application/json";

  if (session?.user?.accessToken)
    headers["Authorization"] = `Bearer ${session?.user?.accessToken}`;

  const config: RequestInit = {
    method,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    headers,
  };

  const res = await fetch(`${BACKEND_URL}${url}`, config);

  if (!res.ok) {
    const error = await res.json();

    if (res.status === 401 && UNAUTHORIZED_CODE.includes(error.code)) {
      redirect("/api/proxy/clear-session");
    }

    throw new ApiError(error.message, error.code, error.details);
  }

  return (await res.json()).data;
};

const get = <T>(url: string) => apiFetch<T>(url);
const post = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: "POST", body });
const put = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: "PUT", body });
const patch = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: "PATCH", body });
const del = <T>(url: string) => apiFetch<T>(url, { method: "DELETE" });

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};
