// ─── Shared utility ───────────────────────────────────────────────────────────
export type ApiResult<T> = Promise<
  | { data: T;    error: null   }
  | { data: null; error: string }
>

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id:         number
  full_name:  string
  email:      string
  role:       'student' | 'admin'
  is_active:  boolean
  created_at: string
  updated_at: string
}

// ─── Landing (static) ─────────────────────────────────────────────────────────
export interface NavLink       { label: string; href: string }
export interface Feature       { icon: string; title: string; description: string }
export interface LandingRoadmap{ title: string; icon: string; category: RoadmapCategory; topicCount: number }
export interface LandingCompany{ name: string; type: 'service'|'product'|'finance'|'startup' }
export type Company = LandingCompany   // backward compat
export type Roadmap = LandingRoadmap   // backward compat

// ─── Roadmaps ─────────────────────────────────────────────────────────────────
export type RoadmapCategory = 'programming' | 'cs-core' | 'aptitude' | 'interview'
export type TopicDifficulty = 'Easy' | 'Medium' | 'Hard'
export type TopicLevel      = 'beginner' | 'intermediate' | 'advanced'

export interface RoadmapSummary {
  id: number; slug: string; title: string; description: string; icon: string
  category: RoadmapCategory; estimated_hours: number; topic_count: number
  completed_count: number; progress_pct: number; order_index: number
}
export interface RoadmapTopic {
  id: number; roadmap_id: number; title: string; description: string
  difficulty: TopicDifficulty; level: TopicLevel; order_index: number
  estimated_minutes: number; resources_url: string | null; completed: boolean
}
export interface RoadmapDetail extends RoadmapSummary { topics: RoadmapTopic[] }
export interface RoadmapProgress {
  roadmap_slug: string; roadmap_title: string
  total_topics: number; completed_topics: number; progress_pct: number
}

// ─── Progress / Dashboard ─────────────────────────────────────────────────────
export interface StreakInfo {
  current_streak: number; best_streak: number; last_active: string | null
}
export interface ProgressStats {
  topics_completed: number; total_topics: number; readiness_score: number
}
export interface RoadmapProgressItem {
  slug: string; title: string; icon: string; category: RoadmapCategory
  topic_count: number; completed_count: number; progress_pct: number
}
export interface ActivityItem {
  id: number; activity_type: string; description: string
  roadmap_slug: string | null; topic_id: number | null; created_at: string
}
export interface ProgressSummary {
  streak:           StreakInfo
  stats:            ProgressStats
  roadmap_progress: RoadmapProgressItem[]
  recent_activity:  ActivityItem[]
}

// ─── Practice ─────────────────────────────────────────────────────────────────
export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard'
export interface Problem {
  id: number; title: string; slug: string; topic: string
  difficulty: ProblemDifficulty; companies: string
  solved: boolean; bookmarked: boolean
  description?: string; examples?: string
  constraints?: string; editorial?: string
}
export interface ProblemListResponse {
  problems: Problem[]; total: number; page: number; per_page: number; topics: string[]
}

// ─── Aptitude ─────────────────────────────────────────────────────────────────
export type AptitudeCategory = 'quant' | 'logical' | 'verbal'
export interface AptitudeQuestion {
  id: number; category: AptitudeCategory; topic: string
  difficulty: TopicDifficulty; question: string
  option_a: string; option_b: string; option_c: string; option_d: string
  correct?: string; explanation?: string
}
export interface AptitudeStats {
  total_attempts: number; correct: number; accuracy: number
}

// ─── Company ──────────────────────────────────────────────────────────────────
export type CompanyType       = 'product' | 'service' | 'finance' | 'startup'
export type CompanyDifficulty = 'Easy' | 'Medium' | 'Hard'
export interface CompanyItem {
  id: number; name: string; slug: string; type: CompanyType
  difficulty: CompanyDifficulty; logo_abbr: string; description: string
  hiring_process: string; required_skills: string
  interview_rounds: number; roles: string; ctc_range: string
}

// ─── Interview ────────────────────────────────────────────────────────────────
export type InterviewCategory = 'hr' | 'technical' | 'behavioral' | 'company'
export interface InterviewQuestion {
  id: number; category: InterviewCategory; topic: string
  question: string; model_answer: string; tips: string
  company_name: string | null; is_starred: boolean
}
export interface InterviewExperience {
  id: number; company_name: string; role: string
  rounds: number; result: 'Selected' | 'Rejected' | 'Pending'
  experience: string; year: number | null; created_at: string
}

// ─── Resume ───────────────────────────────────────────────────────────────────
export interface ResumePersonal {
  full_name?: string; email?: string; phone?: string
  location?: string; linkedin?: string; github?: string; portfolio?: string; objective?: string
}
export interface ResumeEducation {
  degree?: string; institution?: string; year?: string; grade?: string
}
export interface ResumeProject {
  name?: string; description?: string; tech_stack?: string; link?: string
}
export interface ResumeData {
  id?: number; title: string; template: string
  personal:    ResumePersonal
  education:   ResumeEducation[]
  skills:      { programming?: string; frameworks?: string; tools?: string; soft_skills?: string }
  projects:    ResumeProject[]
  internships: Array<{ company?: string; role?: string; duration?: string; description?: string }>
  experience:  Array<{ company?: string; role?: string; duration?: string; description?: string }>
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface UserProfileData {
  college: string; year: string; branch: string; location: string; bio: string
  skills: string; linkedin_url: string; github_url: string; portfolio_url: string
}
export interface ProfileStats { topics_completed: number; problems_solved: number }

// ─── Notifications ────────────────────────────────────────────────────────────
export type NotifType = 'streak' | 'achievement' | 'reminder' | 'system'
export interface NotificationItem {
  id: number; type: NotifType; title: string; body: string
  is_read: boolean; created_at: string
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number; user_id: number; full_name: string; initials: string
  score: number; streak: number; is_me: boolean
}

// ─── Community ────────────────────────────────────────────────────────────────
export type PostTag = 'DSA' | 'Placement' | 'Resume' | 'Aptitude' | 'Interview' | 'General'
export interface PostItem {
  id: number; user_id: number; title: string; body: string
  tag: PostTag; is_pinned: boolean; author: string
  like_count: number; comment_count: number; liked: boolean; created_at: string
  comments?: CommentItem[]
}
export interface CommentItem {
  id: number; post_id: number; user_id: number; body: string; created_at: string
}

// ─── Resources ────────────────────────────────────────────────────────────────
export type ResourceType = 'video' | 'notes' | 'pdf' | 'link' | 'cheatsheet'
export interface ResourceItem {
  id: number; title: string; type: ResourceType; topic: string
  url: string; description: string; source: string; is_free: boolean
}
