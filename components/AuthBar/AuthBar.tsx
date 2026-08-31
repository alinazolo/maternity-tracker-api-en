import Link from 'next/link';
import styles from './AuthBar.module.css';

export default function AuthBar() {
  return (
    <div className={styles.wrapper}>
      <Link href="/register" className={styles.primary}>
        Register
      </Link>
      <Link href="/login" className={styles.secondary}>
        Login
      </Link>
    </div>
  );
}
