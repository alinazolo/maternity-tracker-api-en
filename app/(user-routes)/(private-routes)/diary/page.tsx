import type { Metadata } from 'next';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import { getNotes } from '@/lib/api/serverApi';
import DiaryClient from './Diary.client';

export const metadata: Metadata = {
  title: 'Diary',
  description: 'User diary page',
};

export default async function Diary() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes'],
    queryFn: () => getNotes(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiaryClient />
    </HydrationBoundary>
  );
}
