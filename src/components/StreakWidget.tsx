import { useProgress } from '../hooks/useProgress';
import styles from './StreakWidget.module.css';

export function StreakWidget() {
  const { getStreak, getLongestStreak, getTotalXP, getTodayXP, getWeeklyActivity } = useProgress();

  const totalXP = getTotalXP();
  if (totalXP === 0) return null;

  const streak = getStreak();
  const longest = getLongestStreak();
  const todayXP = getTodayXP();
  const weekly = getWeeklyActivity();
  const maxXP = Math.max(...weekly.map((d) => d.xp), 1);

  return (
    <section className={styles.widget}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statEmoji}>🔥</span>
          <div>
            <span className={styles.statValue}>{streak}</span>
            <span className={styles.statLabel}>day streak</span>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statEmoji}>🏆</span>
          <div>
            <span className={styles.statValue}>{longest}</span>
            <span className={styles.statLabel}>best streak</span>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statEmoji}>⭐</span>
          <div>
            <span className={styles.statValue}>{totalXP.toLocaleString()}</span>
            <span className={styles.statLabel}>total XP</span>
          </div>
        </div>
        {todayXP > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.stat}>
              <span className={styles.statEmoji}>✨</span>
              <div>
                <span className={styles.statValue}>+{todayXP}</span>
                <span className={styles.statLabel}>today</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.chart}>
        <p className={styles.chartLabel}>This week</p>
        <div className={styles.bars}>
          {weekly.map((d) => (
            <div key={d.day} className={styles.barCol}>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.bar} ${d.isToday ? styles.barToday : ''} ${d.xp > 0 ? styles.barActive : ''}`}
                  style={{ height: `${Math.max((d.xp / maxXP) * 100, d.xp > 0 ? 15 : 0)}%` }}
                />
              </div>
              <span className={`${styles.dayLabel} ${d.isToday ? styles.dayLabelToday : ''}`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
