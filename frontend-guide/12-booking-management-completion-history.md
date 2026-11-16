# Frontend Guide 12: Booking Management, 2-Step Completion & History Logging

> **Branch / Goal:** Lifecycle Action Modals, Rescheduling, 2-Step Completion, Disputes & Provider Medical Logging  
> **Backend Integration:** `/api/v1/bookings/*`, `/api/v1/bookings/:id/*`

---

## 1. Owner Bookings Dashboard (`/dashboard/owner/bookings`)

### Tabs & Views
- **Upcoming:** Bookings in `PENDING`, `CONFIRMED`, or `IN_PROGRESS`.
- **Completed:** Bookings in `COMPLETED_PENDING_CONFIRMATION` or `COMPLETED`.
- **Past / Inactive:** Bookings in `CANCELLED`, `NO_SHOW`, `DISPUTED`, or `REFUNDED`.

### Key Actions on Booking Card:
1. **Reschedule Modal (`PATCH /bookings/:id/reschedule`):**
   - Allowed when booking is `PENDING` or `CONFIRMED`.
   - Must be at least `freeCancellationHours` (e.g. 12h) before appointment start.
   - Limit: Maximum 2 reschedules per booking.
   - Shows calendar + live slot picker for the same service type.
2. **Cancel Modal (`PATCH /bookings/:id/cancel`):**
   - Inputs cancellation reason.
   - Informs client whether the upfront platform fee is refundable based on policy window.

---

## 2. 2-Step Completion & Owner Dispute Modal

PetCareLog uses a **2-step completion flow** to protect pet owners from fraudulent completion marks:

```
Provider marks "Complete" ──► Status: COMPLETED_PENDING_CONFIRMATION
                                   │
          ┌────────────────────────┴────────────────────────┐
          ▼                                                 ▼
Owner clicks "Confirm Completion"          48 Hours Pass Without Action
  OR leaves a positive review                           │
          │                                             ▼
          └────────────────────────► Status: COMPLETED (Provider Wallet Credited)
                                                        ▲
                                   Owner disputes ──────┤
                                   within 48 hours      │
                                                        ▼
                                                  Status: DISPUTED
```

### Owner Action Banner (when `status === 'COMPLETED_PENDING_CONFIRMATION'`):
- Highlighted card: *"Your provider marked this appointment as complete. Please confirm that service was delivered satisfactorily."*
- **Button 1 (Primary):** **"Confirm Completion"** → `PATCH /bookings/:id/confirm-completion`.
- **Button 2 (Outline):** **"Dispute Visit"** → Opens Dispute Modal.

### Dispute Modal Form (`PATCH /bookings/:id/dispute`):
- Reason dropdown: `SERVICE_NOT_DELIVERED`, `POOR_QUALITY`, `INCORRECT_SERVICE`, `SAFETY_CONCERN`, `OTHER`.
- Description textarea (up to 1,000 characters).
- Submitting freezes the provider's earning and notifies platform admins for review.

---

## 3. Provider Bookings Manager (`/dashboard/provider/bookings`)

### Request Actions:
- **Accept Request:** `PATCH /bookings/:id/accept` → moves to `CONFIRMED`.
- **Decline Request:** `PATCH /bookings/:id/decline` (reason required) → cancels booking and automatically initiates full online refund for the client.
- **Start Visit:** `PATCH /bookings/:id/start` (within 30 mins before start) → moves to `IN_PROGRESS`.
- **Complete Visit:** `PATCH /bookings/:id/complete` → moves to `COMPLETED_PENDING_CONFIRMATION`.
- **Mark No-Show:** `PATCH /bookings/:id/no-show` (at least 15 min past start).

---

## 4. Provider Post-Service History Logging (`POST /bookings/:id/history`)

Within 7 days of visit completion, the provider can log medical updates directly into the pet's profile from the booking detail screen:

### Logging Modal Form
Allows the provider to log one or multiple records in a single submission:
1. **Grooming Record:** Services done, groomer name, products used, before & after photo uploads.
2. **Vaccination Record:** Vaccine name, batch number, booster `nextDueDate`.
3. **Deworming Record:** Product name, dosage, next due date.
4. **Weight Entry:** Pet's recorded weight in kg today.
5. **General Doctor / Care Notes:** Recommendations for diet or follow-up care.

### Submitting:
Calls `POST /api/v1/bookings/:id/history`:
- Backend writes the records with `addedBy: { role: 'PROVIDER', userId, providerId }`.
- Automatically updates the pet's health logs in the owner's dashboard.
- Generates automatic pet-care reminders for any populated `nextDueDate` fields.
