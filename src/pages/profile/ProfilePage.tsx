import { useState, useEffect } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      <div className="h-32 rounded-xl bg-[var(--border)]" />
      <div className="h-24 rounded-xl bg-[var(--border)]" />
      <div className="h-40 rounded-xl bg-[var(--border)]" />
    </div>
  )
}

export default function ProfilePage() {
  const { refreshUser } = useAuth()
  const { profile: fullProfile, loading, saving, error, save, refetch } = useProfile()
  const [editing, setEditing] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [college, setCollege] = useState('')
  const [year, setYear] = useState('')
  const [branch, setBranch] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  // Sync state when fullProfile loads
  useEffect(() => {
    if (fullProfile) {
      setFullName(fullProfile.user?.full_name || '')
      setCollege(fullProfile.profile?.college || '')
      setYear(fullProfile.profile?.year || '')
      setBranch(fullProfile.profile?.branch || '')
      setLocation(fullProfile.profile?.location || '')
      setBio(fullProfile.profile?.bio || '')
      setSkills(fullProfile.profile?.skills || '')
      setLinkedinUrl(fullProfile.profile?.linkedin_url || '')
      setGithubUrl(fullProfile.profile?.github_url || '')
      setPortfolioUrl(fullProfile.profile?.portfolio_url || '')
    }
  }, [fullProfile])

  if (loading) return <Skeleton />

  if (error || !fullProfile) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center px-4">
        <span className="text-4xl" aria-hidden="true">⚠️</span>
        <p className="font-semibold text-[var(--text-h)]">Failed to load profile</p>
        <p className="text-sm text-[var(--text)]">{error || 'Data empty'}</p>
        <button onClick={refetch} className="px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-dark)] transition-colors">Retry</button>
      </div>
    )
  }

  const { user, stats } = fullProfile
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const skillArray = skills
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  // Dynamic achievements list
  const achievements = []
  if (stats.topics_completed >= 1) {
    achievements.push({ icon: '📖', title: 'Roadmap Starter', desc: 'Completed your first roadmap topic' })
  }
  if (stats.topics_completed >= 20) {
    achievements.push({ icon: '🎓', title: 'Topic Scholar', desc: 'Completed over 20 roadmap topics' })
  }
  if (stats.problems_solved >= 1) {
    achievements.push({ icon: '💻', title: 'Code Solver', desc: 'Solved your first practice problem' })
  }
  if (stats.problems_solved >= 10) {
    achievements.push({ icon: '🔥', title: 'DSA Enthusiast', desc: 'Solved over 10 practice problems' })
  }

  const handleSave = async () => {
    if (editing) {
      const err = await save({
        full_name: fullName,
        college,
        year,
        branch,
        location,
        bio,
        skills,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
      })
      if (!err) {
        await refreshUser() // update navbar / authContext name
        setEditing(false)
      } else {
        alert(err)
      }
    } else {
      setEditing(true)
    }
  }

  return (
    <>
      <PageHeader title="My Profile">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold text-[var(--text-h)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--brand)] to-violet-700 flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
                {initials}
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4 w-full">
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Full Name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">College</label>
                    <input type="text" value={college} onChange={e => setCollege(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Year of Study</label>
                    <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="e.g. 3rd Year"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Branch / Stream</label>
                    <input type="text" value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. B.E. CSE"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Location</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Chennai, TN"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Bio</label>
                    <input type="text" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">LinkedIn URL</label>
                    <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">GitHub URL</label>
                    <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Portfolio URL</label>
                    <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-extrabold text-[var(--text-h)]">{user.full_name}</h2>
                    <p className="text-sm text-[var(--text)] mt-0.5">{user.email} {location ? `· ${location}` : ''}</p>
                    {college && (
                      <p className="text-sm text-[var(--text)]">{college} {year ? `· ${year}` : ''} {branch ? `· ${branch}` : ''}</p>
                    )}
                    {bio && <p className="text-sm text-[var(--text-h)] mt-2 italic">"{bio}"</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {year && <Badge variant="brand">{year}</Badge>}
                    {branch && <Badge variant="info">{branch}</Badge>}
                    {college && <Badge variant="neutral">{college.split(' ')[0]}</Badge>}
                  </div>

                  {/* Social links */}
                  <div className="flex gap-3 text-xs font-semibold">
                    {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">LinkedIn ↗</a>}
                    {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">GitHub ↗</a>}
                    {portfolioUrl && <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">Portfolio ↗</a>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h3 className="font-bold text-[var(--text-h)] mb-4">Skills</h3>
          {editing ? (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-h)] mb-1">Skills (comma separated)</label>
              <input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Java, Python, React"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text-h)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skillArray.length === 0 ? (
                <p className="text-sm text-[var(--text)]">No skills added yet.</p>
              ) : (
                skillArray.map(s => (
                  <span key={s} className="px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] text-sm font-medium text-[var(--text-h)]">
                    {s}
                  </span>
                ))
              )}
            </div>
          )}
        </div>

        {/* Stats and Achievements */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h3 className="font-bold text-[var(--text-h)] mb-4">Stats & Achievements</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] text-center">
              <p className="text-2xl font-black text-[var(--brand)]">{stats?.topics_completed ?? 0}</p>
              <p className="text-xs text-[var(--text)] mt-1">Topics Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] text-center">
              <p className="text-2xl font-black text-[var(--brand)]">{stats?.problems_solved ?? 0}</p>
              <p className="text-xs text-[var(--text)] mt-1">Problems Solved</p>
            </div>
          </div>

          <h4 className="font-bold text-[var(--text-h)] text-sm mb-3">Earned Badges</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.length === 0 ? (
              <p className="text-sm text-[var(--text)] col-span-2 text-center py-4">Start practicing to earn placement readiness achievements!</p>
            ) : (
              achievements.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-h)]">{title}</p>
                    <p className="text-xs text-[var(--text)]">{desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
