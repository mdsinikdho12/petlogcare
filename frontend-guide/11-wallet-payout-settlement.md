# Frontend Guide 11: Wallet Ledger & Manual Settlement Payouts

> **Branch / Goal:** Provider Earnings Dashboard, Append-Only Ledger Table, Payout Settings, Admin Mark-as-Paid  
> **Backend Integration:** `/api/v1/wallet/*`, `/api/v1/payouts/*`

---

## 1. Provider Wallet Dashboard (`/dashboard/provider/wallet`)

The wallet interface displays earnings with total financial transparency.

### Balance Summary Cards (`GET /wallet/me`)
```json
{
  "currentBalance": 12500,
  "availableBalance": 9800,
  "heldBalance": 2700,
  "nextReleaseAt": "2026-10-11T14:30:00.000Z",
  "payoutEligible": true,
  "totalEarnedLifetime": 45000,
  "totalPaidOutLifetime": 32500
}
```

### Card Layout:
1. **Available for Payout:** `৳ 9,800` (green highlight — funds past the 48h dispute window).
2. **Held in Dispute Window:** `৳ 2,700` (info tooltip: *"Held for 48 hours following appointment completion to protect against client disputes. Automatically becomes available at {nextReleaseAt}"*).
3. **Total Lifetime Earnings:** `৳ 45,000`.
4. **Total Settled / Paid Out:** `৳ 32,500`.

---

## 2. Append-Only Ledger History Table

Displays the immutable financial audit trail (`GET /wallet/me/ledger`):

| Date & Time | Entry Type | Reference / Reason | Amount | Balance After |
|---|---|---|---|---|
| Oct 9, 02:30 PM | `CREDIT` | Booking #670... (Vaccination) | + ৳ 450 | ৳ 12,500 |
| Oct 7, 10:00 AM | `PAYOUT` | Weekly Settlement (Ref: BKS-9921) | - ৳ 8,000 | ৳ 12,050 |
| Oct 6, 04:00 PM | `REFUND_ADJUSTMENT` | Dispute #669... (Owner Win) | - ৳ 300 | ৳ 20,050 |

---

## 3. Payout Settings Tab (`/dashboard/provider/payout-settings`)

Providers configure where they receive weekly earnings:

### API Endpoints
- `GET /payouts/methods`: List methods.
- `POST /payouts/methods`: Add method (Max 3).
- `PATCH /payouts/methods/:id`: Edit method or set default.
- `DELETE /payouts/methods/:id`: Remove method.

### Security Requirement: Password Confirmation
Every creation, edit, or deletion requires the provider's `currentPassword`:
```typescript
interface AddPayoutMethodPayload {
  type: 'BKASH' | 'BANK';
  currentPassword: string;
  isDefault?: boolean;
  bkashNumber?: string; // Validated as +8801[3-9]...
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  branchName?: string;
  routingNumber?: string;
}
```

---

## 4. Admin Settlement & "Mark as Paid" Flow (`/admin/payouts`)

Platform admins settle earnings manually on a weekly cadence:

```
[ Admin Reviews Eligible Providers ] ──► [ Admin Sends Funds via bKash / Bank ] ──► [ Admin Enters Ref & Marks as Paid ]
```

### 1. Eligible Providers Table (`GET /payouts/admin/eligible`)
- Lists providers where `availableBalance >= minimumPayoutAmount`.
- Displays Provider Name, Available Balance, Held Balance, Default Payout Method (with copy-to-clipboard for bKash/Bank details).
- Action Button: **"Release Payout"**.

### 2. "Mark as Paid" Modal Form (`POST /payouts/admin`)
- **Fields:**
  - `providerId`: ID of provider.
  - `amount`: Number (default: full `availableBalance`, or partial amount up to available balance).
  - `reference`: Transaction ID from bKash / Bank SMS (e.g. `BKS992817346`).
  - `payoutMethodId`: Selected payout method ID.
  - `payoutProof`: Optional screenshot receipt upload (JPEG/PNG/PDF).
  - `note`: Optional admin note.
- **Execution:**
  - Submitting writes an atomic `PAYOUT` debit ledger entry.
  - Automatically sends notification to the provider (`PAYOUT_RELEASED`).
