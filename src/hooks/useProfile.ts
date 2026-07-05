import { useState, useEffect, useCallback } from 'react'
import { fetchProfile, updateProfile, type FullProfile } from '../services/profileService'
import type { UserProfileData } from '../types'

export function useProfile() {
  const [profile,  setProfile]  = useState<FullProfile | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error: err } = await fetchProfile()
    if (err) setError(err)
    else setProfile(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (payload: Partial<UserProfileData & { full_name: string }>) => {
    setSaving(true)
    const { data, error: err } = await updateProfile(payload)
    setSaving(false)
    if (err) return err
    if (data) setProfile(prev => prev ? { ...prev, ...data } : data)
    return null
  }, [])

  return { profile, loading, saving, error, save, refetch: load }
}
