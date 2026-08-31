'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';
import { useEntryStore } from '@/lib/store/entryStore';

const LABELS: Record<string, string> = {
  journey: 'Journey',
  diary: 'Diary',
  profile: 'Profile',
};

const HIDDEN_PREFIXES = ['/auth'];

interface Props {
  lastLabel?: string;
}

export default function Breadcrumb({ lastLabel }: Props) {
  const entryTitle = useEntryStore(s => s.title);
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null;

  const segments = pathname.split('/').filter(Boolean);

  let crumbs;

  if (pathname === '/') {
    crumbs = [
      { label: 'LELÉKA', path: '/', isLast: false },
      { label: 'My Day', path: '/', isLast: true },
    ];
  } else {
    crumbs = [
      { label: 'LELÉKA', path: '/', isLast: segments.length === 0 },
      ...segments.map((seg, i) => ({
        label:
          i === segments.length - 1
            ? (lastLabel ?? LABELS[seg] ?? seg)
            : (LABELS[seg] ?? seg),
        path: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
      })),
    ];
  }
  if (pathname.includes('diary') && crumbs.length > 2) {
    const n = crumbs.length - 1;
    crumbs[n].label = entryTitle;
  }

  return (
    <nav className={styles.breadcrumb} aria-label="Навігація">
      {crumbs.map((c, i) => (
        <span key={i} className={styles.item}>
          {i > 0 && (
            <svg className={styles.svg} width="12" height="12">
              <use href="/icons.svg#arrow-right" />
            </svg>
          )}
          {c.isLast ? (
            <span className={styles.current} aria-current="page">
              {c.label}
            </span>
          ) : (
            <Link href={c.path} className={styles.link}>
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
