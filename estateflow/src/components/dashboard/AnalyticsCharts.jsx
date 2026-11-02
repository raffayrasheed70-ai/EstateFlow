import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PROPERTY_STATUS_COLORS, PROPERTY_STATUSES } from '../../utils/constants'
import EmptyState from '../common/EmptyState'

// Reusable Recharts widgets. Every chart receives data that was calculated from
// the stored properties/leads (see utils/analytics.js), never hard-coded numbers.
// Colours use CSS variables so charts follow the light/dark theme.

const AXIS_TICK = { fill: 'var(--ef-muted)', fontSize: 12 }
const TOOLTIP_STYLE = {
  background: 'var(--ef-surface)',
  border: '1px solid var(--ef-border)',
  borderRadius: 10,
  color: 'var(--ef-text)',
  boxShadow: 'var(--ef-shadow)',
}

function ChartCard({ title, subtitle, children, height = 280 }) {
  return (
    <section className="ef-card chart-card" aria-label={title}>
      <div className="card-head">
        <div>
          <h2 className="card-title">{title}</h2>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div style={{ width: '100%', height }}>{children}</div>
    </section>
  )
}

function noData(data) {
  return data.every((d) => !d.value && !d.inquiries)
}

export function InquiryTrendChart({ data }) {
  return (
    <ChartCard title="Monthly inquiries" subtitle="New leads created in the last 6 months">
      {noData(data) ? (
        <EmptyState icon="bi-bar-chart" title="No inquiries yet" message="Leads you add will appear here." />
      ) : (
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--ef-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--ef-soft)' }} />
            <Bar dataKey="inquiries" name="Inquiries" fill="#BD995C" radius={[6, 6, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

function DonutChart({ title, subtitle, data, emptyTitle }) {
  const visible = data.filter((d) => d.value > 0)
  return (
    <ChartCard title={title} subtitle={subtitle}>
      {visible.length === 0 ? (
        <EmptyState icon="bi-pie-chart" title={emptyTitle} />
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={visible}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="82%"
              paddingAngle={2}
              stroke="var(--ef-surface)"
            >
              {visible.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: 'var(--ef-muted)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

export function LeadStatusChart({ data }) {
  return (
    <DonutChart
      title="Lead status"
      subtitle="Leads grouped by current status"
      data={data}
      emptyTitle="No leads yet"
    />
  )
}

export function PropertyTypeChart({ data }) {
  return (
    <DonutChart
      title="Property types"
      subtitle="Share of listings by type"
      data={data}
      emptyTitle="No properties yet"
    />
  )
}

export function LeadsByStatusBarChart({ data }) {
  return (
    <ChartCard title="Leads by status" subtitle="Number of leads in each pipeline stage">
      {noData(data) ? (
        <EmptyState icon="bi-bar-chart" title="No leads yet" />
      ) : (
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 24, bottom: 0 }}>
            <CartesianGrid stroke="var(--ef-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--ef-soft)' }} />
            <Bar dataKey="value" name="Leads" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

export function InventoryChart({ data }) {
  const empty = data.every((row) => PROPERTY_STATUSES.every((s) => !row[s]))
  return (
    <ChartCard title="Property inventory" subtitle="Listings by sale/rent and availability">
      {empty ? (
        <EmptyState icon="bi-buildings" title="No properties yet" />
      ) : (
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="var(--ef-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--ef-soft)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--ef-muted)' }} />
            {PROPERTY_STATUSES.map((status) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="inventory"
                fill={PROPERTY_STATUS_COLORS[status]}
                maxBarSize={56}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
