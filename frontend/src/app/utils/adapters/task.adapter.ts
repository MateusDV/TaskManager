import {Task, TaskCreateDTO} from '../../models/task/task';

export default class TaskAdapter {
  static toTaskCreateDTO(task: Task): TaskCreateDTO{
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    }
  }
}
