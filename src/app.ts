
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import authRouter from "./routes/auth.routes.js";
import protectedRouter from "./routes/protected.routes.js";
import sessionRouter from "./routes/session.routes.js";
const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "development-only-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/session", sessionRouter);
app.use("/api/auth", authRouter);
app.use("/api", protectedRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "LMS Authentication API is running",
  });
});

export default app;
