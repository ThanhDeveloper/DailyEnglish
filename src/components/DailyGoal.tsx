import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import styles from './DailyGoal.module.css';

export function DailyGoal() {
  const { getDailyGoal, setDailyGoal, getDailyGoalProgress, GOAL_OPTIONS } = useProgress();
  const [activeGoal, setActiveGoal] = useState(getDailyGoal);
  const { goal, current, percentage, completed } = getDailyGoalProgress();

  const handleGoalChange = (newGoal: number) => {
    setDailyGoal(newGoal);
    setActiveGoal(newGoal);
  };

  // SVG circle math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const remaining = Math.max(goal - current, 0);

  return (
    <section className={styles.widget}>
      <div className={styles.header}>
        <span className={styles.title}>Daily Goal</span>
        <div className={styles.goalSelector}>
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`${styles.goalBtn} ${activeGoal === opt ? styles.goalBtnActive : ''}`}
              onClick={() => handleGoalChange(opt)}
            >
              {opt} XP
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.ring}>
          <svg className={styles.ringSvg} viewBox="0 0 80 80">
            <circle className={styles.ringTrack} cx="40" cy="40" r={radius} />
            <circle
              className={`${styles.ringFill} ${completed ? styles.ringFillCompleted : ''}`}
              cx="40"
              cy="40"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className={styles.ringCenter}>
            <span className={styles.ringPercent}>{percentage}%</span>
            <span className={styles.ringLabel}>done</span>
          </div>
        </div>

        <div className={styles.info}>
          <p className={styles.xpText}>
            <span className={styles.xpHighlight}>{current}</span> / {goal} XP
          </p>
          {completed ? (
            <div className={styles.celebration}>
              <span className={styles.celebrationIcon}>&#10003;</span>
              <span className={styles.celebrationText}>Goal reached! Great work today!</span>
            </div>
          ) : (
            <p className={styles.remaining}>
              {current === 0
                ? 'Start a lesson to earn XP toward your daily goal.'
                : `${remaining} XP to go. Keep it up!`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
