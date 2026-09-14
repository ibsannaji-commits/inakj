import * as SecureStore from 'expo-secure-store';
const { API_URL } = require('../constants/config');

const TOKEN_KEY = 'ina_kj_access_token';
const REFRESH_KEY = 'ina_kj_refresh_token';

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setTokens(access: string, refresh?: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, access);
  if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = true, headers = {} } = options;
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (auth) {
    const token = await getAccessToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

// ---- Auth ----
export const authApi = {
  register: (payload: {
    phone: string;
    password: string;
    fullName: string;
    role: 'farmer' | 'buyer';
    email?: string;
    location?: string;
    city?: string;
  }) =>
    api<{ user: User; accessToken: string; refreshToken: string }>(
      '/auth/register',
      { method: 'POST', body: payload, auth: false }
    ),

  login: (phone: string, password: string) =>
    api<{ user: User; accessToken: string; refreshToken: string }>(
      '/auth/login',
      { method: 'POST', body: { phone, password }, auth: false }
    ),

  me: () => api<{ user: User }>('/auth/me'),
};

// ---- Products ----
export const productsApi = {
  list: (params?: Record<string, string | number>) => {
    const q = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return api<{ data: Product[]; meta: Meta }>(`/products${q}`, {
      auth: false,
    });
  },
  get: (id: string) =>
    api<{ data: Product }>(`/products/${id}`, { auth: false }),
  create: (body: Partial<Product>) =>
    api<{ data: Product }>('/products', { method: 'POST', body }),
  update: (id: string, body: Partial<Product>) =>
    api<{ data: Product }>(`/products/${id}`, { method: 'PATCH', body }),
};

// ---- Orders ----
export const ordersApi = {
  create: (body: {
    items: { productId: string; quantity: number }[];
    deliveryMethod?: string;
    deliveryAddress?: object;
    paymentMethod?: string;
    notes?: string;
  }) => api<{ data: Order }>('/orders', { method: 'POST', body }),
  list: () => api<{ data: Order[] }>('/orders'),
  get: (id: string) => api<{ data: Order }>(`/orders/${id}`),
};

// ---- Types (minimal) ----
export type User = {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'farmer' | 'buyer' | 'admin' | 'delivery';
  isVerified?: boolean;
};

export type Product = {
  id: string;
  name: string;
  priceEtb: number | string;
  unit: string;
  quantityAvailable: number | string;
  grade?: string;
  location?: string;
  description?: string;
  images?: string[];
  seller?: {
    id: string;
    fullName: string;
    isVerified?: boolean;
    ratingAvg?: number | string;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  paymentStatus: string;
  items?: unknown[];
};

type Meta = { total: number; page: number; limit: number };
