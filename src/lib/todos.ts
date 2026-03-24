export type Priority = 'low' | 'medium' | 'high'
export type StatusFilter = 'all' | 'active' | 'completed'
export type DeadlineFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'none'
export type GroupBy = 'none' | 'group' | 'priority' | 'deadline' | 'status'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  deadline: string
  group: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TodoForm {
  title: string
  description: string
  priority: Priority
  deadline: string
  group: string
}

export interface TodoSection {
  key: string
  label: string
  order: number
  items: Todo[]
}

export interface SelectOption<T extends string> {
  label: string
  value: T
}

export const priorityOptions: SelectOption<Priority>[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

export const groupByOptions: SelectOption<GroupBy>[] = [
  { label: 'No grouping', value: 'none' },
  { label: 'Group', value: 'group' },
  { label: 'Priority', value: 'priority' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Status', value: 'status' },
]

export const statusOptions: SelectOption<StatusFilter>[] = [
  { label: 'All tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export const deadlineOptions: SelectOption<DeadlineFilter>[] = [
  { label: 'Any deadline', value: 'all' },
  { label: 'Due today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'No deadline', value: 'none' },
]
