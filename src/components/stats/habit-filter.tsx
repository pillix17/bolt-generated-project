import { Habit } from '@/store/habits'

interface HabitFilterProps {
  habits: Habit[]
  selectedHabits: string[]
  onToggleHabit: (habitId: string) => void
}

export function HabitFilter({ habits, selectedHabits, onToggleHabit }: HabitFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {habits.map(habit => (
        <button
          key={habit.id}
          onClick={() => onToggleHabit(habit.id)}
          className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-200 ${
            selectedHabits.includes(habit.id)
              ? 'text-white shadow-md scale-105'
              : 'text-gray-600 bg-transparent border-2 border-gray-200 hover:border-gray-300'
          }`}
          style={{
            backgroundColor: selectedHabits.includes(habit.id) ? habit.color : undefined
          }}
        >
          {habit.name}
        </button>
      ))}
    </div>
  )
}
