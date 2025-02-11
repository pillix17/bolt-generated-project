import { useState } from 'react'

interface StatsViewSwitchProps {
  onViewChange: (view: 'line' | 'calendar') => void
}

export function StatsViewSwitch({ onViewChange }: StatsViewSwitchProps) {
  const [isCalendarView, setIsCalendarView] = useState(false)

  const handleToggle = () => {
    setIsCalendarView(!isCalendarView)
    onViewChange(isCalendarView ? 'line' : 'calendar')
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <span className={`text-sm ${!isCalendarView ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
        Line Chart
      </span>
      <button
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors"
        role="switch"
        aria-checked={isCalendarView}
      >
        <span
          className={`${
            isCalendarView ? 'translate-x-6 bg-blue-600' : 'translate-x-1 bg-gray-500'
          } inline-block h-4 w-4 transform rounded-full transition-transform`}
        />
      </button>
      <span className={`text-sm ${isCalendarView ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
        Calendar
      </span>
    </div>
  )
}
