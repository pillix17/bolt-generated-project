import * as TabsPrimitive from '@radix-ui/react-tabs'
import { Home, BarChart, User } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useHabitStore } from '@/store/habits'
import { HabitCard } from '../habit-card'
import { HabitStats } from '../stats/habit-stats'
import { ProfileSettings } from '../profile/profile-settings'

export function Tabs() {
  const { habits, incrementHabit, decrementHabit, reorderHabits } = useHabitStore()
  const activeHabits = habits.filter(h => !h.archived)

  const handleDragEnd = (result) => {
    if (!result.destination) return
    reorderHabits(result.source.index, result.destination.index)
  }

  return (
    <TabsPrimitive.Root defaultValue="home" className="h-full">
      <TabsPrimitive.Content value="home" className="pb-24">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Mes habitudes</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="habits">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {activeHabits.map((habit, index) => (
                    <Draggable 
                      key={habit.id} 
                      draggableId={habit.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <HabitCard
                            habit={habit}
                            onIncrement={() => incrementHabit(habit.id)}
                            onDecrement={() => decrementHabit(habit.id)}
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </TabsPrimitive.Content>

      <TabsPrimitive.Content value="stats" className="pb-24">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Statistiques</h1>
          <HabitStats habits={activeHabits} />
        </div>
      </TabsPrimitive.Content>

      <TabsPrimitive.Content value="profile" className="pb-24">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Profil</h1>
          <ProfileSettings />
        </div>
      </TabsPrimitive.Content>

      <TabsPrimitive.List className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-4">
        <TabsPrimitive.Trigger 
          value="home"
          className="flex flex-col items-center gap-1 text-sm text-gray-600 data-[state=active]:text-blue-600"
        >
          <Home size={24} />
          <span>Accueil</span>
        </TabsPrimitive.Trigger>
        
        <TabsPrimitive.Trigger 
          value="stats"
          className="flex flex-col items-center gap-1 text-sm text-gray-600 data-[state=active]:text-blue-600"
        >
          <BarChart size={24} />
          <span>Stats</span>
        </TabsPrimitive.Trigger>
        
        <TabsPrimitive.Trigger 
          value="profile"
          className="flex flex-col items-center gap-1 text-sm text-gray-600 data-[state=active]:text-blue-600"
        >
          <User size={24} />
          <span>Profil</span>
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}
