import React, { useState, useEffect } from 'react';
import Display from './Display/Display';
import ButtonPad from './ButtonPad/ButtonPad';
import History from './History/History';
import type { Operator, Operation } from '../../types/calculator';
import styles from './Calculator.module.css';

const Calculator: React.FC = () => {

  const [display, setDisplay] = useState<string>(() => {
    return localStorage.getItem('calc_display') || '0';
  });
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [history, setHistory] = useState<Operation[]>(() => {
    const saved = localStorage.getItem('calc_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [operationCount, setOperationCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('calc_count') || '0');
  });
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('calc_theme') === 'dark';
  });

  const MAX_DIGITS = 12;
  const MAX_HISTORY = 5;

  useEffect(() => {
    if (display.length > MAX_DIGITS && !isNewNumber) {
      setDisplay(display.slice(0, MAX_DIGITS));
    }
  }, [display, isNewNumber]);

  useEffect(() => {
    localStorage.setItem('calc_display', display);
  }, [display]);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('calc_count', operationCount.toString());
  }, [operationCount]);

  useEffect(() => {
    localStorage.setItem('calc_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleNumber = (num: string): void => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      if (num === '.' && display.includes('.')) return;
      setDisplay(display + num);
    }
  };

  const handleOperator = (operator: Operator): void => {
    const currentValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (currentOperator) {
      const result = calculate(previousValue, currentValue, currentOperator);
      setDisplay(result.toString());
      setPreviousValue(result);
    }
    setCurrentOperator(operator);
    setIsNewNumber(true);
  };

  const calculate = (prev: number, current: number, operator: Operator): number => {
    switch (operator) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '*': return prev * current;
      case '/':
        if (current === 0) {
          alert('No se puede dividir entre 0');
          return prev;
        }
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = (): void => {
    if (previousValue !== null && currentOperator) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, currentOperator);
      const rounded = Math.round(result * 100) / 100;
      setDisplay(rounded.toString());

      const newOperation: Operation = {
        id: operationCount + 1,
        expression: `${previousValue} ${currentOperator} ${currentValue}`,
        result: rounded,
        timestamp: new Date()
      };

      setHistory((prev) => [newOperation, ...prev].slice(0, MAX_HISTORY));
      setOperationCount((prev) => prev + 1);
      setPreviousValue(null);
      setCurrentOperator(null);
      setIsNewNumber(true);
    }
  };

  const handleClear = (): void => {
    setDisplay('0');
    setPreviousValue(null);
    setCurrentOperator(null);
    setIsNewNumber(true);
  };

  const handleBackspace = (): void => {
    if (display.length === 1) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercentage = (): void => {
    const value = parseFloat(display) / 100;
    setDisplay(value.toString());
  };

  const handleTheme = (): void => {
    setIsDark(!isDark);
  };

  const playSound = (): void => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 600;
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <div className={styles.calculatorWrapper}>
        <h1 className={styles.title}>🧮 Calculadora</h1>

        <button onClick={handleTheme} className={styles.themeToggle}>
          {isDark ? '☀️ Claro' : '🌙 Oscuro'}
        </button>

        <Display value={display} />

        <ButtonPad
          onNumber={(num) => { playSound(); handleNumber(num); }}
          onOperator={(op) => { playSound(); handleOperator(op); }}
          onEquals={() => { playSound(); handleEquals(); }}
          onClear={() => { playSound(); handleClear(); }}
          onBackspace={() => { playSound(); handleBackspace(); }}
          onPercentage={() => { playSound(); handlePercentage(); }}
        />

        {history.length > 0 && <History operations={history} />}
      </div>
    </div>
  );
};

export default Calculator;