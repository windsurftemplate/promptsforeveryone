import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './firebase'
import { User, signOut as firebaseSignOut } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { db } from './firebase'

interface AuthContextType {
  user: User | null
  signOut: () => Promise<void>
  isPro: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
  isPro: false,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        const userRef = ref(db, `users/${user.uid}`)
        const snapshot = await get(userRef)
        const userData = snapshot.val()
        setIsPro(userData?.plan === 'pro' || userData?.role === 'admin')
      } else {
        setIsPro(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, signOut, isPro, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 