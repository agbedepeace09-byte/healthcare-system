import {
  Activity,
  BarChart3,
  BedDouble,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Package2,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Patients", icon: BedDouble },
  { label: "Staffing", icon: Users },
  { label: "Inventory", icon: Package2 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const statCards = [
  {
    label: "Total Patients",
    value: "12,482",
    trend: "+2.4%",
    detail: "vs last month",
    icon: Users,
    trendTone: "text-emerald-600",
  },
  {
    label: "Active Doctors",
    value: "48",
    trend: "Stable",
    detail: "currently on shift",
    icon: Stethoscope,
    trendTone: "text-on-surface-variant",
  },
  {
    label: "Prescriptions Today",
    value: "342",
    trend: "+12",
    detail: "vs yesterday",
    icon: ClipboardList,
    trendTone: "text-emerald-600",
  },
  {
    label: "Revenue / Cost (YTD)",
    value: "$1.2M",
    trend: "-1.1%",
    detail: "margin variance",
    icon: CircleDollarSign,
    trendTone: "text-red-600",
  },
];

const staffRows = [
  {
    initials: "SM",
    name: "Dr. Sarah Mitchell",
    role: "Attending Physician",
    department: "Cardiology",
    status: "Active",
    tone: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
  },
  {
    initials: "JL",
    name: "James Lawson",
    role: "Registered Nurse",
    department: "Emergency",
    status: "On Leave",
    tone: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-600",
  },
  {
    initials: "AK",
    name: "Dr. Aliyah Khan",
    role: "Chief Surgeon",
    department: "Neurology",
    status: "Offline",
    tone: "bg-surface-variant text-on-surface-variant border-outline-variant/50",
    dot: "bg-outline",
  },
  {
    initials: "MR",
    name: "Michael Ross",
    role: "System Administrator",
    department: "IT Ops",
    status: "Active",
    tone: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
  },
];

function NavItem({ item }) {
  const Icon = item.icon;

  return (
    <li>
      <a
        href="#"
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${item.active ? "bg-secondary-container/40 text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-container-high"}`}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </a>
    </li>
  );
}

function StatCard({ card }) {
  const Icon = card.icon;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4 shadow-soft flex flex-col justify-between gap-6 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <p className="text-label-md uppercase tracking-wider text-on-surface-variant">
          {card.label}
        </p>
        <span className="rounded-md bg-primary/10 p-1.5 text-primary/80">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div>
        <p className="text-display-lg text-on-surface mb-1">{card.value}</p>
        <div className="flex items-center gap-1 text-sm">
          <span className={`font-medium ${card.trendTone}`}>{card.trend}</span>
          <span className="text-on-surface-variant/70 text-xs ml-1">
            {card.detail}
          </span>
        </div>
      </div>
    </div>
  );
}

function StaffRow({ staff }) {
  return (
    <tr className="group transition-colors hover:bg-surface-container-low/30">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container/20 text-primary font-bold text-xs">
            {staff.initials}
          </div>
          <span className="font-medium text-on-surface">{staff.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-on-surface">{staff.role}</td>
      <td className="py-3 px-4 text-on-surface-variant">{staff.department}</td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${staff.tone}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${staff.dot}`} />
          {staff.status}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          type="button"
          className="opacity-0 transition-colors group-hover:opacity-100 text-outline hover:text-primary"
          aria-label={`Edit ${staff.name}`}
        >
          <Activity className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface selection:bg-primary/20 selection:text-primary">
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest py-8">
        <div className="mb-8 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary shadow-soft">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-title-lg font-bold text-primary">
                MediCenter
              </h1>
              <p className="text-label-md text-on-surface-variant">
                Clinical Admin
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-outline-variant/30 px-3 pt-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Support</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <section className="min-h-screen md:ml-64 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
            <div className="relative hidden w-full max-w-md items-center md:flex">
              <Search className="absolute left-3 h-4 w-4 text-outline" />
              <input
                type="text"
                placeholder="Search patients, staff, or records..."
                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline/70 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <button
                type="button"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Toggle theme"
              >
                <span className="material-symbols-outlined">dark_mode</span>
              </button>
              <button
                type="button"
                className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
              </button>
              <div className="ml-1 flex items-center border-l border-outline-variant/50 pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container font-semibold">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
            <section>
              <h2 className="mb-1 text-headline-lg font-bold text-on-surface">
                Overview
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Enterprise clinical metrics for today.
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.label} card={card} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex h-[400px] flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-soft lg:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-title-lg font-semibold text-on-surface">
                    Patient Traffic
                  </h3>
                  <button
                    type="button"
                    className="rounded p-1 text-outline transition-colors hover:bg-surface-variant/50 hover:text-on-surface"
                    aria-label="More options"
                  >
                    <span className="material-symbols-outlined text-sm">
                      more_horiz
                    </span>
                  </button>
                </div>
                <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low/30">
                  <div className="absolute bottom-0 h-[60%] w-full bg-gradient-to-t from-primary/20 to-transparent" />
                  <svg
                    className="absolute bottom-0 h-full w-full text-primary"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,100 L0,70 Q10,60 20,75 T40,65 T60,80 T80,50 T100,40 L100,100 Z"
                      fill="currentColor"
                      opacity="0.1"
                    />
                    <path
                      d="M0,70 Q10,60 20,75 T40,65 T60,80 T80,50 T100,40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="absolute left-4 top-4 rounded border border-outline-variant/50 bg-surface/90 px-2 py-1 text-xs font-medium backdrop-blur">
                    30 Days Trend
                  </div>
                </div>
              </div>

              <div className="flex h-[400px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-soft lg:col-span-2">
                <div className="flex items-center justify-between border-b border-outline-variant p-4">
                  <div>
                    <h3 className="text-title-lg font-semibold text-on-surface">
                      Staff Management
                    </h3>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Real-time personnel status.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-label-md text-on-primary transition-all hover:bg-primary/90 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    Add Staff
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="min-w-[600px] w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-surface-container-low/50 backdrop-blur-sm">
                      <tr>
                        <th className="border-b border-outline-variant/50 px-4 py-3 text-label-md font-medium text-on-surface-variant">
                          Name
                        </th>
                        <th className="border-b border-outline-variant/50 px-4 py-3 text-label-md font-medium text-on-surface-variant">
                          Role
                        </th>
                        <th className="border-b border-outline-variant/50 px-4 py-3 text-label-md font-medium text-on-surface-variant">
                          Department
                        </th>
                        <th className="border-b border-outline-variant/50 px-4 py-3 text-label-md font-medium text-on-surface-variant">
                          Status
                        </th>
                        <th className="border-b border-outline-variant/50 px-4 py-3 text-right text-label-md font-medium text-on-surface-variant">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30 text-sm text-on-surface">
                      {staffRows.map((staff) => (
                        <StaffRow key={staff.name} staff={staff} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </section>
    </main>
  );
}
