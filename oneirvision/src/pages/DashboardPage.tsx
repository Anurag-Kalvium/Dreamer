import React, { useEffect, useState, useMemo, FC } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { DreamEntry } from '../contexts/DreamContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface DashboardStats {
  totalDreams: number;
  dreamsThisMonth: number;
  mostCommonMood: string;
  averageDreamsPerWeek: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-dark-secondary p-6 rounded-lg shadow-lg">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardPage: FC = () => {
  const { dreamJournal } = useDreamContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalDreams: 0,
    dreamsThisMonth: 0,
    mostCommonMood: 'None',
    averageDreamsPerWeek: 0,
  });
  const [recentDreams, setRecentDreams] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate stats when dreamJournal changes
  useEffect(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    if (dreamJournal.length > 0) {
      
      // Calculate dreams this month
      const dreamsThisMonth = dreamJournal.filter(dream => {
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
        if (count > maxCount) {
          maxCount = count;
          mostCommonMood = mood;
        }
      });
      
      // Calculate average dreams per week (over last 4 weeks)
      const fourWeeksAgo = new Date(now);
      fourWeeksAgo.setDate(now.getDate() - 28);
      
      const recentDreams = dreamJournal.filter(dream => 
        new Date(dream.date) >= fourWeeksAgo
      );
      
      const averageDreamsPerWeek = recentDreams.length > 0 
        ? parseFloat((recentDreams.length / 4).toFixed(1))
        : 0;
      
      // Update stats state
      setStats({
        totalDreams: dreamJournal.length,
        dreamsThisMonth,
        mostCommonMood,
        averageDreamsPerWeek
      });
      
      // Set recent dreams (5 most recent)
      setRecentDreams([...dreamJournal]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
      );
      
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [dreamJournal]);

  // Prepare data for mood chart
  const moodData = useMemo(() => {
    const moodCounts = dreamJournal.reduce((acc: Record<string, number>, dream: DreamEntry) => {
      acc[dream.mood] = (acc[dream.mood] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(moodCounts),
      datasets: [{
        data: Object.values(moodCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }]
    };
  }, [dreamJournal]);

  // Prepare monthly data for bar chart
  const monthlyChartData = useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, now.getMonth() - i, 1);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyCounts[monthYear] = 0;
    }
    
    // Count dreams per month
    dreamJournal.forEach(dream => {
      const dreamDate = new Date(dream.date);
      const monthYear = dreamDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (monthlyCounts[monthYear] !== undefined) {
        monthlyCounts[monthYear]++;
      }
    });
    
    return {
      labels: Object.keys(monthlyCounts),
      datasets: [{
        label: 'Dreams',
        data: Object.values(monthlyCounts),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }],
    };
  }, [dreamJournal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading your dream data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vivid-blue to-teal-400">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Overview of your dream journal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Dreams" 
            value={stats.totalDreams} 
            icon="💭" 
          />
          <StatCard 
            title="This Month" 
            value={stats.dreamsThisMonth} 
            icon="📅" 
          />
          <StatCard 
            title="Common Mood" 
            value={stats.mostCommonMood} 
            icon="😊" 
          />
          <StatCard 
            title="Avg/Week" 
            value={stats.averageDreamsPerWeek} 
            icon="📊" 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-dark-secondary rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dreams by Month</h3>
            <div className="h-64">
              <Bar 
                data={monthlyChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                    },
                  },
                }} 
              />
            </div>
          </div>

          <div className="bg-dark-secondary rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Mood Distribution</h3>
            <div className="h-64">
              <Pie 
                data={moodData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        padding: 20,
                      },
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>

        {/* Recent Dreams */}
        <div className="bg-dark-secondary rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Dreams</h2>
            <a 
              href="/journal" 
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
            >
              View All <span className="ml-1">→</span>
            </a>
          </div>
          
          {recentDreams.length > 0 ? (
            <div className="space-y-4">
              {recentDreams.map((dream) => (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-tertiary rounded-lg p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{dream.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {dream.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {new Date(dream.date).toLocaleDateString()}
                      </span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200">
                          {dream.mood}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No dreams recorded yet. Start by adding your first dream!</p>
              <a 
                href="/analyze" 
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-lg hover:shadow-lg hover:shadow-deep-purple/20 transition-all"
              >
                Add Your First Dream
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
