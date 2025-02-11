import { useState } from 'react'
import { Habit } from '@/store/habits'
import { HabitChart } from './habit-chart'
import { HabitCalendar } from './habit-calendar'
import { HabitFilter } from './habit-filter'

export function HabitStats({ habits }) {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  const filteredHabits = selectedHabits.length 
    ? habits.filter(habit => selectedHabits.includes(habit.id))
    : habits

  return (
    <div className="p-4">
      <HabitFilter 
        habits={habits}
        selectedHabits={selectedHabits}
        onToggleHabit={(habitId) => {
          setSelectedHabits(prev => 
            prev.includes(habitId)
              ? prev.filter(id => id !== habitId)
              : [...prev, habitId]
          )
        }}
      />

      <div className="space-y-8">
        {filteredHabits.map(habit => (
          <div 
            key={habit.id} 
            className="bg-white rounded-2xl p-6 shadow-elegant"
          >
            <h3 
              className="text-xl font-bold mb-6" 
              style={{ color: habit.color }}
            >
              {habit.name}
            </h3>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Progression sur 30 jours
                </h4>
                <HabitChart habit={habit} days={30} />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Calendrier du mois
                </h4>
                <HabitCalendar habit={habit} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
