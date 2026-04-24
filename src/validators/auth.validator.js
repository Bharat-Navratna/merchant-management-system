const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters long")
  }),
  params: z.object({}),
  query: z.object({})
});

const loginSchema = z.object({
  body: z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long")
  }),
  params: z.object({}),
  query: z.object({})
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
  }),
  params: z.object({}),
  query: z.object({})
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema
};
