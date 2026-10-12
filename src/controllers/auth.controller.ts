
import type { Request, Response } from "express";
import { registerUser,loginUser } from "../services/auth.service.js";

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      res.status(400).json({
        message:
          "Name, valid email, and password of at least 8 characters are required.",
      });
      return;
    }

    if (
      role !== undefined &&
      !["student", "instructor", "admin"].includes(role)
    ) {
      res.status(400).json({
        message: "Role must be student, instructor, or admin.",
      });
      return;
    }

    const user = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(409).json({
        message: "Email already registered",
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        res.status(401).json({
          message: "Invalid email or password",
        });
        return;
      }

      if (error.message === "JWT_SECRET_NOT_CONFIGURED") {
        res.status(500).json({
          message: "JWT secret is not configured",
        });
        return;
      }
    }

    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

