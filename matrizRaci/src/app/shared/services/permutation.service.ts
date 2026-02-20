import { Injectable } from '@angular/core';
import {
  Variable,
  PermutationResult,
  PermutationCase,
  PermutationExport,
} from '../models/permutation.model';

@Injectable({
  providedIn: 'root',
})
export class PermutationService {
  /**
   * Gera todas as permutações possíveis baseado nas variáveis de entrada
   */
  generatePermutations(
    inputVariables: Variable[],
    outputVariables: Variable[]
  ): PermutationResult[] {
    if (inputVariables.length === 0) {
      return [];
    }

    const inputCombinations = this.generateCombinations(inputVariables);
    const results: PermutationResult[] = [];

    inputCombinations.forEach((inputCombo, index) => {
      // Para cada combinação de entrada, gera as saídas esperadas
      const expectedOutput = this.inferExpectedOutput(inputCombo, outputVariables);
      const reason = this.generateReason(inputCombo, expectedOutput, inputVariables, outputVariables);

      results.push({
        id: `case-${index + 1}`,
        combination: inputCombo,
        expectedOutput,
        reason,
      });
    });

    return results;
  }

  /**
   * Gera todas as combinações possíveis de partições para um conjunto de variáveis
   */
  private generateCombinations(variables: Variable[]): Record<string, string>[] {
    if (variables.length === 0) {
      return [{}];
    }

    const [firstVar, ...restVars] = variables;
    const restCombinations = this.generateCombinations(restVars);
    const combinations: Record<string, string>[] = [];

    for (const partition of firstVar.partitions) {
      for (const restCombo of restCombinations) {
        combinations.push({
          [firstVar.name]: partition.value,
          ...restCombo,
        });
      }
    }

    return combinations;
  }

  /**
   * Infere a saída esperada baseado na combinação de entrada
   * Esta é uma lógica simplificada - pode ser customizada conforme necessário
   */
  private inferExpectedOutput(
    inputCombo: Record<string, string>,
    outputVariables: Variable[]
  ): Record<string, string> {
    const output: Record<string, string> = {};

    outputVariables.forEach((outVar) => {
      // Lógica padrão: seleciona a primeira partição
      // Esta lógica pode ser customizada pelo usuário
      if (outVar.partitions.length > 0) {
        output[outVar.name] = outVar.partitions[0].value;
      }
    });

    return output;
  }

  /**
   * Gera uma descrição textual do motivo/razão para o caso de teste
   */
  private generateReason(
    inputCombo: Record<string, string>,
    expectedOutput: Record<string, string>,
    inputVariables: Variable[],
    outputVariables: Variable[]
  ): string {
    const inputDesc = Object.entries(inputCombo)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    const outputDesc = Object.entries(expectedOutput)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    return `Dados: ${inputDesc} → Esperado: ${outputDesc}`;
  }

  /**
   * Calcula o número total de combinações possíveis
   */
  calculateTotalCombinations(variables: Variable[]): number {
    if (variables.length === 0) {
      return 0;
    }

    return variables.reduce((total, variable) => {
      return total * (variable.partitions.length || 1);
    }, 1);
  }

  /**
   * Prepara dados para exportação
   */
  prepareExport(
    inputVariables: Variable[],
    outputVariables: Variable[],
    results: PermutationResult[]
  ): PermutationExport {
    return {
      timestamp: new Date().toISOString(),
      inputVariables,
      outputVariables,
      totalCombinations: results.length,
      results,
    };
  }

  /**
   * Exporta resultados para formato de tabela (para Excel)
   */
  exportToTableFormat(results: PermutationResult[]): Record<string, any>[] {
    return results.map((result) => {
      // Combina expectedOutput com manualEdits, dando prioridade às edições manuais
      const finalOutput = { ...result.expectedOutput };
      if (result.manualEdits) {
        Object.assign(finalOutput, result.manualEdits);
      }

      const row: Record<string, any> = {
        ID: result.id,
        ...result.combination,
        ...Object.entries(finalOutput).reduce((acc, [key, value]) => {
          acc[`Esperado_${key}`] = value;
          return acc;
        }, {} as Record<string, any>),
        Motivo: result.reason,
        'Editado Manualmente': result.isManuallyEdited ? 'Sim' : 'Não',
      };
      return row;
    });
  }

  /**
   * Valida se as variáveis têm partições definidas
   */
  validateVariables(variables: Variable[]): string[] {
    const errors: string[] = [];

    variables.forEach((variable) => {
      if (!variable.name || variable.name.trim() === '') {
        errors.push('Todas as variáveis devem ter um nome');
      }

      if (!variable.partitions || variable.partitions.length === 0) {
        errors.push(`A variável "${variable.name}" deve ter pelo menos uma partição`);
      }

      variable.partitions.forEach((partition, index) => {
        if (!partition.label || partition.label.trim() === '') {
          errors.push(`Partição ${index + 1} da variável "${variable.name}" deve ter um rótulo`);
        }
        if (!partition.value || partition.value.trim() === '') {
          errors.push(`Partição ${index + 1} da variável "${variable.name}" deve ter um valor`);
        }
      });
    });

    return errors;
  }
}
