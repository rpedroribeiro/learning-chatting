import { createContext, useMemo, useState, type ReactNode } from "react"

type AuthContextType = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextChildren = {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthContextChildren) => {
  const [accessToken, setAccessToken] = useState<string>('')
  const value = useMemo(() => ({
    accessToken,
    setAccessToken
  }), [accessToken])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext