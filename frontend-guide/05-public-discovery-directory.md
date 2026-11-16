# Frontend Guide 05: Public Homepage & Provider Directory

> **Branch / Goal:** Public Landing, Category Navigation, Provider Search & Public Profile  
> **Backend Integration:** `GET /banners`, `GET /categories`, `GET /providers`, `GET /providers/:id`

---

## 1. Public Homepage (`src/app/(public)/page.tsx`)

### Key Sections:
1. **Hero Banner Slider (`GET /banners?placement=HOME_HERO`):**
   - Displays live active hero banners ordered by `sortOrder`.
   - Call to Action button linking to directory or service category.
2. **Category Navigation Grid (`GET /categories`):**
   - Renders pet types (Cats, Dogs, Birds, Exotic) and service categories (Veterinary, Grooming, Boarding, Training).
   - Clicking a category navigates to `/providers?category=<idOrSlug>`.
3. **Featured Verified Providers:**
   - Cards showing Provider logo, business name, rating badge (e.g. `⭐ 4.9 (124)`), address, and "Book Appointment" CTA.
4. **Special Offers Banner (`GET /banners?placement=HOME_OFFERS`):**
   - Promotional banner strip.
5. **Educational Blog Highlights (`GET /blogs?limit=3`):**
   - 3 recent published pet-care articles with reading time and author.

---

## 2. Provider Directory (`src/app/(public)/providers/page.tsx`)

### Search & Filtering Query State:
Sync search params to URL query string (`/providers?search=...&serviceCategory=...&petType=...&rating=...&district=...`):

```typescript
interface DirectoryFilterState {
  searchTerm?: string;
  categoryId?: string;       // Service category
  petTypeId?: string;         // Applicable pet type
  minRating?: number;        // e.g. 4.0
  district?: string;         // e.g. "Dhaka", "Chittagong"
  serviceMode?: 'IN_CLINIC' | 'HOME_VISIT';
  page: number;
  limit: number;
}
```

### API Call:
```typescript
const fetchProviders = async (filters: DirectoryFilterState) => {
  const { data } = await apiClient.get('/providers', {
    params: {
      searchTerm: filters.searchTerm,
      category: filters.categoryId,
      minRating: filters.minRating,
      district: filters.district,
      page: filters.page,
      limit: 12,
    },
  });
  return data; // { data: IProvider[], meta: IMeta }
};
```

### Provider Card Component:
- Business Logo + Cover photo background.
- Business Name + Verification Badge (if `verificationStatus === 'APPROVED'`).
- Rating Summary: `⭐ {avgRating} ({totalRatings} reviews)`.
- Service Modes: Badges for `In-Clinic` and `Home Visit`.
- Address snippet: `Dhanmondi, Dhaka`.
- Action Button: **"View Profile & Book"** → routes to `/providers/[id]`.

---

## 3. Provider Public Profile (`src/app/(public)/providers/[id]/page.tsx`)

### Layout & Tabs:
- **Hero Header:**
  - Full-width cover image with floating business logo, verified checkmark, and contact badge.
  - Overall rating score + star progress breakdown:
    - 5★ ████████ 80%
    - 4★ ██ 15%
    - 3★ █ 5%
- **Tabs Navigation:**
  1. **Services Offered (Default Tab):**
     - Lists all active services from `GET /service-types/provider/:providerId`.
     - Displays Service Title, duration in minutes (e.g. `30 mins`), price in BDT (e.g. `৳ 500`), and description.
     - Primary button: **"Book This Service"** — triggers the Cal.com booking modal.
  2. **About & Facilities:**
     - Business bio.
     - Operating Hours table (Sun–Sat with open/closed indicator).
     - Full address with embedded map coordinates.
  3. **Photo Gallery:**
     - Grid of uploaded clinic/grooming photos with lightbox popup.
  4. **Customer Reviews:**
     - List of verified reviews from `GET /reviews/provider/:providerId`.
     - Reviewer name formatted as `Rahim U.`, date, rating, comment text, before/after photos, and provider reply.
