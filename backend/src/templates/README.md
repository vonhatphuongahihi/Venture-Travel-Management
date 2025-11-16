# Email Templates

Thư mục này chứa các template HTML cho email được gửi bởi hệ thống.

## Templates có sẵn:

### 1. `verificationEmail.html`
- **Mục đích**: Gửi email xác thực tài khoản cho user mới đăng ký
- **Placeholders**:
  - `{{name}}`: Tên của user
  - `{{verificationUrl}}`: URL để xác thực email

### 2. `passwordResetEmail.html`
- **Mục đích**: Gửi email đặt lại mật khẩu
- **Placeholders**:
  - `{{name}}`: Tên của user
  - `{{resetUrl}}`: URL để đặt lại mật khẩu

### 3. `welcomeEmail.html`
- **Mục đích**: Gửi email chào mừng sau khi xác thực thành công
- **Placeholders**:
  - `{{name}}`: Tên của user
  - `{{frontendUrl}}`: URL của frontend application

## Cách sử dụng:

Templates được render tự động bởi `EmailService.renderTemplate()` method:

```typescript
const htmlContent = this.renderTemplate('passwordResetEmail', {
    name: userName,
    resetUrl: resetUrl
});
```

## Lưu ý:

- Tất cả templates đều responsive và tương thích với email clients
- Sử dụng inline CSS để đảm bảo tương thích
- Placeholders được thay thế bằng `{{placeholderName}}` format
- Templates được thiết kế với brand Venture Travel (#26B8ED color scheme)