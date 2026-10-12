
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import type { AuthRequest } from "./auth.middleware.js";

type Role = "student" | "instructor" | "admin";

export function authorize(...allowedRoles: Role[]): RequestHandler {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const authUser = (req as AuthRequest).authUser;

    if (!authUser) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(authUser.role)) {
      res.status(403).json({
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
}
