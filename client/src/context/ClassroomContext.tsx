import { createContext, useMemo, useState, useEffect, type ReactNode } from "react"

type ClassroomContextType = {
  isClassroom: boolean
  setIsClassroom: React.Dispatch<React.SetStateAction<boolean>>
  currClass: any
  setCurrClass: React.Dispatch<React.SetStateAction<any>>;
  currFileItem: any;
  setCurrFileItem: React.Dispatch<React.SetStateAction<any>>;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined)

type ClassroomContextChildren = {
  children: ReactNode
}

export const ClassroomProvider = ({ children }: ClassroomContextChildren) => {
  const [isClassroom, setIsClassroom] = useState<boolean>(() => {
    const stored = localStorage.getItem('isClassroom')
    if (stored === 'true') return true
    if (stored === 'false') return false
    return false
  })

  const [currClass, setCurrClass] = useState<any>(() => {
    const stored = localStorage.getItem('currClass')
    return stored ? JSON.parse(stored) : null
  })

  const [currFileItem, setCurrFileItem] = useState<any>(() => {
    const stored = localStorage.getItem('currFileItem')
    return stored ? JSON.parse(stored): null
  })

  useEffect(() => {
    localStorage.setItem('isClassroom', String(isClassroom))
  }, [isClassroom])

  useEffect(() => {
    if (currClass) {
      localStorage.setItem('currClass', JSON.stringify(currClass))
    } else {
      localStorage.removeItem('currClass')
    }
  }, [currClass])

  useEffect(() => {
    if (currFileItem) {
      localStorage.setItem('currFileItem', JSON.stringify(currFileItem))
    } else {
      localStorage.removeItem('currFileItem')
    }
  }, [currFileItem])

  const value = useMemo(() => ({
    isClassroom,
    setIsClassroom,
    currClass,
    setCurrClass,
    currFileItem,
    setCurrFileItem
  }), [isClassroom, currClass, currFileItem])

  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  )
}

export default ClassroomContext