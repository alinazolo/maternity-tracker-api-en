import styles from './MomTipCard.module.css';

type MomTipCardProps = {
  tip: string;
};

export default function MomTipCard({ tip }: MomTipCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Advice for mother</h2>
      <p className={styles.text}>{tip}</p>
    </section>
  );
}
