# Frontend Guide 15: Notifications Center & Pet Reminders Hub

> **Branch / Goal:** In-App Notification Center & Health Due-Date Reminders Hub  
> **Backend Integration:** `/api/v1/notifications/*`, `/api/v1/reminders/*`

---

## 1. In-App Notification Center

### Header Bell & Flyout Component
- Displays unread notification count badge in real-time.
- Connected to Socket.IO event: `notification:new`:
  - When event fires: plays subtle audio ping, triggers toast notification via Sonner, and increments badge counter.

### API Endpoints
- `GET /notifications`: List notifications with pagination and unread filtering.
- `GET /notifications/unread-count`: Fetch total unread count.
- `PATCH /notifications/:id/read`: Mark single notification as read.
- `PATCH /notifications/read-all`: Mark all notifications as read.

### Notification Item Card Design:
- **Icon Type:**
  - 📅 `BOOKING_*`: Appointment updates (confirmed, reminder, cancelled).
  - 💉 `REMINDER_DUE`: Vaccination / medication due today.
  - 💰 `PAYOUT_*` / `PAYMENT_*`: Financial events.
  - ⭐ `REVIEW_*`: Customer review received / replied.
- **Title & Body Text.**
- **Timestamp:** Formatted as relative time (e.g. `10 minutes ago`).
- **Click Action:** Deep-links to the related resource (e.g. `/dashboard/owner/bookings/670...`).

---

## 2. Pet-Care Reminders Hub (`/dashboard/owner/reminders`)

PetCareLog provides an automated preventive care engine that keeps pets healthy by reminding owners of upcoming treatments.

```
       [ Auto-Generated Reminders ]                  [ Manual Custom Reminders ]
  (Vaccinations, Deworming, Document Expiry)           (Heartworm Pills, Vet Visits)
                       │                                             │
                       └──────────────────────┬──────────────────────┘
                                              ▼
                             [ Reminders Hub: Calendar & List ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
            "Mark as Completed"                               "Snooze Reminder"
          (Closes reminder as DONE)                         (Postpones by 1–7 days)
```

### Reminder Tabs & Filters:
1. **List View:**
   - **Overdue (Red):** Due date is in the past.
   - **Due Today (Amber):** Requires action today.
   - **Upcoming (Green):** Due in the next 30 days.
2. **Calendar View:**
   - Monthly grid showing reminder pills tagged by pet.

---

## 3. Reminder Actions & Manual Creation

### Manual Reminder Modal (`POST /reminders`)
- **Fields:**
  - `title`: e.g. `Administer Frontline Flea Treatment`.
  - `petId`: select owner's pet.
  - `dueDate`: YYYY-MM-DD.
  - `dueTime`: optional (e.g. `09:00`).
  - `notes`: optional instructions.

### Action Controls on Reminder Row:
- **Mark Done (`PATCH /reminders/:id/done`):**
  - Moves reminder to archived completed list.
- **Snooze Modal (`PATCH /reminders/:id/snooze`):**
  - Quick choices: "Tomorrow", "In 3 Days", "In 1 Week", or "Custom Date".
  - Calls `PATCH /reminders/:id/snooze` with `{ until: "2026-10-15T09:00:00.000Z" }`.
