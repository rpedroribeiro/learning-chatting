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

const classDaysMapping: Dictionary = {
  "MWF": ["Monday", "Wednesday", "Friday"],
  "TuTh": ["Tuesday", "Thursday"],
  "MW": ["Monday", "Wednesday"]
}

/**
 * This function takes in the UTC time and converts it into
 * PDT for display as Date objects are stored in UTC time.
 * 
 * @param timeString - The UTC time to be converted
 * @returns - The PDT time
 */
const convertUtcToPdt = (timeString: string): string => {
  let [hour, minute] = timeString.split(":").map(Number);
  hour -= 8;
  if (hour < 0) {
    hour += 24;
  }
  const hourStr = hour.toString().padStart(2, "0")
  const minuteStr = minute.toString().padStart(2, "0")
  return `${hourStr}:${minuteStr}`
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
    const pdtStartTime = convertUtcToPdt(startTime)
    const pdtEndTime = convertUtcToPdt(endTime)
    newHours.push(`${pdtStartTime} - ${pdtEndTime}`)

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
  formatClassTimes,
  classDaysMapping
}

export default classesUtils