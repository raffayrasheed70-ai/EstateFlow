// Loading placeholders. Skeletons keep the layout stable while data loads.

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="property-grid" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div className="ef-card skeleton-card" key={i}>
          <div className="skeleton skeleton-img" />
          <div className="p-3">
            <div className="skeleton skeleton-line w-75" />
            <div className="skeleton skeleton-line w-50" />
            <div className="skeleton skeleton-line w-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonRows({ count = 5 }) {
  return (
    <div className="ef-card p-3" role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton skeleton-row" key={i} />
      ))}
    </div>
  )
}

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="state-box" role="status">
      <div className="spinner-border" aria-hidden="true" />
      <p className="mb-0 mt-3">{label}</p>
    </div>
  )
}
