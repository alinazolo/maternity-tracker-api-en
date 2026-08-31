'use client';

import styles from './GreetingBlock.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  name?: string;
};

function getGreetingByHour(hour: number) {
  if (hour >= 6 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good day';
  if (hour >= 18 && hour < 24) return 'Good evening';
  return 'Good night';
}

export default function GreetingBlock({ name = 'guest' }: Props) {
  const user = useAuthStore(state => state.user);
  const [greeting, setGreeting] = useState('');
  if (user?.name) {
    name = user.name;
  }

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeout(() => setGreeting(getGreetingByHour(hour)));
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        {greeting}, {name}!
      </h1>
    </div>
  );
}
