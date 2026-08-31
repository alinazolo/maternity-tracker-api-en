import styles from './DiaryEntryDetails.module.css';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Note } from '@/types/types';
import { deleteNote } from '@/lib/api/clientApi';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

interface DiaryEntryDetailsProps {
  entry?: Note | null;
  onEdit: () => void;
}

export default function DiaryEntryDetails({
  entry,
  onEdit,
}: DiaryEntryDetailsProps) {
  const [isModal, setIsModal] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNote(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModal(false);
      toast.success('Note deleted');
      if (window.innerWidth < 1440) {
        router.push('/diary');
      } else {
        router.refresh();
      }
    },
    onError: () => {
      setIsModal(false);
      toast.error('An error occurred while deleting the note');
    },
  });

  function handleDelete() {
    if (entry?._id) {
      createMutation.mutate(entry?._id);
    }
  }

  if (!entry) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>You do not have any entries yet...</h2>
      </div>
    );
  } else {
    const date = new Date(entry.updatedAt ? entry.updatedAt : entry.createdAt);
    const day = date.getDay();
    const mounth = date.getMonth();
    const mounths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const textMounth = mounths[mounth - 1];
    const year = date.getFullYear();
    return (
      <div className={styles.container}>
        <Toaster position="top-right" />
        {isModal && (
          <ConfirmationModal
            title="Do you want to delete the entry?"
            onConfirm={handleDelete}
            confirmButtonText={
              createMutation.isPending ? 'Deleting...' : 'Delete'
            }
            cancelButtonText="Cancel"
            onCancel={() => setIsModal(false)}
          />
        )}
        <div className={styles.topBox}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>{entry && entry.title}</h2>
            <button className={styles.editButton} onClick={onEdit}>
              <svg width={24} height={24}>
                <use href="/icons.svg#update"></use>
              </svg>
            </button>
          </div>
          <div className={styles.dateBox}>
            <p className={styles.date}>{`${day} ${textMounth} ${year}`}</p>
            <button
              className={styles.deleteButton}
              onClick={() => {
                // if (entry._id) {
                //   handleDelete(entry._id);
                // }
                setIsModal(true);
              }}
            >
              <svg width={24} height={24}>
                <use href="/icons.svg#delete"></use>
              </svg>
            </button>
          </div>
        </div>
        <p className={styles.text}>{entry && entry.description}</p>
        <div className={styles.emotions}>
          {entry &&
            entry.emotions.map(emotion => (
              <span key={emotion._id} className={styles.emotion}>
                {emotion.title}
              </span>
            ))}
        </div>
        <div className={styles.buttons}></div>
      </div>
    );
  }
}
