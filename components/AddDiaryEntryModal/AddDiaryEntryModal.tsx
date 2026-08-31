'use client';

import Modal from '../Modal/Modal';
import styles from './AddDiaryEntryModal.module.css';
import AddDiaryEntryForm from '../AddDiaryEntryForm/AddDiaryEntryForm';
import type { Note } from '@/types/types';

interface AddDiaryEntryModalProps {
  onClose: () => void;
  initialData?: Note | null;
}

export default function AddDiaryEntryModal({
  onClose,
  initialData,
}: AddDiaryEntryModalProps) {
  return (
    <Modal onClose={onClose}>
      <h2 className={styles.header}>
        {initialData ? 'Edit entry' : 'New entry'}
      </h2>
      <div className={styles.content}>
        <AddDiaryEntryForm onSuccess={onClose} initialData={initialData} />
      </div>
    </Modal>
  );
}
