'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';

import { homePrivate } from '@/lib/api/clientApi';

export default function JourneyRedirectPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weeks'],
    queryFn: () => homePrivate(),
  });

  useEffect(() => {
    if (data?.currentWeek) {
      router.replace(`/journey/${data.currentWeek}`);
    }
  }, [data?.currentWeek, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <p>An error occurred while loading data...</p>;
  }

  return null;
}
