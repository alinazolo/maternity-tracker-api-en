'use client';

import ProfileAvatar from '@/components/ProfileAvatar/ProfileAvatar';
import ProfileEditForm from '@/components/ProfileEditForm/ProfileEditForm';
import { getMe } from '@/lib/api/clientApi';
import styles from './profile.module.css';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function ProfileClient() {
  const [message, setMessage] = useState({ title: '', err: false });
  useEffect(() => {
    if (message.title != '') {
      if (message.err) {
        toast.error(message.title);
      } else {
        toast.success(message.title);
      }
    }
  }, [message]);

  function sendMess(mess: string, err: boolean) {
    setMessage({ title: mess, err: err });
  }

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getMe(),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    throwOnError: true,
  });

  return (
    <div className={styles.profileContainer}>
      <Toaster position="top-right" />
      {data ? (
        <ProfileAvatar
          message={sendMess}
          avatar={data?.avatar}
          name={data.name}
          email={data.email}
        />
      ) : (
        <p>An error occurred while loading user data...</p>
      )}

      {data ? (
        <ProfileEditForm message={sendMess} user={data} />
      ) : (
        <p>An error occurred while loading user data...</p>
      )}
    </div>
  );
}
