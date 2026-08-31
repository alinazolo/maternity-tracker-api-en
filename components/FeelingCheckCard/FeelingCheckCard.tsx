import styles from './FeelingCheckCard.module.css';

interface FeelingCardProps {
  recommendation: string;
  onAction: () => void;
}

export default function FeelingCard({
  recommendation,
  onAction,
}: FeelingCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>How are you feeling?</h2>
      <p className={styles.subtitle}>Today recommendation:</p>
      <p className={styles.text}>{recommendation}</p>
      <button
        className={styles.button}
        type="button"
        onClick={onAction}>
        Add an entry to your diary
      </button>
    </section>
  );
}
