# Frontend Guide 03: Auth Flow Pages & Forms

> **Branch / Goal:** Register, Login, Email OTP, Password Reset, and Google OAuth Pages  
> **Backend Integration:** `/api/v1/auth/*` endpoints (tag: Auth)

---

## 1. Zod Form Validation Schemas (`src/lib/validations/auth.ts`)

Matches the backend constraints in `auth.validation.ts`:

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').toLowerCase(),
  phone: z
    .string()
    .regex(/^\+8801[3-9]\d{8}$/, 'Must be a valid Bangladeshi number (+8801XXXXXXXXX)')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password cannot exceed 72 characters'),
  role: z.enum(['USER', 'PROVIDER'], {
    errorMap: () => ({ message: 'Please select account type' }),
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
```

---

## 2. Register Page (`src/app/(auth)/register/page.tsx`)

### Role Selection UI & Form:
1. Two interactive radio cards: **"Pet Owner"** (book services, track health) vs. **"Service Provider"** (offer vet, grooming, boarding).
2. Form fields: Full Name, Email, Phone Number (+880 format helper), Password.
3. Submit sends `POST /api/v1/auth/register`.
4. On success: redirects to `/verify-email?email=<encodedEmail>` with toast: *"We sent a 6-digit verification code to your email"*.

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post('/auth/register', values);
      toast.success(data.message || 'Verification code sent!');
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-card border border-surface-200">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Create your account</h1>
      <p className="text-surface-600 text-sm mb-6">Join PetCareLog to manage pets or offer care services.</p>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setValue('role', 'USER')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedRole === 'USER'
              ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500'
              : 'border-surface-200 hover:bg-surface-50'
          }`}
        >
          <div className="font-semibold text-surface-900">Pet Owner</div>
          <div className="text-xs text-surface-500 mt-1">Book care & track health</div>
        </button>

        <button
          type="button"
          onClick={() => setValue('role', 'PROVIDER')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedRole === 'PROVIDER'
              ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500'
              : 'border-surface-200 hover:bg-surface-50'
          }`}
        >
          <div className="font-semibold text-surface-900">Service Provider</div>
          <div className="text-xs text-surface-500 mt-1">Vet, groomer, boarding</div>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="Dr. Rahman / Nusrat Jahan"
          />
          {errors.name && <p className="text-xs text-coral-500 mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Email Address</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-coral-500 mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Phone Number (optional)</label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="+8801712345678"
          />
          {errors.phone && <p className="text-xs text-coral-500 mt-1">{errors.phone.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-coral-500 mt-1">{errors.password.message as string}</p>}
        </div>

        <Button type="submit" className="w-full" isLoading={loading}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
```

---

## 3. Email Verification Page (`src/app/(auth)/verify-email/page.tsx`)

### OTP Screen Features:
- 6-box individual digit inputs (auto-focus next input, backspace moves back, paste handles full 6 digits).
- Resend Timer countdown (60 seconds cooldown before calling `POST /auth/resend-otp`).
- Submitting calls `POST /auth/verify-email`:
  ```json
  { "email": "user@example.com", "otp": "123456" }
  ```
- On success: stores token & user in `useAuthStore`, redirects based on role:
  - `USER` → `/dashboard/owner`
  - `PROVIDER` → `/dashboard/provider/onboarding` (to complete business profile)

---

## 4. Login Page (`src/app/(auth)/login/page.tsx`)

- Email + Password inputs.
- Google OAuth CTA button:
  ```typescript
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };
  ```
- Submits to `POST /auth/login`.
- Saves `accessToken` and user object in Zustand.
- Redirects to previously intended page (via `?redirect=` param) or default dashboard.

---

## 5. Password Reset Flow

1. **Forgot Password Screen (`/forgot-password`):**
   - User inputs email → calls `POST /auth/forgot-password`.
   - Backend sends 6-digit reset code via email.
   - Redirects to `/reset-password?email=...`.
2. **Reset Password Screen (`/reset-password`):**
   - Step A: Verify OTP via `POST /auth/verify-reset-otp` → returns temporary `resetToken`.
   - Step B: User inputs new password → calls `POST /auth/reset-password`:
     ```json
     { "email": "...", "resetToken": "...", "newPassword": "..." }
     ```
   - On success: all sessions revoked on backend; redirects to `/login`.
