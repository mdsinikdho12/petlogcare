import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, "Must be a valid Bangladeshi number (+8801XXXXXXXXX)")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
  role: z.enum(["USER", "PROVIDER"], {
    message: "Please select account type",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "Reset code must be 6 digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
