import { useState, useEffect } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import { updateProfile as apiUpdateAuth } from '../../services/authService'

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
        checked ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--text-h)]">{label}</p>
        {desc && <p className="text-xs text-[var(--text)] mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { profile: fullProfile, loading } = useProfile()

  // Theme state: initialized from DOM state
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  // Notifications state: persist in localStorage
  const [notif, setNotif] = useState(() => localStorage.getItem('placeprep_notif') !== 'false')
  const [email, setEmail] = useState(() => localStorage.getItem('placeprep_email') !== 'false')
  const [streak, setStreak] = useState(() => localStorage.getItem('placeprep_streak') !== 'false')

  // Password update form state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  // Sync Dark Mode state change to HTML document and LocalStorage
  const handleThemeChange = (isChecked: boolean) => {
    setDark(isChecked)
    if (isChecked) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('placeprep_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('placeprep_theme', 'light')
    }
  }

  // Save minor toggles to localStorage
  useEffect(() => {
    localStorage.setItem('placeprep_notif', String(notif))
  }, [notif])

  useEffect(() => {
    localStorage.setItem('placeprep_email', String(email))
  }, [email])

  useEffect(() => {
    localStorage.setItem('placeprep_streak', String(streak))
  }, [streak])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setSavingPassword(true)
    const { error: err } = await apiUpdateAuth({ password: newPassword })
    setSavingPassword(false)

    if (err) {
      setPasswordError(err)
    } else {
      setPasswordSuccess('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess(null)
      }, 2000)
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your preferences, notifications, and account." />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Account Info */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
          <div className="px-5 py-3 bg-[var(--bg-muted)] border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-[var(--text-h)]">Account</h2>
          </div>
          <div className="px-5">
            <SettingRow label="Email address" desc={user?.email || 'Loading...'}>
              <span className="text-xs text-[var(--text)] italic bg-[var(--bg-muted)] px-2.5 py-1 rounded">Locked</span>
            </SettingRow>

            <SettingRow label="Password" desc="Change password for security">
              <button
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-xs text-[var(--brand)] hover:underline font-semibold cursor-pointer"
              >
                {showPasswordForm ? 'Cancel' : 'Update'}
              </button>
            </SettingRow>

            {/* Password Form Dropdown */}
            {showPasswordForm && (
              <form onSubmit={handleUpdatePassword} className="px-4 py-4 bg-[var(--bg-muted)] rounded-lg my-4 space-y-3">
                <p className="text-xs font-bold text-[var(--text-h)]">Set New Password</p>
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                {passwordSuccess && <p className="text-xs text-green-500">{passwordSuccess}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text)] mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-h)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text)] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-h)]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-3 py-1.5 rounded bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  {savingPassword ? 'Saving...' : 'Save Password'}
                </button>
              </form>
            )}

            <SettingRow
              label="College / Institution"
              desc={loading ? 'Loading...' : fullProfile?.profile?.college || 'Not set yet'}
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
          <div className="px-5 py-3 bg-[var(--bg-muted)] border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-[var(--text-h)]">Notifications</h2>
          </div>
          <div className="px-5">
            <SettingRow label="Push notifications" desc="Get alerts in-browser">
              <Toggle checked={notif} onChange={setNotif} label="Push notifications" />
            </SettingRow>
            <SettingRow label="Email notifications" desc="Daily digest and reminders">
              <Toggle checked={email} onChange={setEmail} label="Email notifications" />
            </SettingRow>
            <SettingRow label="Streak reminders" desc="Get reminded to keep your streak">
              <Toggle checked={streak} onChange={setStreak} label="Streak reminders" />
            </SettingRow>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
          <div className="px-5 py-3 bg-[var(--bg-muted)] border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-[var(--text-h)]">Appearance</h2>
          </div>
          <div className="px-5">
            <SettingRow label="Dark mode" desc="Switch between light and dark theme">
              <Toggle checked={dark} onChange={handleThemeChange} label="Dark mode" />
            </SettingRow>
          </div>
        </section>
      </div>
    </>
  )
}
