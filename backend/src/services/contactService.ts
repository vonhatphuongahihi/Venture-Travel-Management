import { EmailService } from "./emailService";

const emailService = new EmailService();

class ContactService {
  static async sendMessage(username: string, email: string, message: string) {
    return await emailService.sendContactEmail(username, email, message);
  }
}

export default ContactService;
