import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.SUPPORT_EMAIL_PASS, // the Outlook password / app password
    },
    tls: {
      ciphers: "TLSv1.2",
    },
  });

  try {
    // Verify SMTP connection config (throws early if auth fails)
    await transporter.verify();

    // Send the email
    await transporter.sendMail({
      from: `"Trizen Ventures Support" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent via Outlook SMTP");
  } catch (err) {
    console.error("❌ Outlook email send failed:", err);
    throw err;
  }
};
