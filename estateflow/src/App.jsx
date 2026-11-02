import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoadingState from './components/common/LoadingState'
import AppLayout from './components/layout/AppLayout'
import PublicLayout from './components/layout/PublicLayout'
import Leads from './pages/Leads'
import NotFound from './pages/NotFound'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import PublicListings from './pages/PublicListings'
import PublicPropertyDetails from './pages/PublicPropertyDetails'
import Settings from './pages/Settings'

// The two pages that use Recharts are loaded on demand, which keeps the
// first download smaller (Recharts is the biggest dependency).
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))

// Two layouts share one app:
//  - AppLayout:    private-style admin area (sidebar + topbar)
//  - PublicLayout: visitor-facing listings
// NOTE: there is no login. The admin area is open in this demo; a real product
// would add authentication through a backend (Supabase, Firebase, …).
export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Loading…" />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="leads" element={<Leads />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="listings" element={<PublicListings />} />
          <Route path="listings/:id" element={<PublicPropertyDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
