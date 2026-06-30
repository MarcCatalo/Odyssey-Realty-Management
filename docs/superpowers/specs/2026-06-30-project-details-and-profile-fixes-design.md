# Project Details and Profile Fixes Design

## Goal

Align the realtor and public catalog experiences by fixing developer-logo presentation, renaming the project gallery, replacing project location content with optional amenities, containing expanded images, locking publishing controls outside edit mode, and persisting realtor website-header changes.

## Scope

### Realtor developer cards

- Keep the developer-card header dark green.
- Render an uploaded developer logo inside the same compact square used for initials.
- Use contained image sizing so the logo cannot cover the full card header.
- Preserve initials as the fallback when no logo exists.

### House Models terminology

- Replace buyer-facing and realtor-facing references to "House Gallery" with "House Models."
- Keep existing project-gallery media roles and database relationships unchanged because this is a terminology change, not a storage migration.
- Update accessible labels and empty-state copy alongside visible labels.

### Features and Amenities

- Remove the project location/map section from the realtor create form, realtor edit form, project API payloads, and public project detail page.
- Add an optional ordered `text[]` project column named `features_amenities`.
- Provide a repeatable realtor form control that can add, edit, reorder, and remove plain-text amenities.
- Trim entries, reject empty entries, cap individual values and list size, and preserve realtor-defined order.
- Render the public section only when at least one amenity exists.
- Existing projects without amenities remain valid and omit the public section.

### Expanded image containment

- Keep both public image inspectors and realtor media-manager cards within their containers.
- Use contained image rendering for expanded previews so portrait, landscape, and square images remain fully visible.
- Constrain overlay width and height to the viewport without allowing media to overflow.
- Preserve the existing backdrop, close behavior, and scroll-away behavior.

### Publishing edit lock

- Add a disabled state to the shared publishing controls.
- On existing project pages, draft/published controls remain visible but cannot change until Edit Project is active.
- New-project publishing controls remain enabled.
- Disabled controls must communicate their state visually and through native form semantics.

### Website-header persistence

- Convert the realtor Profile editor into an authenticated form submission.
- Persist realtor identity fields to `realtors`, website-header fields to `realtor_catalog_settings`, and contact/social fields to `contact_links`.
- Do not allow the catalog slug to be manually changed; it remains backend-managed.
- Validate and sanitize all submitted fields on the server.
- Invalidate both realtor and public catalog caches after a successful save.
- Refresh the realtor view and show the existing top-right success toast after persistence succeeds.
- Keep the public catalog reader unchanged except where required to consume newly persisted values.

## Architecture

Follow the existing route, controller, service, repository structure:

1. Client forms submit authenticated requests to `/api/realtor/...`.
2. Controllers parse and validate requests.
3. Services enforce ownership and coordinate related updates.
4. Repositories perform tenant-scoped Supabase operations.
5. Successful mutations invalidate realtor and public cache tags.

The amenities change extends the existing project create/update path. The profile change introduces a focused profile update path using the same authenticated backend conventions.

## Data Migration

- Add `projects.features_amenities text[] not null default '{}'`.
- Preserve existing location columns temporarily for backward compatibility, but stop collecting or displaying them.
- Keep RLS enabled; the new column inherits existing project table policies.

## Error Handling

- Invalid amenities return a clear `400` response.
- Profile validation failures retain edit mode and show an inline error.
- Failed saves do not show a success toast or replace current values.
- Database failures use existing safe `AppError` messages and structured server logging without sensitive values.

## Verification

- Add validator and service/repository-focused tests where practical.
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Run `npm test`.
- Run `npm run build`.
- Verify the affected realtor and public routes in the browser at desktop and mobile widths.
- Confirm each feature area is committed separately after its own verification.
