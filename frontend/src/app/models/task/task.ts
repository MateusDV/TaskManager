export interface Task {
  id: number,
  title: string,
  description: string,
  dueDate: Date,
  isCompleted: boolean,
}

export interface TaskCreateDTO {
  id: number,
  title: string,
  description: string,
  dueDate: Date,
}
