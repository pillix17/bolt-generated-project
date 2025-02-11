import { Habit } from '@/store/habits'

interface HabitCalendarProps {
  habit: Habit
}

export function HabitCalendar({ habit }: HabitCalendarProps) {
  const getDaysInMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDay }, (_, i) => i)
  const today = new Date().getDate()

  const getProgressForDay = (day: number) => {
    const date = new Date()
    const dateStr = new Date(date.getFullYear(), date.getMonth(), day).toISOString().split('T')[0]
    const historyEntry = habit.history.find(h => h.date === dateStr)
    return historyEntry ? historyEntry.count / habit.goal : 0
  }

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-1">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(day => (
          <div key={`empty-${day}`} className="aspect-square bg-gray-100 rounded-lg opacity-50" />
        ))}
        
        {days.map(day => {
          const progress = getProgressForDay(day)
          const isToday = today === day
          const isFuture = day > today
          
          return (
            <div
              key={day}
              className={`
                aspect-square rounded-lg flex items-center justify-center relative group
                ${isToday ? 'ring-2 ring-offset-2' : ''} 
                ${isFuture ? 'opacity-25' : ''}
              `}
              style={{ 
                backgroundColor: `${habit.color}${Math.max(20, Math.floor(progress * 100))}`,
                ringColor: habit.color,
              }}
            >
              <span 
                className={`
                  text-sm font-medium z-10
                  ${progress > 0.5 ? 'text-white' : 'text-gray-700'}
                `}
              >
                {day}
              </span>
              
              {/* Tooltip */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-20">
                {Math.round(progress * 100)}% complété
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
