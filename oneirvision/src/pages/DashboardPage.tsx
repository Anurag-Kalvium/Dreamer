import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../contexts/DreamContext';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  BarElement 
} from 'chart.js';
import { 
  FiTrendingUp, 
  FiCalendar, 
  FiMoon, 
  FiZap, 
  FiHeart, 
  FiDownload, 
  FiPlay,
  FiPause,
  FiStar,
  FiEye,
  FiClock
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface DreamStats {
  totalDreams: number;
  streakDays: number;
  mostCommonMood: string;
  averagePerWeek: number;
  moodDistribution: { [key: string]: number };
  weeklyActivity: number[];
  recentDreams: any[];
  dreamSymbols: { symbol: string; count: number }[];
}

const DashboardPage: React.FC = () => {
  const { dreamJournal, fetchDreamJournal } = useDreamContext();
  const { user } = useAuth();
  const [stats, setStats] = useState<DreamStats>({
    totalDreams: 0,
    streakDays: 0,
    mostCommonMood: 'peaceful',
    averagePerWeek: 0,
    moodDistribution: {},
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    recentDreams: [],
    dreamSymbols: []
  });
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  const moodColors = {
    peaceful: '#60A5FA',
    adventurous: '#F59E0B',
    mysterious: '#A855F7',
    scary: '#EF4444',
    happy: '#10B981',
    sad: '#6B7280',
    confused: '#8B5CF6',
    excited: '#F97316'
  };

  const moodEmojis = {
    peaceful: '🌙',
    adventurous: '⚡',
    mysterious: '🔮',
    scary: '👻',
    happy: '☀️',
    sad: '☁️',
    confused: '🌀',
    excited: '🎆'
  };

  useEffect(() => {
    fetchDreamJournal();
  }, [fetchDreamJournal]);

  useEffect(() => {
    if (dreamJournal.length > 0) {
      calculateStats();
    }
  }, [dreamJournal]);

  const calculateStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {};
    dreamJournal.forEach(dream => {
      moodCounts[dream.mood] = (moodCounts[dream.mood] || 0) + 1;
    });

    // Calculate weekly activity
    const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
    dreamJournal.forEach(dream => {
      const dreamDate = new Date(dream.date);
      if (dreamDate >= oneWeekAgo) {
        const dayOfWeek = dreamDate.getDay();
        weeklyActivity[dayOfWeek]++;
      }
    });

    // Calculate streak
    let streak = 0;
    const sortedDreams = [...dreamJournal].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const dream of sortedDreams) {
      const dreamDate = new Date(dream.date);
      dreamDate.setHours(0, 0, 0, 0);
      
      if (dreamDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dreamDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    // Extract common symbols (simplified)
    const symbolCounts: { [key: string]: number } = {};
    const commonSymbols = ['water', 'flying', 'house', 'animal', 'forest', 'car', 'people', 'school'];
    
    dreamJournal.forEach(dream => {
      const description = dream.description.toLowerCase();
      commonSymbols.forEach(symbol => {
        if (description.includes(symbol)) {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        }
      });
    });

    const dreamSymbols = Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Find most common mood
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'peaceful';

    setStats({
      totalDreams: dreamJournal.length,
      streakDays: streak,
      mostCommonMood,
      averagePerWeek: weeklyActivity.reduce((a, b) => a + b, 0),
      moodDistribution: moodCounts,
      weeklyActivity,
      recentDreams: dreamJournal.slice(0, 3),
      dreamSymbols
    });
  };

  // Chart configurations
  const moodTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Dreams',
        data: stats.weeklyActivity,
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#60A5FA',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const moodDistributionData = {
    labels: Object.keys(stats.moodDistribution),
    datasets: [
      {
        data: Object.values(stats.moodDistribution),
        backgroundColor: Object.keys(stats.moodDistribution).map(mood => moodColors[mood as keyof typeof moodColors] || '#6B7280'),
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#60A5FA',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#60A5FA',
        borderWidth: 1,
      },
    },
  };

  const StatCard = ({ title, value, icon, color = 'blue', subtitle }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    subtitle?: string;
  }) => (
    <motion.div
      className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r from-${color}-500/20 to-${color}-600/20`}>
            {icon}
          </div>
          {title === 'Dream Streak' && value > 0 && (
            <div className="text-2xl">🔥</div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-300">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] pt-20 pb-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              background: `radial-gradient(circle, ${
                ['rgba(0, 245, 255, 0.1)', 'rgba(192, 132, 252, 0.1)', 'rgba(253, 230, 138, 0.1)'][Math.floor(Math.random() * 3)]
              }, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="mr-4 p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiZap className="h-8 w-8 text-blue-300" />
            </motion.div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                Dream Lab
              </h1>
              <p className="text-xl text-gray-300">
                Welcome back, {user?.name?.split(' ')[0] || 'Dreamer'}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your personal analytics dashboard for exploring dream patterns and insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Dreams"
            value={stats.totalDreams}
            icon={<FiMoon className="h-6 w-6 text-blue-400" />}
            color="blue"
            subtitle="Dreams captured"
          />
          <StatCard
            title="Dream Streak"
            value={`${stats.streakDays} days`}
            icon={<FiZap className="h-6 w-6 text-yellow-400" />}
            color="yellow"
            subtitle="Keep it going!"
          />
          <StatCard
            title="Weekly Activity"
            value={stats.averagePerWeek}
            icon={<FiTrendingUp className="h-6 w-6 text-green-400" />}
            color="green"
            subtitle="Dreams this week"
          />
          <StatCard
            title="Dominant Mood"
            value={stats.mostCommonMood}
            icon={<span className="text-2xl">{moodEmojis[stats.mostCommonMood as keyof typeof moodEmojis]}</span>}
            color="purple"
            subtitle="Most frequent"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mood Trends Chart */}
          <motion.div 
            className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FiTrendingUp className="mr-2 text-blue-400" />
                Weekly Dream Activity
              </h3>
              <div className="text-sm text-gray-400">Last 7 days</div>
            </div>
            <div className="h-64">
              <Line data={moodTrendData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FiHeart className="mr-2 text-pink-400" />
              Mood Distribution
            </h3>
            <div className="h-64">
              <Doughnut data={moodDistributionData} options={doughnutOptions} />
            </div>
          </motion.div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Dreams */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FiEye className="mr-2 text-indigo-400" />
                Recent Dreams
              </h3>
              <Link 
                to="/journal"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentDreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {moodEmojis[dream.mood as keyof typeof moodEmojis]}
                        </span>
                        <h4 className="font-medium text-white text-sm">{dream.title}</h4>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {dream.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(dream.date).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              {stats.recentDreams.length === 0 && (
                <div className="text-center py-8">
                  <FiMoon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No dreams yet</p>
                  <Link 
                    to="/analyze"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Start your first dream
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Dream Symbols */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FiStar className="mr-2 text-yellow-400" />
              Common Symbols
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.dreamSymbols.map((symbol, index) => (
                <motion.div
                  key={symbol.symbol}
                  className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {symbol.symbol === 'water' && '🌊'}
                      {symbol.symbol === 'flying' && '🕊️'}
                      {symbol.symbol === 'house' && '🏠'}
                      {symbol.symbol === 'animal' && '🦋'}
                      {symbol.symbol === 'forest' && '🌲'}
                      {symbol.symbol === 'car' && '🚗'}
                      {symbol.symbol === 'people' && '👥'}
                      {symbol.symbol === 'school' && '🏫'}
                    </div>
                    <p className="text-white font-medium capitalize text-sm">{symbol.symbol}</p>
                    <p className="text-gray-400 text-xs">{symbol.count} times</p>
                  </div>
                </motion.div>
              ))}
              {stats.dreamSymbols.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-400">No symbols detected yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Insights */}
          <motion.div 
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiZap className="mr-2 text-blue-400" />
              AI Insights
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">
                "You tend to dream more on weekends"
              </p>
              <p className="text-sm text-gray-300">
                "Your {stats.mostCommonMood} dreams often feature transformation themes"
              </p>
              <p className="text-sm text-gray-300">
                "Consider exploring lucid dreaming techniques"
              </p>
            </div>
          </motion.div>

          {/* Export Data */}
          <motion.div 
            className="bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiDownload className="mr-2 text-green-400" />
              Export Data
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Download your dream insights and analytics
            </p>
            <button className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors flex items-center justify-center">
              <FiDownload className="mr-2" />
              Download Report
            </button>
          </motion.div>

          {/* Ambient Controls */}
          <motion.div 
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiClock className="mr-2 text-purple-400" />
              Ambient Mode
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Enhance your focus with ambient sounds
            </p>
            <button 
              onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
              className="w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors flex items-center justify-center"
            >
              {isAmbientPlaying ? <FiPause className="mr-2" /> : <FiPlay className="mr-2" />}
              {isAmbientPlaying ? 'Pause' : 'Play'} Ambient
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;