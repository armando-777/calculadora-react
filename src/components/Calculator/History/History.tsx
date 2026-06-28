import React from 'react';
import type { Operation } from '../../../types/calculator';
import styles from './History.module.css';

interface HistoryProps {
  operations: Operation[];
}

const History: React.FC<HistoryProps> = ({ operations }) => {
  return (
    <div className={styles.history}>
      <h3 className={styles.title}>📜 Últimas Operaciones</h3>
      <ul className={styles.list}>
        {operations.map((op) => (
          <li key={op.id} className={styles.item}>
            <span className={styles.expression}>{op.expression}</span>
            <span className={styles.equals}>=</span>
            <span className={styles.result}>{op.result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;