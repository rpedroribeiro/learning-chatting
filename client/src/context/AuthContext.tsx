import React, { createContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { UserRole } from "../utils/UserRole"
import { io, Socket } from "socket.io-client"

type AuthContextType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  accountType: UserRole | null;
  setAccountType: React.Dispatch<React.SetStateAction<UserRole | null>>;
  profileImg: string;
  setProfileImg: React.Dispatch<React.SetStateAction<string>>;
  socket: any;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthContextChildren = {
  children: ReactNode
}

export const AuthProvider = ({children}: AuthContextChildren) => {
  const [socket, setSocket] = useState<Socket | any>(null)
  const [userId, setUserId] = useState<string>(() => localStorage.getItem('userId') || '')
  const [profileImg, setProfileImg] = useState<string>(() => localStorage.getItem('profileImg') || '')
  const [accountType, setAccountType] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem('accountType')
    if (stored === UserRole.Professor || stored === UserRole.Student) {
      return stored as UserRole
    }
    return null
  })

  useEffect(() => {
    if (userId.length > 0) { localStorage.setItem('userId', userId) } 
    else { localStorage.removeItem('userId') }
  }, [userId])

  useEffect(() => {
    if (accountType) { localStorage.setItem('accountType', accountType) }
    else { localStorage.removeItem('accountType') }
  }, [accountType])

  useEffect(() => {
    if (profileImg) { localStorage.setItem('profileImg', profileImg) }
    else { localStorage.removeItem('profileImg') }
  }, [profileImg])

  useEffect(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
    if (userId.length > 0) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        withCredentials: true,
        auth: { userId }
      })
      newSocket.on('connect', () => {
        setSocket(newSocket)
      })
    }
    return () => {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
    }
  }, [userId])

  const value = useMemo(() => ({
    userId,
    setUserId,
    accountType,
    setAccountType,
    socket,
    setSocket,
    profileImg,
    setProfileImg
  }), [userId, accountType, socket, profileImg])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext