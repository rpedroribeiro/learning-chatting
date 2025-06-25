import { createContext, useMemo, useState, type ReactNode } from "react"

type ClassroomContextType = {
  isClassroom: boolean;
  setIsClassroom: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined)

type ClasroomContextChildren = {
  children: ReactNode
}

export const ClassroomProvider = ({children}: ClasroomContextChildren) => {
  const [isClassroom, setIsClassroom] = useState<boolean>(false)
  const value = useMemo(() => ({
    isClassroom,
    setIsClassroom
  }), [isClassroom])

  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  )
}

export default ClassroomContext
