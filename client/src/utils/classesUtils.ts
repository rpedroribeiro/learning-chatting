interface Dictionary {
    [key: string]: any
}

const weekdayMapping: Dictionary = {
  "1": "Su",
  "2": "M",
  "3": "T",
  "4": "W",
  "5": "Th",
  "6": "F",
  "7": "Sa"
}

/**
 * This function takes all the classes and cycles through their starting
 * times and ending times to create a list of days and hours than can be
 * neatly presented in the class card.
 * 
 * @param classes - An array of all the classes.
 * @returns - An array of the newly formatted days of the week and class
 * hours.
 */
const formatClassTimes = (classes: any[]): [string[], string[]] => {
  const newDays: string[] = []
  const newHours: string[] = []

  classes.forEach((currClass: any) => {
    const startTime = String(currClass.startTimes[0]).substring(11, 16)
    const endTime = String(currClass.endTimes[0]).substring(11, 16)
    newHours.push(`${startTime} - ${endTime}`)

    let weekdayInitials = ""
    currClass.startTimes.forEach((time: string) => {
      const date = new Date(time)
      const currDay = date.getUTCDate()
      const weekday = weekdayMapping[currDay]
      weekdayInitials += weekday
    })
    newDays.push(weekdayInitials)
  })

  return [newDays, newHours]
}

const classesUtils = {
  formatClassTimes
}

export default classesUtils