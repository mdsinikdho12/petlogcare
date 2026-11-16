# Frontend Guide 10: UddoktaPay Payment Flow & Upfront Fee Model

> **Branch / Goal:** UddoktaPay Checkout Integration, Upfront Booking Confirmation Fee, Return Verification  
> **Backend Integration:** `POST /payments/bookings/:id/checkout`, `POST /payments/verify`

---

## 1. Upfront Fee Model & Payment Selection

PetCareLog eliminates fake cancellations and cash-collection fee evasion by **always securing the platform fee online upfront**:

| Payment Option | Charged Online (UddoktaPay) | Paid at Appointment | Backend Charge Type |
|---|---|---|---|
| **Pay Now (100%)** | Full Service Price (e.g. ৳ 500) | ৳ 0 | `FULL_AMOUNT` |
| **Pay on Visit** | Platform Fee Only (e.g. ৳ 50) | ৳ 450 (cash to provider) | `FEE_ONLY` |

---

## 2. Initiating Checkout (`POST /payments/bookings/:id/checkout`)

Once a booking is created and in `PENDING_PAYMENT` status:

```typescript
const initiatePayment = async (bookingId: string) => {
  try {
    const { data } = await apiClient.post(`/payments/bookings/${bookingId}/checkout`);
    
    // Backend returns: { status: true, payment_url: "https://pay.uddoktapay.com/..." }
    if (data.data?.payment_url) {
      // Redirect user to UddoktaPay MFS Gateway (bKash, Nagad, Rocket, Cards)
      window.location.href = data.data.payment_url;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Could not initialize payment gateway');
  }
};
```

---

## 3. Return Callback Page (`src/app/(public)/payment/callback/page.tsx`)

After the client enters their PIN on UddoktaPay, the gateway redirects back to the configured `PAYMENT_RESULT_URL`:
```
https://petcarelog.com/payment/callback?status=success&invoiceId=inv_12345&bookingId=670...
```

### Callback Verification Component
The callback page displays a loading spinner while verifying transaction status with the backend:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('invoiceId') || searchParams.get('invoice_id');
  const bookingId = searchParams.get('bookingId');

  const [state, setState] = useState<'verifying' | 'success' | 'failed' | 'late_refunded'>('verifying');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const verify = async () => {
      if (!invoiceId) {
        setState('failed');
        return;
      }

      try {
        const { data } = await apiClient.post('/payments/verify', { invoiceId });
        setDetails(data.data);

        if (data.data.bookingOutcome === 'CONFIRMED' || data.data.bookingOutcome === 'PENDING') {
          setState('success');
        } else if (data.data.bookingOutcome === 'REFUNDED_LATE') {
          setState('late_refunded');
        } else {
          setState('failed');
        }
      } catch (err) {
        setState('failed');
      }
    };

    verify();
  }, [invoiceId]);

  if (state === 'verifying') {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-2xl shadow-card">
        <Loader2 className="h-12 w-12 text-brand-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900">Verifying Payment...</h2>
        <p className="text-surface-600 text-sm mt-2">Connecting with bKash/Nagad to confirm transaction.</p>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-2xl shadow-card">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-surface-900">Appointment Confirmed!</h2>
        <p className="text-surface-600 text-sm mt-2 mb-6">
          Your payment was processed successfully. Notifications have been dispatched.
        </p>
        <div className="space-y-3">
          <Button onClick={() => router.push(`/dashboard/owner/bookings/${bookingId}`)} className="w-full">
            View Booking Details
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/owner')} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'late_refunded') {
    return (
      <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-2xl shadow-card">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-surface-900">Slot No Longer Available</h2>
        <p className="text-surface-600 text-sm mt-2 mb-6">
          Payment took longer than the 15-minute hold and the slot was taken. Your full payment of ৳ {details?.amount} has been automatically refunded to your MFS account.
        </p>
        <Button onClick={() => router.push('/providers')} className="w-full">
          Select Another Slot
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-20 text-center p-8 bg-white rounded-2xl shadow-card">
      <XCircle className="h-16 w-16 text-coral-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-surface-900">Payment Incomplete</h2>
      <p className="text-surface-600 text-sm mt-2 mb-6">The transaction was cancelled or could not be verified.</p>
      <Button onClick={() => router.push(`/dashboard/owner/bookings`)} className="w-full">
        Check Bookings
      </Button>
    </div>
  );
}
```
