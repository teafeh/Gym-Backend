import express from "express";
import path from "path";
import { ENV } from "./src/config/env.js";
import qrRoutes from "./src/routes/qr.routes.js";
import connectDB from "./src/config/db.js";
import cors from "cors";
import adminRoutes from "./src/routes/admin.routes.js"
import userRoutes from "./src/routes/user.routes.js";
import checkinRoutes from "./src/routes/checkin.routes.js";

const app = express();

// =======================
// CORS CONFIGURATION ✅
// =======================
const allowedOrigins = [
  "https://gym-react-app-orpin.vercel.app",
  "http://localhost:5173",
  "http://10.30.65.121:5173",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc.
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =======================
// BODY PARSER + UPLOAD LIMITS ✅
// =======================
// Must come *before* routes
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// =======================
// STATIC FILES ✅
// =======================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// =======================
// ROUTES ✅
// =======================
app.use("/api/qr", qrRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/checkin", checkinRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Gym Check-in Backend Running ✅");
});

// =======================
// START SERVER ✅
// =======================
app.listen(ENV.PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`✅ Server running on http://0.0.0.0:${ENV.PORT}`);
});
