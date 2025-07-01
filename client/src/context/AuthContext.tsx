import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { UserRole } from "../utils/UserRole"

type AuthContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  accountType: UserRole | null;
  setAccountType: React.Dispatch<React.SetStateAction<UserRole | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextChildren = {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthContextChildren) => {
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('userId') || '')
  const [accountType, setAccountType] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem('accountType');
    if (stored === UserRole.Professor || stored === UserRole.Student) {
      return stored as UserRole
    }
    return null
  })

  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])

  useEffect(() => {
    if (accountType) {
      localStorage.setItem('accountType', accountType)
    } else {
      localStorage.removeItem('accountType')
    }
  }, [accountType])

  const value = useMemo(() => ({
    userId,
    setUserId,
    accountType,
    setAccountType,
  }), [userId, accountType])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext