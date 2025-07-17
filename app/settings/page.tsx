"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">
          Configure your dashboard preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Dashboard Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Dark Mode</span>
              <div className="text-sm text-slate-400">Coming Soon</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Email Notifications
              </span>
              <div className="text-sm text-slate-400">Coming Soon</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Data Management
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Export Data</span>
              <div className="text-sm text-slate-400">Coming Soon</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Clear All Data</span>
              <div className="text-sm text-slate-400">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
