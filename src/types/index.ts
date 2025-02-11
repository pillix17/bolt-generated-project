export interface HabitEntry {
  date: string;
  count: number;
}

export interface Habit {
  id: string;
  name: string;
  count: number;
  goal: number;
  color: string;
  archived: boolean;
  history: HabitEntry[];
  order: number;
}

export interface HabitCardProps {
  habit: Habit;
  onIncrement: () => void;
  onDecrement: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export interface HabitFilterProps {
  habits: Habit[];
  selectedHabits: string[];
  onToggleHabit: (habitId: string) => void;
}

export interface HabitStatsProps {
  habits: Habit[];
}

export interface LayoutProps {
  children: React.ReactNode;
}
