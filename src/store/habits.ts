import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Habit, HabitEntry } from '@/types'

interface HabitStore {
  habits: Habit[];
  addHabit: (name: string, goal: number) => void;
  incrementHabit: (habitId: string) => void;
  decrementHabit: (habitId: string) => void;
  archiveHabit: (habitId: string) => void;
  reactivateHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  reorderHabits: (startIndex: number, endIndex: number) => void;
  resetDailyHabits: () => void;
}

const generateRandomColor = (): string => {
  const vibrantColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FDCB6E',
    '#6C5CE7',
    '#A8E6CF',
    '#FF8ED4',
  ]
  return vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
}

const checkAndResetHabits = (habits: Habit[]): Habit[] => {
  const lastResetDate = localStorage.getItem('lastResetDate')
  const today = new Date().toDateString()

  if (lastResetDate !== today) {
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
    (set) => ({
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
      
      incrementHabit: (habitId) => set((state) => ({
        habits: state.habits.map(habit =>
          habit.id === habitId
            ? { ...habit, count: habit.count + 1 }
            : habit
        )
      })),
      
      decrementHabit: (habitId) => set((state) => ({
        habits: state.habits.map(habit =>
          habit.id === habitId && habit.count > 0
            ? { ...habit, count: habit.count - 1 }
            : habit
        )
      })),
      
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
        getItem: (name): string | null => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const data = JSON.parse(str)
          return JSON.stringify({
            ...data,
            state: {
              ...data.state,
              habits: checkAndResetHabits(data.state.habits)
            }
          })
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
)

const initializeDailyReset = (): void => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  
  const timeUntilMidnight = tomorrow.getTime() - now.getTime()
  
  setTimeout(() => {
    useHabitStore.getState().resetDailyHabits()
    initializeDailyReset()
  }, timeUntilMidnight)
}

initializeDailyReset()
