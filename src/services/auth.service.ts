
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { usersTable } from "../db/schema.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "student" | "instructor" | "admin";
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const result = await db.insert(usersTable).values({
    name: input.name.trim(),
    email,
    password: hashedPassword,
    role: input.role ?? "student",
  });

  return {
    id: result[0].insertId,
    name: input.name.trim(),
    email,
    role: input.role ?? "student",
  };
}

export async function loginUser(email: string, password: string) {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.trim().toLowerCase()))
    .limit(1);

  const user = users[0];

  if (!user || !user.password) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || secret === "replace_with_a_long_random_secret") {
    throw new Error("JWT_SECRET_NOT_CONFIGURED");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    secret,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
