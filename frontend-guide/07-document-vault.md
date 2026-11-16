# Frontend Guide 07: Pet Document Vault & Expiry Badges

> **Branch / Goal:** Secure Pet Medical Documents Vault with Signed URL Previews & Expiry Flags  
> **Backend Integration:** `/api/v1/pets/:petId/documents/*`

---

## 1. Vault Overview & Access Rules

The Document Vault allows pet owners to store confidential medical files (vaccination certificates, prescriptions, blood tests, ultrasound imaging, adoption papers).

### Strict Security Model
1. Stored as **Cloudinary `authenticated` private assets** — raw file URLs are never public.
2. The frontend requests a **temporary 5-minute signed download link** via:
   ```
   GET /api/v1/pets/:petId/documents/:id/url
   ```
3. **Provider Access Control:**
   - Providers can only access a document if they have an active booking (`CONFIRMED` or `IN_PROGRESS`) for that pet AND `visibleToProviders === true`.
   - Otherwise, the backend returns 403 Forbidden.

---

## 2. Document Upload Form & Validation

### Upload Modal
- **Upload Endpoint:** `POST /api/v1/pets/:petId/documents` (Multipart FormData).
- **Form Fields:**
  - `petDocument` (File: PDF, PNG, JPEG, WebP; max 10MB).
  - `title`: string (e.g. `Rabies Vaccination Certificate 2026`).
  - `docType`: `VACCINATION_CERTIFICATE` | `PRESCRIPTION` | `LAB_REPORT` | `INSURANCE` | `IMAGING` | `ADOPTION_PAPER` | `OTHER`.
  - `issuedOn`: date string (YYYY-MM-DD).
  - `expiryDate`: optional date string (must be after `issuedOn`).
  - `visibleToProviders`: boolean switch (default: `true`).
  - `notes`: optional description.

### Component Implementation (`src/components/modules/vault/UploadDocumentModal.tsx`)
```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function UploadDocumentModal({ petId, onSuccess }: { petId: string; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (values: any) => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('petDocument', file);
    formData.append('title', values.title);
    formData.append('docType', values.docType);
    formData.append('issuedOn', values.issuedOn);
    if (values.expiryDate) formData.append('expiryDate', values.expiryDate);
    formData.append('visibleToProviders', values.visibleToProviders ? 'true' : 'false');
    if (values.notes) formData.append('notes', values.notes);

    try {
      setLoading(true);
      await apiClient.post(`/pets/${petId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document saved to vault!');
      reset();
      setFile(null);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* File Dropzone */}
      <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center hover:border-brand-500 cursor-pointer">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          {file ? (
            <p className="text-sm font-semibold text-brand-600">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
          ) : (
            <p className="text-sm text-surface-600">Click to upload PDF or image (Max 10MB)</p>
          )}
        </label>
      </div>

      <input
        {...register('title', { required: true })}
        placeholder="Document Title (e.g. CBC Blood Test Report)"
        className="w-full px-4 py-2 border rounded-xl"
      />

      <select {...register('docType')} className="w-full px-4 py-2 border rounded-xl">
        <option value="VACCINATION_CERTIFICATE">Vaccination Certificate</option>
        <option value="PRESCRIPTION">Prescription</option>
        <option value="LAB_REPORT">Lab Report</option>
        <option value="INSURANCE">Insurance Paper</option>
        <option value="IMAGING">X-Ray / Ultrasound Imaging</option>
        <option value="ADOPTION_PAPER">Adoption Paper</option>
        <option value="OTHER">Other</option>
      </select>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-surface-500">Issued On</label>
          <input type="date" {...register('issuedOn', { required: true })} className="w-full px-3 py-2 border rounded-xl" />
        </div>
        <div>
          <label className="text-xs text-surface-500">Expiry Date (optional)</label>
          <input type="date" {...register('expiryDate')} className="w-full px-3 py-2 border rounded-xl" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-surface-700">
        <input type="checkbox" {...register('visibleToProviders')} defaultChecked />
        Allow booked service providers to view this document
      </label>

      <Button type="submit" isLoading={loading} className="w-full">
        Upload Document
      </Button>
    </form>
  );
}
```

---

## 3. Expiry Badging & Secure Viewer Component

### Expiry Badge Display Logic
Each document returned by `GET /pets/:petId/documents` carries calculated fields:
- `isExpired: boolean`
- `expiryStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED'`
- `daysUntilExpiry: number | null`

```typescript
export function ExpiryPill({ status, days }: { status?: string; days?: number | null }) {
  if (!status) return null;
  if (status === 'EXPIRED') {
    return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-semibold">Expired</span>;
  }
  if (status === 'EXPIRING_SOON') {
    return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold">Expires in {days}d</span>;
  }
  return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-semibold">Valid</span>;
}
```

### Secure Viewer Modal
Clicking **"View Document"**:
1. Triggers `GET /pets/:petId/documents/:id/url` to receive `{ url: 'https://res.cloudinary.com/...?signature=...' }`.
2. If PDF: renders inside `<iframe src={signedUrl} className="w-full h-[600px] rounded-xl" />`.
3. If Image: renders `<img src={signedUrl} alt="Document" className="max-h-[600px] mx-auto object-contain" />`.
4. Adds a convenient "Download" button opening the signed URL in a new tab.
