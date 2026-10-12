/**
 * Connect your backend here.
 * Everything runs in labelled DEMO mode until you set NEXT_PUBLIC_AUTH_DEMO=false
 * and the endpoints below exist.
 */
export const AUTH = {
  GOOGLE_URL: "/auth/google", // server route that starts Google OAuth, then redirects back
  SIGNUP_ENDPOINT: "/api/auth/signup", // POST JSON {email,password,name,ageOk,q?} -> 200, or 4xx {error}
  LOGIN_ENDPOINT: "/api/auth/login", // POST JSON {email,password,q?} -> 200, or 4xx {error}
  RESET_ENDPOINT: "/api/auth/reset", // POST JSON {email}
  AFTER: "/app", // where to go after success
  DEMO: process.env.NEXT_PUBLIC_AUTH_DEMO !== "false",
} as const;
