import { apiClient } from "../api.client";

class ContactAPI {
  static async sendMessage(data: {
    name: string;
    email: string;
    message: string;
  }) {
    try {
      const result = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/contact", data);

      return result;
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}

export default ContactAPI;
