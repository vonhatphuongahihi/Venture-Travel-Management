import axios, { type AxiosInstance } from "axios";

const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

interface AxiosClientProps {
  baseUrl?: string;
  timeout?: number;
  contentType?: string;
  withCredentials?: boolean;
}

class AxiosClient {
  public instance: AxiosInstance;

  constructor(props?: AxiosClientProps) {
    this.instance = axios.create({
      baseURL: props?.baseUrl || VITE_API_BASE_URL,
      headers: {
        "Content-Type": props?.contentType || "application/json",
      },
      withCredentials: props?.withCredentials ?? true,
    });
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Nếu là FormData thì xóa header Content-Type để browser tự set
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export const axiosClient = new AxiosClient().instance;
