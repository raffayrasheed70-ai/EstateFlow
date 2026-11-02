import { useSettings } from '../../context/SettingsContext'
import { CLOSED_LEAD_STATUSES, LEAD_STATUSES } from '../../utils/constants'
import { formatDate, isOverdue } from '../../utils/dates'

// Leads list. The status column is an inline dropdown, so status can be
// changed without opening the edit form.
export default function LeadsTable({ leads, propertyTitles, onView, onEdit, onDelete, onStatusChange }) {
  const { money } = useSettings()

  return (
    <div className="ef-card table-card">
      <div className="table-responsive">
        <table className="table ef-table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Lead</th>
              <th scope="col">Interested in</th>
              <th scope="col">Budget</th>
              <th scope="col">Source</th>
              <th scope="col">Status</th>
              <th scope="col">Follow-up</th>
              <th scope="col" className="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const overdue = !CLOSED_LEAD_STATUSES.includes(lead.status) && isOverdue(lead.followUpDate)
              return (
                <tr key={lead.id} className={overdue ? 'row-overdue' : ''}>
                  <td>
                    <button type="button" className="table-link btn-link-plain" onClick={() => onView(lead)}>
                      {lead.name}
                    </button>
                    <div className="text-muted small">{lead.email}</div>
                    <div className="text-muted small">{lead.phone}</div>
                  </td>
                  <td className="lead-property-cell">{propertyTitles[lead.propertyId] || '—'}</td>
                  <td className="text-nowrap">{lead.budget ? money(lead.budget) : '—'}</td>
                  <td className="text-nowrap">{lead.source}</td>
                  <td>
                    <label className="visually-hidden" htmlFor={`status-${lead.id}`}>
                      Status for {lead.name}
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      className="form-select form-select-sm status-select"
                      value={lead.status}
                      onChange={(event) => onStatusChange(lead, event.target.value)}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="text-nowrap">
                    {lead.followUpDate ? (
                      <span className={overdue ? 'overdue-flag' : ''}>
                        {overdue && <i className="bi bi-exclamation-circle me-1" aria-hidden="true" />}
                        {formatDate(lead.followUpDate)}
                        {overdue && <span className="visually-hidden"> (overdue)</span>}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onView(lead)}
                      aria-label={`View ${lead.name}`}
                      title="View"
                    >
                      <i className="bi bi-eye" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onEdit(lead)}
                      aria-label={`Edit ${lead.name}`}
                      title="Edit"
                    >
                      <i className="bi bi-pencil" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => onDelete(lead)}
                      aria-label={`Delete ${lead.name}`}
                      title="Delete"
                    >
                      <i className="bi bi-trash" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
