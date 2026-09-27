'use client';

import css from './page.module.css';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { type Note } from '@/types/types';
import { getNotes } from '@/lib/api/clientApi';
import GreetingBlock from '@/components/GreetingBlock/GreetingBlock';
import DiaryList from '@/components/DiaryList/DiaryList';
import DiaryEntryDetails from '@/components/DiaryEntryDetails/DiaryEntryDetails';
import AddDiaryEntryModal from '@/components/AddDiaryEntryModal/AddDiaryEntryModal';


export default function Diary() {
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const { data } = useQuery({
    queryKey: ['notes'],
    queryFn: () => getNotes(),
    refetchOnMount: false,
    throwOnError: true,
  });
  const [selectedEntry, setSelectedEntry] = useState<Note | null>(
    data && data.length > 0 ? data[0] : null
  );
  useEffect(() => {
    setTimeout(() => {
      if (data) {
        setSelectedEntry(data[0]);
      }
    }, 0);
  }, [data]);

  return (
    <>
      <div className={css.gretBox}>
        <GreetingBlock />
      </div>
      <div className={css.diaryBox}>
        {data ? (
          <DiaryList
            entries={data}
            onEntrySelect={setSelectedEntry}
            onEntryCreate={() => setIsModalCreate(true)}
          />
        ) : (
          <p>An error occurred while loading the notes.</p>
        )}

        <div className={css.entryDetails}>
          <DiaryEntryDetails
            entry={selectedEntry}
            onEdit={() => setIsModalUpdate(true)}
          />
        </div>

        {isModalCreate && (
          <AddDiaryEntryModal onClose={() => setIsModalCreate(false)} />
        )}
        {isModalUpdate && (
          <AddDiaryEntryModal
            initialData={selectedEntry}
            onClose={() => setIsModalUpdate(false)}
          />
        )}
      </div>
    </>
  );
}
