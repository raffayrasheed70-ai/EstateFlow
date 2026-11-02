import { useMemo } from 'react'
import { computeMetrics } from '../../utils/analytics'

// Small statistics strip for the Properties page. It is computed from the live
// property list, so it updates the moment a property is added, edited or deleted.
export default function PropertyStats({ properties }) {
  const m = useMemo(() => computeMetrics(properties, []), [properties])
  const items = [
    { label: 'Total', value: m.totalProperties, icon: 'bi-buildings' },
    { label: 'Available', value: m.availableProperties, icon: 'bi-check2-circle' },
    { label: 'For sale', value: m.forSale, icon: 'bi-tag' },
    { label: 'For rent', value: m.forRent, icon: 'bi-key' },
  ]

  return (
    <ul className="stat-strip" aria-label="Property statistics">
      {items.map((item) => (
        <li key={item.label} className="stat-chip">
          <i className={`bi ${item.icon}`} aria-hidden="true" />
          <span className="stat-chip-value">{item.value}</span>
          <span className="stat-chip-label">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
