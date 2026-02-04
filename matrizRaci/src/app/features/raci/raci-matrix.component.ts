import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { RACIService } from '../../shared/services/raci.service';
import { RACIMatrix, RACIRole, RACITask, RACIAssignment, RACI_DEFINITIONS } from '../../shared/models/raci.model';

@Component({
  selector: 'app-raci-matrix',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './raci-matrix.component.html',
  styleUrls: ['./raci-matrix.component.scss']
})
export class RACIMatrixComponent implements OnInit, OnDestroy {
  matrix: RACIMatrix | null = null;
  RACIRole = RACIRole;
  RACI_DEFINITIONS = RACI_DEFINITIONS;

  newTaskName = '';
  newTaskDescription = '';
  newStakeholder = '';
  selectedTaskId: string | null = null;
  showAddTaskForm = false;
  showAddStakeholderForm = false;
  validationErrors: string[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private raciService: RACIService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.raciService.getCurrentMatrix().subscribe(matrix => {
        this.matrix = matrix;
        this.validateMatrix();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Abre o formulário para adicionar tarefa
   */
  openAddTaskForm(): void {
    this.showAddTaskForm = true;
    this.newTaskName = '';
    this.newTaskDescription = '';
  }

  /**
   * Cancela o formulário de nova tarefa
   */
  cancelAddTask(): void {
    this.showAddTaskForm = false;
    this.newTaskName = '';
    this.newTaskDescription = '';
  }

  /**
   * Adiciona uma nova tarefa
   */
  addTask(): void {
    if (!this.newTaskName.trim()) {
      alert('Nome da tarefa é obrigatório');
      return;
    }

    const newTask: RACITask = {
      id: Date.now().toString(),
      name: this.newTaskName,
      description: this.newTaskDescription,
      assignments: new Map()
    };

    this.raciService.addTask(newTask);
    this.cancelAddTask();
  }

  /**
   * Remove uma tarefa
   */
  removeTask(taskId: string): void {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      this.raciService.removeTask(taskId);
      this.selectedTaskId = null;
    }
  }

  /**
   * Abre o formulário para adicionar stakeholder
   */
  openAddStakeholderForm(): void {
    this.showAddStakeholderForm = true;
    this.newStakeholder = '';
  }

  /**
   * Cancela o formulário de novo stakeholder
   */
  cancelAddStakeholder(): void {
    this.showAddStakeholderForm = false;
    this.newStakeholder = '';
  }

  /**
   * Adiciona um novo stakeholder
   */
  addStakeholder(): void {
    if (!this.newStakeholder.trim()) {
      alert('Nome do stakeholder é obrigatório');
      return;
    }

    this.raciService.addStakeholder(this.newStakeholder);
    this.cancelAddStakeholder();
  }

  /**
   * Remove um stakeholder
   */
  removeStakeholder(name: string): void {
    if (confirm(`Tem certeza que deseja remover ${name}?`)) {
      this.raciService.removeStakeholder(name);
    }
  }

  /**
   * Alterna o papel RACI de uma célula
   */
  toggleRole(taskId: string, stakeholder: string): void {
    if (!this.matrix) return;

    const task = this.matrix.tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentAssignment = task.assignments.get(stakeholder);
    const currentRole = currentAssignment?.role || null;
    const nextRole = this.getNextRole(currentRole);

    const assignment: RACIAssignment = {
      id: currentAssignment?.id || `${taskId}-${stakeholder}`,
      role: nextRole
    };

    this.raciService.updateAssignment(taskId, stakeholder, assignment);
  }

  /**
   * Obtém o próximo papel na sequência
   */
  private getNextRole(currentRole: RACIRole | null): RACIRole | null {
    const roles = [null, RACIRole.RESPONSIBLE, RACIRole.ACCOUNTABLE, RACIRole.CONSULTED, RACIRole.INFORMED];
    const currentIndex = roles.indexOf(currentRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    return roles[nextIndex];
  }

  /**
   * Obtém a cor de fundo de uma célula
   */
  getCellBackgroundColor(role: RACIRole | null): string {
    if (!role) return '#f5f5f5';
    return RACI_DEFINITIONS[role].color;
  }

  /**
   * Obtém a cor do texto de uma célula
   */
  getCellTextColor(role: RACIRole | null): string {
    if (!role) return '#333333';
    return RACI_DEFINITIONS[role].textColor;
  }

  /**
   * Valida a matriz
   */
  validateMatrix(): void {
    if (!this.matrix) return;
    const validation = this.raciService.validateMatrix(this.matrix);
    this.validationErrors = validation.errors;
  }

  /**
   * Exporta a matriz para JSON
   */
  exportToJSON(): void {
    if (!this.matrix) return;
    const json = this.raciService.exportToJSON(this.matrix);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raci-${this.matrix.id}-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Exporta a matriz para Excel
   */
  exportToExcel(): void {
    if (!this.matrix) return;
    this.raciService.exportToExcel(this.matrix);
  }

  /**
   * Obtém a atribuição de um stakeholder para uma tarefa
   */
  getAssignment(taskId: string, stakeholder: string) {
    if (!this.matrix) return null;
    const task = this.matrix.tasks.find(t => t.id === taskId);
    return task?.assignments.get(stakeholder) || null;
  }

  /**
   * Obtém a tarefa selecionada
   */
  getSelectedTask() {
    if (!this.matrix || !this.selectedTaskId) return null;
    return this.matrix.tasks.find(t => t.id === this.selectedTaskId);
  }

  /**
   * Obtém a contagem de cada papel por stakeholder
   */
  getRoleCount(stakeholder: string, role: RACIRole): number {
    if (!this.matrix) return 0;
    return this.matrix.tasks.filter(task => {
      const assignment = task.assignments.get(stakeholder);
      return assignment?.role === role;
    }).length;
  }
}
