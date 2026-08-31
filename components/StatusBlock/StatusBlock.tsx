'use client';

import styles from './StatusBlock.module.css';

interface StatusBlockProps {
  currentWeek: number;
  daysLeftTo: number;
}

export default function StatusBlock({
  currentWeek,
  daysLeftTo,
}: StatusBlockProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.label}>Week</p>
        <p className={styles.value}>{currentWeek}</p>
      </div>

      <div className={styles.card}>
        <p className={styles.label}>Days left to meeting</p>
        <p className={styles.value}>{daysLeftTo ? `~${daysLeftTo}` : '—'}</p>
      </div>
    </div>
  );
}
