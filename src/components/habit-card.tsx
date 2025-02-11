import { useState } from 'react'
import { Habit } from '@/store/habits'
import { Minus, Plus, GripVertical } from 'lucide-react'

interface HabitCardProps {
  habit: Habit
  onIncrement: () => void
  onDecrement: () => void
  isDragging?: boolean
  dragHandleProps?: any
}

export function HabitCard({ habit, onIncrement, onDecrement, isDragging, dragHandleProps }: HabitCardProps) {
  const progress = (habit.count / habit.goal) * 100

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-elegant transition-all duration-200 ${
        isDragging ? 'scale-105 rotate-2' : ''
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div {...dragHandleProps} className="cursor-grab hover:text-gray-600">
          <GripVertical size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{habit.name}</h3>
          <p className="text-sm text-gray-500">Objectif: {habit.goal}</p>
        </div>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
          style={{ 
            background: `linear-gradient(135deg, ${habit.color}20, ${habit.color}40)`,
            color: habit.color 
          }}
        >
          {habit.count}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            background: `linear-gradient(90deg, ${habit.color}, ${habit.color}dd)`
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-6">
        <button
          onClick={onDecrement}
          disabled={habit.count === 0}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus size={24} className="text-gray-600" />
        </button>
        
        <button
          onClick={onIncrement}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`
          }}
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  )
}
