import { useState } from 'react'

const FAQS = [
  { q: 'Is PlacePrep AI really free?',          a: 'Yes, 100% free. No credit card, no subscription, no hidden fees. Ever.' },
  { q: 'Do I need to create an account?',        a: 'You can browse freely, but creating an account unlocks progress tracking, bookmarks, and personalized recommendations.' },
  { q: 'How often is content updated?',          a: 'Our team regularly updates roadmaps, adds new practice problems, and uploads fresh company preparation content.' },
  { q: 'Can I suggest a feature or company?',    a: 'Absolutely! Use the contact form below or post in our community forum.' },
]

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null)
  const [sent,  setSent]  = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-h)] mb-3">Contact Us</h1>
        <p className="text-[var(--text)]">Have a question, suggestion, or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Contact form */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text-h)] mb-5">Send us a message</h2>
          {!sent ? (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); setSent(true) }}>
              {[['Full Name','text','Rahul Kumar'],['Email','email','you@email.com']].map(([label, type, ph]) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5">{label}</label>
                  <input type={type} placeholder={ph}
                    className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5">Subject</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
                  {['General Enquiry','Bug Report','Feature Request','Content Issue','Partnership','Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-h)] mb-1.5">Message</label>
                <textarea rows={5} placeholder="Your message…"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] placeholder:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent resize-none" />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-lg bg-[var(--brand)] text-white font-semibold text-sm hover:bg-[var(--brand-dark)] transition-all">
                Send Message
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-[var(--border)] bg-[var(--bg)]">
              <span className="text-4xl mb-3" aria-hidden="true">✅</span>
              <h3 className="font-bold text-[var(--text-h)] mb-1">Message sent!</h3>
              <p className="text-sm text-[var(--text)]">We'll get back to you within 24 hours.</p>
              <button type="button" onClick={() => setSent(false)}
                className="mt-4 text-sm text-[var(--brand)] hover:underline font-medium">Send another</button>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-lg font-bold text-[var(--text-h)] mb-5">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-muted)] transition-colors">
                  <span className="text-sm font-semibold text-[var(--text-h)]">{q}</span>
                  <span className={`text-[var(--text)] transition-transform ml-2 flex-shrink-0 ${open === i ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4 border-t border-[var(--border)]">
                    <p className="text-sm text-[var(--text)] mt-3 leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="mt-6 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] space-y-2">
            <p className="text-sm font-semibold text-[var(--text-h)]">Other ways to reach us</p>
            <p className="text-sm text-[var(--text)]">📧 support@placeprepai.com</p>
            <p className="text-sm text-[var(--text)]">💬 Community Forum (fastest response)</p>
            <p className="text-sm text-[var(--text)]">🐦 @PlacePrepAI on Twitter</p>
          </div>
        </div>
      </div>
    </div>
  )
}
