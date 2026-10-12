
import { Router } from "express";
import passport from "passport";
import { requireSession } from "../middleware/session.middleware.js";
const sessionRouter = Router();

sessionRouter.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.status(200).json({
      message: "Session login successful",
      user: req.user,
    });
  },
);

sessionRouter.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      next(error);
      return;
    }

    res.status(200).json({
      message: "Logged out successfully",
    });
  });
});
sessionRouter.get("/profile", requireSession, (req, res) => {
  res.json({
    message: "Session authenticated",
    user: req.user,
  });
});
export default sessionRouter;
