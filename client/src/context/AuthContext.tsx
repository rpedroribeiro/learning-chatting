import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"

type AuthContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextChildren = {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthContextChildren) => {
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('userId') || '')
  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])
  const value = useMemo(() => ({
    userId,
    setUserId
  }), [userId])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext