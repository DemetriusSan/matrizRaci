import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import {
  RACIMatrix,
  RACITask,
  RACIAssignment,
  RACIRole,
  RACI_DEFINITIONS,
  RACIDefinition
} from '../models/raci.model';

@Injectable({
  providedIn: 'root'
})
export class RACIService {
  private matrices$ = new BehaviorSubject<RACIMatrix[]>([]);
  private currentMatrix$ = new BehaviorSubject<RACIMatrix | null>(null);

  constructor() {
    this.loadSampleData();
  }

  /**
   * Carrega dados de exemplo da Matriz RACI
   */
  private loadSampleData(): void {
    const sampleMatrix: RACIMatrix = {
      id: '1',
      name: 'Matriz RACI - Tribo Monetário (Domínio: Cartões)',
      description: 'Matriz de responsabilidades - Squad de Fatura e Squad de Produtos de Crédito',
      team: 'Tribo Monetário',
      department: 'Business Domain: Cartões',
      createdDate: new Date(),
      updatedDate: new Date(),
      stakeholders: [
        'PO (Product Owner)',
        'Tech Lead Cobol',
        'Dev Backend Pleno/Sênior',
        'Dev Cobol',
        'QA Automação',
        'Leader (Gestor de Time)',
        'DevOps (CI/CD)'
      ],
      tasks: [
        {
          id: '1',
          name: 'Definição de Requisitos - Fatura',
          description: 'Especificar funcionalidades e fluxos de faturamento de cartões',
          assignments: new Map([
            ['PO (Product Owner)', { id: '1-1', role: RACIRole.ACCOUNTABLE }],
            ['Tech Lead Cobol', { id: '1-2', role: RACIRole.CONSULTED }],
            ['Dev Backend Pleno/Sênior', { id: '1-3', role: RACIRole.CONSULTED }],
            ['Leader (Gestor de Time)', { id: '1-4', role: RACIRole.INFORMED }]
          ])
        },
        {
          id: '2',
          name: 'Implementação - Backend (Java/Node)',
          description: 'Desenvolver APIs e serviços de negócio para Fatura',
          assignments: new Map([
            ['Dev Backend Pleno/Sênior', { id: '2-1', role: RACIRole.RESPONSIBLE }],
            ['Tech Lead Cobol', { id: '2-2', role: RACIRole.CONSULTED }],
            ['Dev Cobol', { id: '2-3', role: RACIRole.INFORMED }],
            ['QA Automação', { id: '2-4', role: RACIRole.INFORMED }]
          ])
        },
        {
          id: '3',
          name: 'Integração com Sistema Legado (Cobol)',
          description: 'Conectar APIs ao sistema mainframe e COBOL',
          assignments: new Map([
            ['Tech Lead Cobol', { id: '3-1', role: RACIRole.ACCOUNTABLE }],
            ['Dev Cobol', { id: '3-2', role: RACIRole.RESPONSIBLE }],
            ['Dev Backend Pleno/Sênior', { id: '3-3', role: RACIRole.CONSULTED }],
            ['QA Automação', { id: '3-4', role: RACIRole.CONSULTED }]
          ])
        },
        {
          id: '4',
          name: 'Testes Automatizados (QA)',
          description: 'Automação de testes funcionais, integração e performance',
          assignments: new Map([
            ['QA Automação', { id: '4-1', role: RACIRole.RESPONSIBLE }],
            ['Dev Backend Pleno/Sênior', { id: '4-2', role: RACIRole.CONSULTED }],
            ['Tech Lead Cobol', { id: '4-3', role: RACIRole.CONSULTED }],
            ['PO (Product Owner)', { id: '4-4', role: RACIRole.ACCOUNTABLE }]
          ])
        },
        {
          id: '5',
          name: 'Deploy em Produção (Pipeline CI/CD)',
          description: 'Executar pipeline, testes de smoke e monitoramento',
          assignments: new Map([
            ['DevOps (CI/CD)', { id: '5-1', role: RACIRole.RESPONSIBLE }],
            ['Tech Lead Cobol', { id: '5-2', role: RACIRole.ACCOUNTABLE }],
            ['Dev Backend Pleno/Sênior', { id: '5-3', role: RACIRole.CONSULTED }],
            ['Leader (Gestor de Time)', { id: '5-4', role: RACIRole.INFORMED }]
          ])
        },
        {
          id: '6',
          name: 'Produtos de Crédito - Desenvolvimento',
          description: 'Criar novas funcionalidades de produtos de crédito (Squad 2)',
          assignments: new Map([
            ['Dev Backend Pleno/Sênior', { id: '6-1', role: RACIRole.RESPONSIBLE }],
            ['PO (Product Owner)', { id: '6-2', role: RACIRole.ACCOUNTABLE }],
            ['Tech Lead Cobol', { id: '6-3', role: RACIRole.CONSULTED }],
            ['QA Automação', { id: '6-4', role: RACIRole.CONSULTED }]
          ])
        }
      ]
    };

    this.matrices$.next([sampleMatrix]);
    this.currentMatrix$.next(sampleMatrix);
  }

  /**
   * Obtém todas as matrizes
   */
  getMatrices(): Observable<RACIMatrix[]> {
    return this.matrices$.asObservable();
  }

  /**
   * Obtém a matriz atual
   */
  getCurrentMatrix(): Observable<RACIMatrix | null> {
    return this.currentMatrix$.asObservable();
  }

  /**
   * Define a matriz atual
   */
  setCurrentMatrix(matrixId: string): void {
    const matrices = this.matrices$.value;
    const matrix = matrices.find(m => m.id === matrixId);
    if (matrix) {
      this.currentMatrix$.next(matrix);
    }
  }

  /**
   * Cria uma nova matriz RACI
   */
  createMatrix(name: string, team: string, department: string): RACIMatrix {
    const newMatrix: RACIMatrix = {
      id: Date.now().toString(),
      name,
      team,
      department,
      createdDate: new Date(),
      updatedDate: new Date(),
      stakeholders: [],
      tasks: []
    };

    const matrices = this.matrices$.value;
    matrices.push(newMatrix);
    this.matrices$.next(matrices);
    this.currentMatrix$.next(newMatrix);

    return newMatrix;
  }

  /**
   * Adiciona uma tarefa à matriz
   */
  addTask(task: RACITask): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix) {
      currentMatrix.tasks.push(task);
      currentMatrix.updatedDate = new Date();
      this.currentMatrix$.next({ ...currentMatrix });
      this.updateMatrixInList(currentMatrix);
    }
  }

  /**
   * Atualiza uma tarefa
   */
  updateTask(taskId: string, task: RACITask): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix) {
      const index = currentMatrix.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        currentMatrix.tasks[index] = task;
        currentMatrix.updatedDate = new Date();
        this.currentMatrix$.next({ ...currentMatrix });
        this.updateMatrixInList(currentMatrix);
      }
    }
  }

  /**
   * Remove uma tarefa
   */
  removeTask(taskId: string): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix) {
      currentMatrix.tasks = currentMatrix.tasks.filter(t => t.id !== taskId);
      currentMatrix.updatedDate = new Date();
      this.currentMatrix$.next({ ...currentMatrix });
      this.updateMatrixInList(currentMatrix);
    }
  }

  /**
   * Atualiza uma atribuição RACI
   */
  updateAssignment(taskId: string, stakeholder: string, assignment: RACIAssignment): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix) {
      const task = currentMatrix.tasks.find(t => t.id === taskId);
      if (task) {
        task.assignments.set(stakeholder, assignment);
        currentMatrix.updatedDate = new Date();
        this.currentMatrix$.next({ ...currentMatrix });
        this.updateMatrixInList(currentMatrix);
      }
    }
  }

  /**
   * Adiciona um stakeholder à matriz
   */
  addStakeholder(name: string): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix && !currentMatrix.stakeholders.includes(name)) {
      currentMatrix.stakeholders.push(name);
      currentMatrix.updatedDate = new Date();
      this.currentMatrix$.next({ ...currentMatrix });
      this.updateMatrixInList(currentMatrix);
    }
  }

  /**
   * Remove um stakeholder
   */
  removeStakeholder(name: string): void {
    const currentMatrix = this.currentMatrix$.value;
    if (currentMatrix) {
      currentMatrix.stakeholders = currentMatrix.stakeholders.filter(s => s !== name);
      currentMatrix.updatedDate = new Date();
      this.currentMatrix$.next({ ...currentMatrix });
      this.updateMatrixInList(currentMatrix);
    }
  }

  /**
   * Obtém definição de um papel RACI
   */
  getRACIDefinition(role: RACIRole | null): RACIDefinition | null {
    if (!role) return null;
    return RACI_DEFINITIONS[role];
  }

  /**
   * Valida a matriz RACI
   */
  validateMatrix(matrix: RACIMatrix): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar se há stakeholders
    if (matrix.stakeholders.length === 0) {
      errors.push('A matriz deve ter pelo menos um stakeholder');
    }

    // Verificar se há tarefas
    if (matrix.tasks.length === 0) {
      errors.push('A matriz deve ter pelo menos uma tarefa');
    }

    // Validar atribuições
    matrix.tasks.forEach(task => {
      const assignments = Array.from(task.assignments.values());
      const accountableCount = assignments.filter(a => a.role === RACIRole.ACCOUNTABLE).length;
      const responsibleCount = assignments.filter(a => a.role === RACIRole.RESPONSIBLE).length;

      if (accountableCount === 0) {
        errors.push(`Tarefa "${task.name}" não tem um responsável pela autoridade (A)`);
      }
      if (accountableCount > 1) {
        errors.push(`Tarefa "${task.name}" tem mais de um responsável pela autoridade (A)`);
      }
      if (responsibleCount === 0) {
        errors.push(`Tarefa "${task.name}" não tem ninguém responsável (R) pela execução`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Exporta a matriz para JSON
   */
  exportToJSON(matrix: RACIMatrix): string {
    const exportData = {
      ...matrix,
      tasks: matrix.tasks.map(task => ({
        ...task,
        assignments: Array.from(task.assignments.entries()).map(([stakeholder, assignment]) => ({
          stakeholder,
          ...assignment
        }))
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Exporta a matriz para Excel
   */
  exportToExcel(matrix: RACIMatrix): void {

    // Preparar dados para a planilha
    const headers = ['Tarefa', ...matrix.stakeholders];
    const rows: any[] = [];

    // Adicionar linhas de tarefas
    matrix.tasks.forEach(task => {
      const row: any = { 'Tarefa': task.name };
      matrix.stakeholders.forEach(stakeholder => {
        const assignment = task.assignments.get(stakeholder);
        row[stakeholder] = assignment?.role || '-';
      });
      rows.push(row);
    });

    // Adicionar linha de resumo
    const summaryRow: any = { 'Tarefa': 'RESUMO' };
    matrix.stakeholders.forEach(stakeholder => {
      const r = rows.filter(row => row[stakeholder] === 'R').length;
      const a = rows.filter(row => row[stakeholder] === 'A').length;
      const c = rows.filter(row => row[stakeholder] === 'C').length;
      const i = rows.filter(row => row[stakeholder] === 'I').length;
      summaryRow[stakeholder] = `R:${r} A:${a} C:${c} I:${i}`;
    });
    rows.push(summaryRow);

    // Criar workbook
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Matriz RACI');

    // Estilizar colunas
    const colWidths = [{ wch: 30 }, ...matrix.stakeholders.map(() => ({ wch: 20 }))];
    ws['!cols'] = colWidths;

    // Fazer download
    XLSX.writeFile(wb, `raci-${matrix.id}-${Date.now()}.xlsx`);
  }

  /**
   * Atualiza a matriz na lista
   */
  private updateMatrixInList(updatedMatrix: RACIMatrix): void {
    const matrices = this.matrices$.value.map(m => m.id === updatedMatrix.id ? updatedMatrix : m);
    this.matrices$.next(matrices);
  }
}
