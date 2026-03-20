"use client"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Account</h3>
          <p>Update email, password.</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Privacy</h3>
          <p>Profile visibility.</p>
        </div>
      </div>
    </div>
  )
}

