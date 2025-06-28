import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"

type AuthContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  accountType: string;
  setAccountType: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextChildren = {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthContextChildren) => {
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('userId') || '')
  const [accountType, setAccountType] = useState<string>(() => localStorage.getItem('accountType') || '')

  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])

  useEffect(() => {
    localStorage.setItem('accountType', accountType)
  }, [accountType])

  const value = useMemo(() => ({
    userId,
    setUserId,
    accountType,
    setAccountType
  }), [userId, accountType])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext