const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "narasimha34327@gmail.com",
    pass: "wlfnjzvfhtpxdorh",
  },
});
app.get("/sendMail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"NEM student NodeMailer"',
      to: "venugopal.burli@masaischool.com",
      subject: "do not reply",
      text: "This is testing Mail sent by NEM student,no need to reply",
    });

    console.log("Message sent:", info.messageId);
    res
      .status(200)
      .json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending mail:", error.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});
app.listen(3000, () => {
  console.log("server running at 3000");
});
