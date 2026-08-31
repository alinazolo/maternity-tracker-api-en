'use client';

import DiaryEntryCard from '../DiaryEntryCard/DiaryEntryCard';
import { Note } from '@/types/types';
import styles from './DiaryList.module.css';

interface DiaryListProps {
  entries: Note[];
  onEntrySelect?: (entry: Note) => void;
  onEntryCreate?: () => void;
  selectedEntryId?: string;
}

export default function DiaryList({
  entries,
  onEntrySelect,
  onEntryCreate,
  selectedEntryId,
}: DiaryListProps) {
  if (entries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>Your entries</h2>
          <button
            className={styles.newEntryButton}
            onClick={onEntryCreate}
            aria-label="Add a new entry"
          >
            New entry
            <svg width={18} height={18}>
              <use href="/icons.svg#plus"></use>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Your entries</h2>
        <button
          className={styles.newEntryButton}
          onClick={onEntryCreate}
          aria-label="Add a new entry"
        >
          New entry
          <span className={styles.plusIcon} aria-hidden="true">
            <svg width={18} height={18}>
              <use href="/icons.svg#plus"></use>
            </svg>
          </span>
        </button>
      </div>

      <ul className={styles.list} role="list">
        {entries.map(entry => (
          <li key={entry._id} className={styles.listItem}>
            <DiaryEntryCard
              entry={entry}
              isSelected={selectedEntryId === entry._id}
              onSelect={onEntrySelect}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
