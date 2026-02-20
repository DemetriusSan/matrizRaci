import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';

import { PermutationService } from '../../shared/services/permutation.service';
import { Variable, Partition, PermutationResult } from '../../shared/models/permutation.model';

@Component({
  selector: 'app-permutation-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './permutation-test.html',
  styleUrl: './permutation-test.scss',
})
export class PermutationTestComponent implements OnInit {
  inputVariables: Variable[] = [];
  outputVariables: Variable[] = [];
  results: PermutationResult[] = [];

  inputText = '';
  outputText = '';

  displayedColumns: string[] = [];
  errors: string[] = [];
  totalCombinations = 0;
  showResults = false;

  // Edição manual
  editingCell: { resultId: string; column: string } | null = null;
  editingValue = '';

  constructor(private permutationService: PermutationService) {}

  ngOnInit(): void {
    // Inicializa vazio
  }

  // ==================== Parsing de Texto ====================

  parseInputText(): void {
    this.inputVariables = this.parseText(this.inputText, 'input');
  }

  parseOutputText(): void {
    this.outputVariables = this.parseText(this.outputText, 'output');
  }

  private parseText(text: string, prefix: string): Variable[] {
    if (!text || text.trim() === '') {
      return [];
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const variables: Variable[] = [];

    lines.forEach((line, lineIndex) => {
      const parts = line.split(';').map(part => part.trim()).filter(part => part !== '');

      if (parts.length === 0) {
        return;
      }

      const variableName = parts[0];
      const partitionValues = parts.slice(1);

      if (partitionValues.length === 0) {
        return;
      }

      const variable: Variable = {
        id: `${prefix}-${Date.now()}-${lineIndex}`,
        name: variableName,
        partitions: partitionValues.map((value, index) => ({
          id: `partition-${Date.now()}-${lineIndex}-${index}`,
          label: value,
          value: value,
        })),
      };

      variables.push(variable);
    });

    return variables;
  }

  // ==================== Geração de Permutações ====================

  generatePermutations(): void {
    this.errors = [];

    // Faz parsing dos textos
    this.parseInputText();
    this.parseOutputText();

    // Valida variáveis de entrada
    const inputErrors = this.permutationService.validateVariables(this.inputVariables);
    const outputErrors = this.permutationService.validateVariables(this.outputVariables);

    this.errors = [...inputErrors, ...outputErrors];

    if (this.errors.length > 0) {
      return;
    }

    // Gera permutações
    this.results = this.permutationService.generatePermutations(
      this.inputVariables,
      this.outputVariables
    );

    // Calcula total de combinações
    this.totalCombinations = this.permutationService.calculateTotalCombinations(
      this.inputVariables
    );

    // Prepara colunas da tabela
    this.prepareTableColumns();

    this.showResults = true;
  }

  private prepareTableColumns(): void {
    this.displayedColumns = [
      'id',
      ...this.inputVariables.map((v) => v.name),
      ...this.outputVariables.map((v) => `esperado_${v.name}`),
    ];
  }

  // ==================== Exportação ====================

  exportToExcel(): void {
    if (this.results.length === 0) {
      return;
    }

    const tableData = this.permutationService.exportToTableFormat(this.results);
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Ajusta largura das colunas
    const colWidths = Object.keys(tableData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Permutações');

    const fileName = `permutacao-testes-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  exportToJson(): void {
    if (this.results.length === 0) {
      return;
    }

    const exportData = this.permutationService.prepareExport(
      this.inputVariables,
      this.outputVariables,
      this.results
    );

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `permutacao-testes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // ==================== Utilitários ====================

  resetForm(): void {
    this.inputVariables = [];
    this.outputVariables = [];
    this.results = [];
    this.errors = [];
    this.totalCombinations = 0;
    this.showResults = false;
    this.inputText = '';
    this.outputText = '';
  }

  getCellValue(result: PermutationResult, column: string): string {
    if (column === 'id') {
      return result.id;
    }

    // Verifica se é coluna de saída esperada
    if (column.startsWith('esperado_')) {
      const varName = column.replace('esperado_', '');

      // Se foi editado manualmente, retorna o valor editado
      if (result.manualEdits && result.manualEdits[varName]) {
        return result.manualEdits[varName];
      }

      return result.expectedOutput[varName] || '-';
    }

    // Coluna de entrada
    return result.combination[column] || '-';
  }

  isOutputColumn(column: string): boolean {
    return column.startsWith('esperado_');
  }

  isEditing(result: PermutationResult, column: string): boolean {
    return this.editingCell?.resultId === result.id && this.editingCell?.column === column;
  }

  startEdit(result: PermutationResult, column: string): void {
    if (!this.isOutputColumn(column)) {
      return;
    }

    this.editingCell = { resultId: result.id, column };
    this.editingValue = this.getCellValue(result, column);
  }

  saveEdit(result: PermutationResult, column: string): void {
    if (!this.editingCell || !this.isOutputColumn(column)) {
      return;
    }

    const varName = column.replace('esperado_', '');

    // Inicializa manualEdits se não existir
    if (!result.manualEdits) {
      result.manualEdits = {};
    }

    // Salva o valor editado
    result.manualEdits[varName] = this.editingValue;
    result.isManuallyEdited = true;

    // Atualiza o motivo para indicar edição manual
    if (!result.reason.includes('(Editado manualmente)')) {
      result.reason += ' (Editado manualmente pelo PO)';
    }

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingCell = null;
    this.editingValue = '';
  }

  getAvailableOptions(column: string): string[] {
    if (!this.isOutputColumn(column)) {
      return [];
    }

    const varName = column.replace('esperado_', '');
    const outputVar = this.outputVariables.find(v => v.name === varName);

    return outputVar ? outputVar.partitions.map(p => p.value) : [];
  }

  isCellManuallyEdited(result: PermutationResult, column: string): boolean {
    if (!this.isOutputColumn(column)) {
      return false;
    }

    const varName = column.replace('esperado_', '');
    return !!(result.manualEdits && result.manualEdits[varName]);
  }

  loadExample(): void {
    this.inputText = `Valor; 5; 10; 100
Limite; 1000; 5000; 10000
Token; false; true`;

    this.outputText = `Resultado; Aceito; Rejeitado
Saldo; Atualizado; Não Atualizado`;
  }
}
