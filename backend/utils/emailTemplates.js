const verificationEmailTemplate = ({ name, verifyUrl }) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #4f46e5;">Welcome to PrepAI, ${name}!</h2>
    <p>Please verify your email address to activate your account.</p>
    <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">
      Verify Email
    </a>
    <p style="margin-top:24px;color:#6b7280;font-size:12px;">
      This link expires in 24 hours. If you didn't create a PrepAI account, you can ignore this email.
    </p>
  </div>
`;

const resetPasswordEmailTemplate = ({ name, resetUrl }) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #4f46e5;">Password Reset Request</h2>
    <p>Hi ${name}, click the button below to reset your PrepAI password.</p>
    <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">
      Reset Password
    </a>
    <p style="margin-top:24px;color:#6b7280;font-size:12px;">
      This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

module.exports = { verificationEmailTemplate, resetPasswordEmailTemplate };
