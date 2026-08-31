'use client';

import css from './JourneyDetails.module.css';
import Image from 'next/image';
import { useState } from 'react';
import TasksReminderCard from '@/components/TasksReminderCard/TasksReminderCard';
import type { BabyState, MomState } from '@/types/types';

interface JourneyDetailsProps {
  babyData: BabyState | undefined;
  momData: MomState | undefined;
  isLoading?: boolean;
}

const iconsMap: Record<string, string> = {
  Nutrition: 'cutlery',
  Activity: 'dumbbell',
  'Rest and comfort': 'sofa',
};

const categoryTitles: Record<string, string> = {
  Nutrition: 'Nutrition',
  Activity: 'Activity',
  'Rest and comfort': 'Rest and comfort',
};

export default function JourneyDetails( { babyData, momData, isLoading = false }: JourneyDetailsProps) {
  const [activeTab, setActiveTab] = useState<'baby' | 'mom'>('baby');

    if (isLoading) {
    return (
      <section className={css.loaderWrapper}>
        <div className={css.loader}></div>
      </section>
    );
    }

    if (!babyData || !momData) {
    return null;
  }

  return (
      <section className={css.journeyInfo}>
        <div className={css.tab}>
          <div className={css.tabsNav}>
          <button
            type="button"
              className={`${css.babyContent} ${activeTab === 'baby' ? css.activeTab : ''}`}
              onClick={() => setActiveTab('baby')}
            >
              <span className={css.babyButton}>Baby development</span>
            </button>

            <button
              type="button"
              className={`${css.motherBodyContent} ${activeTab === 'mom' ? css.activeTab : ''}`}
              onClick={() => setActiveTab('mom')}
            >
              <span className={css.motherBodyButton}>Mom body</span>
            </button>
          </div>
        </div>

        {activeTab === 'baby' && (
          <div className={css.babyInformation}>
            {babyData.image ? (
              <Image
                src={babyData.image}
                alt={`Baby development, week ${babyData.weekNumber}`}
                className={css.babyPhotoSize}
                width={200}
                height={200}
              />
            ) : null}

            {babyData.analogy ? (
              <p className={css.sizePhotoDescription}>
                {babyData.analogy}
              </p>
            ) : null}

              <div className={css.babyRightColumn}>
            {babyData.babyDevelopment ? (
                <p className={css.babySizeInformation}>{babyData.babyDevelopment}
                </p>
            ) : null}

            <div className={css.interestingWeekFact}>
              <div className={css.factHeader}>
                <svg className={css.iconStar} width="24" height="24">
                  <use href="/icons.svg#star"></use>
                  </svg>

                  <h3 className={css.titleFact}>
                    Interesting fact of the week
                </h3>
              </div>
              {babyData.interestingFact ? (
                <p className={css.descriptionFact}>{babyData.interestingFact}</p>
              ) : null}
            </div>
            </div>
          </div>
        )}

        {activeTab === 'mom' && (


          <div className={css.motherInformation}>
  <div className={css.motherFeelingsTips}>
    <div className={css.motherLeftColumn}>
      <div className={css.motherFeelingCard}>
        <h3 className={css.cardTitle}>How you may feel</h3>

        <div className={css.tags}>
          {momData?.feelings?.states?.map((emotion, index) => (
            <span key={index} className={css.tag}>
              {emotion}
            </span>
          ))}
        </div>

        {momData.feelings?.sensationDescr ? (
          <p className={css.feelingDescription}>
            {momData.feelings.sensationDescr}
          </p>
        ) : null}
      </div>

      <div className={css.motherTipsCard}>
        <h3 className={css.tipsHeader}>Tips for your comfort</h3>

        <ul className={css.tipItems}>
                  {momData.comfortTips?.map((tip) => {
            const icon = iconsMap[tip.category] || 'heart';
            const title = categoryTitles[tip.category] || tip.category;

            return (
              <li key={tip._id} className={css.tipItem}>
                <svg className={css.icon} width="24" height="24" viewBox="0 0 24 24">
                  <use href={`/icons.svg#${icon}`}></use>
                </svg>

                <div className={css.tipText}>
                  <p className={css.tipTitle}>{title}</p>
                  <p className={css.tipDescription}>{tip.tip}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>

    <div className={css.tasksReminderWrapper}>
      <TasksReminderCard />
    </div>
  </div>
</div>
        )}
      </section>
  );
}
