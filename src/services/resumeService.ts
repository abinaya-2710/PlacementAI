import api from './api'
import type { ResumeData, ApiResult } from '../types'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const d = (err as { response: { data: Record<string, unknown> } }).response?.data
    if (typeof d?.message === 'string') return d.message
  }
  return err instanceof Error ? err.message : 'An error occurred.'
}

interface RawResume extends ResumeData { id: number; created_at: string; updated_at: string }

function parseResume(raw: Record<string, unknown>): ResumeData {
  const parse = (v: unknown, fallback: unknown) => {
    if (!v) return fallback
    try { return typeof v === 'string' ? JSON.parse(v) : v } catch { return fallback }
  }
  return {
    ...raw,
    personal:    parse(raw.personal,    {}) as ResumeData['personal'],
    education:   parse(raw.education,   []) as ResumeData['education'],
    skills:      parse(raw.skills,      {}) as ResumeData['skills'],
    projects:    parse(raw.projects,    []) as ResumeData['projects'],
    internships: parse(raw.internships, []) as ResumeData['internships'],
    experience:  parse(raw.experience,  []) as ResumeData['experience'],
  } as ResumeData
}

export async function fetchResumes(): ApiResult<RawResume[]> {
  try {
    const { data } = await api.get<{ data: { resumes: Record<string, unknown>[] } }>('/resume/')
    return { data: data.data.resumes.map(parseResume) as RawResume[], error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function fetchResume(id: number): ApiResult<RawResume> {
  try {
    const { data } = await api.get<{ data: { resume: Record<string, unknown> } }>(`/resume/${id}`)
    return { data: parseResume(data.data.resume) as RawResume, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function saveResume(payload: ResumeData): ApiResult<RawResume> {
  try {
    const isNew = !payload.id
    const res = isNew
      ? await api.post<{ data: { resume: Record<string, unknown> } }>('/resume/', payload)
      : await api.put<{ data: { resume: Record<string, unknown> } }>(`/resume/${payload.id}`, payload)
    return { data: parseResume(res.data.data.resume) as RawResume, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}

export async function deleteResume(id: number): ApiResult<null> {
  try {
    await api.delete(`/resume/${id}`)
    return { data: null, error: null }
  } catch (e) { return { data: null, error: extractError(e) } }
}
