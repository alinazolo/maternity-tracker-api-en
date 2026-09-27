'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GreetingBlock from '@/components/GreetingBlock/GreetingBlock';
import StatusBlock from '@/components/StatusBlock/StatusBlock';
import BabyTodayCard from '@/components/BabyTodayCard/BabyTodayCard';
import MomTipCard from '@/components/MomTipCard/MomTipCard';
import TasksReminderCard from '@/components/TasksReminderCard/TasksReminderCard';
import FeelingCheckCard from '@/components/FeelingCheckCard/FeelingCheckCard';
import { useAuthStore } from '@/lib/store/authStore';
import { homePrivate, homePublic } from "@/lib/api/clientApi";
import css from "./page.module.css";
import AddDiaryEntryModal from '@/components/AddDiaryEntryModal/AddDiaryEntryModal';
import Loader from '@/components/Loader/Loader';


export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['home', isAuthenticated],
  queryFn: () =>
    isAuthenticated ? homePrivate() : homePublic(),
  enabled: isAuthenticated !== undefined, // або !!user
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddClick = () => {
      if (isAuthenticated) {
        setIsModalOpen(true);
      } else {
        router.push('/register');
      }
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

  if (isLoading) return <Loader />;
  const baby = data?.babyState;
  if (!baby) return null;

  return (
    <div className={css.container}>
      <GreetingBlock name={user?.name} />
      <div className={css.wrapper}>
        <div className={css.left}>
          <StatusBlock
        currentWeek={data?.currentWeek}
        daysLeftTo={data?.daysLeft}
      />

      <BabyTodayCard
        size={baby.babySize}
        weight={baby.babyWeight}
        activity={baby.babyActivity}
        imageUrl={baby.image}
        bodyAdvice={baby.babyDevelopment}
      />

      <MomTipCard tip={baby.momDailyTips} />
        </div>
        <div className={css.right}>
          <TasksReminderCard />

          <FeelingCheckCard recommendation={baby.momDailyTips} onAction={handleAddClick}/>
          {isModalOpen && (
             <AddDiaryEntryModal onClose={handleCloseModal}></AddDiaryEntryModal>
          )}
    </div>
      </div>
</div>
  );
}
