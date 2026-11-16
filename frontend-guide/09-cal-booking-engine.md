# Frontend Guide 09: Cal.com-Style Client Booking Flow

> **Branch / Goal:** Interactive Multi-Step Cal.com Booking Wizard with Live Discrete Slots & 15-Minute Hold  
> **Backend Integration:** `GET /availability/dates`, `GET /availability/slots`, `POST /bookings`

---

## 1. Booking Engine Architectural Flow

```
[ Step 1: Select Service ]
        │
        ▼
[ Step 2: Pick Date (Month Calendar) ]  ◄── GET /availability/dates?serviceTypeId=&month=
        │
        ▼
[ Step 3: Pick Discrete Slot ]         ◄── GET /availability/slots?serviceTypeId=&date=
        │
        ▼
[ Step 4: Pick Pet & Notes ]
        │
        ▼
[ Step 5: Summary & Create Booking ]   ──► POST /bookings (Creates 15-min Hold: PENDING_PAYMENT)
        │
        ▼
[ Step 6: Redirect to Payment Step ]   ──► (See Guide 10 for UddoktaPay Checkout)
```

---

## 2. Step-by-Step Wizard Implementation

### Step 1: Select Service Type
- If initiated from the provider's public profile, the service may already be selected.
- Otherwise, list available services with title, duration (e.g. `30 mins`), and price badge (e.g. `৳ 600`).

### Step 2: Date Picker (Month View)
- Fetches active dates for the month:
  ```
  GET /api/v1/availability/dates?serviceTypeId=<serviceTypeId>&month=2026-10
  ```
- Returns an array of date strings: `["2026-10-10", "2026-10-11", ...]`.
- Render a monthly calendar:
  - Dates not in the returned array are disabled/greyed out.
  - Selecting a date advances the user to Step 3.

### Step 3: Live Discrete Slot Grid
- Fetches computed discrete slots for the chosen date:
  ```
  GET /api/v1/availability/slots?serviceTypeId=<serviceTypeId>&date=2026-10-12
  ```
- Response format:
  ```json
  {
    "data": [
      { "startTime": "09:00", "endTime": "09:30", "start": "2026-10-12T03:00:00.000Z", "end": "2026-10-12T03:30:00.000Z" },
      { "startTime": "09:30", "endTime": "10:00", "start": "2026-10-12T03:30:00.000Z", "end": "2026-10-12T04:00:00.000Z" },
      { "startTime": "11:00", "endTime": "11:30", "start": "2026-10-12T05:00:00.000Z", "end": "2026-10-12T05:30:00.000Z" }
    ]
  }
  ```
- **UI Slot Grid:**
  - Responsive button grid (e.g. `09:00 AM`, `09:30 AM`, `11:00 AM`).
  - If no slots available: Displays friendly message *"No slots available for this date. Please pick another date."*

### Step 4: Select Pet & Notes
- Query current user's active pets (`GET /pets`).
- Radio card picker showing pet avatar, pet name, and species.
- If user has no pets: Inline "+ Add a Pet" modal trigger.
- Textarea for special instructions (e.g. *"My cat is nervous around dogs"*).

### Step 5: Price Breakdown & Booking Creation
- Displays the clear breakdown:
  - **Service Fee:** `৳ 600`
  - **Payment Options:**
    - Option A: **"Pay Now"** (Pay 100% online now via bKash/Nagad/Cards).
    - Option B: **"Pay on Visit"** (Pay booking platform confirmation fee of `৳ 60` online now; pay remaining `৳ 540` in cash at clinic).
- Creates booking via `POST /bookings`:
  ```json
  {
    "providerId": "651a...",
    "serviceTypeId": "651b...",
    "petId": "651c...",
    "date": "2026-10-12",
    "startTime": "09:00",
    "paymentType": "PAY_NOW", // or "PAY_ON_VISIT"
    "notes": "First checkup"
  }
  ```

---

## 3. The 15-Minute Slot Hold (`PENDING_PAYMENT`)

When `POST /bookings` succeeds:
1. Status is `PENDING_PAYMENT`.
2. The slot is held exclusively for this owner for **15 minutes**.
3. Response contains:
   ```json
   {
     "_id": "670...",
     "status": "PENDING_PAYMENT",
     "holdExpiresAt": "2026-10-12T08:15:00.000Z",
     "amountDueOnline": 600
   }
   ```
4. **UI Floating Countdown Timer:**
   - Display a 15-minute countdown clock: *"Slot held for 14:45. Please complete payment to confirm your appointment."*
   - Immediately transition to the Payment Step (Guide 10).
   - If timer reaches zero, the booking expires and the user is notified with an option to select a new slot.
