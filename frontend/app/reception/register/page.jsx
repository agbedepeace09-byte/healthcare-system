export default function RegisterPatientPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex text-sm text-[#434655] dark:text-[#bec6e0] mb-2 font-medium"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/patients" className="hover:text-[#004ac6]">
                Patients
              </a>
            </li>
            <li>/</li>
            <li
              aria-current="page"
              className="text-[#004ac6] dark:text-[#b4c5ff]"
            >
              Register New
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-[#0b1c30] dark:text-[#eaf1ff]">
          Register New Patient
        </h1>
        <p className="text-[#434655] dark:text-[#bec6e0] mt-1">
          Please enter the patient's personal and contact information
          accurately.
        </p>
      </div>

      {/* Registration Form Card */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-[#c3c6d7] dark:border-[#262626] p-8 shadow-sm">
        <form className="space-y-8">
          {/* Personal Info Section */}
          <section>
            <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] mb-6 flex items-center gap-2 border-b border-[#c3c6d7] dark:border-[#262626] pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" id="first_name" type="text" />
              <InputField label="Last Name" id="last_name" type="text" />
              <InputField label="Date of Birth" id="dob" type="date" />
              <SelectField
                label="Gender"
                id="gender"
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />
            </div>
          </section>

          {/* Contact Info Section */}
          <section>
            <h3 className="text-lg font-semibold text-[#0b1c30] dark:text-[#eaf1ff] mb-6 flex items-center gap-2 border-b border-[#c3c6d7] dark:border-[#262626] pb-2">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Contact Number"
                id="contact_number"
                type="tel"
              />
              <InputField label="Email Address" id="email" type="email" />
              <div className="md:col-span-2">
                <InputField
                  label="Next of Kin (Name & Relationship)"
                  id="next_of_kin"
                  type="text"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#c3c6d7] dark:border-[#262626]">
            <button
              type="button"
              className="px-6 py-2 border border-[#c3c6d7] dark:border-[#262626] text-[#434655] dark:text-[#bec6e0] rounded-md font-medium hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#004ac6] text-white rounded-md font-medium hover:bg-[#003ea8] transition-all active:scale-95"
            >
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Small Components for Form Fields
function InputField({
  label,
  id,
  type,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#434655] dark:text-[#bec6e0]"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#434655] dark:text-[#bec6e0]"
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full bg-white dark:bg-[#0b1c30] border border-[#c3c6d7] dark:border-[#737686] rounded-md px-3 py-2 focus:ring-1 focus:ring-[#004ac6] outline-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
