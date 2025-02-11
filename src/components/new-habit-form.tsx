import { useState } from 'react'

interface NewHabitFormProps {
  onSubmit: (name: string, goal: number) => void
  onCancel: () => void
}

export function NewHabitForm({ onSubmit, onCancel }: NewHabitFormProps) {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name, goal)
      setName('')
      setGoal(1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          placeholder="Enter habit name"
        />
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          Daily Goal
        </label>
        <input
          type="number"
          id="goal"
          min="1"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
