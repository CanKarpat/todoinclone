import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user) {
      loadProfile(session.user.id)
    } else {
      setProfile(null)
    }
  }, [session?.user?.id])

  async function loadProfile(userId) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      setProfile(existing)
      return
    }

    const { data: created } = await supabase
      .from('profiles')
      .insert({ user_id: userId })
      .select()
      .single()
    setProfile(created)
  }

  async function refreshProfile() {
    if (session?.user) await loadProfile(session.user.id)
  }

  async function updateProfile(patch) {
    if (!session?.user) return { data: null, error: new Error('no session') }
    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('user_id', session.user.id)
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error }
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signIn,
        signOut,
        profile,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
