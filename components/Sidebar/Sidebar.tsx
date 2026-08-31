'use client';

import UserBar from '../UserBar/UserBar';
import AuthBar from '../AuthBar/AuthBar';

import css from './Sidebar.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const user = useAuthStore(state => state.user);
  const [myDay, setMyday] = useState(false);
  const [journey, setJourney] = useState(false);
  const [diary, setDiary] = useState(false);
  const [profile, setProfile] = useState(false);
  const path = usePathname();

  const isAuth = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (path === '/') {
      setTimeout(() => {
        setMyday(true);
        setJourney(false);
        setDiary(false);
        setProfile(false);
      }, 0);
    } else if (path.startsWith('/journey')) {
      setTimeout(() => {
        setMyday(false);
        setJourney(true);
        setDiary(false);
        setProfile(false);
      }, 0);
    } else if (path.startsWith('/diary')) {
      setTimeout(() => {
        setMyday(false);
        setJourney(false);
        setDiary(true);
        setProfile(false);
      }, 0);
    } else if (path.startsWith('/profile')) {
      setTimeout(() => {
        setMyday(false);
        setJourney(false);
        setDiary(false);
        setProfile(true);
      }, 0);
    }
  }, [path]);

  return (
    <div className={css.sidebar}>
      <div className={clsx(css.inner)}>
        <Link href="/" className={css.logoWrap}>
          <svg width="32" height="32">
            <use href="/icons.svg#logo" />
          </svg>
          <span className={css.logoText}>Leleka</span>
        </Link>

        <nav className={css.nav}>
          <ul className={css.navList}>
            <li>
              <Link href="/" className={clsx(css.navLink, myDay && css.active)}>
                <svg width="24" height="24">
                  <use href="/icons.svg#me-day" />
                </svg>
                <span>My day</span>
              </Link>
            </li>

            <li>
              <Link
                href="/journey"
                className={clsx(css.navLink, journey && css.active)}
              >
                <svg width="24" height="24">
                  <use href="/icons.svg#journey" />
                </svg>
                <span>Journey</span>
              </Link>
            </li>

            <li>
              <Link
                href="/diary"
                className={clsx(css.navLink, diary && css.active)}
              >
                <svg width="24" height="24">
                  <use href="/icons.svg#diary" />
                </svg>
                <span>Diary</span>
              </Link>
            </li>

            <li>
              <Link
                href="/profile"
                className={clsx(css.navLink, profile && css.active)}
              >
                <svg width="24" height="24">
                  <use href="/icons.svg#profile" />
                </svg>
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={css.footer}>
        {isAuth && user ? <UserBar user={user} /> : <AuthBar />}
      </div>
    </div>
  );
}
