import { format } from 'date-fns'
import { Trash2, Edit, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Task {
  id: string
  description: string
  date: string
  status: 'PENDING' | 'COMPLETED'
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const startTime = format(new Date(task.date), 'HH:mm')
  const endTime = format(new Date(new Date(task.date).getTime() + 30 * 60000), 'HH:mm')
  const displayTime = `${startTime} - ${endTime}`

  return (
    <div className="flex items-center justify-between rounded-md border-2 border-os-border bg-os-primary p-3 text-os-text">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold">{displayTime}</span>
        <p className="font-semibold">{task.description}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-os-text hover:bg-black/10">
          <Trash2 size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-os-text hover:bg-black/10">
          <Edit size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-os-text hover:bg-black/10">
          <Star size={18} />
        </Button>
        <div className="ml-2 flex items-center gap-1">
          <div className="h-2.5 w-2.5 rounded-full border border-os-border"></div>
          <div className="h-2.5 w-2.5 rounded-full border border-os-border"></div>
        </div>
      </div>
    </div>
  )
}