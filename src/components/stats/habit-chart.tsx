import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Habit } from '@/store/habits'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface HabitChartProps {
  habit: Habit
  days: number
}

export function HabitChart({ habit, days }: HabitChartProps) {
  const today = new Date().toLocaleDateString()
  
  const data = habit.history
    .slice(-days)
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      count: entry.count
    }))

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: habit.name,
        data: data.map(d => d.count),
        borderColor: habit.color,
        backgroundColor: habit.color + '40',
        tension: 0.3,
        pointBackgroundColor: data.map(d => 
          d.date === today ? '#FFFFFF' : habit.color
        ),
        pointBorderColor: data.map(d => 
          d.date === today ? habit.color : habit.color
        ),
        pointBorderWidth: data.map(d => 
          d.date === today ? 3 : 1
        ),
        pointRadius: data.map(d => 
          d.date === today ? 6 : 4
        ),
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">{habit.name}</h3>
      <Line 
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(habit.goal, ...data.map(d => d.count))
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y;
                  const percentage = (value / habit.goal) * 100;
                  return `${value} (${percentage.toFixed(0)}% de l'objectif)`;
                }
              }
            }
          }
        }}
      />
    </div>
  )
}
