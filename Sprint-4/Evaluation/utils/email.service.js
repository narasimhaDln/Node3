const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
exports.sendJbEmil = async (userEmail, job, adminName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Job Application confirmation:${job.title}`,
    text: `You applied for:${job.title}\nDescription:${
      job.description
    }\nPosted by:${adminName}\nTime:${new Date()}`,
  });
};
