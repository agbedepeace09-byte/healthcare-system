"use client";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  PackagePlus,
  Search,
  Settings,
  Users,
} from "lucide-react";

const queueRows = [
  {
    name: "Eleanor Vance",
    drug: "Lisinopril",
    dosage: "10mg, QD",
    doctor: "Dr. J. Montague",
    priority: false,
  },
  {
    name: "Theodora Crain",
    drug: "Sertraline",
    dosage: "50mg, QD",
    doctor: "Dr. J. Montague",
    priority: false,
  },
  {
    name: "Luke Crain",
    drug: "Atorvastatin",
    dosage: "20mg, QHS",
    doctor: "Dr. H. Dudley",
    priority: false,
  },
  {
    name: "Shirley Crain",
    drug: "Amoxicillin",
    dosage: "500mg, TID",
    doctor: "Dr. H. Dudley",
    priority: false,
  },
  {
    name: "Steven Crain",
    drug: "Metformin",
    dosage: "1000mg, BID",
    doctor: "Dr. J. Montague",
    priority: true,
  },
];

const inventoryRows = [
  {
    drug: "Amoxicillin",
    category: "Antibiotic",
    stock: "142",
    critical: false,
  },
  {
    drug: "Lisinopril",
    category: "ACE Inhibitor",
    stock: "12",
    critical: true,
  },
  { drug: "Sertraline", category: "SSRI", stock: "87", critical: false },
  { drug: "Metformin", category: "Anti-diabetic", stock: "08", critical: true },
  { drug: "Atorvastatin", category: "Statin", stock: "215", critical: false },
];

function QueueRow({ row }) {
  return (
    <tr
      className={`group transition-colors hover:bg-surface-container-low ${row.priority ? "bg-error-container/10" : ""}`}
    >
      <td className="px-4 py-3 font-medium text-on-surface">{row.name}</td>
      <td className="px-4 py-3 font-code-sm text-code-sm text-on-surface">
        {row.drug}
      </td>
      <td className="px-4 py-3 text-on-surface-variant">{row.dosage}</td>
      <td className="px-4 py-3 text-on-surface-variant">{row.doctor}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          className="rounded bg-primary-container px-3 py-1.5 text-label-md text-on-primary-container shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
        >
          Mark Dispensed
        </button>
      </td>
    </tr>
  );
}

function InventoryRow({ row }) {
  return (
    <tr
      className={`transition-colors hover:bg-surface-container-low ${row.critical ? "bg-error-container/10" : ""}`}
    >
      <td
        className={`px-4 py-2 font-medium ${row.critical ? "text-error" : "text-on-surface"}`}
      >
        {row.drug}
      </td>
      <td className="px-4 py-2 text-[12px] text-on-surface-variant">
        {row.category}
      </td>
      <td className="px-4 py-2 text-right">
        <span
          className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 font-code-sm text-code-sm ${row.critical ? "bg-error text-on-error shadow-sm" : "border border-outline-variant/50 bg-surface-container-highest text-on-surface"}`}
        >
          {row.stock}
        </span>
      </td>
    </tr>
  );
}

export default function PharmacyPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <section className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-headline-lg tracking-tight text-on-surface">
            Pharmacy Dashboard
          </h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Real-time overview of prescriptions and inventory status.
          </p>
        </div>
        <button
          type="button"
          className="rounded border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
        >
          Export Report
        </button>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-bright px-4 py-4">
              <h3 className="flex items-center gap-2 text-title-lg text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  receipt_long
                </span>
                Prescription Queue
              </h3>
              <span className="rounded bg-primary-container px-2 py-0.5 text-code-sm font-code-sm text-on-primary-container">
                14 Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">
                      Patient Name
                    </th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">
                      Drug
                    </th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-label-md uppercase text-on-surface-variant">
                      Ordering Doctor
                    </th>
                    <th className="px-4 py-3 text-right text-label-md uppercase text-on-surface-variant">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                  {queueRows.map((row) => (
                    <QueueRow key={`${row.name}-${row.drug}`} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-soft">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-bright px-4 py-4">
              <h3 className="flex items-center gap-2 text-title-lg text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-tertiary">
                  vaccines
                </span>
                Inventory Tracker
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant">
                      Drug Name
                    </th>
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant">
                      Cat
                    </th>
                    <th className="px-4 py-2 text-label-md uppercase text-on-surface-variant text-right">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-body-md text-on-surface">
                  {inventoryRows.map((row) => (
                    <InventoryRow key={row.drug} row={row} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-outline-variant bg-surface-bright p-3 text-center">
              <a
                href="#"
                className="flex items-center justify-center gap-1 text-label-md text-primary transition-colors hover:text-primary-fixed-variant"
              >
                View Full Inventory
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}