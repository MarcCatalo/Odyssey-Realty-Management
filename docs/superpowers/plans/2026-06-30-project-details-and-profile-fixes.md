# Project Details and Profile Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the six approved realtor/public catalog inconsistencies while preserving tenant isolation, cache correctness, and a feature-by-feature Git history.

**Architecture:** Extend the existing project mutation pipeline with an ordered amenities array and add a dedicated authenticated profile mutation pipeline using the existing route/controller/service/repository boundaries. Keep visual-only fixes in shared components and CSS, and invalidate both public and realtor catalog caches after persisted changes.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Supabase Postgres/Auth/Storage, Zod, Vitest, Tailwind/CSS.

---

### Task 1: Features and Amenities Data Model

**Files:**
- Create: `supabase/migrations/20260630090000_project_features_amenities.sql`
- Modify: `src/features/catalog/types.ts`
- Modify: `src/features/catalog/live-queries.ts`
- Modify: `src/server/validators/realtor-project.ts`
- Modify: `src/server/repositories/realtor-catalog-repository.ts`
- Test: `src/server/validators/realtor-project.test.ts`

- [ ] **Step 1: Write failing validator tests**

Test that `featuresAmenities` trims entries, removes empty entries, preserves order, accepts an empty list, and rejects more than 30 entries or entries longer than 120 characters.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- src/server/validators/realtor-project.test.ts`

Expected: failure because `featuresAmenities` is not defined.

- [ ] **Step 3: Add the migration and domain field**

Add:

```sql
alter table public.projects
  add column features_amenities text[] not null default '{}';
```

Extend `Project`, `ProjectRow`, project selects, and `mapProject` with `featuresAmenities: string[]`.

- [ ] **Step 4: Extend project validation and persistence**

Use:

```ts
const featuresAmenities = z
  .array(z.string().trim().min(1).max(120))
  .max(30)
  .default([])
  .transform((items) => items.filter(Boolean));
```

Write `features_amenities` in both project insert and update operations.

- [ ] **Step 5: Run focused and full tests**

Run: `npm test -- src/server/validators/realtor-project.test.ts`

Expected: all focused tests pass.

- [ ] **Step 6: Commit**

Commit message: `feature: add project features and amenities model`

### Task 2: Replace Location With Amenities and Rename House Models

**Files:**
- Create: `src/components/realtor-amenities-field.tsx`
- Modify: `src/components/realtor-new-project-form.tsx`
- Modify: `src/components/realtor-project-editor.tsx`
- Modify: `src/app/developers/[developerSlug]/projects/[projectSlug]/page.tsx`
- Modify: `src/components/project-gallery-carousel.tsx`
- Modify: `src/app/globals.css`
- Modify: `docs/multi-contractor-real-estate-catalog-prd.md`

- [ ] **Step 1: Add a repeatable amenities control**

Build a controlled list that submits repeated `featuresAmenities` inputs and supports add, remove, move up, and move down. It must honor a `disabled` prop on the edit page.

- [ ] **Step 2: Replace location inputs in both realtor forms**

Serialize repeated form values with:

```ts
featuresAmenities: formData
  .getAll("featuresAmenities")
  .map(String)
  .map((value) => value.trim())
  .filter(Boolean)
```

Remove `googleMapsUrl` and `mapAddress` from submitted payloads and show amenities in their place.

- [ ] **Step 3: Replace the public Location section**

Render a `Features and Amenities` section only when `project.featuresAmenities.length > 0`. Remove map-derived placeholder content and the Google Maps button.

- [ ] **Step 4: Rename gallery terminology**

Change visible text, descriptions, empty states, and accessible names from `House Gallery` to `House Models`. Keep the `project_gallery` media role unchanged.

- [ ] **Step 5: Verify typecheck and commit**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Commit message: `feature: replace project location with house amenities`

### Task 3: Contain Public and Realtor Overlay Images

**Files:**
- Modify: `src/components/project-gallery-carousel.tsx`
- Modify: `src/components/project-sdp-image-panel.tsx`
- Modify: `src/components/realtor-image-upload.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Apply contained media rendering**

Use `object-contain` for expanded public images and realtor manager images. Add viewport-constrained image shells with explicit `max-height`, `min-height: 0`, and `overflow: hidden`.

- [ ] **Step 2: Preserve existing overlay behavior**

Keep portal rendering, backdrop dismissal, close controls, and scroll-away closure. Ensure image content never paints beyond the bordered container.

- [ ] **Step 3: Verify typecheck and browser layout**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Commit message: `fix: contain images within media overlays`

### Task 4: Lock Publishing Controls Outside Edit Mode

**Files:**
- Modify: `src/components/realtor-publishing-controls.tsx`
- Modify: `src/components/realtor-project-editor.tsx`
- Test: `src/server/validators/realtor-project.test.ts`

- [ ] **Step 1: Add a disabled publishing-control contract**

Add `disabled?: boolean` and apply it to both native checkbox inputs while retaining the hidden current publication value.

- [ ] **Step 2: Connect the edit state**

Pass `disabled={!isEditing}` on existing project pages. Leave new-project controls enabled.

- [ ] **Step 3: Verify and commit**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Commit message: `fix: lock project publishing outside edit mode`

### Task 5: Persist Realtor Profile and Website Header

**Files:**
- Create: `src/app/api/realtor/profile/route.ts`
- Create: `src/server/controllers/realtor-profile-controller.ts`
- Create: `src/server/services/realtor-profile-service.ts`
- Create: `src/server/repositories/realtor-profile-repository.ts`
- Create: `src/server/validators/realtor-profile.ts`
- Create: `src/server/validators/realtor-profile.test.ts`
- Modify: `src/components/realtor-contact-profile-editor.tsx`
- Modify: `src/features/catalog/live-queries.ts`

- [ ] **Step 1: Write failing profile validator tests**

Test trimmed required fields, valid optional social URLs, catalog slug exclusion, and maximum lengths.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- src/server/validators/realtor-profile.test.ts`

Expected: failure because the profile schema does not exist.

- [ ] **Step 3: Implement the authenticated backend**

The route calls a controller. The controller validates input and obtains `getRealtorContext()`. The service coordinates tenant-scoped repository updates. The repository updates:

```ts
realtors: business_name, title, summary
realtor_catalog_settings: sidebar_brand_name, header_main,
  header_primary_subheader, header_secondary_subheader
contact_links: realtor-owned phone, email, and optional socials
```

Use an upsert for catalog settings and replace only realtor-owned contact rows. Do not accept or update `catalog_slug`.

- [ ] **Step 4: Wire the Profile form**

Submit `PATCH /api/realtor/profile`, retain edit mode on error, exit edit mode on success, invalidate/refresh catalog data, and show `RealtorFeedbackToast`.

- [ ] **Step 5: Revalidate public and realtor caches**

Call `revalidateCatalogPaths(["/realtor/contact", "/contact"], realtorId)` after a successful mutation.

- [ ] **Step 6: Run focused tests and commit**

Run: `npm test -- src/server/validators/realtor-profile.test.ts`

Expected: all focused tests pass.

Commit message: `feature: persist realtor profile and website header`

### Task 6: Match Realtor Developer Logo Treatment

**Files:**
- Modify: `src/app/realtor/developers/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Use the compact header mark**

Wrap either the uploaded logo or initials in a dedicated square mark. Render the logo with `object-contain`, internal padding, reduced opacity, and no full-header `fill` behavior.

- [ ] **Step 2: Verify responsive layout and commit**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Commit message: `fix: constrain realtor developer card logos`

### Task 7: Full Verification

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run static and automated checks**

Run:

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Expected: all commands exit 0 and all tests pass.

- [ ] **Step 2: Run the app normally**

Run: `npm run local:dev`

Verify public and realtor project pages, realtor Profile save behavior, developer-card logo sizing, amenities editing, publishing lock, and image overlays. Do not use hidden launchers or generated executable scripts.

- [ ] **Step 3: Review Git history**

Run: `git log --oneline -8`

Expected: one focused commit per approved feature area with no unrelated changes.
