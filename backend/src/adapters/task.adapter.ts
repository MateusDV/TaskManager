import {TaskDTO} from "../dtos/tasks";
import {Task} from '../generated/prisma';

export default class TaskAdapter {
    static toDTO(task: Task): TaskDTO {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            isCompleted: task.isCompleted
        };
    }
}