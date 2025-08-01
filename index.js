const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const authMiddleware = require("./config/auth");
const db = require("./config/db");

require('./config/initDB');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome Programmer, API is running");
});

const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const profileRouter = require("./routes/profileRouter");
const bannerRouter = require("./routes/bannerRouter");
const servicesRouter = require("./routes/servicesRouter");
const balanceRouter = require("./routes/balanceRouter");
const topUpRouter = require("./routes/topupRouter");
const transaksiRouter = require("./routes/transaksiRouter");

app.use("/upload", express.static(path.join(__dirname, "../upload")));

app.use("/login", loginRouter);
app.use("/registration", registerRouter);
app.use("/profile", authMiddleware, profileRouter);
app.use("/banner", bannerRouter);
app.use("/services", authMiddleware, servicesRouter);
app.use("/balance", authMiddleware, balanceRouter);
app.use("/topup", authMiddleware, topUpRouter);
app.use("/transaction", authMiddleware, transaksiRouter);

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = app;
module.exports.handler = serverless(app);
