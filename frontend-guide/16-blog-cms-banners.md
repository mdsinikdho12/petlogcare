# Frontend Guide 16: Blog CMS & Homepage Banners

> **Branch / Goal:** Public Pet Care Articles, SEO Slug Routing, Admin Markdown Editor & Banner Manager  
> **Backend Integration:** `/api/v1/blogs/*`, `/api/v1/banners/*`

---

## 1. Public Blog Experience (`/blogs` & `/blogs/[slug]`)

### 1. Blog Index (`/blogs`)
- **Category Filter Strip:** Displays active blog categories from `GET /categories?type=BLOG_CATEGORY` (e.g. `Pet Nutrition`, `Veterinary Advice`, `Grooming Tips`, `Training`).
- **Article Card Component:**
  - Cover image (WebP optimized).
  - Category pill badge.
  - Title & reading time (`5 min read`).
  - Generated excerpt (text truncated at 160 characters).
  - Author byline (`PetCareLog Team`) and published date.

### 2. Article Detail View (`/blogs/[slug]`)
- **Slug Redirection Handling:**
  - If a user accesses an article via an old slug that was renamed, the backend returns the post with the current active `slug`.
  - The frontend checks if `post.slug !== params.slug` and triggers a redirect:
    ```typescript
    if (data.slug && data.slug !== params.slug) {
      redirect(`/blogs/${data.slug}`);
    }
    ```
- **Markdown Content Rendering:**
  - Render with React Markdown (with raw HTML disabled for safety).
  - Responsive typography (`prose prose-slate max-w-none prose-headings:font-bold prose-img:rounded-2xl`).
- **Dynamic SEO Meta Tags (`generateMetadata`):**
  - Uses `post.seo.metaTitle` (fallback: `post.title`).
  - Uses `post.seo.metaDescription` (fallback: `post.excerpt`).
  - Uses `post.seo.ogImage` (fallback: `post.coverImage.url`).

---

## 2. Admin Blog Editor (`/admin/cms/blogs/new` & `.../edit/[id]`)

### Form Fields:
1. **Title:** string (min 5, max 150 chars).
2. **Slug:** optional custom slug (auto-generated from title if omitted).
3. **Category:** select from `BLOG_CATEGORY` taxonomy.
4. **Cover Image Uploader:** Multipart upload (`cover`).
5. **Markdown Body Editor:** Side-by-side edit and live preview panels.
6. **Custom Excerpt:** Optional manual summary.
7. **SEO Settings Panel:**
   - Meta Title (char counter up to 70).
   - Meta Description (char counter up to 160).
   - Keywords (comma-separated tags).
   - Canonical URL (https format).
8. **Publish Status Switch:**
   - Toggle: `Draft` vs `Published`. Calls `PATCH /blogs/:id/publish`.

---

## 3. Admin Homepage Banner Manager (`/admin/cms/banners`)

Allows administrators to configure promotional hero slides and seasonal offers:

### Features:
1. **Placement Filter:** Tab between `HOME_HERO` and `HOME_OFFERS`.
2. **Add Banner Modal (`POST /banners`):**
   - Image upload (multipart `banner`, recommended 1920x600 for hero).
   - Title (admin label & alt text).
   - Subtitle (e.g. `Get 20% off your pet's first vaccination`).
   - Destination Link (URL or relative path like `/providers?category=grooming`).
   - CTA Button Text (e.g. `Book Appointment`).
   - Active Schedule Window: `startsAt` and `endsAt` (optional date/time pickers).
3. **Drag & Drop Reordering (`PATCH /banners/admin/reorder`):**
   - Reorder banner list using drag handles.
   - On drop, sends `{ placement: "HOME_HERO", ids: [...] }` to update `sortOrder`.
