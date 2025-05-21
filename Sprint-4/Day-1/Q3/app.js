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
      from: '"HR Team"', // From should be a valid address
      to: "kovvurunaseer@gmail.com",
      subject: "Confirm Interview Schedule",
      text: `
We are pleased to inform you that you have been shortlisted for the role of Software Developer
Your interview is scheduled on In this WeekEnd

Please make sure to prepare well. We wish you all the best!

Best regards,  
HR Team,`,
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
