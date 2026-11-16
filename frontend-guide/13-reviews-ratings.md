# Frontend Guide 13: Reviews, Ratings & Photo Moderation

> **Branch / Goal:** Post-Booking Verified Reviews, Rating Breakdown, Provider Reply & Photo Gallery  
> **Backend Integration:** `/api/v1/reviews/*`, `/api/v1/reviews/:id/*`

---

## 1. Review Submission Rules & Verification

To prevent fake reviews, PetCareLog enforces strict verification:
1. **Who can review:** Only the pet owner of a finalized `COMPLETED` booking.
2. **Review Window:** Must be posted within `reviewWindowDays` (default: 30 days of completion).
3. **One Review per Booking:** Unique constraint on `bookingId`.
4. **Edit Window:** Owner can edit rating/text or delete review within `reviewEditWindowDays` (default: 7 days).

---

## 2. Leave Review Modal (`POST /reviews`)

### UI Components:
- **Interactive Star Picker:** 1 to 5 clickable amber stars with label ("Poor", "Fair", "Good", "Very Good", "Excellent").
- **Review Textarea:** Min 10, max 2,000 characters.
- **Photo Uploader (Optional):** Upload up to 5 photos (JPEG/PNG/WebP, max 5MB each) under multipart field `reviewPhotos`.
  - Grid preview with image thumbnail and remove (X) button.

```typescript
const submitReview = async (bookingId: string, rating: number, text: string, photos: File[]) => {
  const formData = new FormData();
  formData.append('bookingId', bookingId);
  formData.append('rating', rating.toString());
  formData.append('text', text);
  photos.forEach((file) => formData.append('reviewPhotos', file));

  const { data } = await apiClient.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
```

---

## 3. Public Reviews Feed & Provider Rating Breakdown

### Provider Public Profile Rating Summary
Rendered at the top of the Reviews tab (`GET /providers/:id` includes `ratingBreakdown`):

```
4.9 ★ ★ ★ ★ ★  (128 verified reviews)

5 Stars  ██████████████████  85% (109)
4 Stars  ████                 12% (15)
3 Stars  █                     2% (3)
2 Stars  ░                     1% (1)
1 Star   ░                     0% (0)
```

### Review Item Card Component:
- **Reviewer Identity (Privacy Preserving):** Displays `Rahim U.` (first name + last initial), verified badge, date of visit.
- **Service & Pet Badges:** e.g. `🐾 Fluffy (Persian Cat) • Full Grooming Package`.
- **Star Rating:** 5 filled amber stars.
- **Review Text.**
- **Customer Photos:** Thumbnail gallery. Clicking any photo opens full-screen lightbox.
- **Provider Reply Box (if present):**
  - Highlighted card underneath with provider business avatar:
    *"Response from CareVet Hospital: Thank you so much, Rahim! We loved taking care of Fluffy."*

---

## 4. Provider Reply & Report Actions

### In Provider Dashboard (`/dashboard/provider/reviews`):
1. **Reply to Review (`POST /reviews/:id/reply`):**
   - Modal with textarea (max 1,000 chars).
   - Only one reply per review (edited in place).
2. **Report Review (`POST /reviews/:id/report`):**
   - If a review violates platform policy (abusive language, extortion).
   - Dropdown reasons: `INAPPROPRIATE_LANGUAGE`, `OFF_TOPIC`, `FRAUDULENT`, `PRIVACY_VIOLATION`.
   - Sends review to the admin moderation queue.
