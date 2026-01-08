import { useState } from 'react'
import { Settings as SettingsIcon, Save, Shield, Bell, Globe } from 'lucide-react'

const STATS = [
  { label: 'Environment', value: 'Production', color: 'text-emerald-400' },
  { label: 'Regions', value: '2', color: 'text-indigo-300' },
  { label: 'Active Users', value: '128', color: 'text-amber-300' },
]

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'JK Company Ltd',
    email: 'admin@jkcompany.com',
    phone: '+91-98765-43210',
    language: 'English',
    timezone: 'IST (UTC+5:30)',
    otpEnabled: true,
    notifications: true,
  })

  const handleChange = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    alert('Demo: settings saved')
  }

  return (
    <div className="space-y-6 pb-10 text-foreground w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">Demo configuration options for the site</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save Demo
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-400 rounded-sm"></span>
            Showing dummy settings only
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 grid-cols-3 gap-4">
        {STATS.map((item) => (
          <div key={item.label} className="card-surface p-5 md:p-6 rounded-xl border border-[var(--border)]">
            <p className="text-xs md:text-sm text-muted-foreground mb-2">{item.label}</p>
            <p className={`text-3xl md:text-4xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* General */}
        <div className="card-surface rounded-xl border border-[var(--border)] p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <h3 className="text-base md:text-lg font-semibold text-foreground">General</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
              <input
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none"
                >
                  <option>IST (UTC+5:30)</option>
                  <option>PST (UTC-8:00)</option>
                  <option>GMT (UTC+0:00)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="card-surface rounded-xl border border-[var(--border)] p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-base md:text-lg font-semibold text-foreground">Security & Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                OTP Enabled (demo)
              </span>
              <input
                type="checkbox"
                checked={settings.otpEnabled}
                onChange={(e) => handleChange('otpEnabled', e.target.checked)}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                Email Notifications (demo)
              </span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}