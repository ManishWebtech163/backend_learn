import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


// --
const app = express();

// -middle ware for cors error solve-
app.use(
  cors({
    origin: process.env.CORS_URLS,
    credentials: true,
  }),
);

// -config for data in-out app-
app.use(
  express.json({
    limit: "16kb", // optional
  }),
);
app.use(
  express.urlencoded({
    limit: "20kb", // optional
    extended: true, // optional
  }),
);
app.use(express.static("public"));

// -middleware for set or access user browser cookies-
app.use(cookieParser());


// --routes--
import user_router from "./routes/user.routes.js";

// --routes declaration--
app.use("/api/v1/users", user_router) // route - ---/api/v1/users/login-regsiter

// -
export default app;
