import ContactService from "@/services/contactService";
import { ResponseUtils } from "@/utils";
import { Request, Response } from "express";

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

class ContactController {
  static async sendMessage(req: Request, res: Response) {
    try {
      const { name, email, message }: ContactMessage = req.body;

      await ContactService.sendMessage(name, email, message);

      res
        .status(200)
        .json(ResponseUtils.success("Gửi tin nhắn liên hệ thành công"));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseUtils.error(
            "Lỗi máy chủ",
            error instanceof Error ? error.message : undefined
          )
        );
    }
  }
}

export default ContactController;
