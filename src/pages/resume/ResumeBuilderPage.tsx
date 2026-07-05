import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'

const SECTIONS = [
  { key: 'personal',    label: 'Personal Details',  icon: '👤' },
  { key: 'education',   label: 'Education',          icon: '🎓' },
  { key: 'skills',      label: 'Skills',             icon: '🛠️' },
  { key: 'projects',    label: 'Projects',           icon: '💼' },
  { key: 'internships', label: 'Internships',        icon: '🏢' },
  { key: 'experience',  label: 'Experience',         icon: '📋' },
]

export default function ResumeBuilderPage() {
  const [active, setActive] = useState('personal')

  return (
    <>
      <PageHeader title="Resume Builder" subtitle="Build an ATS-friendly resume step by step. Preview it live.">
        <button type="button"
          className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
          Preview Resume
        </button>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav aria-label="Resume sections">
              <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible list-none m-0 p-0">
                {SECTIONS.map(({ key, label, icon }) => (
                  <li key={key}>
                    <button onClick={() => setActive(key)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap ${
                        active === key
                          ? 'bg-[var(--brand)] text-white'
                          : 'text-[var(--text)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-h)]'
                      }`}>
                      <span aria-hidden="true">{icon}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Form panel */}
          <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6 min-h-[500px]">

            {active === 'personal' && (
              <div className="space-y-5">
                <h2 className="font-bold text-[var(--text-h)] text-lg mb-2">Personal Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['Full Name','text','Rahul Kumar'],['Email','email','rahul@email.com'],
                    ['Phone','tel','+91 98765 43210'],['Location','text','Chennai, Tamil Nadu'],
                    ['LinkedIn URL','url','linkedin.com/in/rahul'],['GitHub URL','url','github.com/rahul'],
                    ['Portfolio URL','url','rahulkumar.dev'],['Objective / Summary','text',''],
                  ].map(([label, type, placeholder]) => (
                    <div key={label} className={label === 'Objective / Summary' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-[var(--text-h)] mb-1.5">{label}</label>
                      {label === 'Objective / Summary'
                        ? <textarea rows={3} placeholder={`Enter your ${label.toLowerCase()}…`}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent resize-none" />
                        : <input type={type as string} placeholder={placeholder as string}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === 'education' && (
              <div className="space-y-5">
                <h2 className="font-bold text-[var(--text-h)] text-lg mb-2">Education</h2>
                <div className="rounded-xl border border-[var(--border)] p-5 space-y-4">
                  {[['Degree / Course','text','B.E. Computer Science'],['Institution','text','Anna University'],
                    ['Year of Passing','text','2025'],['CGPA / Percentage','text','8.5 / 10'],
                  ].map(([label, type, placeholder]) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-[var(--text-h)] mb-1.5">{label}</label>
                      <input type={type as string} placeholder={placeholder as string}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
                    </div>
                  ))}
                </div>
                <button type="button"
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:underline">
                  + Add another degree
                </button>
              </div>
            )}

            {active === 'skills' && (
              <div className="space-y-5">
                <h2 className="font-bold text-[var(--text-h)] text-lg mb-2">Skills</h2>
                {['Programming Languages', 'Frameworks & Libraries', 'Tools & Technologies', 'Soft Skills'].map(group => (
                  <div key={group}>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1.5">{group}</label>
                    <input type="text" placeholder="e.g. Java, Python, C++ (comma separated)"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
                  </div>
                ))}
              </div>
            )}

            {['projects', 'internships', 'experience'].includes(active) && (
              <div className="space-y-5">
                <h2 className="font-bold text-[var(--text-h)] text-lg mb-2 capitalize">{active}</h2>
                <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
                  <span className="text-3xl mb-3 block" aria-hidden="true">
                    {SECTIONS.find(s => s.key === active)?.icon}
                  </span>
                  <p className="text-sm text-[var(--text)] mb-4">No {active} added yet.</p>
                  <button type="button"
                    className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">
                    + Add {active.slice(0, -1)}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Preview panel (desktop) */}
          <div className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-24 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] overflow-hidden">
              <div className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2">Live Preview</div>
              <div className="p-4 text-center py-16">
                <span className="text-3xl" aria-hidden="true">📄</span>
                <p className="text-xs text-[var(--text)] mt-2">Fill in your details to see the preview.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
