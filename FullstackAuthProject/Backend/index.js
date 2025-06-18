require("dotenv").config();
const express = require("express");
const connection = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  })
);
const authRoute = require("./routes/auth.route");
app.get("/", (req, res) => {
  res.send("this is get route...!");
});
app.use("/api/auth", authRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/Frontend/vite-project/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  connection();
  console.log(`server running on port ${PORT}`);
});
