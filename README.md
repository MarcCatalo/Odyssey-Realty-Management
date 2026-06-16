# Multi-Realtor Developer Catalog

Curated real estate catalog platform where each realtor manages their own public developer and project catalog.

## Stack

- Next.js with TypeScript
- Tailwind CSS
- Supabase Postgres, Auth, and Storage
- Vercel deployment target

## Current Scope

- Realtor-scoped public catalog URLs
- Public realtor homepage
- Developer index per realtor
- Developer profile pages per realtor
- Project detail pages per realtor
- Realtor default contact actions
- Developer contact actions only on developer-specific surfaces
- Realtor admin scaffold for future Supabase Auth and CMS writes
- Local platform-owner app planned for realtor subscription and limit management

The app does not store Google Drive links or sales-agent private documentation.

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when Supabase credentials are ready.

## Verification

```bash
npm test
npm run build
```
