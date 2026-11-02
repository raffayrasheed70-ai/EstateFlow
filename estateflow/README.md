# EstateFlow — Real Estate Management Platform

EstateFlow is a responsive real estate management dashboard built with **React + Vite**. It combines a CRM-style admin area (properties, leads, analytics, settings) with a separate public listings site where visitors can browse properties and send inquiries.

It is a **portfolio project**: all data is stored in your browser (`localStorage`), and the code is structured so a real backend (Supabase or Firebase) can be added later without rewriting the UI.

**Developer:** Muhammad Raffay (Raffay Rasheed) — Front-End Developer
**GitHub:** <https://github.com/raffayrasheed70-ai>
**Portfolio:** <https://raffayrasheed70.github.io/>

> Status: built and verified locally (`npm run build` succeeds). It has **not** been deployed anywhere yet. See [Deployment](#deployment).

## Screenshots

Add your own screenshots to a `docs/` folder after running the app, then update these paths.

| Dashboard | Properties |
| --- | --- |
| ![Dashboard placeholder](docs/dashboard.png) | ![Properties placeholder](docs/properties.png) |

| Leads | Public listing |
| --- | --- |
| ![Leads placeholder](docs/leads.png) | ![Public listing placeholder](docs/public-listing.png) |

## Main features

- **Dashboard** — total/available/for-sale/for-rent properties, total and converted leads, monthly inquiry chart, lead status chart, recent activity, recent website inquiries, quick actions. Every number is calculated from stored records.
- **Properties** — add, edit and delete (with confirmation) through a responsive form with validation and a live image preview; grid and table views; live statistics; search (title, location, description); filters (type, sale/rent, status, price range); sort (price, date); detail page.
  - Fields: title, type (House, Apartment, Villa, Commercial, Plot), listing type (For Sale / For Rent), price, address, city, bedrooms, bathrooms (hidden for plots), area size and unit (Marla, Kanal, Sq Ft), status (Available, Pending, Sold, Rented), description, image URL, owner / agent name, contact number.
  - Owner / agent name and contact number are visible in the admin area only, not on the public listings.
  - Older saved data keeps working: the former "Under Offer" status is shown as "Pending", and records without an owner ask for one the next time you edit them.
- **Leads (CRM)** — add, view, edit, delete, search (name/email/phone), filter by status and source, inline status change, follow-up dates, notes, overdue follow-ups highlighted, newest first.
- **Public listings** — modern cards, search and filters, detail page with hero image, inquiry form. A valid inquiry is saved as a lead (source "Website Inquiry") and appears in the admin Leads page.
- **Analytics** — inventory breakdown, property type distribution, leads by status, inquiry trend, conversion metrics (all derived from real records).
- **Settings** — profile, price format (compact Lakh/Crore or full), light/dark theme, restore sample data, clear demo data (with confirmation).
- **Demo API integration** — fetches fake contacts from DummyJSON with loading, error and retry states.
- **Quality** — form validation with accessible error messages, skeleton loaders, empty states, toasts, keyboard-friendly modals, mobile navigation drawer, safe handling of broken images and corrupted `localStorage`.

## Technology stack

- React 19 and Vite
- JavaScript (ES6+) with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`)
- React Router DOM (`HashRouter`)
- Bootstrap 5 and Bootstrap Icons
- Custom CSS (navy / warm white / muted gold design system, Manrope + DM Sans)
- Recharts
- `fetch` API
- `localStorage` for persistence

## Installation

Requirements: [Node.js](https://nodejs.org/) 20 or newer.

```powershell
# Windows PowerShell
cd path\to\estateflow
npm install
```

## Run locally

```powershell
npm run dev       # start the dev server (usually http://localhost:5173)
npm run build     # create the production build in dist/
npm run preview   # serve the production build locally
npm run lint      # optional: run the linter
```

## Project structure

```
src/
  components/
    layout/       AppLayout, Sidebar, Topbar, PublicLayout
    dashboard/    MetricCard, AnalyticsCharts, RecentActivity, DemoContacts, SafeAvatar
    properties/   PropertyCard, PropertyForm, PropertyFilters, PropertyTable,
                  PropertyBadges, InquiryForm
    leads/        LeadForm, LeadsTable, LeadDetails, LeadStatusBadge
    common/       Modal, ConfirmDialog, SearchInput, LoadingState, EmptyState,
                  Toast, SafeImage, FormField, PageHeader
  context/        SettingsContext (profile, theme, price format), ToastContext
  pages/          Dashboard, Properties, PropertyDetails, Leads, Analytics,
                  PublicListings, PublicPropertyDetails, Settings, NotFound
  services/       propertyService, leadService, settingsService, api (DummyJSON)
  hooks/          useProperties, useLeads
  utils/          constants, storage, dates, formatCurrency, validation,
                  formHelpers, propertyFilters, analytics
  data/           sampleProperties, sampleLeads
  App.jsx  main.jsx  styles.css
```

**How the layers connect:** pages → hooks → services → `localStorage`.
Components never read `localStorage` directly. Services are `async` and return Promises, so replacing them with real network calls later will not change the pages.

## API information

`src/services/api.js` calls the public **DummyJSON** demo API:

```
GET https://dummyjson.com/users?limit=8
```

- It handles network failures, non-2xx HTTP responses and unreadable JSON, and converts each user into an internal contact shape.
- The dashboard shows loading skeletons, an error message, and a **Try again** button.
- DummyJSON is a demo service, not a real estate backend. Its users are **fake**. They are labelled "Demo data" and are only added as leads if you click **Add as lead** (source "Demo API").
- Properties and leads do not depend on this API at all.

## Sample data

On first launch (or when storage is empty/corrupted) EstateFlow creates **6 sample properties** and **8 sample leads**. They are fictional: made-up listings, names, emails and phone numbers, with dates generated relative to today. Property photos are Unsplash stock images; if one fails to load, a placeholder is shown.

- **Settings → Restore sample data** replaces everything with the samples.
- **Settings → Clear all demo data** removes everything (it does *not* re-seed until you restore).
- Charts and metrics are calculated from whatever records exist, so they update after every change.

## Known limitations

- **`localStorage` is for demos only.** Data lives in one browser, is readable by anyone using it, is lost if site data is cleared, and is not shared between users or devices.
- **No authentication.** The admin area is open. There is no login because fake auth would give a false sense of security. Do not enter real personal data.
- **Inquiries are not delivered.** The public form saves a lead locally. Nothing is emailed or sent to any agency.
- Only one image URL per property (no gallery upload).
- No edit history; "Recent activity" shows when properties and leads were created.
- Follow-up reminders are visual only (highlighting); there are no notifications.
- The interface has been checked with the production build, linting and automated logic/render tests, but **you should click through it in your browser** (especially on a phone) before showing it to others.

## Future backend integration plan

1. Create a Supabase (or Firebase) project with `properties` and `leads` tables/collections matching the fields in `propertyService.js` and `leadService.js`.
2. Add the project URL and public anon key through environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Never put secret/service keys in front-end code.
3. Rewrite the function bodies in `propertyService.js` and `leadService.js` to call the backend. Keep the same function names and return shapes, so pages and hooks stay unchanged.
4. Add authentication (e.g. Supabase Auth) and protect the admin routes. Add row-level security so visitors can only *insert* inquiries, not read leads.
5. Send inquiry notifications with a server-side function or email service (so keys stay off the client).
6. Replace `HashRouter` with `BrowserRouter` if you host somewhere that supports SPA rewrites.

## Deployment

The app is configured for static hosting:

- `vite.config.js` uses `base: './'`, so built asset paths are relative and work under any sub-path (like `https://<user>.github.io/estateflow/`).
- The app uses `HashRouter` (URLs look like `/#/properties`), so page refreshes work without server rewrite rules.

### GitHub Pages (with the included workflow)

A workflow is included at `.github/workflows/deploy.yml`.

```powershell
git init
git add .
git commit -m "Initial commit: EstateFlow"
git branch -M main
git remote add origin https://github.com/raffayrasheed70-ai/estateflow.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` builds and publishes the site at `https://raffayrasheed70-ai.github.io/estateflow/` (this URL only exists after you complete these steps).

### Other static hosts (Netlify, Vercel, Cloudflare Pages)

Build command: `npm run build` · Output directory: `dist`. No extra configuration is needed.

## License

Personal portfolio project. Add a license file if you plan to share the code publicly.
