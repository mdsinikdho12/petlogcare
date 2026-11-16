# Frontend Guide 18: Hardening, SEO, Performance & Deployment

> **Branch / Goal:** Production Polish, Metadata & SEO, Error Boundaries, Bundle Optimization & Deployment Checklist

---

## 1. SEO & Structured Data (JSON-LD)

### 1. Dynamic Meta & OpenGraph (`src/app/(public)/layout.tsx`)
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://petcarelog.com'),
  title: {
    default: 'PetCareLog — Complete Pet Health Records & Verified Booking in Bangladesh',
    template: '%s | PetCareLog',
  },
  description: 'Digital pet health records, vaccination logs, veterinary appointments and verified pet care services across Dhaka and Bangladesh.',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: 'https://petcarelog.com',
    siteName: 'PetCareLog',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'PetCareLog' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 2. Structured Data for Providers (`src/app/(public)/providers/[id]/page.tsx`)
Inject Google LocalBusiness / VeterinaryCare schema for high search ranking:
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VeterinaryCare',
  name: provider.businessName,
  image: provider.logo?.url,
  telephone: provider.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: provider.address?.street,
    addressLocality: provider.address?.area,
    addressRegion: provider.address?.district,
    addressCountry: 'BD',
  },
  aggregateRating: provider.totalRatings > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: provider.avgRating,
    reviewCount: provider.totalRatings,
  } : undefined,
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## 2. Error Boundaries & Offline Feedback

### 1. Custom Global Error Boundary (`src/app/error.tsx`)
```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-coral-50 rounded-2xl flex items-center justify-center text-coral-600 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-surface-900 mb-2">Something went wrong</h2>
      <p className="text-surface-600 text-sm max-w-md mb-6">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
      </div>
    </div>
  );
}
```

### 2. Network Offline Toast
Listen for browser online/offline events in `src/components/shared/NetworkBanner.tsx`:
- Shows a non-intrusive top banner when user loses internet connection: *"⚠️ You are currently offline. Some features may be unavailable."*

---

## 3. Bundle & Performance Optimization

1. **Next.js Image Component:**
   - Configure Cloudinary domain in `next.config.ts`:
     ```typescript
     images: {
       remotePatterns: [
         { protocol: 'https', hostname: 'res.cloudinary.com' },
       ],
     },
     ```
2. **Dynamic Imports for Heavy Modules:**
   - Lazy load Recharts chart components in the weight tracker and admin trends using `next/dynamic` (`ssr: false`) to keep the initial page bundle light.

---

## 4. Production Deployment Checklist

| Checklist Item | Requirement & Action |
|---|---|
| **API URL** | Ensure `NEXT_PUBLIC_API_URL` points to live HTTPS endpoint (e.g. `https://api.petcarelog.com/api/v1`). |
| **UddoktaPay Ports** | API must run on standard HTTPS port (443); non-standard ports will drop payment callback paths. |
| **Cookies** | Cross-domain deployments must enable `SameSite=None; Secure` for the refreshToken cookie. |
| **Socket.IO** | Ensure WebSocket upgrade proxying is enabled in Nginx: `proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`. |
| **PWA / Mobile** | Provide `manifest.json` and app icons for home screen pet reminder installation. |
