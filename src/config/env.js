import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  BASE_URL: process.env.BASE_URL || "https://gymapp.com",
};
