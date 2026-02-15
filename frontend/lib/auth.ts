import { betterAuth } from "better-auth";
import { pool } from "./db";

export const auth = betterAuth({
    database: pool,
    emailAndPassword: {
        enabled: true,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    session: {
        expiresIn: 60 * 30, // 30 minutes
        updateAge: 60 * 15,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 30
        }
    },
    advanced: {
        cookiePrefix: "better-auth",
    }
});
