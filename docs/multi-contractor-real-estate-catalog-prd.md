# Product Requirements Document: Multi-Realtor Developer Catalog Platform

## 1. Product Summary

The product is a multi-realtor real estate catalog platform. Each realtor has their own account, their own managed catalog, and their own public URL where potential clients can view the realtor's published developers and projects without creating an account.

Each realtor can create developer profiles, add projects under those developers, upload public visual assets, manage their own contact details, preview unpublished content, and publish approved content to their public catalog URL.

The platform owner has a separate locally run owner app for managing realtor clients, subscription status, and publishing limits. Subscription information must live in a separate table from realtor profile information so realtor identity data remains clean and subscription rules can evolve independently.

The platform is not a broad public marketplace. Public visitors land on a specific realtor's catalog link and browse that realtor's curated developer and project inventory.

## 2. Core User Flow

### 2.1 Platform Owner Flow

1. Platform owner opens a locally run owner app.
2. Platform owner creates or manages realtor client records.
3. Platform owner assigns subscription details to each realtor.
4. Subscription details define limits such as:
   - How many developers the realtor can publish.
   - How many projects each developer profile can publish.
   - Other future subscription parameters.
5. Platform owner can activate, suspend, or archive realtor access.
6. Platform owner can review usage across realtors.

### 2.2 Realtor Flow

1. Realtor logs into the hosted realtor admin dashboard.
2. Realtor manages their own profile and public contact information.
3. Realtor creates developer profiles.
4. Realtor creates projects under specific developers.
5. Realtor uploads images and public project assets.
6. Realtor previews drafts before publishing.
7. Realtor publishes developers and projects within their subscription limits.
8. Published content appears on that realtor's public catalog URL.

### 2.3 Public Visitor Flow

1. Potential client receives or opens a specific realtor public URL.
2. Visitor sees that realtor's catalog homepage.
3. Visitor browses the realtor's published developers.
4. Visitor opens a developer profile.
5. Visitor opens project detail pages under that developer.
6. Visitor views public project details, galleries, SDP content, location buttons, and realtor contact actions.
7. Visitor contacts the realtor using the public contact actions.

## 3. Goals

- Let multiple realtors manage separate catalogs under one platform.
- Give each realtor a clean public catalog URL they can share with clients.
- Ensure public visitors only see published content belonging to the specific realtor URL they are viewing.
- Let realtors manage developers and projects without editing code.
- Let the platform owner manage realtor clients and subscription limits from a separate local owner app.
- Keep realtor profile data separate from subscription and entitlement data.
- Support secure draft, preview, and publish workflows.
- Keep the MVP simple enough to run with Next.js, Supabase, and Vercel.

## 4. Non-Goals

- Buyer or public visitor accounts.
- Developer self-service accounts.
- Marketplace bidding, checkout, reservation, or payment flows.
- Public browsing across all realtors from one global marketplace page.
- Public map and location-link sections.
- Storing private sales-agent documents or Google Drive links in the app database.
- Complex billing automation for MVP.
- Fully public platform-owner dashboard. The owner management app is local-only for MVP.

## 5. Target Users

### 5.1 Platform Owner

The system owner who manages realtor clients, subscription limits, account status, and platform-level controls through a separate locally run owner app.

### 5.2 Realtors

Authenticated users who manage their own developer and project catalog. Realtors can publish content only within the subscription limits assigned by the platform owner.

### 5.3 Public Visitors

Potential buyers or interested clients who open a realtor's public catalog link. Public visitors do not need accounts and can only read published content.

## 6. Product Approach

The product should be built as a multi-tenant catalog platform.

Each realtor is a tenant. All developer, project, image, contact, draft, and publish data must be scoped to a realtor. Database queries, routes, RLS policies, and admin screens must always respect realtor ownership.

The public website should not behave like a global marketplace. The main public browsing surface is a realtor-specific catalog.

Recommended public URL pattern:

`/r/[realtor-slug]`

Examples:

- `/r/diana-reyes`
- `/r/diana-reyes/developers`
- `/r/diana-reyes/developers/[developer-slug]`
- `/r/diana-reyes/developers/[developer-slug]/projects/[project-slug]`

Realtor domains are not customizable for MVP. Public catalog paths are generated from the realtor slug stored in the database, which is derived from the realtor's concatenated name or display name.

### 6.1 Slug and Route Resolution Rules

Slugs are URL-safe identifiers generated from names or titles. They are used for readable public routes, while database `id` values remain the internal source of truth.

Required uniqueness rules:

- `realtors.slug` must be globally unique.
- `developers(realtor_id, slug)` must be unique per realtor.
- `projects(developer_id, slug)` must be unique per developer.

Route lookup rules:

- A realtor route must first resolve the realtor by `realtors.slug`.
- Developer routes must resolve by both the current `realtor_id` and the `developer.slug`.
- Project routes must resolve by the current `realtor_id`, the resolved `developer_id`, and the `project.slug`.
- The app must never query a developer by slug alone.
- The app must never query a project by slug alone.
- If two realtors have developers with the same slug, each realtor URL must still only show that realtor's developer.
- If slug generation creates a duplicate inside the same uniqueness scope, the backend should append a suffix such as `-2`, `-3`, or another deterministic collision-safe suffix.

Example:

- `/r/diana-reyes/developers/primebuild-homes`
- `/r/marco-santos/developers/primebuild-homes`

Both URLs can exist because `primebuild-homes` is scoped by the realtor slug.

## 7. Public Website Requirements

### 7.1 Realtor Public Catalog Homepage

The realtor catalog homepage should explain the catalog and present the realtor's published content.

Required content:

- Realtor or brokerage display name.
- Short catalog description.
- Realtor public contact actions.
- Published developer count.
- Trust or disclaimer message.
- Persistent developer navigation for that realtor's published developers.

Public visitors should always understand which realtor's catalog they are viewing.

### 7.2 Developer Directory Navigation

Each realtor catalog should include a persistent developer navigation component.

Desktop behavior:

- Developer list appears as a left sidebar.
- The currently selected page, developer, or project should be visually highlighted.
- The sidebar should only show published developers belonging to the current realtor.

Mobile behavior:

- Developer list becomes a drawer, menu, or compact navigation pattern.
- Navigation remains clear and direct.

### 7.3 Developer Profile Page

URL pattern:

`/r/[realtor-slug]/developers/[developer-slug]`

The developer page should show:

- Developer name.
- Optional logo or initials mark.
- Developer description or background.
- Optional credibility details.
- Optional developer contact links, if the realtor entered public developer-specific links.
- Projects owned by that developer and published by that realtor.

Developer contact details are optional and should only appear on developer-specific surfaces. The primary public contact path should remain the realtor unless a developer-specific link is intentionally configured.

### 7.4 Project Detail Page

URL pattern:

`/r/[realtor-slug]/developers/[developer-slug]/projects/[project-slug]`

Each project belongs to exactly one developer and one realtor. One developer can have many projects, subject to the realtor's subscription limits.

Project page content:

- Project title.
- Developer name and link back to developer page.
- Project description.
- Optional project type.
- Optional status or availability.
- Optional price range.
- House models.
- Site Development Plan section.
- Optional features and amenities list.
- Realtor contact actions.

Project page header should focus on project identity. Contact actions should appear in the dedicated contact section, not as a crowded header action stack.

### 7.5 House Models

Project pages should support multiple public images.

House model behavior:

- One image can be marked as the project cover image.
- Multiple images can appear in an animated card carousel.
- Images may include house photos, renders, exterior photos, and interior photos.
- Users should be able to click or tap images to view them larger.
- House model containers should feel dynamic but remain clean and easy to use.

### 7.6 Site Development Plan Section

Each project may have a separate SDP section.

SDP content:

- SDP image or file preview if available.
- Short optional description.
- Optional plan details shown beside the SDP image.

### 7.7 Features and Amenities

Each project may include an ordered list of public features and amenities.

- Amenities are optional.
- Realtors can add, rename, reorder, or remove entries.
- Empty amenities are not published.
- The public section stays hidden when a project has no amenities.

### 7.8 Contact Actions

The default public contact source for a realtor catalog is the realtor's contact information.

Supported realtor contact types:

- Phone.
- Email.
- Facebook page.
- Messenger.
- WhatsApp.
- Viber.
- Website.
- Other social media pages.
- Other custom communication links.

Developer contact links may also exist, but they are secondary and shown only on developer-specific surfaces.

## 8. Realtor Admin Requirements

### 8.1 Realtor Authentication

Realtor admin access should be protected by login.

MVP behavior:

- Realtors authenticate through Supabase Auth.
- Each authenticated realtor can only manage their own catalog.
- Realtor account access can be activated, suspended, or archived by the platform owner.

### 8.2 Realtor Dashboard

The realtor dashboard should show:

- Published developer count versus subscription limit.
- Draft developer count.
- Published project usage per developer versus subscription limit.
- Recently updated developers and projects.
- Quick links to create developer, create project, preview catalog, and public catalog URL.

### 8.3 Realtor Profile Management

Realtors should be able to manage:

- Public display name.
- Slug.
- Brokerage or business name.
- Short public description.
- Logo or profile image.
- Public contact links.
- Public catalog status, if enabled by platform owner.

### 8.4 Developer Management

Realtors should be able to:

- Create developer profiles.
- Edit developer details.
- Upload developer logo or banner.
- Add optional developer contact links.
- Set developer slug.
- Mark developer as draft, published, archived, or deleted.
- Preview developer before publishing.

Publishing rules:

- A realtor cannot publish more developers than their active subscription allows.
- If the published developer limit is reached, the realtor can save drafts but cannot publish another developer until they unpublish one or their subscription is upgraded.

### 8.5 Project Management

Realtors should be able to:

- Create a project under one of their developers.
- Edit project details.
- Upload a project cover image.
- Upload and sort house model images.
- Add or update SDP image.
- Add an optional ordered features and amenities list.
- Add optional status and price range.
- Mark project as draft, published, archived, or deleted.
- Preview project before publishing.

Publishing rules:

- A realtor cannot publish more projects under a developer than their active subscription allows.
- If a developer has reached its published project limit, the realtor can save additional projects as drafts but cannot publish them until they unpublish another project or their subscription is upgraded.

### 8.6 Image Upload Requirements

Realtor uploads should be validated, compressed, and stored in a structured private storage path.

Upload rules:

- Images must be uploaded through backend endpoints or server actions, not directly from frontend components to Supabase Storage.
- The backend must validate file type, file size, and ownership before accepting an upload.
- Allowed image types for MVP: JPEG, PNG, WebP.
- Images should be compressed and resized before storage whenever possible.
- The app should generate web-friendly variants for public display, such as thumbnail, card, and full-size display versions.
- Original uploads should either be discarded after processing or stored privately only if there is a clear admin need.
- Upload limits should respect subscription parameters such as the maximum image count per project.

Recommended image size targets:

- Thumbnail: approximately 400px wide.
- Card/display image: approximately 1000-1400px wide.
- Full house model image: capped around 1800-2200px wide.
- Use WebP where possible for public display.

Storage path rules:

- Every uploaded asset must be scoped to a realtor folder.
- Developer assets should be stored under that realtor and developer.
- Project assets should be stored under that realtor, developer, and project.

Recommended private bucket path structure:

```txt
realtors/{realtor_id}/profile/{asset_id}.webp
realtors/{realtor_id}/developers/{developer_id}/logo/{asset_id}.webp
realtors/{realtor_id}/developers/{developer_id}/banner/{asset_id}.webp
realtors/{realtor_id}/developers/{developer_id}/projects/{project_id}/cover/{asset_id}.webp
realtors/{realtor_id}/developers/{developer_id}/projects/{project_id}/gallery/{asset_id}.webp
realtors/{realtor_id}/developers/{developer_id}/projects/{project_id}/sdp/{asset_id}.webp
```

Bucket privacy:

- Supabase Storage buckets should be private by default if possible.
- Public pages should load images through signed URLs, server-generated short-lived URLs, or a backend image proxy.
- Public buckets may be considered only if private bucket delivery creates unacceptable complexity for MVP, but private buckets remain the target design.
- Realtors must never be able to upload into another realtor's folder.

### 8.7 Draft and Publish Workflow

Rules:

- Draft developers and projects are visible only to the realtor who owns them.
- Public visitors only see published developers and published projects for the current realtor URL.
- Published developers should not show unpublished projects.
- Realtors can preview draft or unpublished content before publishing.
- Preview URLs must require authentication and ownership checks.

## 9. Platform Owner Local App Requirements

### 9.1 Purpose

The platform owner needs a separate locally run app to manage realtor clients and subscription settings.

This app is intended for platform-owner use only. It does not need to be publicly deployed for MVP.

### 9.2 Owner Authentication

For MVP, access can be controlled by local environment configuration and Supabase service-role access from the local machine only.

Rules:

- Service-role keys must never be exposed in browser code.
- If the local owner app has a browser UI, service-role operations must run only in a local server process.
- The app should be treated as an internal operations tool.

### 9.3 Realtor Client Management

The owner app should allow the platform owner to:

- Create realtor client records.
- Edit realtor client information.
- Set realtor account status.
- Assign or update subscription details.
- View usage against subscription limits.
- Suspend or archive a realtor account.
- Reset or help manage realtor access if needed.

### 9.4 Subscription Management

Subscription data must live in a separate table from realtor profile data.

The owner app should manage subscription parameters such as:

- Subscription plan name.
- Subscription status.
- Subscription start date.
- Subscription renewal or expiration date.
- Maximum published developers.
- Maximum published projects per developer.
- Optional maximum project images per project.
- Optional storage limit.
- Optional feature flags.
- Internal notes.

The first required limits are:

- Number of developers a realtor can publish.
- Number of projects each developer profile can publish.

## 10. Recommended Technical Stack

Recommended MVP stack:

- Public and realtor admin app: Next.js with TypeScript.
- Owner local app: separate local-only Next.js app, Node app, or CLI-backed admin tool.
- Styling: Tailwind CSS.
- Database: Supabase Postgres.
- Authentication: Supabase Auth for realtor accounts.
- Storage: Supabase Storage for uploaded public images.
- Hosting: Vercel for the public and realtor admin app.

Rationale:

- Next.js supports realtor-specific public routes and protected admin pages in one deployed app.
- Supabase provides Auth, Postgres, Storage, and Row Level Security in one platform.
- Separating the owner app keeps high-privilege subscription and account operations out of the public deployed surface.
- A dedicated subscription table keeps entitlement logic flexible without polluting realtor profile data.

### 10.1 Backend Service Layer Requirements

All database and storage operations must be handled by backend code.

Rules:

- Frontend components must not call Supabase database or storage services directly.
- Public data loading should happen through server components, server actions, route handlers, or backend service functions.
- Realtor admin write operations should go through server actions or route handlers with authentication and ownership checks.
- Storage uploads should go through backend endpoints that validate, compress, and store images.
- The Supabase service role key must never be exposed to frontend code.
- The browser may only receive safe public data, signed asset URLs, and results already filtered by backend ownership rules.

### 10.2 Rate Limiting

Endpoints should be rate limited to reduce abuse and accidental excessive usage.

Required rate-limited surfaces:

- Realtor login and auth callback flows, where applicable.
- Public catalog read endpoints or route handlers if they are exposed as API endpoints.
- Image upload endpoints.
- Publish, unpublish, and preview endpoints.
- Contact or inquiry endpoints if added later.

Rate limit keys may include:

- IP address for public visitors.
- Authenticated `realtor_id` for realtor admin actions.
- Route or action type.

Rate limit failures should return clear, non-sensitive errors.

## 11. Data Model

### 11.1 Realtors

Realtor profile and identity data only.

Fields:

- `id`
- `auth_user_id`
- `display_name`
- `business_name`
- `slug`
- `description`
- `logo_url`
- `profile_image_url`
- `public_status` with values such as `draft`, `published`, `hidden`
- `account_status` with values such as `active`, `suspended`, `archived`
- `created_at`
- `updated_at`

Uniqueness:

- `slug` must be globally unique.

Slug generation:

- Realtor slugs should be generated by the system from the realtor display name or concatenated first and last name.
- Realtors should not customize the slug manually in MVP.
- If a generated realtor slug already exists, the backend should append a collision-safe suffix.

### 11.2 Realtor Subscriptions

Subscription and entitlement data only.

Fields:

- `id`
- `realtor_id`
- `plan_name`
- `subscription_status` with values such as `trial`, `active`, `past_due`, `suspended`, `cancelled`
- `starts_at`
- `renews_at`
- `expires_at`
- `max_published_developers`
- `max_published_projects_per_developer`
- `max_gallery_images_per_project`
- `storage_limit_mb`
- `feature_flags`
- `internal_notes`
- `created_at`
- `updated_at`

### 11.3 Realtor Contact Links

Fields:

- `id`
- `realtor_id`
- `type`
- `label`
- `value`
- `url`
- `sort_order`
- `is_enabled`
- `created_at`
- `updated_at`

### 11.4 Developers

Fields:

- `id`
- `realtor_id`
- `name`
- `slug`
- `description`
- `specialty`
- `coverage`
- `logo_url`
- `banner_image_url`
- `publication_status` with values such as `draft`, `published`, `archived`
- `sort_order`
- `created_at`
- `updated_at`

Uniqueness:

- `slug` should be unique per realtor, not globally.

### 11.5 Developer Contact Links

Fields:

- `id`
- `realtor_id`
- `developer_id`
- `type`
- `label`
- `value`
- `url`
- `sort_order`
- `is_enabled`
- `created_at`
- `updated_at`

### 11.6 Projects

Fields:

- `id`
- `realtor_id`
- `developer_id`
- `title`
- `slug`
- `description`
- `project_type`
- `status_label`
- `price_range`
- `cover_image_url`
- `sdp_image_url`
- `sdp_description`
- `google_maps_url`
- `publication_status` with values such as `draft`, `published`, `archived`
- `sort_order`
- `created_at`
- `updated_at`

Uniqueness:

- `slug` should be unique per developer, not globally.

### 11.7 Project Images

Fields:

- `id`
- `realtor_id`
- `project_id`
- `image_url`
- `storage_bucket`
- `storage_path`
- `mime_type`
- `width`
- `height`
- `file_size_bytes`
- `variant`
- `alt_text`
- `caption`
- `sort_order`
- `is_cover_candidate`
- `created_at`
- `updated_at`

Notes:

- `image_url` may store a derived public URL, signed URL cache reference, or backend proxy path depending on the final private-bucket strategy.
- `storage_path` should be the durable source for locating the object in Supabase Storage.

### 11.8 Asset Variants

If image variants are stored as separate rows, use an asset variant table.

Fields:

- `id`
- `realtor_id`
- `source_image_id`
- `variant` with values such as `thumbnail`, `card`, `full`, `original`
- `storage_bucket`
- `storage_path`
- `mime_type`
- `width`
- `height`
- `file_size_bytes`
- `created_at`
- `updated_at`

### 11.9 Owner Users

The owner local app may use local environment configuration for MVP. If owner user records are needed later, they can be added separately.

Possible fields:

- `id`
- `email`
- `role`
- `is_active`
- `created_at`
- `updated_at`

## 12. Subscription Limit Enforcement

Publishing should enforce subscription limits at the server/database layer, not only in the UI.

Rules:

- Count only `published` developers against `max_published_developers`.
- Count only `published` projects under a developer against `max_published_projects_per_developer`.
- Draft, archived, and deleted content should not count toward published limits.
- Realtors can create drafts beyond published limits if storage and future plan rules allow it.
- Publish actions should fail with a clear error if the relevant limit is reached.
- The realtor dashboard should show current usage before the realtor hits a limit.

Recommended enforcement:

- Server actions or API routes validate limits before publishing.
- Supabase RLS ensures realtors can only access their own rows.
- Optional database functions can enforce publish limits transactionally.
- Image upload endpoints validate storage and gallery-image limits before processing uploads.

## 13. Security Requirements

### 13.1 Public Read Rules

Public visitors can read:

- Published realtor profile data for public realtor catalogs.
- Published developers belonging to the current realtor.
- Published projects under published developers belonging to the current realtor.
- Enabled realtor contact links.
- Enabled developer contact links only on developer-specific surfaces.
- Public image URLs for published content.

Public visitors cannot:

- Create data.
- Edit data.
- Delete data.
- Access drafts.
- Access preview pages.
- Access another realtor's unpublished or private data.
- Access the owner local app.

### 13.2 Realtor Write Rules

Authenticated realtors can:

- Create and edit their own realtor profile.
- Create, update, archive, or delete their own developers.
- Create, update, archive, or delete their own projects.
- Upload images for their own catalog.
- Manage their own contact links.
- Preview their own draft content.

Authenticated realtors cannot:

- Read or write another realtor's private data.
- Edit subscription details.
- Increase their own publishing limits.
- Access owner-only operations.

### 13.3 Platform Owner Rules

The platform owner can:

- Create and manage realtor records.
- Manage realtor subscription rows.
- View usage.
- Suspend or archive realtor accounts.

Owner operations should be isolated to the local owner app for MVP.

### 13.4 Supabase Security

Required:

- Enable Row Level Security on all tenant-owned tables.
- Include `realtor_id` on tenant-owned rows.
- Use strict policies for realtor ownership.
- Use public read policies only for published content.
- Never expose the Supabase service role key in browser code.
- Validate realtor identity on server-side admin routes.
- Ensure nested resources are validated by parent ownership. For example, a project must belong to a developer that belongs to the current realtor.
- Use database constraints to prevent cross-realtor relationships, such as a project referencing a developer owned by another realtor.
- Backend route handlers must resolve slugs within their parent scope and must not use slug-only lookups for tenant-owned records.

### 13.5 Storage Security

Required:

- Supabase Storage buckets should be private by default where possible.
- RLS or storage policies must prevent realtors from reading, writing, or deleting objects outside their own folder scope.
- Upload endpoints must verify authenticated ownership before writing to storage.
- Public image access should use signed URLs, short-lived generated URLs, or backend image proxy responses.
- Signed URL durations should be short enough to reduce link sharing risk but long enough to avoid poor public page performance.
- Stored object paths must include `realtor_id` and the relevant parent ids.
- Deleting or archiving records should not accidentally expose orphaned files.

### 13.6 Link Validation

Forms should validate important URLs before saving.

Validation rules:

- Custom contact links should require valid HTTPS URLs, except phone and email links.
- Invalid or suspicious links should be rejected or clearly warned before publishing.

### 13.7 Endpoint Abuse Protection

Required:

- Apply rate limits to write-heavy or costly endpoints.
- Apply stricter rate limits to image uploads and publish actions.
- Log repeated rate limit failures for review.
- Do not return sensitive ownership or existence details in public error messages.

## 14. UX Requirements

The site should feel neat, concise, clean, and straightforward.

UX principles:

- Public visitors should always know which realtor catalog they are viewing.
- The current developer or project should be visually emphasized.
- Developer navigation should remain available without overwhelming the page.
- Project pages should guide users from overview, to visuals, to SDP/location, to realtor contact.
- Realtor admin forms should feel like guided content entry, not database editing.
- Subscription limits should be visible before publishing is blocked.
- Limit errors should explain what happened and how to resolve it.
- Optional fields should not leave awkward blank spaces when missing.
- Animations should support clarity and polish, not distract from information.

## 15. MVP Scope

MVP includes:

- Realtor authentication.
- Realtor public URL.
- Realtor public homepage.
- Persistent developer sidebar on desktop.
- Mobile developer navigation.
- Developer profile pages.
- Project detail pages.
- House models carousel.
- SDP section.
- Optional features and amenities section.
- Realtor contact actions as the default public contact action.
- Developer contact details on developer cards and developer profile pages only.
- Realtor admin dashboard.
- Realtor profile management.
- Developer CRUD.
- Project CRUD.
- Realtor contact management.
- Image upload to Supabase Storage.
- Image validation, compression, and private bucket storage structure.
- Backend-only service calls for database and storage operations.
- Endpoint rate limiting for upload, publish, preview, and API-like routes.
- Draft, publish, and archive states.
- Admin preview mode for realtor-owned drafts.
- Subscription limit checks for published developers and published projects per developer.
- Local owner app for realtor and subscription management.
- Supabase RLS security policies.
- Scoped slug resolution and database uniqueness constraints.

## 16. Future Enhancements

Possible future features:

- Automated billing and payment integration.
- Multiple staff users per realtor.
- Platform-owner web dashboard.
- Activity logs with `updated_by` history.
- Inquiry/contact forms.
- Email notifications.
- Analytics dashboard per realtor.
- SEO metadata editor.
- Search and filtering by location, type, developer, status, or price.
- Featured developers or featured projects.
- Developer comparison view.
- More advanced image gallery controls.

## 17. Success Criteria

The MVP is successful when:

- Platform owner can create realtor clients and assign subscription limits from the local owner app.
- Realtor subscription details are stored separately from realtor profile data.
- Realtors can log in and manage only their own catalog.
- Realtors can create developers and projects.
- Realtors can publish content only within their assigned limits.
- Public visitors can open a realtor URL and see only that realtor's published catalog.
- Visitors can browse developers from the persistent navigation.
- Visitors can open developer pages and view that developer's projects.
- Visitors can open project pages and view photos, SDP, location links, and realtor contact actions.
- Draft content stays private until published.
- Preview mode lets realtors review draft pages before publishing.
- Public users cannot modify database content.
- Realtors cannot access or change another realtor's data.
- Duplicate developer or project slugs under different realtors never leak or resolve to the wrong realtor's content.
- Uploaded images are validated, compressed, stored under realtor-scoped paths, and protected by private bucket or signed-access rules.
