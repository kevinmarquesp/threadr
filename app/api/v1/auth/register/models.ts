import { z } from "zod";

namespace PostModels {
  // export const paramsValidator = z.object({});
  // export type Params = z.infer<typeof paramsValidator>;

  // export const searchValidator = z.object({});
  // export type Search = z.infer<typeof searchValidator>;

  export const bodyValidator = z.object({
    username: z
      .string()
      .trim()
      .min(1, "Username required")
      .refine((name) => !["admin", "name", "user", "users", "event"].includes(name)),
    email: z
      .string()
      .trim()
      .email()
      .min(1, "Email required"),
    password: z
      .string()
      .trim()
      .regex(/[!@#$%^&*()_+{}[\]|:;<>,.?/\\]/, "Should include special characters.")
      .regex(/[0-9]/, "Should include numbers.")
      .regex(/[A-Z]/, "Should include uppercase characters.")
      .regex(/[a-z]/, "Should include lowercase characters.")
      .min(12, "Password is too short.")
      .min(1, "Password required."),
    confirmation: z
      .string()
      .trim()
      .min(1, "Confirm your password"),
  }).superRefine(({ password, confirmation }, ctx) =>
    password !== confirmation && ctx.addIssue({
      code: "custom",
      message: "Passwords did not match",
      path: ["confirmation"],
    }));
  export type Body = z.infer<typeof bodyValidator>;
}

export { PostModels };
