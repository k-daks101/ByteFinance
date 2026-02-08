import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      <section className="bf-card p-6">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Personalize your learning and simulation experience.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {["Notification preferences", "Simulation defaults", "Security"].map(
          (item) => (
            <div
              key={item}
              className="bf-card bf-card-hover p-6"
            >
              <h2 className="text-lg font-bold text-slate-900">{item}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Configuration options will appear here.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
