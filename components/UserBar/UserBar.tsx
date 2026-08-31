'use client';

import css from './UserBar.module.css';

import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { User } from '@/types/types';
import { logout } from '@/lib/api/clientApi';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useAuthStore } from '@/lib/store/authStore';

interface UserBarProps {
  user: User;
}

export default function UserBar({ user }: UserBarProps) {
  const clearUser = useAuthStore(state => state.clearIsAuthenticated);
  const [isModal, setIsModal] = useState(false);
  const [isFetch, setisFetch] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setisFetch(true);
    try {
      await logout();
      setIsModal(false);
      setisFetch(false);
      clearUser();
      router.push('/login');
    } catch {
      setIsModal(false);
      setisFetch(false);
      toast.error('An error occurred while logging out');
    }
  }

  return (
    <div className={css.cont}>
      <Toaster />
      {isModal && (
        <ConfirmationModal
          title="Do you want to log out?"
          cancelButtonText="Stay"
          confirmButtonText={isFetch ? 'Logging out...' : 'Log out'}
          onCancel={() => setIsModal(false)}
          onConfirm={() => handleLogout()}
        />
      )}
      <div className={css.imageBox}>
        <Image
          className={css.image}
          src={user.avatar}
          alt="avatar"
          fill
          sizes="150px 150px"
        />
      </div>
      <div className={css.nameBox}>
        <p className={css.name}>{user.name}</p>
        <p className={css.email}>{user.email}</p>
      </div>
      <button
        className={css.logout}
        type="button"
        onClick={() => setIsModal(true)}
      >
        <svg width={18} height={18}>
          <use href="/icons.svg#logout"></use>
        </svg>
      </button>
    </div>
  );
}
