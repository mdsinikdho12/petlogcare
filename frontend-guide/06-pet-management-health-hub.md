# Frontend Guide 06: Pet Management & Health Records Hub

> **Branch / Goal:** Pet Profiles CRUD & 6 Health Record Sub-Modules with Charting  
> **Backend Integration:** `/api/v1/pets/*`, `/api/v1/pets/:petId/*`

---

## 1. Pet Profiles Management (`/dashboard/owner/pets`)

### Pet Creation & Edit Modal
- **Endpoints:**
  - `POST /pets`: Create pet profile (JSON with `species`, `breed` or `customBreed`, `name`, `gender`, `dob`, `microchipId`, `allergies`, `conditionNotes`).
  - `PATCH /pets/:id/photo`: Multipart form-data with `petPhoto` field.
  - `PATCH /pets/:id`: Update pet metadata.
  - `DELETE /pets/:id`: Soft delete pet.

### Zod Validation Schema
```typescript
import { z } from 'zod';

export const petFormSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50),
  species: z.string().min(1, 'Species is required'), // PET_TYPE category ID
  breed: z.string().optional(),                      // BREED category ID
  customBreed: z.string().max(50).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNKNOWN']),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth required (YYYY-MM-DD)'),
  microchipId: z.string().max(30).optional(),
  isSterilized: z.boolean().default(false),
  allergies: z.array(z.string()).default([]),
  conditionNotes: z.string().max(500).optional(),
});
```

---

## 2. Pet Health Records Hub (`/dashboard/owner/pets/[petId]`)

Provides a unified multi-tab interface for the pet's complete medical history.

```
[ Overview ] | [ Vaccinations ] | [ Deworming ] | [ Medications ] | [ Weight Chart ] | [ Grooming ] | [ Diet ] | [ Documents ]
```

### Critical Business Rule: Provider Records Immutability
Records can have `addedBy.role === 'OWNER'` or `'PROVIDER'`:
- If `addedBy.role === 'PROVIDER'`: The UI must display a **"Verified Provider Entry"** badge. Disable the "Edit" action (backend returns 403). Allow only the "Delete" action if the owner wishes to purge the record.

---

### Tab 1: Vaccination Log (`/pets/:petId/vaccinations`)
- **Fields:** Vaccine Name, Date Administered, Next Due Date (booster), Batch Number, Vet Name / Clinic.
- **Due Date Indicator:** If `nextDueDate` is within 7 days, highlight row in amber; if in the past, highlight in red.
- **Add Modal:** Standard form with date pickers.

### Tab 2: Deworming Log (`/pets/:petId/dewormings`)
- **Fields:** Deworming Product Name, Date Given, Dosage (e.g. `1 tablet / 5ml`), Next Due Date.

### Tab 3: Medication Log (`/pets/:petId/medications`)
- **Fields:** Medication Name, Dosage, Frequency (e.g. `Twice daily with meals`), Course Start Date, Course End Date, Next Due Date / Refill.

### Tab 4: Weight Tracker & Interactive Chart (`/pets/:petId/weights`)
- **Data Endpoint:** `GET /pets/:petId/weights/chart` returns chronological weight data:
  ```json
  [
    { "date": "2026-05-10", "weight": 4.2 },
    { "date": "2026-07-15", "weight": 4.5 },
    { "date": "2026-09-20", "weight": 4.8 }
  ]
  ```
- **Interactive Chart (`Recharts` LineChart):**
  - Smooth line chart plotting weight (kg) over time.
  - Hover tooltip displaying exact weight and date.
  - Below chart: Table of logged weight entries with "+ Add Weight" button.

### Tab 5: Grooming History (`/pets/:petId/groomings`)
- **Fields:** Services Performed (Bath, Nail Trim, Haircut), Groomer/Salon, Products Used, Next Grooming Due Date.
- **Before & After Photos:** Displays side-by-side photo thumbnails. Clicking opens high-resolution comparison lightbox.

### Tab 6: Food & Diet Log (`/pets/:petId/food-logs`)
- **Fields:** Diet Period (start date - end date), Food Brand & Name (e.g. `Royal Canin Kitten`), Type (Dry / Wet / Home Cooked), Portion Size (e.g. `80g per day`), Meals per Day (`3 meals`).
- Indicates currently active diet period.
