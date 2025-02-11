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

// Check if it's a new day and reset habits if needed
const checkAndResetHabits = (habits: Habit[]) => {
  const lastResetDate = localStorage.getItem('lastResetDate')
  const today = new Date().toDateString()

  if (lastResetDate !== today) {
    // Save yesterday's counts to history before resetting
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const updatedHabits = habits.map(habit => ({
      ...habit,
      history: [
        ...habit.history,
        { date: yesterdayStr, count: habit.count }
      ],
      count: 0
    }))

    localStorage.setItem('lastResetDate', today)
    return updatedHabits
  }

  return habits
}

export const useHabitStore = create<HabitStore>()(
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
            return {
              ...habit,
              count: habit.count + 1
            }
          }
          return habit
        })
        return { habits: updatedHabits }
      }),
      
      decrementHabit: (habitId) => set((state) => {
        const updatedHabits = state.habits.map(habit => {
          if (habit.id === habitId && habit.count > 0) {
            return {
              ...habit,
              count: habit.count - 1
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
        return { 
          habits: result.map((habit, index) => ({
            ...habit,
            order: index
          }))
        }
      }),
      
      resetDailyHabits: () => set((state) => ({
        habits: checkAndResetHabits(state.habits)
      }))
    }),
    {
      name: 'habits-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)
          return {
            ...data,
            state: {
              ...data.state,
              habits: checkAndResetHabits(data.state.habits)
            }
          }
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)

// Initialize daily reset check
const initializeDailyReset = () => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const timeUntilMidnight = tomorrow.getTime() - now.getTime()
  
  setTimeout(() => {
    useHabitStore.getState().resetDailyHabits()
    initializeDailyReset() // Set up next day's check
  }, timeUntilMidnight)
}

initializeDailyReset()
