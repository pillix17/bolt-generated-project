import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface HabitEntry {
  date: string
  count: number
}

export interface Habit {
  id: string
  name: string
  count: number
  goal: number
  color: string
  archived: boolean
  history: HabitEntry[]
  order: number
}

interface HabitStore {
  habits: Habit[]
  addHabit: (name: string, goal: number) => void
  incrementHabit: (habitId: string) => void
  decrementHabit: (habitId: string) => void
  archiveHabit: (habitId: string) => void
  reactivateHabit: (habitId: string) => void
  deleteHabit: (habitId: string) => void
  reorderHabits: (startIndex: number, endIndex: number) => void
  resetDailyHabits: () => void
}

const generateRandomColor = () => {
  const vibrantColors = [
    '#FF6B6B',  // Coral Red
    '#4ECDC4',  // Turquoise
    '#45B7D1',  // Sky Blue
    '#FDCB6E',  // Sunflower Yellow
    '#6C5CE7',  // Purple
    '#A8E6CF',  // Mint Green
    '#FF8ED4',  // Pink
  ]
  return vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
}

export const useHabitStore = create<HabitStore>(
  persist(
    (set, get) => ({
      habits: [],
      
      addHabit: (name, goal) => set((state) => ({
        habits: [...state.habits, {
          id: crypto.randomUUID(),
          name,
          count: 0,
          goal,
          color: generateRandomColor(),
          archived: false,
          history: [],
          order: state.habits.length
        }]
      })),
      
      incrementHabit: (habitId) => set((state) => {
        const updatedHabits = state.habits.map(habit => {
          if (habit.id === habitId) {
            const newCount = habit.count + 1
            const today = new Date().toISOString().split('T')[0]
            
            const existingHistoryIndex = habit.history.findIndex(h => h.date === today)
            const updatedHistory = [...habit.history]
            
            if (existingHistoryIndex !== -1) {
              updatedHistory[existingHistoryIndex] = { 
                date: today, 
                count: newCount 
              }
            } else {
              updatedHistory.push({ 
                date: today, 
                count: newCount 
              })
            }
            
            return { 
              ...habit, 
              count: newCount,
              history: updatedHistory
            }
          }
          return habit
        })
        
        return { habits: updatedHabits }
      }),
      
      decrementHabit: (habitId) => set((state) => {
        const updatedHabits = state.habits.map(habit => {
          if (habit.id === habitId && habit.count > 0) {
            const newCount = habit.count - 1
            const today = new Date().toISOString().split('T')[0]
            
            const existingHistoryIndex = habit.history.findIndex(h => h.date === today)
            const updatedHistory = [...habit.history]
            
            if (existingHistoryIndex !== -1) {
              updatedHistory[existingHistoryIndex] = { 
                date: today, 
                count: newCount 
              }
            } else {
              updatedHistory.push({ 
                date: today, 
                count: newCount 
              })
            }
            
            return { 
              ...habit, 
              count: newCount,
              history: updatedHistory
            }
          }
          return habit
        })
        
        return { habits: updatedHabits }
      }),
      
      archiveHabit: (habitId) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === habitId 
            ? { ...habit, archived: true } 
            : habit
        )
      })),

      reactivateHabit: (habitId) => set((state) => ({
        habits: state.habits.map(habit => 
          habit.id === habitId 
            ? { ...habit, archived: false } 
            : habit
        )
      })),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== habitId)
      })),

      reorderHabits: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.habits)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return { habits: result }
      }),
      
      resetDailyHabits: () => set((state) => ({
        habits: state.habits.map(habit => ({
          ...habit,
          count: 0
        }))
      }))
    }),
    {
      name: 'habit-tracker-storage',
      getStorage: () => localStorage
    }
  )
)
