import { useState } from 'react'
import ConfirmDialog from '../components/common/ConfirmDialog'
import FormField from '../components/common/FormField'
import { fieldProps } from '../utils/formHelpers'
import PageHeader from '../components/common/PageHeader'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { clearLeads, restoreSampleLeads } from '../services/leadService'
import { clearProperties, restoreSampleProperties } from '../services/propertyService'
import { validateProfile } from '../utils/validation'

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const toast = useToast()

  const [profile, setProfile] = useState(settings.profile)
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null) // 'clear' | 'restore' | null
  const [busy, setBusy] = useState(false)

  const changeProfile = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const found = validateProfile(profile)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`sp-${Object.keys(found)[0]}`)?.focus()
      return
    }
    updateSettings({ profile: { ...profile, name: profile.name.trim() } })
    toast.success('Profile settings saved.')
  }

  const runDataAction = async () => {
    setBusy(true)
    try {
      if (confirm === 'clear') {
        await Promise.all([clearProperties(), clearLeads()])
        toast.success('All properties and leads were removed.')
      } else {
        await Promise.all([restoreSampleProperties(), restoreSampleLeads()])
        toast.success('Sample data restored.')
      }
      setConfirm(null)
    } catch (err) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const f = (name) => ({ ...fieldProps(`sp-${name}`, errors[name]), name, value: profile[name], onChange: changeProfile })

  return (
    <>
      <PageHeader title="Settings" subtitle="Profile, display preferences and demo data." />

      <div className="settings-grid">
        <form className="ef-card p-4" onSubmit={saveProfile} noValidate>
          <h2 className="card-title">Developer / business profile</h2>
          <p className="card-subtitle mb-3">Shown in the app header and on the public listings site.</p>
          <div className="row g-3">
            <FormField id="sp-name" label="Name" error={errors.name} required className="col-md-6">
              <input type="text" {...f('name')} />
            </FormField>
            <FormField id="sp-role" label="Role" error={errors.role} required className="col-md-6">
              <input type="text" {...f('role')} />
            </FormField>
            <FormField id="sp-businessName" label="Business name" error={errors.businessName} required className="col-12">
              <input type="text" {...f('businessName')} />
            </FormField>
            <FormField id="sp-email" label="Contact email" error={errors.email} className="col-12">
              <input type="email" {...f('email')} placeholder="Optional" />
            </FormField>
            <FormField id="sp-github" label="GitHub URL" error={errors.github} className="col-md-6">
              <input type="url" {...f('github')} />
            </FormField>
            <FormField id="sp-portfolio" label="Portfolio URL" error={errors.portfolio} className="col-md-6">
              <input type="url" {...f('portfolio')} />
            </FormField>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-ef-primary">
              Save profile
            </button>
          </div>
        </form>

        <div className="d-flex flex-column gap-3">
          <section className="ef-card p-4" aria-label="Display preferences">
            <h2 className="card-title">Display preferences</h2>

            <div className="mb-3">
              <label htmlFor="pref-currency" className="form-label">
                Currency
              </label>
              <input id="pref-currency" className="form-control" value="PKR — Pakistani Rupee" disabled readOnly />
              <div className="form-text">EstateFlow uses PKR only.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="pref-format" className="form-label">
                Price format
              </label>
              <select
                id="pref-format"
                className="form-select"
                value={settings.currencyDisplay}
                onChange={(e) => updateSettings({ currencyDisplay: e.target.value })}
              >
                <option value="compact">Compact — Rs 1.25 Crore / Rs 85 Lakh</option>
                <option value="full">Full — Rs 12,500,000</option>
              </select>
            </div>

            <div>
              <label htmlFor="pref-theme" className="form-label">
                Theme
              </label>
              <select
                id="pref-theme"
                className="form-select"
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </section>

          <section className="ef-card p-4" aria-label="Demo data">
            <h2 className="card-title">Demo data</h2>
            <p className="text-muted small">
              Properties and leads are stored in this browser's localStorage. That is fine for a portfolio
              demo, but it is <strong>not</strong> a secure or shared database: anyone using this browser can
              read it, and clearing site data erases it.
            </p>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-ef-ghost" onClick={() => setConfirm('restore')}>
                <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true" />
                Restore sample data
              </button>
              <button type="button" className="btn btn-ef-danger" onClick={() => setConfirm('clear')}>
                <i className="bi bi-trash me-2" aria-hidden="true" />
                Clear all demo data
              </button>
            </div>
          </section>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          title={confirm === 'clear' ? 'Clear all demo data?' : 'Restore sample data?'}
          message={
            confirm === 'clear'
              ? 'All properties and leads will be permanently removed from this browser.'
              : 'This replaces ALL current properties and leads with the original sample records.'
          }
          confirmLabel={confirm === 'clear' ? 'Clear everything' : 'Restore samples'}
          busy={busy}
          onConfirm={runDataAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}
