import { useMemo } from 'react'
import {
  InquiryTrendChart,
  InventoryChart,
  LeadsByStatusBarChart,
  PropertyTypeChart,
} from '../components/dashboard/AnalyticsCharts'
import MetricCard from '../components/dashboard/MetricCard'
import { ErrorState } from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import { useSettings } from '../context/SettingsContext'
import { useLeads } from '../hooks/useLeads'
import { useProperties } from '../hooks/useProperties'
import {
  computeMetrics,
  inventoryBreakdown,
  leadsByStatus,
  monthlyInquiries,
  propertyTypeDistribution,
} from '../utils/analytics'

export default function Analytics() {
  const props = useProperties()
  const lead = useLeads()
  const { money } = useSettings()

  const metrics = useMemo(() => computeMetrics(props.properties, lead.leads), [props.properties, lead.leads])
  const inventory = useMemo(() => inventoryBreakdown(props.properties), [props.properties])
  const types = useMemo(() => propertyTypeDistribution(props.properties), [props.properties])
  const statuses = useMemo(() => leadsByStatus(lead.leads), [lead.leads])
  const trend = useMemo(() => monthlyInquiries(lead.leads), [lead.leads])

  if (props.error || lead.error) {
    return (
      <ErrorState
        message={props.error || lead.error}
        onRetry={() => {
          props.reload()
          lead.reload()
        }}
      />
    )
  }
  if (props.loading || lead.loading) return <LoadingState label="Calculating analytics…" />

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="All figures are calculated from the properties and leads stored in this browser."
      />

      <div className="metric-grid">
        <MetricCard
          icon="bi-percent"
          label="Conversion rate"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          tone="green"
          hint={`${metrics.convertedLeads} of ${metrics.totalLeads} leads converted`}
        />
        <MetricCard icon="bi-hourglass-split" label="Open leads" value={metrics.openLeads} tone="blue" hint="Not yet converted or lost" />
        <MetricCard icon="bi-x-octagon" label="Lost leads" value={metrics.lostLeads} tone="red" />
        <MetricCard
          icon="bi-exclamation-circle"
          label="Overdue follow-ups"
          value={metrics.overdueFollowUps}
          tone="gold"
          hint="Open leads past their follow-up date"
        />
        <MetricCard
          icon="bi-wallet2"
          label="Average lead budget"
          value={metrics.averageBudget ? money(metrics.averageBudget) : '—'}
          hint="Leads with a budget entered"
        />
        <MetricCard icon="bi-buildings" label="Total properties" value={metrics.totalProperties} />
      </div>

      <div className="dash-grid dash-grid-even">
        <InventoryChart data={inventory} />
        <PropertyTypeChart data={types} />
      </div>
      <div className="dash-grid dash-grid-even">
        <LeadsByStatusBarChart data={statuses} />
        <InquiryTrendChart data={trend} />
      </div>
    </>
  )
}
