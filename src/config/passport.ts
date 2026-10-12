
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { usersTable } from "../db/schema.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const users = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email.trim().toLowerCase()))
          .limit(1);

        const user = users[0];

        if (!user || !user.password) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        const isMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!isMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export default passport;
