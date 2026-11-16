# Frontend Guide 01: Next.js Setup, Tailwind CSS & Design System

> **Branch / Goal:** Frontend Project Initialization & Core Design System  
> **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons, Class Variance Authority (CVA), Tailwind Merge

---

## 1. Project Initialization

Initialize a new Next.js project with TypeScript, Tailwind CSS, and App Router:

```bash
npx create-next-app@latest petcarelog-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm
```

### Essential Dependencies
Install component utilities, icons, and UI helpers:

```bash
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install @tanstack/react-query @tanstack/react-query-devtools axios
npm install zustand react-hook-form @hookform/resolvers zod
npm install date-fns date-fns-tz
npm install sonner recharts socket.io-client
```

---

## 2. Directory Layout (`src/`)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (public)/
│   │   ├── page.tsx                     # Landing page
│   │   ├── providers/
│   │   │   ├── page.tsx                 # Directory search
│   │   │   └── [id]/page.tsx            # Provider public profile & booking
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── legal/
│   ├── dashboard/
│   │   ├── owner/                       # Pet owner dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pets/
│   │   │   ├── bookings/
│   │   │   ├── reminders/
│   │   │   └── messages/
│   │   └── provider/                    # Service provider dashboard
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── services/
│   │       ├── availability/
│   │       ├── bookings/
│   │       ├── wallet/
│   │       └── profile/
│   ├── admin/                           # Admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── users/
│   │   ├── providers/
│   │   ├── bookings/
│   │   ├── payouts/
│   │   ├── reviews/
│   │   ├── cms/
│   │   └── audit-logs/
│   ├── layout.tsx                       # Root layout
│   └── globals.css
├── components/
│   ├── ui/                              # Primitive UI components (Button, Modal, Input)
│   ├── layout/                          # Header, Footer, Sidebar, Navigation
│   ├── shared/                          # Avatar, StatusBadge, RatingStars, FileUploader
│   └── modules/                         # Feature-specific components
├── lib/
│   ├── api/                             # Axios instance, endpoints, query keys
│   ├── hooks/                           # Custom React hooks
│   ├── store/                           # Zustand stores (auth, booking modal)
│   ├── utils.ts                         # cn() helper, formatters
│   └── constants.ts                     # Enums, Bangladesh districts, defaults
└── types/                               # TypeScript interfaces matching backend models
```

---

## 3. Tailwind CSS & Design System Tokens

PetCareLog uses a modern, calming palette designed for pet health care.

### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',   // Primary Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        warm: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',   // Amber accent
          600: '#d97706',
        },
        coral: {
          50: '#fff1f2',
          500: '#f43f5e',   // Heart / Urgency accent
          600: '#e11d48',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)',
        hover: '0 12px 24px -4px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
};

export default config;
```

### Utility Helper: `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
}
```

---

## 4. Universal Component Primitives

### 1. `Button.tsx` (`src/components/ui/button.tsx`)
```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
        secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200',
        outline: 'border border-surface-200 bg-white text-surface-900 hover:bg-surface-50',
        ghost: 'text-surface-700 hover:bg-surface-100',
        danger: 'bg-coral-500 text-white hover:bg-coral-600',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### 2. Status Badge (`src/components/shared/StatusBadge.tsx`)
Color-coded badge for booking statuses, payment states, and document expiry:
```typescript
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-brand-50 text-brand-700 border-brand-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
  DISPUTED: 'bg-coral-50 text-coral-700 border-coral-200',
  NO_SHOW: 'bg-rose-50 text-rose-700 border-rose-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  VALID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  EXPIRING_SOON: 'bg-amber-50 text-amber-700 border-amber-200',
  EXPIRED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');
  const style = statusStyles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        style,
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
```

---

## 5. Global Root Layout Setup (`src/app/layout.tsx`)

```typescript
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import Providers from './providers';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'PetCareLog — Health Records & Verified Pet Service Booking',
  description: 'Comprehensive pet health records, cal.com-style veterinary and grooming booking in Bangladesh.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen bg-surface-50 text-surface-900 font-sans antialiased selection:bg-brand-500 selection:text-white">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
```
