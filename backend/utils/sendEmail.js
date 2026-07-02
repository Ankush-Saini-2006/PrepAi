const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} (${subject})${info?.messageId ? ` [${info.messageId}]` : ""}`);
    return info;
  } catch (error) {
    console.error(`❌ Email send failed to ${to} (${subject}): ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
