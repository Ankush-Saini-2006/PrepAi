const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error(`❌ SMTP transporter verification failed: ${error.message}`);
    return;
  }

  console.log(`✅ SMTP transporter ready (${process.env.SMTP_HOST || "smtp.gmail.com"}:${Number(process.env.SMTP_PORT) || 587})`);
});

module.exports = transporter;
