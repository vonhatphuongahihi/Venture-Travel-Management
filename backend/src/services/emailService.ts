import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Send verification email
    async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<boolean> {
        try {
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

            const mailOptions = {
                from: process.env.SMTP_FROM || 'Venture <noreply@venture.com>',
                to: email,
                subject: 'Xác thực tài khoản Venture',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#26B8ED; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Venture</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Chào mừng bạn đến với Venture!</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Xin chào ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Cảm ơn bạn đã đăng ký tài khoản tại Venture. Để hoàn tất quá trình đăng ký, 
                vui lòng xác thực email của bạn bằng cách nhấp vào nút bên dưới:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background:#26B8ED; 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          font-weight: bold;
                          display: inline-block;">
                  Xác thực Email
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Nếu nút trên không hoạt động, bạn có thể copy và paste link sau vào trình duyệt:
              </p>
              
              <p style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #495057;">
                ${verificationUrl}
              </p>
              
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                <strong>Lưu ý:</strong> Link xác thực sẽ hết hạn sau 24 giờ. Nếu bạn không thực hiện xác thực trong thời gian này, 
                bạn sẽ cần đăng ký lại.
              </p>
            </div>
            
            <div style="background: #343a40; padding: 20px; text-align: center;">
              <p style="color: #adb5bd; margin: 0; font-size: 14px;">
                © 2024 Venture. Tất cả quyền được bảo lưu.
              </p>
              <p style="color: #adb5bd; margin: 5px 0 0 0; font-size: 12px;">
                Email này được gửi tự động, vui lòng không trả lời.
              </p>
            </div>
          </div>
        `,
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending verification email:', error);
            return false;
        }
    }

    // Send welcome email after verification
    async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'Venture <noreply@Venture.com>',
                to: email,
                subject: 'Chào mừng bạn đến với Venture!',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#26B8ED; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Venture</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Chào mừng bạn đến với Venture!</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Xin chào ${name}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Chúc mừng! Tài khoản của bạn đã được xác thực thành công. 
                Bây giờ bạn có thể sử dụng đầy đủ các tính năng của Venture.
              </p>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #155724; margin: 0; font-weight: bold;">
                  ✅ Tài khoản đã được kích hoạt thành công!
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Bạn có thể bắt đầu khám phá các tính năng tuyệt vời của Venture:
              </p>
              
              <ul style="color: #666; line-height: 1.8;">
                <li>Quản lý thông tin thú cưng</li>
                <li>Đặt lịch khám bệnh</li>
                <li>Mua sắm các sản phẩm chăm sóc</li>
                <li>Tham gia cộng đồng yêu thú cưng</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:8081'}" 
                   style="background:#26B8ED; 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          font-weight: bold;
                          display: inline-block;">
                  Truy cập Venture
                </a>
              </div>
            </div>
            
            <div style="background: #343a40; padding: 20px; text-align: center;">
              <p style="color: #adb5bd; margin: 0; font-size: 14px;">
                © 2024 Venture. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        `,
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }
    }

    // Test email configuration
    async testConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }
}
