import { apiClient } from "../api.client";

class ContactAPI {
  static async sendMessage(data: {
    name: string;
    email: string;
    message: string;
  }) {
    const result = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/contact", data);

    return result;
  }
}

export default ContactAPI;
