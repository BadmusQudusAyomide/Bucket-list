import { onAuthStateChanged, type User } from 'firebase/auth'
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { auth } from '../services/firebase'
import {
  getUserProfile,
  loginWithGoogle,
  loginWithEmail,
  logout,
  signupWithEmail,
} from '../services/authService'
import type { UserProfile } from '../types/firebase'

interface AuthContextValue {
  user: User | null
  userProfile: UserProfile | null
  initializing: boolean
  authLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)

      if (!nextUser) {
        setUserProfile(null)
        setInitializing(false)
        return
      }

      try {
        const profile = await getUserProfile(nextUser)
        setUserProfile(profile)
      } finally {
        setInitializing(false)
      }
    })

    return unsubscribe
  }, [])

  const runAuthAction = async (callback: () => Promise<void>) => {
    setAuthLoading(true)

    try {
      await callback()
    } finally {
      setAuthLoading(false)
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userProfile,
      initializing,
      authLoading,
      login: async (email, password) => {
        await runAuthAction(async () => {
          const nextUser = await loginWithEmail(email.trim().toLowerCase(), password)
          setUser(nextUser)
          setUserProfile(await getUserProfile(nextUser))
        })
      },
      signup: async (email, password) => {
        await runAuthAction(async () => {
          const nextUser = await signupWithEmail(email.trim().toLowerCase(), password)
          setUser(nextUser)
          setUserProfile(await getUserProfile(nextUser))
        })
      },
      loginWithGoogle: async () => {
        await runAuthAction(async () => {
          const nextUser = await loginWithGoogle()
          setUser(nextUser)
          setUserProfile(await getUserProfile(nextUser))
        })
      },
      logoutUser: async () => {
        await runAuthAction(async () => {
          await logout()
          setUser(null)
          setUserProfile(null)
        })
      },
    }),
    [authLoading, initializing, user, userProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
