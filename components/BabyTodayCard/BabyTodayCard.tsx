import styles from './BabyTodayCard.module.css';
import Image from 'next/image';

interface BabyTodayCardProps {
  size: number;
  weight: number;
  activity: string;
  bodyAdvice: string;
  imageUrl: string;
}


export default function BabyTodayCard({
  size,
  weight,
  activity,
  bodyAdvice,
  imageUrl,
}: BabyTodayCardProps) {

  return (
    <section className={styles.babycard}>
      <p className={styles.titleBaby}>Baby Today</p>
      <div id="BabyState" className={styles.babycard__listitem}>
        <Image
        src={imageUrl}
        alt="Baby Image"
        width={257}
        height={194}
        className={styles.babyImage}
      />
        <ul className={styles.babycard__list}>
  <li>
    <p className={styles.babycard__datalabel}>
      <span className={styles.label}>Size:</span>
      <span className={styles.value}>{size}</span>
    </p>
  </li>

  <li>
    <p className={styles.babycard__datalabel}>
      <span className={styles.label}>Weight:</span>
      <span className={styles.value}>{weight}</span>
    </p>
  </li>

  <li>
    <p className={styles.babycard__datalabel}>
      <span className={styles.label}>Activity:</span>
      <span className={styles.value}>{activity}</span>
    </p>
  </li>
        </ul>

      </div>

      <div className={styles.bodyAdvice}>
        <p className={styles.advice}>{bodyAdvice}</p>
      </div>
    </section>
  );
};
