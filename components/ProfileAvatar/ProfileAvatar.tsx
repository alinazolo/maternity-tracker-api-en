'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ProfileAvatar.module.css';
import { getMe } from '@/lib/api/clientApi';
import { updateAvatar } from '@/lib/api/clientApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';

interface ProfileAvatarProps {
  avatar: string;
  name: string;
  email: string;
  message: (mes: string, err: boolean) => void;
}

export default function ProfileAvatar({
  avatar,
  name,
  email,
  message,
}: ProfileAvatarProps) {
  const setUserStore = useAuthStore(s => s.setUser);
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: File) => {
      const res = await updateAvatar(data);
      setAvatarPreview(res.url);
      const user = await getMe();
      if (user) {
        setUserStore(user);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      message('Avatar updated successfully', false);
    },
    onError: () => {
      message('An error occurred while uploading the avatar', true);
    },
  });

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
    createMutation.mutate(file);
  }

  return (
    <div className={styles.avatarSection}>
      <div
        className={styles.avatarCircle}
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src={avatarPreview}
          alt="Аватар"
          width={140}
          height={140}
          className={styles.image}
          loading="eager"
        />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleAvatarChange}
      />
      <div className={styles.btnBox}>
        <p className={styles.name}>{name}</p>
        <p className={styles.email}>{email}</p>
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload new avatar
        </button>
      </div>
    </div>
  );
}
