'use client';

import css from './WeekSelector.module.css';
import { useEffect, useRef } from 'react';

interface Props {
  selectedWeek: number;
  currentWeek: number;
  onWeekChange: (week: number) => void;
}

export default function WeekSelector({
  selectedWeek,
  currentWeek,
  onWeekChange,
}: Props) {
  const allWeeks = Array.from({ length: 40 }, (_, i) => i + 1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedWeekRef = useRef<HTMLButtonElement | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const selectedButton = selectedWeekRef.current;

    if (!container || !selectedButton) return;

    const scrollLeft =
      selectedButton.offsetLeft -
      container.clientWidth / 2 +
      selectedButton.offsetWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: isFirstRenderRef.current ? 'auto' : 'smooth',
    });

    isFirstRenderRef.current = false;
  }, [selectedWeek]);

  return (
    <section className={css.sectionWeeks}>
      <div ref={containerRef} className={css.weeksScrollContainer}>
        {allWeeks.map((week) => {
          const isActive = week <= currentWeek;
          const isSelected = week === selectedWeek;
          const isCurrent = week === currentWeek;

          return (
            <button
              key={week}
              ref={(element) => {
                if (isSelected) {
                  selectedWeekRef.current = element;
                }
              }}
              disabled={!isActive}
              type="button"
              tabIndex={!isActive ? -1 : 0}
              aria-pressed={isSelected}
              onClick={() => {
                if (!isActive) return;
                onWeekChange(week);
              }}
              className={`
                ${css.buttonWeek}
                ${isSelected ? css.buttonWeekActive : ''}
                ${isCurrent ? css.buttonWeekCurrent : ''}
                ${!isActive ? css.buttonWeekDisabled : ''}
              `}
            >
              <span className={css.weekNumber}>{week}</span>
              <span className={css.weekName}>Week</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
