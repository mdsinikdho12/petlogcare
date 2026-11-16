# Frontend Guide 08: Provider Service Types & Weekly Availability Builder

> **Branch / Goal:** Cal.com-Style Service Type Definitions & Weekly Schedule Configuration  
> **Backend Integration:** `/api/v1/service-types/*`, `/api/v1/availability/*`

---

## 1. Provider Service Types CRUD (`/dashboard/provider/services`)

Providers define bookable offerings (e.g. "Cat Vaccination 30 min", "Full Dog Grooming 90 min").

### API Endpoints
- `GET /service-types/me`: List all services owned by current provider.
- `POST /service-types`: Create new service type.
- `PATCH /service-types/:id`: Update title, duration, price, active status.
- `DELETE /service-types/:id`: Soft delete service type.

### Create / Edit Service Modal Fields
1. **Title:** string (3–100 chars, e.g. `Comprehensive Health Checkup`).
2. **Service Category:** select dropdown of active `SERVICE_CATEGORY` items (`GET /categories?type=SERVICE_CATEGORY`).
3. **Duration:** integer dropdown, 5 to 720 minutes (step: 5 mins, e.g. 15, 30, 45, 60, 90).
4. **Price (BDT):** positive integer (whole Taka, e.g. `500`).
5. **Buffer Time (min):** dropdown (0, 5, 10, 15, 30 min) — resting/cleanup time between consecutive bookings.
6. **Applicable Pet Types:** multi-select checkboxes of active `PET_TYPE` categories (e.g. `[Cat, Dog]`).
7. **Active Switch:** toggle (`isActive: true/false`).

---

## 2. Weekly Availability Template Builder (`/dashboard/provider/availability`)

The core Cal.com-style weekly schedule builder.

### Structure of Availability Template (`PUT /availability/me`)
```json
{
  "days": [
    {
      "dayOfWeek": 0, // 0 = Sunday, 1 = Monday ... 6 = Saturday
      "isEnabled": true,
      "timeRanges": [
        { "startTime": "09:00", "endTime": "13:00" },
        { "startTime": "16:00", "endTime": "20:00" } // Support split shifts
      ]
    },
    { "dayOfWeek": 5, "isEnabled": false } // Friday closed
  ]
}
```

### Dynamic Dropdown Time Options Helper
The backend computes valid time intervals based on Bangladesh wall-clock 24-hour time:
- **Start Time Dropdown:** `GET /availability/time-options?durationMinutes=30` returns options `[{ value: "09:00", label: "09:00 AM" }, ...]`.
- **End Time Dropdown:** `GET /availability/time-options/end?durationMinutes=30&startTime=09:00` returns dependent options `[{ value: "09:30", label: "09:30 AM" }, ...]`.
- **Note:** `24:00` is supported as an end time (representing midnight at the end of the day).

### UI Schedule Builder Component Design
- 7 day rows (Sunday to Saturday).
- Each row contains:
  1. **Day Label & On/Off Toggle Switch.**
  2. If enabled: List of **Time Range Chips** (e.g. `09:00 AM – 01:00 PM` [x]).
  3. **"+ Add Hours" Button** to append an extra non-contiguous shift.
  4. **"Copy to all days" quick action** to duplicate hours across weekdays.
- Save button at the bottom calls `PUT /availability/me`.

---

## 3. Date Overrides & Holiday Blocker Modal

Allows providers to block out specific dates (holidays, personal leave) or set custom hours for a single day:

### API Endpoints
- `GET /availability/me/overrides`: List all date overrides.
- `PUT /availability/me/overrides/:date`:
  - Body for full day off:
    ```json
    { "isAvailable": false }
    ```
  - Body for custom one-off hours on that date:
    ```json
    {
      "isAvailable": true,
      "timeRanges": [{ "startTime": "10:00", "endTime": "14:00" }]
    }
    ```
- `DELETE /availability/me/overrides/:date`: Remove override and revert back to normal weekly schedule.

### UI Calendar Widget
- Displays a calendar view with blocked holidays marked in red.
- Clicking any date allows the provider to toggle "Mark as Day Off" or set custom special hours.
