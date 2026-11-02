import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import DemoContacts from '../components/dashboard/DemoContacts'
import {
  InquiryTrendChart,
  LeadStatusChart,
} from '../components/dashboard/AnalyticsCharts'
import MetricCard from '../components/dashboard/MetricCard'
import { RecentActivity, RecentInquiries } from '../components/dashboard/RecentActivity'
import { ErrorState } from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import { useSettings } from '../context/SettingsContext'
import { useLeads } from '../hooks/useLeads'
import { useProperties } from '../hooks/useProperties'
import {
  buildActivity,
  computeMetrics,
  leadsByStatus,
  monthlyInquiries,
} from '../utils/analytics'

export default function Dashboard() {
  const props = useProperties()
  const lead = useLeads()
  const { settings } = useSettings()

  const loading = props.loading || lead.loading
  const error = props.error || lead.error

  // Every figure below is calculated from the stored records.
  const metrics = useMemo(() => computeMetrics(props.properties, lead.leads), [props.properties, lead.leads])
  const trend = useMemo(() => monthlyInquiries(lead.leads), [lead.leads])
  const statusData = useMemo(() => leadsByStatus(lead.leads), [lead.leads])
  const activity = useMemo(() => buildActivity(props.properties, lead.leads), [props.properties, lead.leads])
  const inquiries = useMemo(
    () => lead.leads.filter((l) => l.source === 'Website Inquiry').slice(0, 5),
    [lead.leads],
  )
  const propertyTitles = useMemo(
    () => Object.fromEntries(props.properties.map((p) => [p.id, p.title])),
    [props.properties],
  )

  const firstName = settings.profile.name.split(/[\s(]/)[0] || 'there'

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          props.reload()
          lead.reload()
        }}
      />
    )
  }

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here is what is happening across your listings and leads."
        actions={
          <>
            <Link to="/properties?new=1" className="btn btn-ef-primary">
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              Add property
            </Link>
            <Link to="/leads?new=1" className="btn btn-ef-ghost">
              <i className="bi bi-person-plus me-2" aria-hidden="true" />
              Add lead
            </Link>
          </>
        }
      />

      {loading ? (
        <div className="metric-grid" role="status" aria-label="Loading dashboard">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="ef-card metric-card" key={i}>
              <div className="skeleton skeleton-circle" />
              <div className="flex-grow-1">
                <div className="skeleton skeleton-line w-50" />
                <div className="skeleton skeleton-line w-75" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="metric-grid">
            <MetricCard icon="bi-buildings" label="Total properties" value={metrics.totalProperties} to="/properties" />
            <MetricCard
              icon="bi-check2-circle"
              label="Available"
              value={metrics.availableProperties}
              tone="green"
              hint={`of ${metrics.totalProperties} listings`}
              to="/properties"
            />
            <MetricCard icon="bi-tag" label="For sale" value={metrics.forSale} tone="gold" to="/properties" />
            <MetricCard icon="bi-key" label="For rent" value={metrics.forRent} tone="blue" to="/properties" />
            <MetricCard
              icon="bi-people"
              label="Total leads"
              value={metrics.totalLeads}
              hint={
                metrics.overdueFollowUps
                  ? `${metrics.overdueFollowUps} overdue follow-up${metrics.overdueFollowUps > 1 ? 's' : ''}`
                  : 'No overdue follow-ups'
              }
              to="/leads"
            />
            <MetricCard
              icon="bi-trophy"
              label="Converted leads"
              value={metrics.convertedLeads}
              tone="green"
              hint={`${metrics.conversionRate.toFixed(0)}% conversion rate`}
              to="/analytics"
            />
          </div>

          <div className="dash-grid">
            <InquiryTrendChart data={trend} />
            <LeadStatusChart data={statusData} />
          </div>

          <div className="dash-grid dash-grid-even">
            <RecentActivity items={activity} />
            <RecentInquiries inquiries={inquiries} propertyTitles={propertyTitles} />
          </div>

          <DemoContacts />
        </>
      )}
    </>
  )
}
