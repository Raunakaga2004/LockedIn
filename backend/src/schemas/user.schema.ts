import {z} from 'zod'

export const SignUpSchema = z.object({
  username : z.string().min(3, 'Username is requried'),
  firstname : z.string(),
  lastname : z.string().optional(),
  email : z.string().email('Invalid email'),
  phone_number : z.string().regex(/^\+91[6-9]\d{9}$/),
  password : z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
})

export type SignUpType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  username : z.string().optional(),
  email : z.string().email().optional(),
  phone_number : z.string().regex(/^\+91[6-9]\d{9}$/).optional(),
  password : z.string().min(8)
}).refine((data) => data.username || data.email || data.phone_number)

export type SignInType = z.infer<typeof SignInSchema>

export const ForgotPasswordSchema = z.object({
  email : z.string().email()
})

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>

export const VerifyOTPSchema = z.object({
  otp : z.number().int().min(100000).max(999999),
  email : z.string().email()
})

export type VerifyOTPType = z.infer<typeof VerifyOTPSchema>

export const ResetPasswordSchema = z.object({
  password : z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  email : z.string().email()
})

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>