import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {
  MatTableModule
} from '@angular/material/table';
import {TasksService} from '../../services/tasks/tasks.service';
import {Task} from '../../models/task/task'
import {MatList, MatListItem, MatListModule} from '@angular/material/list';
import {DatePipe, NgIf} from '@angular/common';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatHint, MatLabel} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {LoadingService} from '../../services/utils/loading/loading.service';
import {AlertService} from '../../services/utils/alert/alert.service';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {StatusTextPipe} from '../../utils/pipes/status/status-text.pipe';

@Component({
  selector: 'app-tasks',
  imports: [
    MatTableModule,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatList,
    MatListItem,
    DatePipe,
    MatListModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatLabel,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    MatDatepickerInput,
    MatHint,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    NgIf,
    MatIconButton,
    MatButtonModule,
    MatCheckbox,
    MatCheckboxModule,
    StatusTextPipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  readonly tasksService = inject(TasksService);
  readonly loadingService = inject(LoadingService);
  readonly alertsService = inject(AlertService);
  readonly builder = inject(FormBuilder);


  taskId = signal<number|null>(null);
  formIsOpen = computed<boolean>(() => this.taskId() !== null);
  isEditForm = computed<boolean>(() => (this.taskId() ?? 0) > 0);

  taskModel: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date(),
    isCompleted: false
  }

  tasks: Task[] = [];

  taskForm = this.builder.group({
    id: [this.taskModel.id],
    title: [this.taskModel.title, Validators.required],
    description: [this.taskModel.description, Validators.required],
    dueDate: [this.taskModel.dueDate, Validators.required,],
    isCompleted: [this.taskModel.isCompleted],
  });

  constructor() { }

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.loadingService.startLoading();
    this.tasks = await this.tasksService.getAll();
    this.loadingService.stopLoading();
  }

  async onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }

    const task = this.taskForm.value as Task;

    const result = this.isEditForm()
      ? await this.tasksService.edit(task)
      : await this.tasksService.add(task);

    if (result) {
      this.alertsService.open(this.isEditForm() ? "Task updated successfully" : "Task added successfully.");
      this.taskId.set(null);
      this.taskForm.reset();
      await this.loadTasks();
      return;
    }

    this.alertsService.open("Task was not added, please try again.");
  }

  openNewTask() {
    this.taskId.set(0);
    this.taskForm.reset();
  }

  openEditTask(taskId: number) {
    const task = this.tasks.find((t) => t.id === taskId);
    this.taskId.set(taskId);
    if (task) {
      this.taskForm.setValue(task);
    }
  }

  cancel(){
    this.taskForm.reset();
    this.taskId.set(null);
  }

  async deleteTask(taskId: number) {
    // TODO: Move to AlertService and use Angular Material dialog
    const confirmation = confirm("Are you sure you want to delete this task?");
    if (!confirmation) {
      return;
    }

    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      this.alertsService.open("Task not found.");
      return;
    }

    const result = await this.tasksService.delete(task);
    if (result) {
      this.alertsService.open("Task was deleted successfully.");
      await this.loadTasks();
      return;
    }

    this.alertsService.open(`Failed to delete task ${task.title}. Try again later.`);
  }
}
