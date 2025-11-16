import axios, { type AxiosInstance } from "axios";

const VITE_BASE_API_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:3001/api";

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
      baseURL: props?.baseUrl || VITE_BASE_API_URL,
      headers: {
        "Content-Type": props?.contentType || "application/json",
      },
      withCredentials: props?.withCredentials ?? true,
    });
  }
}

export const axiosClient = new AxiosClient().instance;
