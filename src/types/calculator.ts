// Tipo para operadores permitidos
export type Operator = '+' | '-' | '*' | '/';

// Tipo para una operación en el historial
export interface Operation {
  id: number;
  expression: string;
  result: number;
  timestamp: Date;
}

// Tipo para el estado de la calculadora
export interface CalculatorState {
  display: string;
  previousValue: number | null;
  currentOperator: Operator | null;
  isNewNumber: boolean;
  history: Operation[];
}