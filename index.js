import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config.js";
import authRoute from "./auth/auth.route.js";

const app = express();

if (process.env.DB_TYPE === "mongodb") {
  connectDB();
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRoute);

app.get("/", (_req, res) => {
  res.send("API OK");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
