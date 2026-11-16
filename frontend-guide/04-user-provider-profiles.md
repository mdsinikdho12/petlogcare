# Frontend Guide 04: User & Provider Profiles & Onboarding

> **Branch / Goal:** Owner Profile, Provider Onboarding, Media & Verification Center  
> **Backend Integration:** `/api/v1/users/me`, `/api/v1/providers/me/*`

---

## 1. Pet Owner Profile (`/dashboard/owner/profile`)

### API Endpoints
- `GET /users/me`: Fetch current profile.
- `PATCH /users/me`: Update name, phone, language.
- `PATCH /users/me/profile-image`: Multipart upload (`profileImage`).
- `DELETE /users/me/profile-image`: Remove profile image.

### Form Fields & Schema
- Full Name (required)
- Phone Number (BD format)
- Language preference (`en` | `bn`)
- Avatar uploader with circular preview, dropzone, and remove button.

---

## 2. Provider Onboarding Wizard (`/dashboard/provider/onboarding`)

When a new user with role `PROVIDER` registers, their verification status is `NOT_SUBMITTED`. They are directed to the 4-step Onboarding Wizard:

```
[ Step 1: Business Details ] ──► [ Step 2: Media & Hours ] ──► [ Step 3: Documents ] ──► [ Step 4: Review & Submit ]
```

### Step 1: Business Details (`POST /providers/me`)
```json
{
  "businessName": "CareVet Animal Hospital",
  "phone": "+8801712345678",
  "bio": "Experienced veterinary clinic specializing in small pets.",
  "categories": ["REPLACE_WITH_SERVICE_CATEGORY_ID"],
  "serviceModes": ["IN_CLINIC", "HOME_VISIT"],
  "address": {
    "street": "House 12, Road 4, Dhanmondi",
    "city": "Dhaka",
    "area": "Dhanmondi",
    "district": "Dhaka",
    "coordinates": [90.3752, 23.7461] // [longitude, latitude] GeoJSON
  }
}
```

### Step 2: Branding & Weekly Operating Hours
1. **Logo & Cover Uploader:**
   - `PATCH /providers/me/logo` (`logo` multipart field)
   - `PATCH /providers/me/cover` (`cover` multipart field)
2. **Weekly Operating Hours Table:**
   - `PUT /providers/me/operating-hours`:
   ```json
   {
     "operatingHours": [
       { "dayOfWeek": 0, "isOpen": true, "openTime": "09:00", "closeTime": "20:00" },
       { "dayOfWeek": 1, "isOpen": true, "openTime": "09:00", "closeTime": "20:00" },
       { "dayOfWeek": 5, "isOpen": false } // Friday closed
     ]
   }
   ```
3. **Gallery Uploader (up to 10 images):**
   - `POST /providers/me/gallery` (multipart `images` array, 1–5 files per upload).
   - `DELETE /providers/me/gallery/:imageId` to remove.

### Step 3: Verification Documents Upload (Private Vault)
Providers must upload business registration, trade license, or veterinary degrees.
- `POST /providers/me/verification-documents`:
  - Multipart form data: `verificationDocument` (PDF/JPEG/PNG, max 10MB) + `docType` (`TRADE_LICENSE`, `TIN_CERTIFICATE`, `VET_DEGREE`, `NID`, `OTHER`).
  - Stored in Cloudinary as private `authenticated` assets.
- **Preview Link:**
  - `GET /providers/me/verification-documents/:docId/url` returns a signed, 5-minute temporary URL to display inside a secure modal or PDF viewer.
- `DELETE /providers/me/verification-documents/:docId` to remove uploaded docs before submission.

### Step 4: Submission & Review Status
- Call `POST /providers/me/verification/submit`:
  - Transitions `verificationStatus` from `NOT_SUBMITTED` → `PENDING`.
  - Documents become frozen from modification.
- **Provider Dashboard Banner:**
  - `PENDING`: *"Your verification is under review by our admin team. You will be notified via email once approved."*
  - `APPROVED`: Badge turns green; provider becomes bookable in the public directory.
  - `REJECTED`: Shows rejection reason and unlocks document re-upload.

---

## 3. Provider Staff Management (`/dashboard/provider/staff`)

Providers can manage staff members (assistants, groomers, junior vets):
- `GET /providers/me/staff`: List all staff.
- `POST /providers/me/staff`:
  ```json
  {
    "name": "Kamrul Hassan",
    "roleTitle": "Senior Groomer",
    "phone": "+8801812345678",
    "isActive": true
  }
  ```
- Staff entries display in a manageable table with active toggles.
