# Frontend Guide 17: Platform Admin Dashboard & Audit Oversight

> **Branch / Goal:** Super-Admin Operations, Financial Reporting, Verification Queue & Immutable Audit Logs  
> **Backend Integration:** `/api/v1/admin/*`, `/api/v1/users/admin/*`, `/api/v1/providers/admin/*`, `/api/v1/bookings/admin/*`

---

## 1. Admin Dashboard Overview (`/admin`)

The central operational nerve center of PetCareLog.

### Key Metrics Dashboard (`GET /admin/dashboard/overview`)
```
┌─────────────────────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│ Total GMV (Last 30 Days)        │ Platform Revenue Earned         │ Net Online Collected            │
│ ৳ 485,000                       │ ৳ 48,500                        │ ৳ 142,300                       │
├─────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ Active Pet Owners               │ Verified Bookable Providers     │ Completed Appointments          │
│ 1,420                           │ 86                              │ 942                             │
└─────────────────────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

### Pending Action Attention Strip:
Quick alert chips linking directly to actionable queues:
- ⚠️ **Provider Verification Queue:** `4 pending`
- ⚠️ **Open Booking Disputes:** `2 open`
- ⚠️ **Reported Reviews:** `3 pending moderation`
- ⚠️ **Refunds Needing Review:** `1 pending`

### Daily Trends Charts (`GET /admin/dashboard/trends?startDate=&endDate=`)
Interactive Recharts area charts bucketed in `Asia/Dhaka` calendar days:
- **Tab 1: Revenue Trends:** Daily GMV vs Platform Fee Earned.
- **Tab 2: Bookings Volume:** Daily Created vs Completed Bookings.
- **Tab 3: User Growth:** Daily new Pet Owners vs Service Providers.

---

## 2. User & Provider Oversight (`/admin/users`)

### Users Table Features:
- Filter by Role (`USER`, `PROVIDER`, `ADMIN`) and Status (`ACTIVE`, `INACTIVE`).
- Search by Name, Email, or Phone number.
- Detail Modal (`GET /users/admin/:id`):
  - Displays user profile (sanitized allowlist: passwords & secrets are omitted).
  - Shows active login sessions (refresh tokens).
  - For pet owners: Lists their pets and booking history.
  - For providers: Shows business profile, rating, trust cancellation score.

### Suspend / Reactivate Modal:
1. **Suspend User (`PATCH /users/admin/:id/suspend`):**
   - Requires administrative reason.
   - Immediately revokes all active refresh tokens, cuts Socket.IO connections, and sets account to `INACTIVE`.
   - If user is a provider, automatically soft-suspends the business and removes it from search.
2. **Reactivate User (`PATCH /users/admin/:id/reactivate`):**
   - Restores login capabilities.

---

## 3. Provider Verification Queue (`/admin/providers/verification`)

1. Displays list of providers with status `PENDING`.
2. Detail screen displays:
   - Business license, trade license, or veterinary degrees.
   - Secure Document Viewer: Clicking any uploaded file opens a **5-minute signed Cloudinary link**.
3. **Approval / Rejection Controls (`PATCH /providers/admin/:id/verification`):**
   - **Approve:** Provider status becomes `APPROVED`, public directory visibility is enabled, notification email is dispatched.
   - **Reject:** Requires feedback reason explaining what documentation was inadequate.

---

## 4. Dispute Resolution Panel (`/admin/bookings/disputes`)

For bookings in `DISPUTED` status:

### Admin Resolution Modal (`PATCH /bookings/admin/:id/resolve-dispute`)
- Displays owner complaint and provider appointment notes.
- **Decision Choice:**
  - **Option A: Provider Wins:**
    - Booking status moves to `COMPLETED` or `NO_SHOW`.
    - Provider's wallet credit is finalized.
  - **Option B: Owner Wins (Refund):**
    - Booking status moves to `REFUNDED`.
    - Admin specifies `refundAmount` (up to online amount paid).
    - System calculates financial split: debits provider earning (`REFUND_ADJUSTMENT`), absorbs remaining from platform fee, and initiates MFS refund to the client.

---

## 5. Immutable Admin Audit Logs (`/admin/audit-logs`)

Audit trail displaying every administrative write and sensitive read (`GET /admin/audit-logs`):

### Audit Table Columns:
- **Timestamp:** Asia/Dhaka time.
- **Admin Actor:** Email and ID of acting admin.
- **Action & Method:** e.g. `PATCH /users/admin/:id/suspend`.
- **Resource & Target ID:** e.g. User `#670a...`.
- **Status & Outcome:** `SUCCESS` (green) or `FAILURE` (red).
- **Inspect Request:**
  - Clicking a row opens the sanitized payload modal: displays request body, query parameters, client IP, and User-Agent (with passwords and tokens automatically redacted as `[redacted]`).
