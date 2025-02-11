import { useState } from 'react'
import { useHabitStore } from '@/store/habits'
import { Plus, Archive, RefreshCw, Trash2 } from 'lucide-react'
import { NewHabitForm } from '../new-habit-form'

export function ProfileSettings() {
  const [showNewHabitForm, setShowNewHabitForm] = useState(false)
  const { habits, archiveHabit, deleteHabit, reactivateHabit } = useHabitStore()
  
  const activeHabits = habits.filter(h => !h.archived)
  const archivedHabits = habits.filter(h => h.archived)

  return (
    <div className="p-4 space-y-8 pb-24">
      <div>
        <button
          onClick={() => setShowNewHabitForm(!showNewHabitForm)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <Plus size={24} />
          <span className="font-medium">Ajouter une habitude</span>
        </button>
        
        {showNewHabitForm && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-elegant">
            <NewHabitForm 
              onSubmit={(name, goal) => {
                useHabitStore.getState().addHabit(name, goal)
                setShowNewHabitForm(false)
              }}
              onCancel={() => setShowNewHabitForm(false)}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Habitudes actives</h3>
        <div className="space-y-3">
          {activeHabits.map(habit => (
            <div 
              key={habit.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="font-medium">{habit.name}</span>
              </div>
              <button
                onClick={() => archiveHabit(habit.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Archive size={20} className="text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {archivedHabits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Habitudes archivées</h3>
          <div className="space-y-3">
            {archivedHabits.map(habit => (
              <div 
                key={habit.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full opacity-50"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-gray-500">{habit.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => reactivateHabit(habit.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RefreshCw size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
