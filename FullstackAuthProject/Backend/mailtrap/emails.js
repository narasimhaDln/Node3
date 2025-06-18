// emails.js
require("dotenv").config();
const transporter = require("./mailtrap.config");
const nodemailer = require("nodemailer");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  RESET_PASSWORD_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplates");

const EMAIL_USER = process.env.USER_EMAIL;

const sendVerificationEmail = async (userName, email, verificationToken) => {
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  const mailOptions = {
    from: `"${userName}" <${EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: htmlContent,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", response.response);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
const sendWelcomeEmail = async (userName, email) => {
  const textContent = `
Hi ${userName},

Welcome to Auth Company! 🎉

We're thrilled to have you on board. Your account has been successfully created, and you're now part of a growing network of users doing great things with our platform.

If you need any help getting started, feel free to reach out to us.

Warm regards,  
The Auth Company Team
  `.trim();

  const mailOptions = {
    from: `"Auth Company" <${EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Auth Company, ${userName}!`,
    text: textContent,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", response.response);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
const sendPasswordResetEmail = async (email, resetURL, resetCode) => {
  const htmlContent = RESET_PASSWORD_EMAIL_TEMPLATE.replace(
    "{resetURL}",
    resetURL
  ).replace("{resetCode}", resetCode);

  try {
    const response = await transporter.sendMail({
      from: `"Auth Company" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: htmlContent,
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
const sendResetSuccessEmail = async (email, loginURL) => {
  // Inject loginURL into the HTML
  const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace(
    /{loginURL}/g,
    loginURL
  );
  const textContent = `
Hi ${email},

We're writing to confirm that your password has been successfully reset.

If you did not initiate this password reset, please contact our support team immediately.

For security reasons, we recommend that you:
- Use a strong, unique password
- Enable two-factor authentication if available
- Avoid using the same password across multiple sites



Best regards,
Your App Team
  `.trim();

  try {
    const response = await transporter.sendMail({
      from: `"Auth Company" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Successful",
      html: htmlContent,
      text: textContent,
    });
    console.log("✅ Password reset success email sent:", response.response);
  } catch (error) {
    console.error("❌ Failed to send reset success email:", error);
    throw new Error("Failed to send reset success email");
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
