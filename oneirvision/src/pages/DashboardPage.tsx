import React, { useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCards from '../components/dashboard/DashboardCards';
import { useDreamContext } from '../contexts/DreamContext';

interface DreamStats {
  totalDreams: number;
  dreamsThisMonth: number;
  averagePerWeek: number;
  mostCommonMood: string;
  averageSleepDuration: string;
  lastDream: string;
  lastDreamDate: string;
}

const DashboardPage: React.FC = () => {
  const { dreamJournal = [], fetchDreamJournal } = useDreamContext();
  // Stats are currently not used but kept for future use
  const [, setStats] = React.useState<DreamStats>({
    totalDreams: 0,
    dreamsThisMonth: 0,
    averagePerWeek: 0,
    mostCommonMood: 'None',
    averageSleepDuration: '7.2 hrs',
    lastDream: 'No dreams yet',
    lastDreamDate: 'N/A',
  });

  useEffect(() => {
    const calculateStats = () => {
      if (!dreamJournal || dreamJournal.length === 0) {
        return;
      }

      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      // Calculate dreams this month
      const dreamsThisMonth = dreamJournal.filter((dream) => {
        const dreamDate = new Date(dream.date);
        return dreamDate.getMonth() === thisMonth && dreamDate.getFullYear() === thisYear;
      }).length;
      
      // Calculate most common mood
      const moodCounts = dreamJournal.reduce((acc: Record<string, number>, dream) => {
        acc[dream.mood] = (acc[dream.mood] || 0) + 1;
        return acc;
      }, {});
      
      let mostCommonMood = 'None';
      let maxCount = 0;
      Object.entries(moodCounts).forEach(([mood, count]) => {
        const currentCount = Number(count);
        if (currentCount > maxCount) {
          maxCount = currentCount;
          mostCommonMood = mood;
        }
      });
      
      // Calculate average dreams per week (over last 4 weeks)
      const fourWeeksAgo = new Date(now);
      fourWeeksAgo.setDate(now.getDate() - 28);
      
      const recentDreams = dreamJournal.filter((dream) => {
        const dreamDate = new Date(dream.date);
        return dreamDate >= fourWeeksAgo;
      });
      
      const averageDreamsPerWeek = recentDreams.length / 4;
      
      setStats({
        totalDreams: dreamJournal.length,
        dreamsThisMonth,
        averagePerWeek: averageDreamsPerWeek,
        mostCommonMood,
        averageSleepDuration: '7.2 hrs',
        lastDream: dreamJournal[0]?.title || 'No dreams yet',
        lastDreamDate: dreamJournal[0]?.date ? new Date(dreamJournal[0].date).toLocaleDateString() : 'N/A',
      });
    };

    calculateStats();
  }, [dreamJournal]);

  // Fetch dream journal on component mount
  useEffect(() => {
    const loadDreams = async () => {
      try {
        await fetchDreamJournal();
      } catch (error) {
        console.error('Failed to fetch dream journal:', error);
      }
    };

    loadDreams();
  }, [fetchDreamJournal]);

  return (
    <DashboardLayout>
      <DashboardCards />
    </DashboardLayout>
  );
  
  // Note: The stats state is being set up for future use with DashboardCards.
  // When ready, pass the stats to DashboardCards as props after updating its interface.
};

export default DashboardPage;
